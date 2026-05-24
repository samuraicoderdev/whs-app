import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ShieldCheck, UserPlus, Search, Trash2 } from 'lucide-react';

interface SystemUser {
  id: string;
  name: string;
  email: string;
  role: 'Administrador' | 'CRM' | 'Inventario' | 'Pedidos';
  status: 'Activo' | 'Inactivo';
}

export function UsersView() {
  const [users, setUsers] = useState<SystemUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [newUser, setNewUser] = useState({ name: '', email: '', role: 'Inventario' });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await fetch('/api/users');
      const data = await res.json();
      setUsers(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUser.name || !newUser.email) return;

    try {
      const res = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newUser)
      });
      const data = await res.json();
      setUsers([...users, data]);
      setNewUser({ name: '', email: '', role: 'Inventario' });
    } catch (e) {
      console.error(e);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await fetch(`/api/users/${id}`, { method: 'DELETE' });
      setUsers(users.filter(u => u.id !== id));
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-6xl mx-auto h-[calc(100vh-4rem)] flex flex-col"
    >
      <header className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Usuarios y Accesos</h2>
          <p className="text-slate-500 mt-1">Backend: Gestión de usuarios que tienen acceso a los distintos módulos.</p>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Creation Form */}
        <div className="lg:col-span-1 bg-white border border-slate-200 shadow-sm rounded-2xl overflow-hidden h-fit">
          <div className="p-4 border-b border-slate-100 bg-slate-50 flex items-center gap-2">
            <UserPlus className="w-5 h-5 text-blue-600" />
            <h3 className="font-semibold text-slate-800">Añadir Empleado</h3>
          </div>
          <form onSubmit={handleCreate} className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Nombre Completo</label>
              <input 
                type="text" required
                value={newUser.name}
                onChange={e => setNewUser({...newUser, name: e.target.value})}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                placeholder="Ej. María López"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Email / Login</label>
              <input 
                type="email" required
                value={newUser.email}
                onChange={e => setNewUser({...newUser, email: e.target.value})}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                placeholder="maria@novatecnica.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Módulo (Rol)</label>
              <select 
                value={newUser.role}
                onChange={e => setNewUser({...newUser, role: e.target.value})}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              >
                <option value="Administrador">Administrador Global</option>
                <option value="CRM">CRM (Ventas)</option>
                <option value="Inventario">Almacén e Inventario</option>
                <option value="Pedidos">Gestión de Pedidos</option>
              </select>
            </div>
            <button type="submit" className="w-full mt-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-lg transition-colors">
              Crear Usuario
            </button>
          </form>
        </div>

        {/* Users List */}
        <div className="lg:col-span-2 bg-white border border-slate-200 shadow-sm rounded-2xl overflow-hidden flex flex-col">
          <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row gap-4 items-center justify-between bg-slate-50/50">
             <div className="relative w-full sm:max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input 
                  type="text"
                  placeholder="Buscar usuarios..."
                  className="w-full pl-10 pr-4 py-2 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
          </div>
          
          <div className="flex-1 overflow-auto p-4">
            {loading ? (
              <div className="flex justify-center p-8"><div className="animate-spin w-8 h-8 rounded-full border-4 border-blue-600 border-t-transparent"></div></div>
            ) : (
              <div className="space-y-3">
                {users.map(user => (
                  <div key={user.id} className="p-4 rounded-xl border border-slate-200 flex items-center justify-between hover:shadow-sm transition-shadow">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-bold shrink-0">
                        {user.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-bold text-slate-900">{user.name}</p>
                        <p className="text-sm text-slate-500">{user.email}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <span className="px-3 py-1 bg-slate-100 text-slate-600 text-xs font-bold rounded-lg border border-slate-200">
                        {user.role}
                      </span>
                      <button onClick={() => handleDelete(user.id)} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                ))}
                {users.length === 0 && <p className="text-center text-slate-500 p-8">No hay usuarios dados de alta.</p>}
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
