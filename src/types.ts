export interface Product {
  id: string | number; // Barcode
  name: string;
  sku: string;
  stock: number;
  location: string;
  price?: number;
  category: string;
}

export interface Customer {
  id: string | number;
  name: string;
  company: string;
  email: string;
  phone: string;
  status: 'Activo' | 'Lead' | 'Inactivo';
}

export interface OrderItem {
  productId: string | number;
  quantity: number;
  picked: number;
}

export interface Order {
  id: string | number;
  customerId: string;
  status: 'Pendiente' | 'Picking' | 'Completado' | 'Enviado';
  items: OrderItem[];
  date: string;
}

export type ViewState = 'dashboard' | 'inventory' | 'picking' | 'crm';
