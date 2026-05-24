import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Search, Filter, Plus, Box, ArrowUpDown } from 'lucide-react';
import { api } from '../api/api';
import type { Product } from '../types';

export function Inventory() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    api.getProducts()
      .then(setProducts)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.id.includes(searchTerm)
  );

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-6xl mx-auto h-[calc(100vh-4rem)] flex flex-col"
    >
      <header className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Inventario</h2>
          <p className="text-slate-500 mt-1">Gestión de productos y ubicaciones.</p>
        </div>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors">
          <Plus className="w-5 h-5" />
          Nuevo Producto
        </button>
      </header>

      {loading ? (
        <div className="flex justify-center flex-1 items-center">
          <div className="animate-spin w-8 h-8 rounded-full border-4 border-blue-600 border-t-transparent" />
        </div>
      ) : (
      <div className="bg-white border border-slate-200 shadow-sm rounded-2xl flex-1 flex flex-col overflow-hidden">
        {/* Toolbar */}
        <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row gap-4 items-center justify-between bg-slate-50/50">
          <div className="relative w-full sm:max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input 
              type="text"
              placeholder="Buscar por nombre, SKU o código de barras..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow"
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 text-slate-600 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors shrink-0">
            <Filter className="w-4 h-4" />
            Filtros
          </button>
        </div>

        {/* Table */}
        <div className="flex-1 overflow-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50 text-slate-500 sticky top-0 z-10 shadow-sm shadow-slate-200/50">
              <tr>
                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider">
                  <div className="flex items-center gap-2 cursor-pointer hover:text-slate-700">Producto <ArrowUpDown className="w-4 h-4" /></div>
                </th>
                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider">SKU</th>
                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider">Categoría</th>
                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider">Stock</th>
                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider">Ubicación</th>
                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider">Cod. Barras</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredProducts.map((product) => (
                <tr key={product.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center text-slate-400 shrink-0">
                        <Box className="w-5 h-5" />
                      </div>
                      <span className="font-medium text-slate-900">{product.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-slate-600 text-sm">{product.sku}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2.5 py-1 bg-slate-100 text-slate-600 rounded-md text-xs font-medium">
                      {product.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${product.stock < 20 ? 'bg-amber-500' : 'bg-emerald-500'}`}></div>
                      <span className={`font-medium ${product.stock < 20 ? 'text-amber-700' : 'text-slate-700'}`}>
                        {product.stock} un.
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-slate-600 text-sm font-mono bg-slate-50 group-hover:bg-transparent transition-colors">
                    {product.location}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-slate-500 text-sm font-mono">
                    {product.id}
                  </td>
                </tr>
              ))}
              
              {filteredProducts.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                    No se encontraron productos coincidentes.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      )}
    </motion.div>
  );
}
