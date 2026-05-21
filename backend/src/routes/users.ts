import { Router } from 'express';
import { users } from '../db.js';
import type { SystemUser } from '../types.js';

export const usersRouter = Router();

usersRouter.get('/', (_req, res) => {
  res.json(users);
});

usersRouter.post('/', (req, res) => {
  const { name, email, role } = req.body as Partial<SystemUser>;
  if (!name || !email || !role) {
    res.status(400).json({ error: 'name, email y role son obligatorios' });
    return;
  }
  const newUser: SystemUser = {
    id: Date.now().toString(),
    name,
    email,
    role,
    status: 'Activo',
  };
  users.push(newUser);
  res.status(201).json(newUser);
});

usersRouter.delete('/:id', (req, res) => {
  const index = users.findIndex((u) => u.id === req.params.id);
  if (index === -1) {
    res.status(404).json({ error: 'Usuario no encontrado' });
    return;
  }
  users.splice(index, 1);
  res.json({ success: true });
});
