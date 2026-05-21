import { motion } from 'motion/react';
import { Package, LineChart, ShoppingCart, Users, Settings, User } from 'lucide-react';
import { ViewState } from '../types';

interface SidebarProps {
  currentView: ViewState;
  onNavigate: (view: ViewState) => void;
}

export function Sidebar({ currentView, onNavigate }: SidebarProps) {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LineChart },
    { id: 'inventory', label: 'Inventario', icon: Package },
    { id: 'picking', label: 'Picking (SGA)', icon: ShoppingCart },
    { id: 'crm', label: 'Clientes (CRM)', icon: Users },
  ];

  return (
    <div className="w-64 bg-slate-900 text-slate-300 h-screen flex flex-col fixed left-0 top-0 border-r border-slate-800 shrink-0">
      <div className="p-6">
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
            <Package className="text-white w-5 h-5" />
          </div>
          NxWarehouse
        </h1>
        <p className="text-xs text-slate-500 mt-1 uppercase tracking-wider">Sistema de Gestión</p>
      </div>

      <nav className="flex-1 px-4 space-y-2 mt-4">
        {menuItems.map((item) => {
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id as ViewState)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                isActive 
                  ? 'bg-blue-600 font-medium text-white shadow-lg shadow-blue-500/20' 
                  : 'hover:bg-slate-800 hover:text-white'
              }`}
            >
              <item.icon className={`w-5 h-5 ${isActive ? 'text-blue-200' : 'text-slate-400'}`} />
              {item.label}
              {isActive && (
                <motion.div
                  layoutId="sidebar-active-indicator"
                  className="absolute left-0 w-1 h-8 bg-blue-400 rounded-r-full"
                />
              )}
            </button>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-800 mt-auto">
        <button className="flex items-center gap-3 px-4 py-2 w-full text-left hover:bg-slate-800 rounded-lg transition-colors">
          <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center shrink-0">
            <User className="w-4 h-4" />
          </div>
          <div className="truncate">
            <p className="text-sm font-medium text-white truncate">Operario #042</p>
            <p className="text-xs text-slate-500">Turno de mañana</p>
          </div>
        </button>
      </div>
    </div>
  );
}
