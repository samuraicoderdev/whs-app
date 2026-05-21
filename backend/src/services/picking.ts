import { getPendingOrders, orders, products } from '../db.js';
import type { Order, OrderItem, PickingMode, PickingTask } from '../types.js';

export function buildPickingTasks(mode: PickingMode): PickingTask[] {
  const pendingOrders = getPendingOrders();

  if (mode === 'single') {
    return pendingOrders.map((o) => ({
      id: o.id,
      title: o.id,
      subtitle: `Cliente: ${o.customerId}`,
      items: o.items.map((item) => ({ ...item })),
    }));
  }

  if (mode === 'batch') {
    const allItems: Record<string, OrderItem> = {};
    pendingOrders.forEach((o) => {
      o.items.forEach((item) => {
        if (!allItems[item.productId]) {
          allItems[item.productId] = { ...item };
        } else {
          allItems[item.productId].quantity += item.quantity;
          allItems[item.productId].picked += item.picked;
        }
      });
    });
    const items = Object.values(allItems);
    if (items.length === 0) return [];
    return [{
      id: 'BATCH-001',
      title: 'Batch Picking #1',
      subtitle: `${pendingOrders.length} Órdenes combinadas`,
      items,
    }];
  }

  if (mode === 'zone') {
    const zones: Record<string, (OrderItem & { orderId: string })[]> = {};
    pendingOrders.forEach((o) => {
      o.items.forEach((item) => {
        const prod = products.find((p) => p.id === item.productId);
        const zone = prod ? prod.location.charAt(0) : 'Other';
        if (!zones[zone]) zones[zone] = [];
        const existing = zones[zone].find((z) => z.productId === item.productId);
        if (existing) {
          existing.quantity += item.quantity;
          existing.picked += item.picked;
        } else {
          zones[zone].push({ ...item, orderId: o.id });
        }
      });
    });
    return Object.keys(zones).map((zone) => ({
      id: `ZONE-${zone}`,
      title: `Zona ${zone}`,
      subtitle: `${zones[zone].length} productos distintos`,
      items: zones[zone],
    }));
  }

  const waveTasks: PickingTask[] = [
    {
      id: 'WAVE-MORNING',
      title: 'Ola Mañana (08:00 - 12:00)',
      subtitle: 'Prioridad Alta',
      items: pendingOrders[0]?.items.map((item) => ({ ...item, orderId: pendingOrders[0].id })) ?? [],
    },
    {
      id: 'WAVE-AFTERNOON',
      title: 'Ola Tarde (12:00 - 16:00)',
      subtitle: 'Prioridad Normal',
      items: pendingOrders[1]?.items.map((item) => ({ ...item, orderId: pendingOrders[1].id })) ?? [],
    },
  ];
  return waveTasks.filter((w) => w.items.length > 0);
}

function syncOrderStatus(order: Order): void {
  const allPicked = order.items.every((i) => i.picked >= i.quantity);
  if (allPicked && order.status !== 'Completado') {
    order.status = 'Completado';
  } else if (order.items.some((i) => i.picked > 0) && order.status === 'Pendiente') {
    order.status = 'Picking';
  }
}

export interface ScanResult {
  success: boolean;
  message: string;
  task?: PickingTask;
}

export function processScan(
  mode: PickingMode,
  taskId: string,
  barcode: string,
  orderId?: string,
): ScanResult {
  const scannedCode = barcode.trim();
  const tasks = buildPickingTasks(mode);
  const task = tasks.find((t) => t.id === taskId);

  if (!task) {
    return { success: false, message: 'Tarea de picking no encontrada.' };
  }

  const itemIndex = task.items.findIndex((item) => item.productId === scannedCode);
  if (itemIndex === -1) {
    return { success: false, message: 'Producto incorrecto. Este ítem no pertenece a la lista actual.' };
  }

  const taskItem = task.items[itemIndex];
  if (taskItem.picked >= taskItem.quantity) {
    return { success: false, message: 'Ya se ha recolectado la cantidad total para este producto.' };
  }

  const pendingOrders = getPendingOrders();

  if (mode === 'single') {
    const order = pendingOrders.find((o) => o.id === taskId);
    if (!order) return { success: false, message: 'Pedido no encontrado.' };
    const orderItem = order.items.find((i) => i.productId === scannedCode);
    if (!orderItem) return { success: false, message: 'Ítem no encontrado en el pedido.' };
    orderItem.picked += 1;
    syncOrderStatus(order);
  } else if (mode === 'batch') {
    for (const order of pendingOrders) {
      const orderItem = order.items.find((i) => i.productId === scannedCode && i.picked < i.quantity);
      if (orderItem) {
        orderItem.picked += 1;
        syncOrderStatus(order);
        break;
      }
    }
  } else {
    const targetOrderId = orderId ?? task.items[itemIndex]?.orderId;
    if (!targetOrderId) {
      return { success: false, message: 'No se pudo identificar el pedido asociado.' };
    }
    const order = pendingOrders.find((o) => o.id === targetOrderId);
    if (!order) return { success: false, message: 'Pedido no encontrado.' };
    const orderItem = order.items.find((i) => i.productId === scannedCode);
    if (!orderItem) return { success: false, message: 'Ítem no encontrado en el pedido.' };
    orderItem.picked += 1;
    syncOrderStatus(order);
  }

  task.items[itemIndex].picked += 1;

  return {
    success: true,
    message: `¡Producto ${scannedCode} escaneado correctamente!`,
    task: buildPickingTasks(mode).find((t) => t.id === taskId),
  };
}

export function getOrdersSnapshot(): Order[] {
  return orders.map((o) => ({
    ...o,
    items: o.items.map((item) => ({ ...item })),
  }));
}
