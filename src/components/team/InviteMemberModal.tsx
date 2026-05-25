'use client';

import React, { useState } from 'react';
import { supabase } from '@/lib/supabase';
import {
  X,
  UserPlus,
  Mail,
  User,
  Shield,
  CheckCircle2,
  Loader2,
  AlertTriangle,
  Info,
} from 'lucide-react';

const ROLES = [
  {
    value: 'broker',
    label: 'Corretor',
    description: 'CRM, leads proprios, comissoes e publicacao.',
    color: 'border-blue-200 bg-blue-50 text-blue-700',
    activeColor: 'border-blue-500 bg-blue-500 text-white',
  },
  {
    value: 'manager',
    label: 'Gerente',
    description: 'Corretor + visao de equipe, metas e relatorios.',
    color: 'border-purple-200 bg-purple-50 text-purple-700',
    activeColor: 'border-purple-500 bg-purple-500 text-white',
  },
  {
    value: 'director',
    label: 'Diretor',
    description: 'BI completo, equipe, metas e configuracoes avancadas.',
    color: 'border-orange-200 bg-orange-50 text-orange-700',
    activeColor: 'border-orange-500 bg-orange-500 text-white',
  },
  {
    value: 'admin',
    label: 'Administrador',
    description: 'Controle total: usuarios, convites e permissoes.',
    color: 'border-red-200 bg-red-50 text-red-700',
    activeColor: 'border-red-500 bg-red-500 text-white',
  },
];

interface InviteMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const InviteMemberModal = ({ isOpen, onClose, onSuccess }: InviteMemberModalProps) => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<string>('broker');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const handleClose = () => {
    setFullName('');
    setEmail('');
    setRole('broker');
    setError(null);
    setSuccess(false);
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const tempPassword = Math.random().toString(36).slice(-8) + 'Aa1!';

      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: email.trim().toLowerCase(),
        password: tempPassword,
        options: {
          data: {
            full_name: fullName.trim(),
            role: role,
          },
          emailRedirectTo: `${window.location.origin}/login`,
        },
      });

      if (authError) throw authError;

      if (authData?.user?.id) {
        const { error: profileError } = await supabase
          .from('profiles')
          .upsert({
            id: authData.user.id,
            full_name: fullName.trim(),
            email: email.trim().toLowerCase(),
            role: role,
            status: 'active',
          }, { onConflict: 'id' });

        if (profileError) {
          console.warn('Profile upsert warning:', profileError.message);
        }
      }

      setSuccess(true);
      setTimeout(() => {
        handleClose();
        onSuccess();
      }, 2500);

    } catch (err: any) {
      const msg = err?.message || 'Erro ao enviar convite.';
      if (msg.includes('already registered')) {
        setError('Este e-mail ja esta cadastrado no sistema.');
      } else if (msg.includes('invalid')) {
        setError('Endereco de e-mail invalido.');
      } else {
        setError(msg);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-blue-primary/40 backdrop-blur-md" onClick={handleClose} />

      <div className="relative bg-surface w-full max-w-lg rounded-[3rem] shadow-card border border-border animate-in fade-in zoom-in duration-300 overflow-hidden">

        <div className="p-8 border-b border-border bg-gradient-to-r from-primary/5 to-accent/5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-primary rounded-2xl flex items-center justify-center">
                <UserPlus size={22} className="text-white" />
              </div>
              <div>
                <h2 className="text-xl font-black text-primary">Convidar Membro</h2>
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Novo usuario do sistema</p>
              </div>
            </div>
            <button onClick={handleClose} className="p-2 hover:bg-muted rounded-xl transition-colors">
              <X size={22} />
            </button>
          </div>
        </div>

        {success ? (
          <div className="p-12 flex flex-col items-center text-center gap-4">
            <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center">
              <CheckCircle2 size={44} className="text-green-500" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-heading mb-2">Convite Enviado!</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Um e-mail de confirmacao foi enviado para<br />
                <strong className="text-primary">{email}</strong>.<br />
                O usuario deve verificar o e-mail para ativar o acesso.
              </p>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-8 space-y-6">

            <div className="flex items-start gap-3 bg-blue-50 border border-blue-100 p-4 rounded-2xl">
              <Info size={16} className="text-blue-500 shrink-0 mt-0.5" />
              <p className="text-xs text-blue-700 font-medium leading-relaxed">
                O convidado recebera um e-mail com link de ativacao para definir sua senha.
                Este cadastro e separado de Contatos/Pessoas do CRM.
              </p>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">
                Nome Completo
              </label>
              <div className="flex items-center bg-muted/50 border border-transparent rounded-2xl focus-within:bg-surface focus-within:border-primary/20 transition-all overflow-hidden">
                <div className="pl-4 pr-2 text-muted-foreground shrink-0">
                  <User size={18} />
                </div>
                <input
                  type="text"
                  required
                  placeholder="Ex: Maria Oliveira"
                  value={fullName}
                  onChange={e => setFullName(e.target.value)}
                  className="w-full py-4 pr-4 bg-transparent outline-none font-bold text-primary border-none focus:ring-0"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">
                E-mail
              </label>
              <div className="flex items-center bg-muted/50 border border-transparent rounded-2xl focus-within:bg-surface focus-within:border-primary/20 transition-all overflow-hidden">
                <div className="pl-4 pr-2 text-muted-foreground shrink-0">
                  <Mail size={18} />
                </div>
                <input
                  type="email"
                  required
                  placeholder="usuario@empresa.com.br"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full py-4 pr-4 bg-transparent outline-none font-bold text-primary border-none focus:ring-0"
                />
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1 flex items-center gap-1">
                <Shield size={12} /> Nivel de Acesso
              </label>
              <div className="grid grid-cols-2 gap-3">
                {ROLES.map(r => (
                  <button
                    key={r.value}
                    type="button"
                    onClick={() => setRole(r.value)}
                    className={`p-4 rounded-2xl border-2 text-left transition-all ${
                      role === r.value ? r.activeColor : r.color
                    }`}
                  >
                    <p className="font-black text-sm mb-1">{r.label}</p>
                    <p className={`text-[10px] leading-snug ${role === r.value ? 'opacity-90' : 'opacity-70'}`}>
                      {r.description}
                    </p>
                  </button>
                ))}
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-3 bg-red-50 border border-red-100 text-red-700 px-4 py-3 rounded-2xl">
                <AlertTriangle size={16} className="shrink-0" />
                <span className="text-xs font-bold">{error}</span>
              </div>
            )}

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={handleClose}
                className="flex-1 py-4 rounded-2xl border-2 border-border font-bold text-muted-foreground hover:bg-muted transition-all"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 py-4 rounded-2xl bg-blue-primary text-white font-black hover:bg-blue-primary-light transition-all shadow-card flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? (
                  <><Loader2 className="animate-spin" size={18} /> Enviando...</>
                ) : (
                  <><UserPlus size={18} /> Enviar Convite</>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
