'use client';
import React, { useState } from 'react';
import { PropertyOwner } from '@/types/database';
import { Plus, Trash2, User } from 'lucide-react';

interface Props {
  owners: Omit<PropertyOwner, 'id' | 'created_at' | 'property_id'>[];
  onChange: (owners: Omit<PropertyOwner, 'id' | 'created_at' | 'property_id'>[]) => void;
}

const EMPTY_OWNER = (): Omit<PropertyOwner, 'id' | 'created_at' | 'property_id'> => ({
  name: '',
  cpf_cnpj: '',
  phone: '',
  email: '',
  ownership_percent: 100,
  owner_type: 'owner',
});

export function OwnersStep({ owners, onChange }: Props) {
  const add = () => onChange([...owners, EMPTY_OWNER()]);
  const remove = (i: number) => {
    const updated = owners.filter((_, idx) => idx !== i);
    // Redistribute percentages evenly
    if (updated.length > 0) {
      const share = parseFloat((100 / updated.length).toFixed(2));
      updated.forEach(o => { o.ownership_percent = share; });
    }
    onChange(updated);
  };
  const update = (i: number, patch: Partial<typeof owners[0]>) => {
    onChange(owners.map((o, idx) => idx === i ? { ...o, ...patch } : o));
  };

  const totalPercent = owners.reduce((acc, o) => acc + (o.ownership_percent || 0), 0);
  const percentOk = Math.abs(totalPercent - 100) < 0.1 || owners.length === 0;

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-black text-primary mb-1">Proprietários</h2>
        <p className="text-muted-foreground text-sm">Adicione os proprietários do imóvel. Pode ser pessoa física ou jurídica.</p>
      </div>

      {owners.length === 0 && (
        <div className="py-12 text-center bg-muted/30 rounded-[2rem] border-2 border-dashed border-border">
          <User className="mx-auto mb-3 text-muted-foreground/30" size={40} />
          <p className="font-bold text-muted-foreground">Nenhum proprietário cadastrado.</p>
          <p className="text-sm text-muted-foreground/60 mt-1">Esta etapa é opcional.</p>
        </div>
      )}

      <div className="space-y-6">
        {owners.map((owner, i) => (
          <div key={i} className="bg-white border-2 border-border rounded-[2rem] p-6 space-y-5 relative group">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-muted-foreground uppercase tracking-widest">
                Proprietário #{i + 1}
              </span>
              <button type="button" onClick={() => remove(i)}
                className="p-2 rounded-xl text-red-400 hover:bg-red-50 hover:text-red-600 transition-all">
                <Trash2 size={16} />
              </button>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2 space-y-2">
                <label className="text-xs font-black text-muted-foreground uppercase tracking-widest">Nome Completo *</label>
                <input type="text" value={owner.name} required
                  onChange={e => update(i, { name: e.target.value })}
                  placeholder="Nome do proprietário"
                  className="w-full px-5 py-4 border-2 border-border rounded-2xl focus:border-primary outline-none font-bold text-primary transition-all" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black text-muted-foreground uppercase tracking-widest">CPF / CNPJ</label>
                <input type="text" value={owner.cpf_cnpj || ''}
                  onChange={e => update(i, { cpf_cnpj: e.target.value })}
                  placeholder="000.000.000-00"
                  className="w-full px-5 py-4 border-2 border-border rounded-2xl focus:border-primary outline-none font-bold text-primary transition-all" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black text-muted-foreground uppercase tracking-widest">Telefone / WhatsApp</label>
                <input type="tel" value={owner.phone || ''}
                  onChange={e => update(i, { phone: e.target.value })}
                  placeholder="(62) 99999-0000"
                  className="w-full px-5 py-4 border-2 border-border rounded-2xl focus:border-primary outline-none font-bold text-primary transition-all" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black text-muted-foreground uppercase tracking-widest">E-mail</label>
                <input type="email" value={owner.email || ''}
                  onChange={e => update(i, { email: e.target.value })}
                  placeholder="email@exemplo.com"
                  className="w-full px-5 py-4 border-2 border-border rounded-2xl focus:border-primary outline-none font-bold text-primary transition-all" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black text-muted-foreground uppercase tracking-widest">% de Propriedade</label>
                <input type="number" min={0} max={100} step={0.01}
                  value={owner.ownership_percent}
                  onChange={e => update(i, { ownership_percent: parseFloat(e.target.value) || 0 })}
                  className="w-full px-5 py-4 border-2 border-border rounded-2xl focus:border-primary outline-none font-black text-primary transition-all" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black text-muted-foreground uppercase tracking-widest">Tipo</label>
                <select value={owner.owner_type}
                  onChange={e => update(i, { owner_type: e.target.value as any })}
                  className="w-full px-5 py-4 border-2 border-border rounded-2xl focus:border-primary outline-none font-bold text-primary transition-all bg-white">
                  <option value="owner">Proprietário</option>
                  <option value="heir">Inventariante / Herdeiro</option>
                  <option value="proxy">Procurador</option>
                </select>
              </div>
            </div>
          </div>
        ))}
      </div>

      {!percentOk && (
        <p className="text-sm font-bold text-red-500 text-center">
          ⚠️ A soma dos percentuais é {totalPercent.toFixed(2)}% (deve ser 100%)
        </p>
      )}

      <button type="button" onClick={add}
        className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl border-2 border-dashed border-primary/40 text-primary font-black hover:bg-primary/5 transition-all">
        <Plus size={20} /> Adicionar Proprietário
      </button>
    </div>
  );
}
