# SGA Picking — Backend API

API REST en Express para la aplicación React de almacén (inventario, picking, CRM, usuarios).

## Arranque

```bash
cd backend
npm install
npm run dev
```

Por defecto escucha en **http://localhost:3000**.

## Endpoints

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/api/health` | Estado del servicio |
| GET | `/api/dashboard/stats` | KPIs del panel |
| GET | `/api/products` | Inventario |
| GET | `/api/customers` | Clientes CRM |
| GET | `/api/orders` | Todos los pedidos |
| GET | `/api/orders/pending` | Pedidos pendientes / en picking |
| GET | `/api/picking/tasks?mode=single` | Tareas según modo (single, batch, zone, wave) |
| POST | `/api/picking/scan` | Registrar escaneo de código de barras |
| GET/POST/DELETE | `/api/users` | Gestión de usuarios |

### Escaneo de picking

```json
POST /api/picking/scan
{
  "mode": "single",
  "taskId": "ORD-2023-001",
  "barcode": "8412345678901",
  "orderId": "ORD-2023-001"
}
```

## Frontend

En otra terminal, desde `frontend/`:

```bash
npm run dev
```

Vite redirige `/api/*` al backend (puerto 3000).

## Datos

Persistencia en memoria (reinicio = datos iniciales). Pensado para desarrollo y demos; sustituir `src/db.ts` por PostgreSQL u otro almacén en producción.
