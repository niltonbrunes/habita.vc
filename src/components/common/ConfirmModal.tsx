'use client';
import React from 'react';
import { AlertTriangle, X, Loader2 } from 'lucide-react';

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  isDestructive?: boolean;
  loading?: boolean;
}

export function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmLabel = 'Confirmar',
  cancelLabel = 'Cancelar',
  isDestructive = false,
  loading = false,
}: ConfirmModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-surface w-full max-w-md rounded-xl shadow-card border-2 border-border overflow-hidden animate-in zoom-in-95 duration-300">
        <div className="p-8 text-center">
          <div className={`w-16 h-16 ${isDestructive ? 'bg-red-50 text-red-500' : 'bg-blue-primary/5 text-primary'} rounded-full flex items-center justify-center mx-auto mb-6`}>
            <AlertTriangle size={32} />
          </div>
          
          <h3 className="text-xl font-bold text-heading mb-3">{title}</h3>
          <p className="text-muted-foreground font-medium mb-8 leading-relaxed">
            {message}
          </p>

          <div className="flex flex-col gap-3">
            <button
              onClick={onConfirm}
              disabled={loading}
              className={`w-full py-4 rounded-2xl font-black transition-all flex items-center justify-center gap-2 ${
                isDestructive 
                  ? 'bg-red-500 text-white hover:bg-red-600 shadow-lg shadow-red-200' 
                  : 'bg-blue-primary text-white hover:bg-blue-primary-light shadow-lg shadow-primary/20'
              } disabled:opacity-50`}
            >
              {loading ? <Loader2 className="animate-spin" size={20} /> : confirmLabel}
            </button>
            
            <button
              onClick={onClose}
              disabled={loading}
              className="w-full py-4 rounded-2xl font-black text-muted-foreground hover:bg-muted transition-all"
            >
              {cancelLabel}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
