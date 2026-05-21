export interface Product {
  id: string;
  name: string;
  sku: string;
  stock: number;
  location: string;
  price?: number;
  category: string;
}

export interface Customer {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  status: 'Activo' | 'Lead' | 'Inactivo';
}

export interface OrderItem {
  productId: string;
  quantity: number;
  picked: number;
}

export interface Order {
  id: string;
  customerId: string;
  status: 'Pendiente' | 'Picking' | 'Completado' | 'Enviado';
  items: OrderItem[];
  date: string;
}

export interface SystemUser {
  id: string;
  name: string;
  email: string;
  role: 'Administrador' | 'CRM' | 'Inventario' | 'Pedidos';
  status: 'Activo' | 'Inactivo';
}

export type PickingMode = 'single' | 'batch' | 'zone' | 'wave';

export interface PickingTask {
  id: string;
  title: string;
  subtitle: string;
  items: (OrderItem & { orderId?: string })[];
}

export interface DashboardStats {
  pendingOrders: number;
  lowStockCount: number;
  totalStock: number;
  completionRate: number;
  lowStockProducts: Product[];
  recentOrders: Order[];
}
