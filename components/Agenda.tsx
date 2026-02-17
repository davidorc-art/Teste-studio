import React, { useState, useEffect } from 'react';
import { store } from '../services/store';
import { Appointment, Professional, AppointmentStatus, ServiceItem, Client } from '../types';
import { ChevronLeft, ChevronRight, Plus, X, Check, Clock } from 'lucide-react';

export const Agenda: React.FC<{ currentUser: Professional }> = ({ currentUser }) => {
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [showModal, setShowModal] = useState(false);

  // Form State
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  
  const [newApt, setNewApt] = useState<Partial<Appointment>>({
    date: selectedDate,
    status: AppointmentStatus.SCHEDULED,
    professional: currentUser === Professional.ADMIN ? Professional.DAVID : currentUser
  });

  const loadData = () => {
    setAppointments(store.getAppointments());
    setServices(store.getServices());
    setClients(store.getClients());
  };

  useEffect(() => {
    loadData();
  }, []);

  const changeDate = (days: number) => {
    const date = new Date(selectedDate);
    date.setDate(date.getDate() + days);
    const newDateStr = date.toISOString().split('T')[0];
    setSelectedDate(newDateStr);
    setNewApt(prev => ({ ...prev, date: newDateStr }));
  };

  const handleSave = () => {
    if (!newApt.clientId || !newApt.serviceId || !newApt.time || !newApt.date) return;

    const client = clients.find(c => c.id === newApt.clientId);
    const service = services.find(s => s.id === newApt.serviceId);

    const appointment: Appointment = {
      id: Date.now().toString(),
      clientId: newApt.clientId,
      clientName: client?.name || 'Unknown',
      serviceId: newApt.serviceId,
      serviceName: service?.name || 'Unknown',
      date: newApt.date,
      time: newApt.time,
      price: newApt.price || service?.basePrice || 0,
      professional: newApt.professional as Professional,
      status: AppointmentStatus.SCHEDULED
    };

    store.addAppointment(appointment);
    loadData();
    setShowModal(false);
  };

  const updateStatus = (id: string, status: AppointmentStatus) => {
    store.updateAppointmentStatus(id, status);
    loadData();
  };

  const filteredAppointments = appointments
    .filter(a => a.date === selectedDate)
    .filter(a => currentUser === Professional.ADMIN || a.professional === currentUser)
    .sort((a, b) => a.time.localeCompare(b.time));

  return (
    <div className="h-full flex flex-col">
      {/* Date Header */}
      <div className="flex items-center justify-between mb-6 bg-zinc-900 p-4 rounded-xl border border-zinc-800">
        <button onClick={() => changeDate(-1)} className="p-2 hover:bg-zinc-800 rounded-full text-zinc-400 hover:text-white">
          <ChevronLeft />
        </button>
        <div className="text-center">
            <h2 className="text-xl font-bold text-white">
                {new Date(selectedDate).toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })}
            </h2>
            <p className="text-xs text-purple-400 font-medium uppercase tracking-widest">
                {currentUser === Professional.ADMIN ? 'Agenda Geral' : `Agenda - ${currentUser.split(' ')[0]}`}
            </p>
        </div>
        <button onClick={() => changeDate(1)} className="p-2 hover:bg-zinc-800 rounded-full text-zinc-400 hover:text-white">
          <ChevronRight />
        </button>
      </div>

      {/* Slots */}
      <div className="flex-1 space-y-3 overflow-y-auto">
        {filteredAppointments.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-zinc-500">
                <Clock size={48} className="mb-4 opacity-20" />
                <p>Nenhum agendamento para este dia.</p>
            </div>
        ) : (
            filteredAppointments.map(apt => (
            <div key={apt.id} className="flex group bg-zinc-900 border border-zinc-800 rounded-lg overflow-hidden hover:border-purple-500/50 transition-colors">
                <div className="bg-zinc-800 w-20 flex flex-col items-center justify-center border-r border-zinc-700">
                    <span className="text-lg font-bold text-white">{apt.time}</span>
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded mt-1 ${
                        apt.status === AppointmentStatus.CONFIRMED ? 'bg-green-900 text-green-300' :
                        apt.status === AppointmentStatus.CANCELLED ? 'bg-red-900 text-red-300' :
                        apt.status === AppointmentStatus.COMPLETED ? 'bg-purple-900 text-purple-300' :
                        'bg-yellow-900 text-yellow-300'
                    }`}>
                        {apt.status}
                    </span>
                </div>
                <div className="p-4 flex-1 flex justify-between items-center">
                    <div>
                        <h4 className="font-bold text-white text-lg">{apt.clientName}</h4>
                        <p className="text-purple-400 text-sm">{apt.serviceName}</p>
                        <p className="text-zinc-500 text-xs mt-1">R$ {apt.price.toFixed(2)} • {apt.professional}</p>
                    </div>
                    <div className="flex gap-2 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity">
                        {apt.status !== AppointmentStatus.CANCELLED && apt.status !== AppointmentStatus.COMPLETED && (
                            <>
                                <button 
                                    onClick={() => updateStatus(apt.id, AppointmentStatus.CONFIRMED)}
                                    title="Confirmar"
                                    className="p-2 bg-green-900/50 hover:bg-green-900 text-green-400 rounded-full"
                                >
                                    <Check size={18} />
                                </button>
                                <button 
                                    onClick={() => updateStatus(apt.id, AppointmentStatus.CANCELLED)}
                                    title="Cancelar"
                                    className="p-2 bg-red-900/50 hover:bg-red-900 text-red-400 rounded-full"
                                >
                                    <X size={18} />
                                </button>
                            </>
                        )}
                        {apt.status === AppointmentStatus.CONFIRMED && (
                             <button 
                             onClick={() => updateStatus(apt.id, AppointmentStatus.COMPLETED)}
                             className="px-3 py-1 bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold rounded uppercase"
                         >
                             Finalizar
                         </button>
                        )}
                    </div>
                </div>
            </div>
            ))
        )}
      </div>

      {/* FAB */}
      <button 
        onClick={() => setShowModal(true)}
        className="fixed md:absolute bottom-20 md:bottom-8 right-6 md:right-8 bg-purple-600 hover:bg-purple-500 text-white p-4 rounded-full shadow-lg shadow-purple-900/50 transition-transform hover:scale-105 z-40"
      >
        <Plus size={24} />
      </button>

      {/* New Appointment Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-md p-6">
            <h3 className="text-xl font-bold text-white mb-4">Novo Agendamento</h3>
            
            <div className="space-y-4">
                <div>
                    <label className="block text-xs text-zinc-400 mb-1">Cliente</label>
                    <select 
                        className="w-full bg-zinc-950 border border-zinc-700 rounded p-2 text-white"
                        onChange={(e) => setNewApt({...newApt, clientId: e.target.value})}
                    >
                        <option value="">Selecione...</option>
                        {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs text-zinc-400 mb-1">Data</label>
                        <input 
                            type="date" 
                            className="w-full bg-zinc-950 border border-zinc-700 rounded p-2 text-white"
                            value={newApt.date}
                            onChange={(e) => setNewApt({...newApt, date: e.target.value})}
                        />
                    </div>
                    <div>
                        <label className="block text-xs text-zinc-400 mb-1">Horário</label>
                        <input 
                            type="time" 
                            className="w-full bg-zinc-950 border border-zinc-700 rounded p-2 text-white"
                            onChange={(e) => setNewApt({...newApt, time: e.target.value})}
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-xs text-zinc-400 mb-1">Profissional</label>
                    <select 
                         className="w-full bg-zinc-950 border border-zinc-700 rounded p-2 text-white"
                         value={newApt.professional}
                         onChange={(e) => setNewApt({...newApt, professional: e.target.value as Professional})}
                         disabled={currentUser !== Professional.ADMIN}
                    >
                        <option value={Professional.DAVID}>{Professional.DAVID}</option>
                        <option value={Professional.JEY}>{Professional.JEY}</option>
                    </select>
                </div>

                <div>
                    <label className="block text-xs text-zinc-400 mb-1">Serviço</label>
                    <select 
                         className="w-full bg-zinc-950 border border-zinc-700 rounded p-2 text-white"
                         onChange={(e) => {
                             const s = services.find(srv => srv.id === e.target.value);
                             setNewApt({...newApt, serviceId: e.target.value, price: s?.basePrice});
                         }}
                    >
                        <option value="">Selecione...</option>
                        {services
                            .filter(s => s.professional === newApt.professional)
                            .map(s => <option key={s.id} value={s.id}>{s.name} (R$ {s.basePrice})</option>)
                        }
                    </select>
                </div>

                <div>
                    <label className="block text-xs text-zinc-400 mb-1">Valor (R$)</label>
                    <input 
                        type="number" 
                        className="w-full bg-zinc-950 border border-zinc-700 rounded p-2 text-white"
                        value={newApt.price || ''}
                        onChange={(e) => setNewApt({...newApt, price: parseFloat(e.target.value)})}
                    />
                </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
                <button onClick={() => setShowModal(false)} className="px-4 py-2 text-zinc-400 hover:text-white">Cancelar</button>
                <button onClick={handleSave} className="px-6 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-lg font-bold">Agendar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};