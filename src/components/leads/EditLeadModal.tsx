'use client';

import React, { useState, useEffect } from 'react';
import { X, Loader2, Save } from 'lucide-react';
import { LeadsService } from '@/services/leads.service';
import { PeopleService } from '@/services/people.service';
import { Lead } from '@/types/database';

interface EditLeadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  lead: Lead | null;
}

export const EditLeadModal = ({ isOpen, onClose, onSuccess, lead }: EditLeadModalProps) => {
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState('');
  const [value, setValue] = useState<number | string>('');

  useEffect(() => {
    if (lead) {
      setName(lead.person?.name || lead.name || '');
      setValue(lead.value || 0);
    }
  }, [lead]);

  if (!isOpen || !lead) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Atualiza o lead
      await LeadsService.update(lead.id, {
        name,
        value: typeof value === 'string' ? parseFloat(value) : value,
      });

      // Se houver pessoa vinculada, atualiza o nome da pessoa
      if (lead.person_id) {
        await PeopleService.update(lead.person_id, {
          name,
        });
      }

      onSuccess();
      onClose();
    } catch (err) {
      console.error('Erro ao atualizar lead:', err);
      alert('Erro ao atualizar. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
      <div 
        className="bg-surface w-full max-w-md rounded-3xl shadow-2xl overflow-hidden border border-border-light flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-6 border-b border-border-light bg-muted/5">
          <h2 className="text-xl font-bold text-heading">Editar Lead</h2>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-black/5 dark:hover:bg-white/10 rounded-full transition-colors text-muted-foreground"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4">
          <div>
            <label className="block text-sm font-bold text-heading mb-2">Nome do Lead / Cliente</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-surface border border-border rounded-xl px-4 py-3 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
              placeholder="Ex: Joo da Silva"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-heading mb-2">Valor (R$)</label>
            <input
              type="number"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              className="w-full bg-surface border border-border rounded-xl px-4 py-3 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
              placeholder="0.00"
            />
          </div>

          <div className="mt-6 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 text-sm font-bold text-muted-foreground hover:bg-muted rounded-xl transition-all"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-primary text-white text-sm font-bold rounded-xl hover:bg-primary/90 transition-all shadow-card flex items-center gap-2"
            >
              {loading ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
              Salvar Alteraes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
