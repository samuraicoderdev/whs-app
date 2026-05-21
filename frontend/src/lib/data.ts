import { Customer, Order, Product } from '../types';

export const mockProducts: Product[] = [
  { id: '8412345678901', name: 'Monitor Dell 27"', sku: 'MON-DELL-27', stock: 45, location: 'A-01-01', price: 299.99, category: 'Electrónica' },
  { id: '8412345678902', name: 'Teclado Mecánico Keychron', sku: 'KEY-MECH-01', stock: 12, location: 'A-01-02', price: 99.50, category: 'Periféricos' },
  { id: '8412345678903', name: 'Ratón Inalámbrico Logitech', sku: 'MOU-LOG-WL', stock: 85, location: 'A-02-01', price: 45.00, category: 'Periféricos' },
  { id: '8412345678904', name: 'Soporte Monitor Doble', sku: 'SUP-MON-02', stock: 5, location: 'B-01-05', price: 65.00, category: 'Accesorios' },
  { id: '8412345678905', name: 'Cable USB-C 2m', sku: 'CAB-USBC-2M', stock: 200, location: 'C-10-01', price: 12.00, category: 'Cables' },
];

export const mockCustomers: Customer[] = [
  { id: 'C-001', name: 'Ana García', company: 'TechSolutions SL', email: 'ana@techsolutions.es', phone: '+34 600 123 456', status: 'Activo' },
  { id: 'C-002', name: 'Carlos López', company: 'Global Imports', email: 'clopez@globalimports.com', phone: '+34 611 222 333', status: 'Activo' },
  { id: 'C-003', name: 'Laura Martínez', company: 'Sistemas del Norte', email: 'lmartinez@sisnorte.com', phone: '+34 622 444 555', status: 'Lead' },
];

export const mockOrders: Order[] = [
  {
    id: 'ORD-2023-001',
    customerId: 'C-001',
    status: 'Pendiente',
    date: '2023-10-24T10:00:00Z',
    items: [
      { productId: '8412345678901', quantity: 2, picked: 0 },
      { productId: '8412345678905', quantity: 5, picked: 0 },
    ],
  },
  {
    id: 'ORD-2023-002',
    customerId: 'C-002',
    status: 'Picking',
    date: '2023-10-24T11:30:00Z',
    items: [
      { productId: '8412345678902', quantity: 1, picked: 1 },
      { productId: '8412345678903', quantity: 3, picked: 0 },
    ],
  },
  {
    id: 'ORD-2023-003',
    customerId: 'C-003',
    status: 'Completado',
    date: '2023-10-23T15:45:00Z',
    items: [
      { productId: '8412345678904', quantity: 10, picked: 10 },
    ],
  },
];
