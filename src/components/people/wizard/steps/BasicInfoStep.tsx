'use client';
import React from 'react';
import { PeopleWizardData } from '../PeopleWizard';
import { Building2, User } from 'lucide-react';

interface Props {
  data: PeopleWizardData;
  onChange: (patch: Partial<PeopleWizardData>) => void;
}

export function BasicInfoStep({ data, onChange }: Props) {
  const isPJ = data.person_type === 'PJ';

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
      <div>
        <h2 className="text-xl font-bold text-heading mb-1">Dados Básicos</h2>
        <p className="text-muted-foreground text-sm">Selecione o tipo de pessoa e preencha as informações iniciais.</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <button
          type="button"
          onClick={() => onChange({ person_type: 'PF', document_id: '', name: '', fantasy_name: '' })}
          className={`flex items-center justify-center gap-3 p-4 rounded-2xl border-2 font-bold transition-all ${
            !isPJ ? 'border-primary bg-blue-primary/5 text-primary' : 'border-border bg-surface text-muted-foreground hover:border-primary/30'
          }`}
        >
          <User size={20} /> Pessoa Física (PF)
        </button>
        <button
          type="button"
          onClick={() => onChange({ person_type: 'PJ', document_id: '', name: '', nationality: '' })}
          className={`flex items-center justify-center gap-3 p-4 rounded-2xl border-2 font-bold transition-all ${
            isPJ ? 'border-primary bg-blue-primary/5 text-primary' : 'border-border bg-surface text-muted-foreground hover:border-primary/30'
          }`}
        >
          <Building2 size={20} /> Pessoa Jurídica (PJ)
        </button>
      </div>

      <div className="space-y-4">
        {isPJ ? (
          <>
            <div className="space-y-2">
              <label className="text-xs font-black text-muted-foreground uppercase tracking-widest">Razão Social *</label>
              <input type="text"
                value={data.name} onChange={e => onChange({ name: e.target.value })}
                className="w-full px-5 py-4 bg-surface border-2 border-border rounded-2xl focus:border-primary outline-none font-bold text-primary transition-all"
                placeholder="Ex: Construtora Habita LTDA"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-black text-muted-foreground uppercase tracking-widest">Nome Fantasia</label>
                <input type="text"
                  value={data.fantasy_name || ''} onChange={e => onChange({ fantasy_name: e.target.value })}
                  className="w-full px-5 py-4 bg-surface border-2 border-border rounded-2xl focus:border-primary outline-none font-bold text-primary transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black text-muted-foreground uppercase tracking-widest">CNPJ</label>
                <input type="text"
                  value={data.document_id || ''} onChange={e => onChange({ document_id: e.target.value })}
                  className="w-full px-5 py-4 bg-surface border-2 border-border rounded-2xl focus:border-primary outline-none font-bold text-primary transition-all"
                  placeholder="00.000.000/0000-00"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black text-muted-foreground uppercase tracking-widest">Inscrição Estadual</label>
                <input type="text"
                  value={data.rg_ie || ''} onChange={e => onChange({ rg_ie: e.target.value })}
                  className="w-full px-5 py-4 bg-surface border-2 border-border rounded-2xl focus:border-primary outline-none font-medium text-primary transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black text-muted-foreground uppercase tracking-widest">Inscrição Municipal</label>
                <input type="text"
                  value={data.im || ''} onChange={e => onChange({ im: e.target.value })}
                  className="w-full px-5 py-4 bg-surface border-2 border-border rounded-2xl focus:border-primary outline-none font-medium text-primary transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black text-muted-foreground uppercase tracking-widest">Data de Fundação</label>
                <input type="date"
                  value={data.birth_date_or_foundation || ''} onChange={e => onChange({ birth_date_or_foundation: e.target.value })}
                  className="w-full px-5 py-4 bg-surface border-2 border-border rounded-2xl focus:border-primary outline-none font-medium text-primary transition-all"
                />
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="space-y-2">
              <label className="text-xs font-black text-muted-foreground uppercase tracking-widest">Nome Completo *</label>
              <input type="text"
                value={data.name} onChange={e => onChange({ name: e.target.value })}
                className="w-full px-5 py-4 bg-surface border-2 border-border rounded-2xl focus:border-primary outline-none font-bold text-primary transition-all"
                placeholder="Ex: João da Silva"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-black text-muted-foreground uppercase tracking-widest">CPF</label>
                <input type="text"
                  value={data.document_id || ''} onChange={e => onChange({ document_id: e.target.value })}
                  className="w-full px-5 py-4 bg-surface border-2 border-border rounded-2xl focus:border-primary outline-none font-bold text-primary transition-all"
                  placeholder="000.000.000-00"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black text-muted-foreground uppercase tracking-widest">RG / Órgão Emissor</label>
                <input type="text"
                  value={data.rg_ie || ''} onChange={e => onChange({ rg_ie: e.target.value })}
                  className="w-full px-5 py-4 bg-surface border-2 border-border rounded-2xl focus:border-primary outline-none font-medium text-primary transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black text-muted-foreground uppercase tracking-widest">Data de Nascimento</label>
                <input type="date"
                  value={data.birth_date_or_foundation || ''} onChange={e => onChange({ birth_date_or_foundation: e.target.value })}
                  className="w-full px-5 py-4 bg-surface border-2 border-border rounded-2xl focus:border-primary outline-none font-medium text-primary transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black text-muted-foreground uppercase tracking-widest">Estado Civil</label>
                <select
                  value={data.marital_status || ''} onChange={e => onChange({ marital_status: e.target.value })}
                  className="w-full px-5 py-4 bg-surface border-2 border-border rounded-2xl focus:border-primary outline-none font-medium text-primary transition-all"
                >
                  <option value="">Selecione...</option>
                  <option value="Solteiro(a)">Solteiro(a)</option>
                  <option value="Casado(a)">Casado(a)</option>
                  <option value="Divorciado(a)">Divorciado(a)</option>
                  <option value="Viúvo(a)">Viúvo(a)</option>
                  <option value="União Estável">União Estável</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black text-muted-foreground uppercase tracking-widest">Profissão</label>
                <input type="text"
                  value={data.profession || ''} onChange={e => onChange({ profession: e.target.value })}
                  className="w-full px-5 py-4 bg-surface border-2 border-border rounded-2xl focus:border-primary outline-none font-medium text-primary transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black text-muted-foreground uppercase tracking-widest">Nacionalidade</label>
                <input type="text"
                  value={data.nationality || ''} onChange={e => onChange({ nationality: e.target.value })}
                  className="w-full px-5 py-4 bg-surface border-2 border-border rounded-2xl focus:border-primary outline-none font-medium text-primary transition-all"
                />
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
