import { motion } from 'motion/react';
import { Search, Mail, Phone, Building2, MoreVertical, Plus } from 'lucide-react';
import { mockCustomers } from '../lib/data';

export function CRM() {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-6xl mx-auto h-[calc(100vh-4rem)] flex flex-col"
    >
      <header className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Directorio CRM</h2>
          <p className="text-slate-500 mt-1">Gestión de clientes y contactos comerciales.</p>
        </div>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors">
          <Plus className="w-5 h-5" />
          Añadir Cliente
        </button>
      </header>

      <div className="bg-white border border-slate-200 shadow-sm rounded-2xl flex-1 flex flex-col overflow-hidden">
        {/* Toolbar */}
        <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row gap-4 items-center justify-between bg-slate-50/50">
          <div className="relative w-full sm:max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input 
              type="text"
              placeholder="Buscar clientes por nombre o empresa..."
              className="w-full pl-10 pr-4 py-2 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow"
            />
          </div>
        </div>

        {/* List */}
        <div className="flex-1 overflow-auto p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {mockCustomers.map((customer) => (
              <div key={customer.id} className="border border-slate-200 rounded-xl p-6 hover:shadow-md transition-shadow bg-white group">
                <div className="flex justify-between items-start mb-4">
                  <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-xl font-bold text-slate-600 shrink-0">
                    {customer.name.charAt(0)}
                  </div>
                  <button className="text-slate-400 hover:text-slate-600 transition-colors">
                    <MoreVertical className="w-5 h-5" />
                  </button>
                </div>
                
                <h3 className="text-lg font-bold text-slate-900 leading-tight">{customer.name}</h3>
                
                <div className="flex items-center gap-2 mt-1 mb-4 text-slate-500 text-sm">
                  <Building2 className="w-4 h-4" />
                  <span>{customer.company}</span>
                </div>

                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-3 text-sm text-slate-600">
                    <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center shrink-0">
                      <Mail className="w-4 h-4 text-slate-400" />
                    </div>
                    <span className="truncate">{customer.email}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-slate-600">
                    <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center shrink-0">
                      <Phone className="w-4 h-4 text-slate-400" />
                    </div>
                    <span>{customer.phone}</span>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <span className={`px-2.5 py-1 text-xs font-bold rounded-full border ${
                    customer.status === 'Activo' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                    customer.status === 'Lead' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                    'bg-slate-50 text-slate-700 border-slate-200'
                  }`}>
                    {customer.status}
                  </span>
                  <span className="text-xs text-slate-400 font-mono">{customer.id}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
