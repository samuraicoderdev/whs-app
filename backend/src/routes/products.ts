import { Router } from 'express';
import { findProduct, products } from '../db.js';

export const productsRouter = Router();

productsRouter.get('/', (_req, res) => {
  res.json(products);
});

productsRouter.get('/:id', (req, res) => {
  const product = findProduct(req.params.id);
  if (!product) {
    res.status(404).json({ error: 'Producto no encontrado' });
    return;
  }
  res.json(product);
});
