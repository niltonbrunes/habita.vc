'use client';
import React from 'react';
import { WizardFormData } from '../PropertyWizard';

interface Props {
  data: WizardFormData;
  onChange: (patch: Partial<WizardFormData>) => void;
}

const PROPERTY_TYPES = ['Apartamento','Casa','Cobertura','Terreno','Sala Comercial','Galpão','Loja','Fazenda','Sítio','Chácara','Studio','Kitnet','Flat'];
const STATUS_OPTIONS = [
  { value: 'available', label: 'Disponível', color: 'bg-green-100 text-green-700 border-green-200' },
  { value: 'reserved',  label: 'Reservado',  color: 'bg-amber-100 text-amber-700 border-amber-200' },
  { value: 'sold',      label: 'Vendido',    color: 'bg-red-100 text-red-700 border-red-200' },
];
const TRANSACTION_TYPES = [
  { value: 'sale',  label: '💰 Venda' },
  { value: 'rent',  label: '🔑 Aluguel' },
  { value: 'both',  label: '↔️ Venda e Aluguel' },
];
const PATTERN_OPTIONS = [
  { value: 'economic', label: 'Econômico' },
  { value: 'medium',   label: 'Médio Padrão' },
  { value: 'high_end', label: 'Alto Padrão' },
];

export function BasicInfoStep({ data, onChange }: Props) {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-black text-primary mb-1">Informações Básicas</h2>
        <p className="text-muted-foreground text-sm">Tipo, finalidade e identificação do imóvel.</p>
      </div>

      {/* Type */}
      <div className="space-y-3">
        <label className="block text-xs font-black text-muted-foreground uppercase tracking-widest">Tipo do Imóvel *</label>
        <div className="flex flex-wrap gap-2">
          {PROPERTY_TYPES.map(t => (
            <button key={t} type="button"
              onClick={() => onChange({ type: t })}
              className={`px-4 py-2 rounded-xl text-sm font-bold border-2 transition-all ${
                data.type === t ? 'bg-primary text-white border-primary' : 'bg-white text-primary border-border hover:border-primary/40'
              }`}
            >{t}</button>
          ))}
        </div>
      </div>

      {/* Transaction type */}
      <div className="space-y-3">
        <label className="block text-xs font-black text-muted-foreground uppercase tracking-widest">Finalidade *</label>
        <div className="grid grid-cols-3 gap-3">
          {TRANSACTION_TYPES.map(t => (
            <button key={t.value} type="button"
              onClick={() => onChange({ transaction_type: t.value as any })}
              className={`py-4 rounded-2xl text-sm font-black border-2 transition-all ${
                data.transaction_type === t.value ? 'bg-primary text-white border-primary' : 'bg-white text-primary border-border hover:border-primary/40'
              }`}
            >{t.label}</button>
          ))}
        </div>
      </div>

      {/* Title */}
      <div className="space-y-2">
        <label className="block text-xs font-black text-muted-foreground uppercase tracking-widest">Título do Anúncio *</label>
        <input
          type="text"
          value={data.title}
          onChange={e => onChange({ title: e.target.value })}
          placeholder="Ex: Apartamento 3 suítes com vista panorâmica no Setor Bueno"
          className="w-full px-5 py-4 bg-white border-2 border-border rounded-2xl focus:border-primary outline-none font-bold text-primary placeholder:text-muted-foreground/40 transition-all"
        />
        <p className="text-xs text-muted-foreground">{data.title.length}/120 caracteres</p>
      </div>

      {/* Description */}
      <div className="space-y-2">
        <label className="block text-xs font-black text-muted-foreground uppercase tracking-widest">Descrição</label>
        <textarea
          value={data.description}
          onChange={e => onChange({ description: e.target.value })}
          rows={5}
          placeholder="Descreva o imóvel destacando seus diferenciais, localização privilegiada, acabamentos..."
          className="w-full px-5 py-4 bg-white border-2 border-border rounded-2xl focus:border-primary outline-none font-medium text-primary placeholder:text-muted-foreground/40 transition-all resize-none"
        />
      </div>

      {/* Code + Pattern + Status */}
      <div className="grid sm:grid-cols-3 gap-6">
        <div className="space-y-2">
          <label className="block text-xs font-black text-muted-foreground uppercase tracking-widest">Código Interno</label>
          <input
            type="text"
            value={data.reference || ''}
            onChange={e => onChange({ reference: e.target.value })}
            placeholder="Ex: APT-001"
            className="w-full px-5 py-4 bg-white border-2 border-border rounded-2xl focus:border-primary outline-none font-bold text-primary placeholder:text-muted-foreground/40 transition-all"
          />
        </div>
        <div className="space-y-2">
          <label className="block text-xs font-black text-muted-foreground uppercase tracking-widest">Padrão</label>
          <select
            value={data.pattern}
            onChange={e => onChange({ pattern: e.target.value as any })}
            className="w-full px-5 py-4 bg-white border-2 border-border rounded-2xl focus:border-primary outline-none font-bold text-primary transition-all"
          >
            {PATTERN_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </div>
        <div className="space-y-2">
          <label className="block text-xs font-black text-muted-foreground uppercase tracking-widest">Status *</label>
          <div className="flex gap-2">
            {STATUS_OPTIONS.map(s => (
              <button key={s.value} type="button"
                onClick={() => onChange({ status: s.value as any })}
                className={`flex-1 py-4 rounded-2xl text-xs font-black border-2 transition-all ${
                  data.status === s.value ? s.color + ' border-current' : 'bg-white text-muted-foreground border-border hover:border-muted-foreground'
                }`}
              >{s.label}</button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
