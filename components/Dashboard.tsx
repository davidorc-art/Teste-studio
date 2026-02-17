import React, { useMemo } from 'react';
import { store } from '../services/store';
import { Professional, AppointmentStatus } from '../types';
import { DollarSign, Calendar, TrendingUp, AlertCircle } from 'lucide-react';

export const Dashboard: React.FC<{ currentUser: Professional }> = ({ currentUser }) => {
  const appointments = store.getAppointments();
  const sales = store.getSales();
  const today = new Date().toISOString().split('T')[0];

  const stats = useMemo(() => {
    const todaysApts = appointments.filter(a => a.date === today && a.status !== AppointmentStatus.CANCELLED);
    const userApts = currentUser === Professional.ADMIN 
      ? todaysApts 
      : todaysApts.filter(a => a.professional === currentUser);
    
    const serviceRevenue = userApts.reduce((acc, curr) => acc + curr.price, 0);
    
    // Bar revenue (global)
    const barRevenue = sales
      .filter(s => s.date === today)
      .reduce((acc, curr) => acc + curr.total, 0);

    const totalRevenue = serviceRevenue + (currentUser === Professional.ADMIN ? barRevenue : 0);

    return {
      count: userApts.length,
      revenue: totalRevenue,
      bar: barRevenue,
      next: userApts.find(a => a.time > new Date().toLocaleTimeString('pt-BR', {hour: '2-digit', minute:'2-digit'}))
    };
  }, [appointments, sales, currentUser, today]);

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-white">Olá, {currentUser.split(' ')[0]} 👋</h2>
        <p className="text-zinc-400">Aqui está o resumo do Studio Viking hoje.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Revenue */}
        <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl shadow-lg relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <DollarSign size={64} className="text-purple-500 transform rotate-12" />
          </div>
          <p className="text-zinc-400 text-sm font-medium uppercase">Faturamento Hoje</p>
          <h3 className="text-3xl font-bold text-white mt-2">R$ {stats.revenue.toFixed(2)}</h3>
          {currentUser === Professional.ADMIN && (
             <p className="text-xs text-purple-400 mt-1">+ R$ {stats.bar.toFixed(2)} do Bar</p>
          )}
        </div>

        {/* Card 2: Appointments */}
        <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl shadow-lg relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Calendar size={64} className="text-blue-500 transform -rotate-12" />
          </div>
          <p className="text-zinc-400 text-sm font-medium uppercase">Agendamentos</p>
          <h3 className="text-3xl font-bold text-white mt-2">{stats.count}</h3>
          <p className="text-xs text-zinc-500 mt-1">Para hoje</p>
        </div>

        {/* Card 3: Next Up */}
        <div className="bg-purple-900/20 border border-purple-500/30 p-6 rounded-2xl shadow-lg relative overflow-hidden col-span-1 md:col-span-2">
            <div className="flex items-start justify-between relative z-10">
                <div>
                    <p className="text-purple-300 text-sm font-medium uppercase flex items-center gap-2">
                        <TrendingUp size={16} /> Próximo Cliente
                    </p>
                    {stats.next ? (
                        <>
                            <h3 className="text-2xl font-bold text-white mt-2">{stats.next.clientName}</h3>
                            <p className="text-zinc-300 mt-1">{stats.next.serviceName} • {stats.next.time}</p>
                        </>
                    ) : (
                        <p className="text-zinc-400 mt-4">Nenhum agendamento pendente para hoje.</p>
                    )}
                </div>
                {stats.next && (
                    <div className="h-12 w-12 rounded-full bg-purple-600 flex items-center justify-center text-white font-bold">
                        {stats.next.time}
                    </div>
                )}
            </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <AlertCircle size={20} className="text-yellow-500" /> Avisos & Lembretes
            </h3>
            <div className="space-y-4">
                <div className="p-4 bg-zinc-950/50 rounded-lg border-l-4 border-purple-500">
                    <p className="text-sm text-zinc-300">Flash Day Viking programado para próximo sábado (15/10).</p>
                </div>
                <div className="p-4 bg-zinc-950/50 rounded-lg border-l-4 border-blue-500">
                    <p className="text-sm text-zinc-300">Estoque de Hidromel baixo. Reabastecer bar.</p>
                </div>
            </div>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
              <h3 className="text-lg font-bold text-white mb-4">Acesso Rápido</h3>
              <div className="grid grid-cols-2 gap-4">
                  <button className="p-4 bg-zinc-800 hover:bg-zinc-700 rounded-xl text-left transition-colors">
                      <p className="font-bold text-white">Novo Agendamento</p>
                      <p className="text-xs text-zinc-400 mt-1">Marcar cliente</p>
                  </button>
                  <button className="p-4 bg-zinc-800 hover:bg-zinc-700 rounded-xl text-left transition-colors">
                      <p className="font-bold text-white">Venda Bar</p>
                      <p className="text-xs text-zinc-400 mt-1">Registrar bebida</p>
                  </button>
              </div>
          </div>
      </div>
    </div>
  );
};