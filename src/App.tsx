import { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './views/Dashboard';
import { Inventory } from './views/Inventory';
import { Picking } from './views/Picking';
import { CRM } from './views/CRM';
import { ViewState } from './types';



export default function App() {
  const [currentView, setCurrentView] = useState<ViewState>('dashboard');

  const renderView = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard />;
      case 'inventory':
        return <Inventory />;
      case 'picking':
        return <Picking />;
      case 'crm':
        return <CRM />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="flex h-screen bg-slate-50 font-sans text-slate-700 overflow-hidden selection:bg-blue-500/30">
      <Sidebar currentView={currentView} onNavigate={setCurrentView} />
      <main className="flex-1 ml-64 p-8 overflow-y-auto">
        {renderView()}
      </main>
    </div>
  );
}
