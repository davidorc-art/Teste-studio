import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { store } from '../services/store';
import { AppointmentStatus, Professional } from '../types';

export const Financials: React.FC = () => {
  const appointments = store.getAppointments().filter(a => a.status !== AppointmentStatus.CANCELLED);
  const sales = store.getSales();

  const data = [
    { name: 'Seg', tattoo: 0, piercing: 0, bar: 0 },
    { name: 'Ter', tattoo: 0, piercing: 0, bar: 0 },
    { name: 'Qua', tattoo: 0, piercing: 0, bar: 0 },
    { name: 'Qui', tattoo: 0, piercing: 0, bar: 0 },
    { name: 'Sex', tattoo: 0, piercing: 0, bar: 0 },
    { name: 'Sab', tattoo: 0, piercing: 0, bar: 0 },
    { name: 'Dom', tattoo: 0, piercing: 0, bar: 0 },
  ];

  // Mock population of chart data based on current week (simplified logic for demo)
  // In a real app, we would calculate dates properly
  appointments.forEach(apt => {
    const day = new Date(apt.date).getDay(); // 0 is Sunday
    const index = day === 0 ? 6 : day - 1; // Map to Mon-Sun array
    if (index >= 0 && index < 7) {
        if (apt.professional === Professional.DAVID) data[index].tattoo += apt.price;
        else data[index].piercing += apt.price;
    }
  });

  sales.forEach(sale => {
    const day = new Date(sale.date).getDay();
    const index = day === 0 ? 6 : day - 1;
     if (index >= 0 && index < 7) {
        data[index].bar += sale.total;
     }
  });

  const totalTattoo = appointments.filter(a => a.professional === Professional.DAVID).reduce((acc, c) => acc + c.price, 0);
  const totalPiercing = appointments.filter(a => a.professional === Professional.JEY).reduce((acc, c) => acc + c.price, 0);
  const totalBar = sales.reduce((acc, c) => acc + c.total, 0);

  return (
    <div className="space-y-6">
       <h2 className="text-2xl font-bold text-white mb-4">Relatório Financeiro</h2>

       {/* Summaries */}
       <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-xl border-l-4 border-l-purple-600">
                <p className="text-zinc-400 text-xs uppercase">Tatuagem (David)</p>
                <h3 className="text-2xl font-bold text-white">R$ {totalTattoo.toFixed(2)}</h3>
            </div>
            <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-xl border-l-4 border-l-pink-600">
                <p className="text-zinc-400 text-xs uppercase">Piercing (Jey)</p>
                <h3 className="text-2xl font-bold text-white">R$ {totalPiercing.toFixed(2)}</h3>
            </div>
            <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-xl border-l-4 border-l-blue-600">
                <p className="text-zinc-400 text-xs uppercase">Bar Viking</p>
                <h3 className="text-2xl font-bold text-white">R$ {totalBar.toFixed(2)}</h3>
            </div>
       </div>

       {/* Chart */}
       <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-xl h-96">
            <h3 className="text-white font-bold mb-6">Faturamento da Semana</h3>
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data} stackOffset="sign">
                    <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                    <XAxis dataKey="name" stroke="#71717a" tick={{fill: '#71717a'}} axisLine={false} tickLine={false} />
                    <YAxis stroke="#71717a" tick={{fill: '#71717a'}} axisLine={false} tickLine={false} tickFormatter={(value) => `R$${value}`} />
                    <Tooltip 
                        contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', borderRadius: '8px', color: '#fff' }}
                        itemStyle={{ color: '#fff' }}
                    />
                    <Bar dataKey="tattoo" name="Tatuagem" stackId="a" fill="#9333ea" radius={[0, 0, 4, 4]} />
                    <Bar dataKey="piercing" name="Piercing" stackId="a" fill="#db2777" radius={[0, 0, 0, 0]} />
                    <Bar dataKey="bar" name="Bar" stackId="a" fill="#2563eb" radius={[4, 4, 0, 0]} />
                </BarChart>
            </ResponsiveContainer>
       </div>
    </div>
  );
};