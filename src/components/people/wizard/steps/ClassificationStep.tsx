'use client';
import React from 'react';
import { PeopleWizardData } from '../PeopleWizard';
import { PersonRole } from '@/types/people';
import { Check } from 'lucide-react';

interface Props {
  data: PeopleWizardData;
  onChange: (patch: Partial<PeopleWizardData>) => void;
}

const AVAILABLE_ROLES: { id: PersonRole; label: string; desc: string }[] = [
  { id: 'lead', label: 'Lead / Prospect', desc: 'Ainda não fechou negócio' },
  { id: 'client', label: 'Cliente', desc: 'Já comprou ou alugou' },
  { id: 'owner', label: 'Proprietário', desc: 'Dono de imóveis na base' },
  { id: 'broker', label: 'Corretor / Captador', desc: 'Parceiro de negócios' },
  { id: 'tenant', label: 'Locatário', desc: 'Inquilino ativo' },
  { id: 'guarantor', label: 'Fiador', desc: 'Garantia de locação' },
  { id: 'proxy', label: 'Procurador', desc: 'Representante legal' },
  { id: 'company', label: 'Empresa Parceira', desc: 'Construtora / Imobiliária' },
];

export function ClassificationStep({ data, onChange }: Props) {
  const toggleRole = (role: PersonRole) => {
    const roles = data.roles.includes(role)
      ? data.roles.filter(r => r !== role)
      : [...data.roles, role];
    onChange({ roles });
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
      <div>
        <h2 className="text-2xl font-black text-primary mb-1">Classificação</h2>
        <p className="text-muted-foreground text-sm">Quais papéis essa pessoa/empresa exerce no sistema? (Selecione múltiplos se necessário)</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {AVAILABLE_ROLES.map(role => {
          const isActive = data.roles.includes(role.id);
          return (
            <div
              key={role.id}
              onClick={() => toggleRole(role.id)}
              className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex items-start gap-3 ${
                isActive ? 'border-primary bg-primary/5' : 'border-border bg-white hover:border-primary/30'
              }`}
            >
              <div className={`mt-0.5 w-5 h-5 rounded-md flex items-center justify-center shrink-0 border-2 transition-all ${
                isActive ? 'bg-primary border-primary text-white' : 'border-muted-foreground/30'
              }`}>
                {isActive && <Check size={14} strokeWidth={4} />}
              </div>
              <div>
                <p className={`font-bold ${isActive ? 'text-primary' : 'text-foreground'}`}>{role.label}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{role.desc}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="pt-6 border-t border-border mt-8">
        <h3 className="text-lg font-black text-primary mb-4">Informações Comerciais</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-xs font-black text-muted-foreground uppercase tracking-widest">Origem do Lead</label>
            <select
              value={data.commercial_info.lead_source || ''}
              onChange={e => onChange({ commercial_info: { ...data.commercial_info, lead_source: e.target.value } })}
              className="w-full px-5 py-4 bg-white border-2 border-border rounded-2xl focus:border-primary outline-none font-medium text-primary transition-all"
            >
              <option value="">Selecione...</option>
              <option value="portal">Portal Habita</option>
              <option value="instagram">Instagram</option>
              <option value="google">Google Ads</option>
              <option value="indicacao">Indicação</option>
              <option value="placa">Placa</option>
              <option value="outros">Outros</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-black text-muted-foreground uppercase tracking-widest">Interesse</label>
            <select
              value={data.commercial_info.interests?.[0] || ''}
              onChange={e => onChange({ commercial_info: { ...data.commercial_info, interests: [e.target.value] } })}
              className="w-full px-5 py-4 bg-white border-2 border-border rounded-2xl focus:border-primary outline-none font-medium text-primary transition-all"
            >
              <option value="">Selecione...</option>
              <option value="buy">Comprar</option>
              <option value="rent">Alugar</option>
              <option value="sell">Vender</option>
            </select>
          </div>
          <div className="space-y-2 md:col-span-2">
            <label className="text-xs font-black text-muted-foreground uppercase tracking-widest">Observações Iniciais</label>
            <textarea
              value={data.commercial_info.notes || ''}
              onChange={e => onChange({ commercial_info: { ...data.commercial_info, notes: e.target.value } })}
              rows={3}
              placeholder="Anotações sobre o perfil, necessidades, etc."
              className="w-full px-5 py-4 bg-white border-2 border-border rounded-2xl focus:border-primary outline-none font-medium text-primary transition-all resize-none"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
