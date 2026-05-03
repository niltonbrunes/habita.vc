'use client';

import React, { useState } from 'react';
import { X, Mail, Phone, User, Tag, ShieldCheck, Loader2 } from 'lucide-react';
import { LeadsService } from '@/services/leads.service';
import { useAuth } from '@/context/AuthContext';

interface LeadFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const LeadFormModal = ({ isOpen, onClose, onSuccess }: LeadFormModalProps) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<{
    name: string;
    email: string;
    phone: string;
    source: string;
    temperature: 'cold' | 'warm' | 'hot';
    score: number;
  }>({
    name: '',
    email: '',
    phone: '',
    source: 'Manual',
    temperature: 'warm',
    score: 50,
  });

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    try {
      await LeadsService.create({
        ...formData,
        assigned_to_id: user.id,
        status: 'lead',
        history: [{ type: 'creation', date: new Date().toISOString(), note: 'Lead criado manualmente.' }]
      });
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Erro ao criar lead:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-primary/20 backdrop-blur-sm" onClick={onClose} />
      
      <div className="bg-white w-full max-w-xl rounded-[2.5rem] shadow-luxury border border-border relative overflow-hidden animate-in fade-in zoom-in duration-300">
        {/* Header */}
        <div className="p-8 border-b border-border flex justify-between items-center bg-muted/30">
          <div>
            <h2 className="text-2xl font-black text-primary mb-1">Novo Lead</h2>
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Adicionar prospecto manualmente</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white rounded-xl transition-colors text-muted-foreground">
            <X size={24} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Name */}
            <div className="space-y-2 col-span-full">
              <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">Nome Completo</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <User className="h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                </div>
                <input
                  required
                  type="text"
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  className="block w-full pl-10 pr-4 py-3 bg-muted/50 border border-transparent rounded-2xl focus:bg-white focus:border-primary/20 transition-all outline-none font-bold text-primary placeholder:text-muted-foreground/30"
                  placeholder="Nome do cliente"
                />
              </div>
            </div>

            {/* Email */}
            <div className="space-y-2">
              <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">E-mail</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                </div>
                <input
                  type="email"
                  value={formData.email}
                  onChange={e => setFormData({ ...formData, email: e.target.value })}
                  className="block w-full pl-10 pr-4 py-3 bg-muted/50 border border-transparent rounded-2xl focus:bg-white focus:border-primary/20 transition-all outline-none font-bold text-primary placeholder:text-muted-foreground/30"
                  placeholder="email@exemplo.com"
                />
              </div>
            </div>

            {/* Phone */}
            <div className="space-y-2">
              <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">WhatsApp</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Phone className="h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                </div>
                <input
                  required
                  type="text"
                  value={formData.phone}
                  onChange={e => setFormData({ ...formData, phone: e.target.value })}
                  className="block w-full pl-10 pr-4 py-3 bg-muted/50 border border-transparent rounded-2xl focus:bg-white focus:border-primary/20 transition-all outline-none font-bold text-primary placeholder:text-muted-foreground/30"
                  placeholder="(62) 99999-9999"
                />
              </div>
            </div>

            {/* Source */}
            <div className="space-y-2">
              <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">Origem</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Tag className="h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                </div>
                <select
                  value={formData.source}
                  onChange={e => setFormData({ ...formData, source: e.target.value })}
                  className="block w-full pl-10 pr-4 py-3 bg-muted/50 border border-transparent rounded-2xl focus:bg-white focus:border-primary/20 transition-all outline-none font-bold text-primary appearance-none cursor-pointer"
                >
                  <option value="Manual">Manual</option>
                  <option value="Instagram">Instagram</option>
                  <option value="Facebook">Facebook</option>
                  <option value="Google">Google</option>
                  <option value="Indicação">Indicação</option>
                  <option value="Portal">Portal Imobiliário</option>
                </select>
              </div>
            </div>

            {/* Temperature */}
            <div className="space-y-2">
              <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">Temperatura</label>
              <div className="flex gap-2">
                {(['cold', 'warm', 'hot'] as const).map(temp => (
                  <button
                    key={temp}
                    type="button"
                    onClick={() => setFormData({ ...formData, temperature: temp })}
                    className={`
                      flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border
                      ${formData.temperature === temp 
                        ? 'bg-primary text-white border-primary shadow-md scale-[1.02]' 
                        : 'bg-muted/50 text-muted-foreground border-transparent hover:border-border'}
                    `}
                  >
                    {temp === 'cold' ? 'Frio' : temp === 'warm' ? 'Morno' : 'Quente'}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-border flex items-center justify-between">
            <div className="flex items-center gap-2 text-green-600">
              <ShieldCheck size={18} />
              <span className="text-[10px] font-black uppercase tracking-widest">Dados Seguros</span>
            </div>
            
            <div className="flex gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-3 rounded-2xl font-bold text-sm text-muted-foreground hover:bg-muted transition-all"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={loading}
                className="bg-primary text-white px-8 py-3 rounded-2xl font-black text-sm hover:bg-primary-light transition-all shadow-premium flex items-center gap-2"
              >
                {loading ? <Loader2 className="animate-spin" size={18} /> : 'Cadastrar Lead'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
