import React from 'react';
import { Calendar, Users, Beer, DollarSign, LayoutDashboard, Menu, Sparkles, Settings } from 'lucide-react';
import { AppState, Professional } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  activeView: AppState['view'];
  onChangeView: (view: AppState['view']) => void;
  currentUser: Professional;
  onSwitchUser: (user: Professional) => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, activeView, onChangeView, currentUser, onSwitchUser }) => {
  const navItems = [
    { id: 'dashboard', icon: LayoutDashboard, label: 'Painel' },
    { id: 'agenda', icon: Calendar, label: 'Agenda' },
    { id: 'bar', icon: Beer, label: 'Bar' },
    { id: 'clients', icon: Users, label: 'Clientes' },
    { id: 'financial', icon: DollarSign, label: 'Financeiro' },
    { id: 'ai', icon: Sparkles, label: 'Viking AI' },
  ];

  return (
    <div className="flex h-screen bg-zinc-950 text-zinc-100 font-sans selection:bg-purple-500 selection:text-white">
      {/* Sidebar for Desktop */}
      <aside className="hidden md:flex flex-col w-64 bg-zinc-900 border-r border-zinc-800">
        <div className="p-6 border-b border-zinc-800">
          <h1 className="text-2xl font-bold tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
            STUDIO VIKING
          </h1>
          <p className="text-xs text-zinc-500 mt-1 uppercase tracking-widest">Management</p>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onChangeView(item.id as any)}
              className={`flex items-center w-full px-4 py-3 rounded-lg transition-all duration-200 group ${
                activeView === item.id
                  ? 'bg-purple-600 text-white shadow-lg shadow-purple-900/50'
                  : 'text-zinc-400 hover:bg-zinc-800 hover:text-white'
              }`}
            >
              <item.icon className={`w-5 h-5 mr-3 ${activeView === item.id ? 'animate-pulse' : ''}`} />
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-zinc-800">
          <div className="bg-zinc-800 rounded-lg p-3">
            <p className="text-xs text-zinc-400 mb-2">Logado como:</p>
            <select 
              className="w-full bg-zinc-950 border border-zinc-700 rounded p-2 text-sm text-white focus:ring-1 focus:ring-purple-500 outline-none"
              value={currentUser}
              onChange={(e) => onSwitchUser(e.target.value as Professional)}
            >
              <option value={Professional.DAVID}>{Professional.DAVID}</option>
              <option value={Professional.JEY}>{Professional.JEY}</option>
              <option value={Professional.ADMIN}>{Professional.ADMIN}</option>
            </select>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto pb-20 md:pb-0 relative">
        {/* Mobile Header */}
        <div className="md:hidden flex items-center justify-between p-4 bg-zinc-900/80 backdrop-blur sticky top-0 z-50 border-b border-zinc-800">
          <h1 className="text-xl font-bold text-purple-400">STUDIO VIKING</h1>
          <button className="p-2 text-zinc-400 hover:text-white">
            <Settings size={20} />
          </button>
        </div>
        
        <div className="p-4 md:p-8 max-w-7xl mx-auto">
          {children}
        </div>
      </main>

      {/* Mobile Bottom Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-zinc-900 border-t border-zinc-800 flex justify-around p-2 z-50 pb-safe">
        {navItems.slice(0, 5).map((item) => (
          <button
            key={item.id}
            onClick={() => onChangeView(item.id as any)}
            className={`flex flex-col items-center justify-center w-16 h-14 rounded-lg transition-colors ${
              activeView === item.id ? 'text-purple-400' : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >
            <item.icon className="w-5 h-5 mb-1" />
            <span className="text-[10px] font-medium">{item.label}</span>
          </button>
        ))}
         <button
            onClick={() => onChangeView('ai')}
            className={`flex flex-col items-center justify-center w-16 h-14 rounded-lg transition-colors ${
              activeView === 'ai' ? 'text-purple-400' : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >
            <Sparkles className="w-5 h-5 mb-1" />
            <span className="text-[10px] font-medium">AI</span>
          </button>
      </nav>
    </div>
  );
};