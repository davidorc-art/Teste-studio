import React, { useState } from 'react';
import { store } from '../services/store';
import { Client } from '../types';
import { Search, User, FileText, Instagram } from 'lucide-react';

export const Clients: React.FC = () => {
  const [clients] = useState<Client[]>(store.getClients());
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = clients.filter(c => c.name.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Base de Clientes</h2>
        <button className="bg-purple-600 hover:bg-purple-500 text-white px-4 py-2 rounded-lg font-bold text-sm">
            + Novo Cliente
        </button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-3 text-zinc-500" size={20} />
        <input 
            type="text" 
            placeholder="Buscar por nome..." 
            className="w-full bg-zinc-900 border border-zinc-800 rounded-xl py-3 pl-10 text-white focus:ring-2 focus:ring-purple-500 outline-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="grid gap-4">
        {filtered.map(client => (
            <div key={client.id} className="bg-zinc-900 border border-zinc-800 p-4 rounded-xl flex items-center justify-between hover:border-zinc-700 transition-colors">
                <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-400">
                        <User />
                    </div>
                    <div>
                        <h4 className="font-bold text-white">{client.name}</h4>
                        <div className="flex gap-3 text-xs text-zinc-400 mt-1">
                            <span>{client.phone}</span>
                            {client.instagram && (
                                <span className="flex items-center gap-1 text-purple-400"><Instagram size={12} /> {client.instagram}</span>
                            )}
                        </div>
                    </div>
                </div>
                <div className="flex gap-2">
                    <button className="p-2 hover:bg-zinc-800 rounded-lg text-zinc-400 hover:text-white" title="Histórico">
                        <FileText size={18} />
                    </button>
                </div>
            </div>
        ))}
      </div>
    </div>
  );
};