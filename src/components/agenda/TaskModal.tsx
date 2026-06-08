'use client';

import React, { useState, useEffect } from 'react';
import { X, Calendar, Clock, Tag, MessageSquare, Loader2, ShieldCheck } from 'lucide-react';
import { TasksService } from '@/services/tasks.service';
import { useAuth } from '@/context/AuthContext';
import { TaskCategory, TaskPriority } from '@/types/database';

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  leadId?: string;
  leadName?: string;
}

export const TaskModal = ({ isOpen, onClose, onSuccess, leadId, leadName }: TaskModalProps) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'business' as TaskCategory,
    priority: 'medium' as TaskPriority,
    due_date: '',
    due_time: '09:00',
  });

  // Set today's date and prefill title if lead is linked
  useEffect(() => {
    if (isOpen) {
      setFormData(prev => ({
        ...prev,
        title: leadName ? `Acompanhamento: ${leadName}` : '',
        due_date: new Date().toISOString().split('T')[0],
      }));
    }
  }, [isOpen, leadName]);


  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    try {
      const fullDueDate = `${formData.due_date}T${formData.due_time}:00Z`;
      await TasksService.create({
        user_id: user.id,
        lead_id: leadId || undefined,
        title: formData.title,
        description: formData.description,
        category: formData.category,
        priority: formData.priority,
        due_date: fullDueDate,
        completed: false
      });
      onSuccess();
      onClose();
    } catch (error: any) {
      console.error('Erro detalhado ao salvar tarefa:', error.message || error);
      alert('Erro ao salvar tarefa: ' + (error.message || 'Verifique as permissões no banco.'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-blue-primary/20 backdrop-blur-sm" onClick={onClose} />
      
      <div className="bg-surface w-full max-w-lg rounded-xl shadow-card border border-border relative overflow-hidden animate-in fade-in zoom-in duration-300">
        <div className="p-8 border-b border-border flex justify-between items-center bg-muted/30">
          <div>
            <h2 className="text-xl font-bold text-heading mb-1">Nova Atividade</h2>
            <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Agendar compromisso profissional ou pessoal</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-surface rounded-xl transition-colors text-muted-foreground">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          {/* Category Selector */}
          <div className="flex gap-2">
            {(['business', 'personal', 'meeting'] as const).map(cat => (
              <button
                key={cat}
                type="button"
                onClick={() => setFormData({ ...formData, category: cat })}
                className={`
                  flex-1 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all border
                  ${formData.category === cat 
                    ? 'bg-blue-primary text-white border-primary shadow-md' 
                    : 'bg-muted/50 text-muted-foreground border-transparent hover:border-border'}
                `}
              >
                {cat === 'business' ? 'Negócios' : cat === 'personal' ? 'Pessoal' : 'Reunião'}
              </button>
            ))}
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">O que precisa ser feito?</label>
              <input
                required
                type="text"
                value={formData.title}
                onChange={e => setFormData({ ...formData, title: e.target.value })}
                className="block w-full px-5 py-4 bg-muted/50 border border-transparent rounded-2xl focus:bg-surface focus:border-primary/20 transition-all outline-none font-bold text-primary placeholder:text-muted-foreground/30"
                placeholder="Ex: Reunião com Diretor ou Troca de óleo"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1 text-center block">Data</label>
                <div className="relative">
                  <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                  <input
                    type="date"
                    value={formData.due_date}
                    onChange={e => setFormData({ ...formData, due_date: e.target.value })}
                    className="block w-full pl-12 pr-4 py-4 bg-muted/50 border border-transparent rounded-2xl focus:bg-surface focus:border-primary/20 transition-all outline-none font-bold text-primary text-sm"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1 text-center block">Horário</label>
                <div className="relative">
                  <Clock className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                  <input
                    type="time"
                    value={formData.due_time}
                    onChange={e => setFormData({ ...formData, due_time: e.target.value })}
                    className="block w-full pl-12 pr-4 py-4 bg-muted/50 border border-transparent rounded-2xl focus:bg-surface focus:border-primary/20 transition-all outline-none font-bold text-primary text-sm"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">Observações (Opcional)</label>
              <div className="relative">
                <MessageSquare className="absolute left-4 top-4 text-muted-foreground" size={18} />
                <textarea
                  value={formData.description}
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                  className="block w-full pl-12 pr-4 py-4 bg-muted/50 border border-transparent rounded-2xl focus:bg-surface focus:border-primary/20 transition-all outline-none font-bold text-primary text-sm min-h-[100px]"
                  placeholder="Detalhes adicionais..."
                />
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-border flex items-center justify-between">
            <div className="flex items-center gap-2 text-green-600">
              <ShieldCheck size={18} />
              <span className="text-[10px] font-black uppercase tracking-widest">Sincronizado</span>
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
                className="bg-blue-primary text-white px-8 py-3 rounded-2xl font-black text-sm hover:bg-blue-primary-light transition-all shadow-card flex items-center gap-2"
              >
                {loading ? <Loader2 className="animate-spin" size={18} /> : 'Agendar'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
