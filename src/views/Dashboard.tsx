import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Package, TrendingUp, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { api, type DashboardStats } from '../api/api';

export function Dashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getDashboardStats()
      .then(setStats)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading || !stats) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin w-8 h-8 rounded-full border-4 border-blue-600 border-t-transparent" />
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-6xl mx-auto space-y-6"
    >
      <header className="mb-8">
        <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Panel de Control</h2>
        <p className="text-slate-500 mt-1">Resumen general del estado del almacén y ventas.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-slate-500 uppercase tracking-wider">Órdenes Pendientes</h3>
            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
              <Package className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-bold text-slate-900">{stats.pendingOrders}</div>
          <p className="text-sm text-slate-500 mt-2 flex items-center gap-1">
            <TrendingUp className="w-4 h-4 text-emerald-500" />
            <span className="text-emerald-500 font-medium">+12%</span> esta semana
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-slate-500 uppercase tracking-wider">Alertas de Stock</h3>
            <div className="p-2 bg-amber-50 text-amber-600 rounded-lg">
              <AlertTriangle className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-bold text-slate-900">{stats.lowStockCount}</div>
          <p className="text-sm text-slate-500 mt-2">Productos por debajo del límite</p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-slate-500 uppercase tracking-wider">Items en Almacén</h3>
            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
              <Package className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-bold text-slate-900">{stats.totalStock}</div>
          <p className="text-sm text-slate-500 mt-2">Unidades totales actuales</p>
        </div>
        
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-slate-500 uppercase tracking-wider">Tasa de Completado</h3>
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-bold text-slate-900">{stats.completionRate}%</div>
          <p className="text-sm text-slate-500 mt-2">Órdenes a tiempo</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-slate-800">Alertas de Inventario</h3>
            <button className="text-sm text-blue-600 font-medium hover:text-blue-700">Ver todo</button>
          </div>
          <div className="divide-y divide-slate-100">
            {stats.lowStockProducts.map(product => (
              <div key={product.id} className="p-4 hover:bg-slate-50 transition-colors flex items-center justify-between">
                <div>
                  <p className="font-medium text-slate-900">{product.name}</p>
                  <p className="text-sm text-slate-500">SKU: {product.sku}</p>
                </div>
                <div className="text-right">
                  <p className="text-amber-600 font-bold bg-amber-50 px-3 py-1 rounded-full text-sm">
                    {product.stock} un.
                  </p>
                  <p className="text-xs text-slate-400 mt-1">Loc: {product.location}</p>
                </div>
              </div>
            ))}
            {stats.lowStockProducts.length === 0 && (
              <div className="p-8 text-center text-slate-500">No hay alertas de stock bajo.</div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-slate-800">Órdenes Recientes</h3>
            <button className="text-sm text-blue-600 font-medium hover:text-blue-700">Ir a Picking</button>
          </div>
          <div className="divide-y divide-slate-100">
            {stats.recentOrders.map(order => (
              <div key={order.id} className="p-4 hover:bg-slate-50 transition-colors flex items-center justify-between">
                <div>
                  <p className="font-medium text-slate-900">{order.id}</p>
                  <p className="text-sm text-slate-500">
                    {new Date(order.date).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', hour: '2-digit', minute:'2-digit' })}
                  </p>
                </div>
                <div>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                    ${order.status === 'Pendiente' ? 'bg-slate-100 text-slate-800' : 
                      order.status === 'Picking' ? 'bg-blue-100 text-blue-800' : 
                      'bg-emerald-100 text-emerald-800'}`}
                  >
                    {order.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
