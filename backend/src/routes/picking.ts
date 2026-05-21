import { Router } from 'express';
import { buildPickingTasks, processScan } from '../services/picking.js';
import type { PickingMode } from '../types.js';

export const pickingRouter = Router();

const MODES: PickingMode[] = ['single', 'batch', 'zone', 'wave'];

pickingRouter.get('/tasks', (req, res) => {
  const mode = req.query.mode as PickingMode;
  if (!mode || !MODES.includes(mode)) {
    res.status(400).json({ error: 'Query param mode requerido: single | batch | zone | wave' });
    return;
  }
  res.json(buildPickingTasks(mode));
});

pickingRouter.post('/scan', (req, res) => {
  const { mode, taskId, barcode, orderId } = req.body as {
    mode?: PickingMode;
    taskId?: string;
    barcode?: string;
    orderId?: string;
  };

  if (!mode || !MODES.includes(mode) || !taskId || !barcode) {
    res.status(400).json({ error: 'mode, taskId y barcode son obligatorios' });
    return;
  }

  const result = processScan(mode, taskId, barcode, orderId);
  res.status(result.success ? 200 : 422).json(result);
});
