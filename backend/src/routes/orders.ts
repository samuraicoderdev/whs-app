import { Router } from 'express';
import { findOrder } from '../db.js';
import { getOrdersSnapshot } from '../services/picking.js';

export const ordersRouter = Router();

ordersRouter.get('/', (_req, res) => {
  res.json(getOrdersSnapshot());
});

ordersRouter.get('/pending', (_req, res) => {
  res.json(getOrdersSnapshot().filter((o) => o.status === 'Pendiente' || o.status === 'Picking'));
});

ordersRouter.get('/:id', (req, res) => {
  const order = findOrder(req.params.id);
  if (!order) {
    res.status(404).json({ error: 'Pedido no encontrado' });
    return;
  }
  res.json({ ...order, items: order.items.map((i) => ({ ...i })) });
});
