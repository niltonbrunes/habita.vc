'use client';

import React, { useEffect, useState } from 'react';
import { X, UserCheck, ChevronDown, Loader2 } from 'lucide-react';
import { Profile } from '@/types/database';
import { ProfilesService } from '@/services/profiles.service';

interface AssignManagerModalProps {
  isOpen: boolean;
  broker: Profile | null;
  onClose: () => void;
  onSuccess: () => void;
}

export function AssignManagerModal({ isOpen, broker, onClose, onSuccess }: AssignManagerModalProps) {
  const [managers, setManagers] = useState<Profile[]>([]);
  const [selectedManagerId, setSelectedManagerId] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    setLoading(true);
    ProfilesService.getAll()
      .then(profiles => {
        const eligible = profiles.filter(p => p.role === 'manager' || p.role === 'director' || p.role === 'admin');
        setManagers(eligible);
        setSelectedManagerId(broker?.manager_id || '');
      })
      .finally(() => setLoading(false));
  }, [isOpen, broker]);

  const handleSave = async () => {
    if (!broker) return;
    setSaving(true);
    try {
      await ProfilesService.assignManager(broker.id, selectedManagerId || null);
      onSuccess();
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen || !broker) return null;

  const roleLabel: Record<string, string> = {
    manager: 'Gerente',
    director: 'Diretor',
    admin: 'Admin',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 bg-surface rounded-xl shadow-2xl w-full max-w-md overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary to-primary/80 p-8 text-white">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-surface/10 flex items-center justify-center border border-white/20">
                <UserCheck size={24} />
              </div>
              <div>
                <h2 className="text-lg font-black">Atribuir Gerente</h2>
                <p className="text-white/60 text-xs font-medium mt-0.5">Definir liderança para o corretor</p>
              </div>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-surface/10 rounded-xl transition-colors">
              <X size={20} />
            </button>
          </div>
        </div>

        <div className="p-8 space-y-6">
          {/* Broker info */}
          <div className="flex items-center gap-4 p-4 bg-muted/30 rounded-2xl border border-border/50">
            <div className="w-12 h-12 rounded-2xl bg-blue-primary/10 flex items-center justify-center font-black text-primary overflow-hidden">
              {broker.avatar_url
                ? <img src={broker.avatar_url} alt="" className="w-full h-full object-cover" />
                : broker.full_name.substring(0, 2).toUpperCase()
              }
            </div>
            <div>
              <p className="font-black text-primary">{broker.full_name}</p>
              <p className="text-xs font-medium text-muted-foreground">{broker.email}</p>
            </div>
          </div>

          {/* Manager select */}
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
              Gerente / Líder Responsável
            </label>
            {loading ? (
              <div className="h-14 bg-muted/30 rounded-xl animate-pulse" />
            ) : (
              <div className="relative">
                <select
                  value={selectedManagerId}
                  onChange={e => setSelectedManagerId(e.target.value)}
                  className="w-full px-4 py-4 pr-10 bg-muted/30 border-2 border-border/50 focus:border-primary/30 rounded-xl font-bold text-sm text-primary outline-none appearance-none transition-all"
                >
                  <option value="">— Sem gerente atribuído —</option>
                  {managers.map(m => (
                    <option key={m.id} value={m.id}>
                      {m.full_name} ({roleLabel[m.role] || m.role})
                    </option>
                  ))}
                </select>
                <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
              </div>
            )}
          </div>

          <div className="flex gap-3 pt-2">
            <button
              onClick={onClose}
              className="flex-1 py-4 rounded-xl border-2 border-border font-black text-sm text-muted-foreground hover:border-primary/30 hover:text-primary transition-all"
            >
              Cancelar
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex-1 py-4 rounded-xl bg-blue-primary text-white font-black text-sm hover:bg-blue-primary/90 transition-all flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {saving ? <Loader2 size={16} className="animate-spin" /> : <UserCheck size={16} />}
              {saving ? 'Salvando...' : 'Confirmar'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
