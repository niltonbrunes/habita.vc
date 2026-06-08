'use client';

import React, { useState, useEffect } from 'react';
import { X, ArrowRight, MessageSquare } from 'lucide-react';

interface MoveJustificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (note: string) => void;
  onSkip: () => void;
  leadName: string;
  fromStatus: string;
  toStatus: string;
  leadType: 'buyer' | 'seller';
}

const buyerStatusLabels: Record<string, string> = {
  lead: 'Novos Leads',
  contact: 'Contato',
  presentation: 'Apresentação',
  visit: 'Visitas',
  proposal: 'Proposta',
  sale: 'Fechamento',
  lost: 'Perdido',
};

const sellerStatusLabels: Record<string, string> = {
  prospecting: 'Prospecção',
  contacted: 'Contatado',
  visit_scheduled: 'Visita Agendada',
  visited: 'Visitado',
  proposal_sent: 'Proposta Enviada',
  captured: 'Captado',
  lost: 'Perdido',
};

export const MoveJustificationModal: React.FC<MoveJustificationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  onSkip,
  leadName,
  fromStatus,
  toStatus,
  leadType,
}) => {
  const [note, setNote] = useState('');

  // Reset note when modal opens
  useEffect(() => {
    if (isOpen) {
      setNote('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const labels = leadType === 'buyer' ? buyerStatusLabels : sellerStatusLabels;
  const fromLabel = labels[fromStatus] || fromStatus;
  const toLabel = labels[toStatus] || toStatus;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onConfirm(note.trim());
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      onConfirm(note.trim());
    }
  };

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-blue-primary/25 backdrop-blur-sm transition-opacity" 
        onClick={onClose} 
      />
      
      {/* Modal Dialog */}
      <div className="bg-surface w-full max-w-lg rounded-2xl shadow-card border border-border relative overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="p-6 border-b border-border flex justify-between items-center bg-muted/20">
          <div>
            <h2 className="text-lg font-extrabold text-heading tracking-tight mb-1">
              Justificar Movimentação
            </h2>
            <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">
              Atualizar status do lead
            </p>
          </div>
          <button 
            onClick={onClose} 
            className="p-2 hover:bg-muted/50 rounded-xl transition-colors text-muted-foreground"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
          {/* Content */}
          <div className="p-6 space-y-6 overflow-y-auto">
            {/* Visual Transition */}
            <div className="bg-muted/30 border border-border/40 rounded-xl p-4 space-y-3">
              <div className="text-xs font-bold text-muted-foreground">
                Movendo o lead <span className="text-primary font-extrabold">{leadName}</span>:
              </div>
              <div className="flex items-center gap-3">
                <div className="flex-1 px-3 py-2 bg-surface border border-border rounded-lg text-center">
                  <span className="text-xs font-bold text-muted-foreground block uppercase tracking-wider text-[10px]">Origem</span>
                  <span className="text-xs font-extrabold text-primary block mt-0.5 truncate">{fromLabel}</span>
                </div>
                <div className="flex-shrink-0 text-muted-foreground">
                  <ArrowRight size={16} className="animate-pulse" />
                </div>
                <div className="flex-1 px-3 py-2 bg-blue-primary/5 border border-blue-primary/10 rounded-lg text-center">
                  <span className="text-xs font-bold text-blue-primary block uppercase tracking-wider text-[10px]">Destino</span>
                  <span className="text-xs font-extrabold text-blue-primary block mt-0.5 truncate">{toLabel}</span>
                </div>
              </div>
            </div>

            {/* Note Textarea */}
            <div className="space-y-2">
              <label className="text-xs font-black text-muted-foreground uppercase tracking-widest ml-1 flex items-center gap-1.5">
                <MessageSquare size={14} /> Anotação Comercial (Justificativa)
              </label>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ex: Cliente atendeu e solicitou envio do book pelo WhatsApp. Agendamos retorno para amanhã."
                className="w-full min-h-[120px] max-h-[200px] px-4 py-3 bg-muted/40 border border-border rounded-xl font-medium text-xs text-primary focus:border-primary focus:bg-surface outline-none transition-all resize-none"
                autoFocus
              />
              <p className="text-[10px] text-muted-foreground font-medium ml-1">
                Dica: Pressione <kbd className="px-1 py-0.5 bg-muted rounded border border-border text-[9px] font-bold">Ctrl + Enter</kbd> para salvar rapidamente.
              </p>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="p-6 border-t border-border bg-muted/20 flex flex-col sm:flex-row gap-3">
            <button
              type="button"
              onClick={onClose}
              className="w-full sm:flex-1 py-3 bg-surface border border-border hover:bg-muted/40 rounded-xl text-xs font-bold text-muted-foreground transition-all uppercase tracking-wider"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={onSkip}
              className="w-full sm:flex-1 py-3 bg-muted/50 border border-transparent hover:border-border/60 rounded-xl text-xs font-bold text-muted-foreground transition-all uppercase tracking-wider"
            >
              Mover sem anotação
            </button>
            <button
              type="submit"
              disabled={!note.trim()}
              className={`w-full sm:flex-1 py-3 rounded-xl text-xs font-extrabold text-white transition-all uppercase tracking-wider ${
                note.trim()
                  ? 'bg-blue-primary hover:bg-blue-primary/90 shadow-md'
                  : 'bg-muted-foreground/35 cursor-not-allowed'
              }`}
            >
              Salvar e Mover
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
