# Smart SGA & CRM - Warehouse Management System

A modern, full-stack Warehouse Management System (SGA) and Customer Relationship Management (CRM) application built with React 19, TypeScript, Tailwind CSS v4, and Express.

## 📋 Table of Contents

- [Overview](#overview)
- [Project Structure](#project-structure)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation & Setup](#installation--setup)
- [Configuration Details](#configuration-details)
- [Available Scripts](#available-scripts)
- [API Endpoints](#api-endpoints)
- [Component Architecture](#component-architecture)
- [Troubleshooting](#troubleshooting)

---

## Overview

Smart SGA & CRM is a comprehensive warehouse management solution featuring:

- **Dashboard**: Real-time KPIs and operational metrics
- **Inventory Management**: Complete stock tracking with location management
- **Picking Operations**: Multiple picking modes (Single, Batch, Zone, Wave) with barcode scanning
- **CRM Module**: Customer database with status tracking and order history
- **User Management**: Role-based access control

The application uses a modern architecture with a React frontend powered by Vite and an Express backend API.

---

## Project Structure

```
/workspace
├── frontend/                 # React + Vite frontend application
│   ├── src/
│   │   ├── components/       # Reusable UI components (Sidebar, etc.)
│   │   ├── views/            # Page-level components (Dashboard, Inventory, Picking, CRM)
│   │   ├── lib/              # Mock data and utilities
│   │   ├── api/              # API client functions
│   │   ├── assets/           # Static assets
│   │   ├── types.ts          # TypeScript type definitions
│   │   ├── App.tsx           # Main application component with routing
│   │   ├── main.tsx          # Application entry point
│   │   └── index.css         # Global styles with Tailwind CSS
│   ├── package.json
│   ├── vite.config.ts        # Vite configuration with Tailwind plugin
│   └── tsconfig.json
│
└── backend/                  # Express backend API
    ├── src/
    │   ├── server.ts         # Main server entry point
    │   ├── db.ts             # In-memory database (development)
    │   └── routes/           # API route handlers
    ├── prisma/               # Prisma ORM schema
    ├── package.json
    └── tsconfig.json
```

---

## Tech Stack

### Frontend

| Technology | Version | Purpose |
|------------|---------|---------|
| **React** | 19.x | UI library for building interactive interfaces |
| **TypeScript** | 5.8.x | Type-safe JavaScript development |
| **Vite** | 6.x | Next-generation build tool and dev server |
| **Tailwind CSS** | 4.x | Utility-first CSS framework (configured via Vite plugin) |
| **Lucide React** | 0.546.x | Icon library for UI elements |
| **Motion** | 12.x | Animation library for smooth transitions |
| **HTML5-QRCode** | 2.3.x | Barcode and QR code scanning from camera |

### Backend

| Technology | Version | Purpose |
|------------|---------|---------|
| **Express** | 4.x | Web framework for Node.js API |
| **TypeScript** | 5.8.x | Type-safe server-side development |
| **Prisma** | 7.x | Database ORM (optional, currently using in-memory DB) |
| **Zod** | 4.x | Schema validation for request/response |
| **bcryptjs** | 3.x | Password hashing for authentication |
| **jsonwebtoken** | 9.x | JWT-based authentication |

---

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** >= 18.x (LTS recommended)
- **npm** or **bun** package manager
- **Git** for version control

---

## Installation & Setup

### 1. Clone and Navigate

```bash
cd /workspace
```

### 2. Install Frontend Dependencies

```bash
cd frontend
npm install
```

### 3. Install Backend Dependencies

```bash
cd ../backend
npm install
```

### 4. Start Development Servers

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```
The API server will start at `http://localhost:3000`

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```
The frontend will start at `http://localhost:54321`

---

## Configuration Details

### Critical: Tailwind CSS v4 Setup

This project uses **Tailwind CSS v4**, which requires a different configuration approach than previous versions. The most common cause of styling issues ("unstyled" or "broken layout") is incorrect Tailwind setup.

#### 1. `vite.config.ts` Configuration

The Tailwind v4 plugin must be registered in Vite's configuration:

```typescript
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss()], // <-- Essential for Tailwind v4
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      proxy: {
        '/api': {
          target: process.env.VITE_API_URL ?? 'http://localhost:3000',
          changeOrigin: true,
        },
      },
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
```

#### 2. `src/index.css` Configuration

In Tailwind v4, the traditional `@tailwind base`, `@tailwind components`, and `@tailwind utilities` directives are replaced with a single import:

```css
@import "tailwindcss";
```

#### 3. Entry Point Import

Ensure your `src/main.tsx` imports the CSS file:

```typescript
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css'; // <-- Must import styles

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
```

---

## Available Scripts

### Frontend (`frontend/package.json`)

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server on port 54321 |
| `npm run build` | Build production bundle |
| `npm run preview` | Preview production build locally |
| `npm run clean` | Remove build artifacts (`dist/`, `server.js`) |
| `npm run lint` | Run TypeScript type checking |

### Backend (`backend/package.json`)

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with hot-reload (tsx watch) |
| `npm run start` | Start production server |
| `npm run build` | Compile TypeScript to JavaScript |
| `npm run lint` | Run TypeScript type checking |

---

## API Endpoints

The backend exposes a RESTful API at `http://localhost:3000/api`:

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/health` | Service health check |
| `GET` | `/dashboard/stats` | Dashboard KPIs and statistics |
| `GET` | `/products` | Retrieve all inventory products |
| `GET` | `/customers` | Retrieve all CRM customers |
| `GET` | `/orders` | Retrieve all orders |
| `GET` | `/orders/pending` | Retrieve pending/in-picking orders |
| `GET` | `/picking/tasks?mode=single` | Get picking tasks by mode (single, batch, zone, wave) |
| `POST` | `/picking/scan` | Register barcode scan for picking operation |
| `GET` | `/users` | List all users |
| `POST` | `/users` | Create new user |
| `DELETE` | `/users/:id` | Delete user |

### Example: Picking Scan Request

```json
POST /api/picking/scan
Content-Type: application/json

{
  "mode": "single",
  "taskId": "ORD-2023-001",
  "barcode": "8412345678901",
  "orderId": "ORD-2023-001"
}
```

---

## Component Architecture

### Core Components (`frontend/src/components/`)

- **`Sidebar.tsx`**: Navigation sidebar with menu items for all views
- **`index.ts`**: Component exports

### Views (`frontend/src/views/`)

| Component | Description |
|-----------|-------------|
| **`Dashboard.tsx`** | Overview dashboard with KPI cards, charts, and recent activity |
| **`Inventory.tsx`** | Product inventory list with search, filtering, and stock management |
| **`Picking.tsx`** | Picking operations interface with barcode scanner integration and multiple picking modes |
| **`CRM.tsx`** | Customer relationship management with contact details and order history |
| **`Users.tsx`** | User management interface (admin only) |

### Type Definitions (`frontend/src/types.ts`)

```typescript
export interface Product {
  id: string | number;     // Barcode
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
```

### Mock Data (`frontend/src/lib/data.ts`)

Development mock data for products, customers, and orders. Replace with real API calls in production.

---

## Troubleshooting

### Issue: Application Appears Unstyled / Broken Layout

This is almost always caused by incorrect Tailwind CSS v4 configuration. Follow these steps:

1. **Clear cache and reinstall dependencies:**
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

2. **Verify `vite.config.ts` includes the Tailwind plugin:**
   ```typescript
   import tailwindcss from '@tailwindcss/vite';
   
   export default defineConfig({
     plugins: [react(), tailwindcss()], // <-- Must be present
     // ...
   });
   ```

3. **Check `src/index.css` has the correct import:**
   ```css
   @import "tailwindcss";
   ```
   Do NOT use the old `@tailwind base; @tailwind components; @tailwind utilities;` syntax.

4. **Ensure `src/main.tsx` imports the CSS:**
   ```typescript
   import './index.css';
   ```

5. **Restart the development server:**
   ```bash
   npm run dev
   ```

### Issue: API Connection Errors

1. Ensure the backend server is running on port 3000
2. Check the proxy configuration in `vite.config.ts`
3. Verify `VITE_API_URL` environment variable if using a custom URL

### Issue: Barcode Scanner Not Working

1. Ensure HTTPS is enabled (required for camera access in production)
2. Grant camera permissions when prompted
3. Test with a known working barcode format (EAN-13, Code-128, QR)

---

## License

Private - All rights reserved.

---

## Support

For technical support or questions, please contact the development team.
