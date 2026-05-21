import { Router } from 'express';
import { getPendingOrders, products } from '../db.js';
import { getOrdersSnapshot } from '../services/picking.js';
import type { DashboardStats } from '../types.js';

export const dashboardRouter = Router();

dashboardRouter.get('/stats', (_req, res) => {
  const allOrders = getOrdersSnapshot();
  const pendingOrders = getPendingOrders();
  const lowStockProducts = products.filter((p) => p.stock < 20);

  const stats: DashboardStats = {
    pendingOrders: pendingOrders.length,
    lowStockCount: lowStockProducts.length,
    totalStock: products.reduce((acc, p) => acc + p.stock, 0),
    completionRate: 94.2,
    lowStockProducts,
    recentOrders: allOrders.slice(0, 4),
  };

  res.json(stats);
});
