import React, { useState } from 'react';
import { generateTattooConcept, generateClientMessage } from '../services/geminiService';
import { Sparkles, Send, MessageCircle, PenTool, Copy, Check } from 'lucide-react';

export const AiAssistant: React.FC = () => {
  const [mode, setMode] = useState<'concept' | 'message'>('concept');
  const [prompt, setPrompt] = useState('');
  const [clientName, setClientName] = useState('');
  const [messageType, setMessageType] = useState<'reminder' | 'care' | 'promo'>('reminder');
  
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleGenerate = async () => {
    setLoading(true);
    setCopied(false);
    let response = '';
    
    if (mode === 'concept') {
        response = await generateTattooConcept(prompt);
    } else {
        response = await generateClientMessage(messageType, clientName, prompt);
    }
    
    setResult(response);
    setLoading(false);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center space-y-2">
         <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600 flex justify-center items-center gap-2">
            <Sparkles className="text-purple-400" /> Viking AI Assistant
         </h2>
         <p className="text-zinc-400">Use inteligência artificial para criar conceitos de arte ou mensagens para clientes.</p>
      </div>

      <div className="flex justify-center gap-4 mb-8">
        <button 
            onClick={() => { setMode('concept'); setResult(''); }}
            className={`px-6 py-3 rounded-full font-bold transition-all flex items-center gap-2 ${mode === 'concept' ? 'bg-purple-600 text-white' : 'bg-zinc-800 text-zinc-400'}`}
        >
            <PenTool size={18} /> Conceito Tattoo
        </button>
        <button 
             onClick={() => { setMode('message'); setResult(''); }}
             className={`px-6 py-3 rounded-full font-bold transition-all flex items-center gap-2 ${mode === 'message' ? 'bg-purple-600 text-white' : 'bg-zinc-800 text-zinc-400'}`}
        >
            <MessageCircle size={18} /> Mensagem Cliente
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Input Section */}
        <div className="bg-zinc-900 p-6 rounded-2xl border border-zinc-800 h-fit">
            {mode === 'concept' ? (
                <div className="space-y-4">
                    <label className="block text-sm font-medium text-zinc-300">Descreva a ideia do cliente:</label>
                    <textarea 
                        className="w-full h-40 bg-zinc-950 border border-zinc-700 rounded-xl p-4 text-white focus:ring-2 focus:ring-purple-500 outline-none resize-none"
                        placeholder="Ex: Uma caveira realista com rosas e uma bússola, para o antebraço..."
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                    />
                </div>
            ) : (
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-zinc-300 mb-1">Tipo de Mensagem</label>
                        <select 
                            className="w-full bg-zinc-950 border border-zinc-700 rounded-lg p-2 text-white"
                            value={messageType}
                            onChange={(e) => setMessageType(e.target.value as any)}
                        >
                            <option value="reminder">Lembrete de Sessão</option>
                            <option value="care">Cuidados Pós-Tattoo</option>
                            <option value="promo">Promoção / Flash Day</option>
                        </select>
                    </div>
                    <div>
                         <label className="block text-sm font-medium text-zinc-300 mb-1">Nome do Cliente</label>
                         <input 
                            type="text"
                            className="w-full bg-zinc-950 border border-zinc-700 rounded-lg p-2 text-white"
                            placeholder="Ex: João"
                            value={clientName}
                            onChange={(e) => setClientName(e.target.value)}
                         />
                    </div>
                    <div>
                         <label className="block text-sm font-medium text-zinc-300 mb-1">Detalhes Adicionais</label>
                         <textarea 
                             className="w-full h-24 bg-zinc-950 border border-zinc-700 rounded-lg p-3 text-white resize-none"
                             placeholder="Ex: Amanhã às 14h, não beber álcool hoje..."
                             value={prompt}
                             onChange={(e) => setPrompt(e.target.value)}
                         />
                    </div>
                </div>
            )}

            <button 
                onClick={handleGenerate}
                disabled={loading || !prompt}
                className="w-full mt-6 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold py-3 rounded-xl flex justify-center items-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {loading ? <span className="animate-spin text-xl">⚔️</span> : <><Send size={18} /> Gerar com IA</>}
            </button>
        </div>

        {/* Output Section */}
        <div className="bg-zinc-900 p-6 rounded-2xl border border-zinc-800 min-h-[300px] flex flex-col">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-white font-bold">Resultado</h3>
                {result && (
                    <button onClick={copyToClipboard} className="text-zinc-400 hover:text-purple-400 transition-colors">
                        {copied ? <Check size={20} /> : <Copy size={20} />}
                    </button>
                )}
            </div>
            
            <div className="flex-1 bg-zinc-950 rounded-xl p-4 border border-zinc-800 overflow-y-auto max-h-[400px]">
                {loading ? (
                    <div className="h-full flex flex-col items-center justify-center text-zinc-600 space-y-2">
                        <Sparkles className="animate-pulse text-purple-900" size={48} />
                        <p className="animate-pulse">Consultando os deuses da arte...</p>
                    </div>
                ) : result ? (
                    <p className="whitespace-pre-wrap text-zinc-300 leading-relaxed">{result}</p>
                ) : (
                    <p className="text-zinc-600 italic">O resultado aparecerá aqui...</p>
                )}
            </div>
        </div>
      </div>
    </div>
  );
};