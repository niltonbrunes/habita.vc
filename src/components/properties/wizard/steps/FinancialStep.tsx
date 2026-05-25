'use client';
import React from 'react';
import { WizardFormData } from '../PropertyWizard';
import { DollarSign, CheckCircle2 } from 'lucide-react';

interface Props {
  data: WizardFormData;
  onChange: (patch: Partial<WizardFormData>) => void;
}

function CurrencyInput({ label, value, onChange, note }: { label: string; value: number; onChange: (v: number) => void; note?: string }) {
  return (
    <div className="space-y-2">
      <label className="block text-xs font-black text-muted-foreground uppercase tracking-widest">{label}</label>
      <div className="relative">
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground font-black text-sm">R$</span>
        <input
          type="number"
          min={0}
          value={value || ''}
          onChange={e => onChange(parseFloat(e.target.value) || 0)}
          placeholder="0"
          className="w-full pl-10 pr-5 py-4 bg-surface border-2 border-border rounded-2xl focus:border-primary outline-none font-black text-primary placeholder:text-muted-foreground/40 transition-all"
        />
      </div>
      {note && <p className="text-xs text-muted-foreground">{note}</p>}
    </div>
  );
}

export function FinancialStep({ data, onChange }: Props) {
  const commission = (data.price * (data.commission_estimated_percent || 6)) / 100;

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-bold text-heading mb-1">Valores e Financeiro</h2>
        <p className="text-muted-foreground text-sm">Preço de venda, taxas e condições de negociação.</p>
      </div>

      {/* Main price */}
      <div className="p-6 bg-blue-primary/5 border-2 border-primary/20 rounded-xl space-y-4">
        <CurrencyInput label="Valor do Imóvel *" value={data.price} onChange={v => onChange({ price: v })} />
        {data.price > 0 && (
          <div className="flex items-center gap-3 text-sm font-bold text-primary/70 bg-surface px-4 py-3 rounded-xl border border-border">
            <DollarSign className="text-accent" size={18} />
            Comissão estimada ({data.commission_estimated_percent || 6}%):
            <span className="text-accent font-black ml-auto">R$ {commission.toLocaleString('pt-BR')}</span>
          </div>
        )}
      </div>

      <div className="grid sm:grid-cols-2 gap-5">
        <CurrencyInput
          label="Valor do Condomínio / mês"
          value={data.price_condo || 0}
          onChange={v => onChange({ price_condo: v })}
        />
        <CurrencyInput
          label="IPTU / ano"
          value={data.price_iptu || 0}
          onChange={v => onChange({ price_iptu: v })}
        />
        {data.transaction_type !== 'sale' && (
          <CurrencyInput
            label="Valor do Aluguel / mês"
            value={data.price_rent || 0}
            onChange={v => onChange({ price_rent: v })}
          />
        )}
        <div className="space-y-2">
          <label className="block text-xs font-black text-muted-foreground uppercase tracking-widest">Comissão (%)</label>
          <input
            type="number" min={0} max={10} step={0.5}
            value={data.commission_estimated_percent || 6}
            onChange={e => onChange({ commission_estimated_percent: parseFloat(e.target.value) })}
            className="w-full px-5 py-4 bg-surface border-2 border-border rounded-2xl focus:border-primary outline-none font-black text-primary transition-all"
          />
        </div>
      </div>

      {/* Checkboxes */}
      <div className="space-y-3">
        <label className="block text-xs font-black text-muted-foreground uppercase tracking-widest">Condições Especiais</label>
        <div className="grid sm:grid-cols-2 gap-3">
          {[
            { key: 'accepts_financing', label: '🏦 Aceita Financiamento' },
            { key: 'accepts_exchange', label: '🔄 Aceita Permuta' },
          ].map(opt => (
            <button
              key={opt.key}
              type="button"
              onClick={() => onChange({ [opt.key]: !(data as any)[opt.key] } as any)}
              className={`flex items-center gap-3 p-4 rounded-2xl border-2 font-bold text-sm transition-all ${
                (data as any)[opt.key] ? 'border-primary bg-blue-primary/5 text-primary' : 'border-border bg-surface text-muted-foreground hover:border-primary/30'
              }`}
            >
              {(data as any)[opt.key] && <CheckCircle2 className="text-primary" size={18} />}
              {opt.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
