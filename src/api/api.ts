import type { Customer, Order, Product } from '../types';

export type PickingMode = 'single' | 'batch' | 'zone' | 'wave';

export interface PickingTask {
  id: string;
  title: string;
  subtitle: string;
  items: { productId: string | number; quantity: number; picked: number; orderId?: string }[];
}

export interface DashboardStats {
  pendingOrders: number;
  lowStockCount: number;
  totalStock: number;
  completionRate: number;
  lowStockProducts: Product[];
  recentOrders: Order[];
}

export interface ScanResponse {
  success: boolean;
  message: string;
  task?: PickingTask;
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(path, {
    headers: { 'Content-Type': 'application/json', ...init?.headers },
    ...init,
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error((body as { error?: string }).error ?? res.statusText);
  }
  return res.json() as Promise<T>;
}

export const api = {
  health: () => request<{ status: string }>('/api/health'),

  getProducts: () => request<Product[]>('/api/products'),
  getCustomers: () => request<Customer[]>('/api/customers'),
  getOrders: () => request<Order[]>('/api/orders'),
  getDashboardStats: () => request<DashboardStats>('/api/dashboard/stats'),

  getPickingTasks: (mode: PickingMode) =>
    request<PickingTask[]>(`/api/picking/tasks?mode=${mode}`),

  scanBarcode: async (body: {
    mode: PickingMode;
    taskId: string;
    barcode: string;
    orderId?: string;
  }): Promise<ScanResponse> => {
    const res = await fetch('/api/picking/scan', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    return res.json() as Promise<ScanResponse>;
  },
};
