import cors from 'cors';
import express from 'express';
import { customersRouter } from './routes/customers.js';
import { dashboardRouter } from './routes/dashboard.js';
import { ordersRouter } from './routes/orders.js';
import { pickingRouter } from './routes/picking.js';
import { productsRouter } from './routes/products.js';
import { usersRouter } from './routes/users.js';

export function createApp() {
  const app = express();

  app.use(cors({ origin: true }));
  app.use(express.json());

  app.get('/api/health', (request: Request, response: Response) => {
    response.json({ ok: true, message: 'SGA API works'});
  });

  app.use('/api/users', usersRouter);
  app.use('/api/products', productsRouter);
  app.use('/api/customers', customersRouter);
  app.use('/api/orders', ordersRouter);
  app.use('/api/picking', pickingRouter);
  app.use('/api/dashboard', dashboardRouter);

  return app;
}
