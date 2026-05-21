import { Router } from 'express';
import { customers } from '../db.js';

export const customersRouter = Router();

customersRouter.get('/', (_req, res) => {
  res.json(customers);
});
