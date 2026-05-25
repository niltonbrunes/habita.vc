'use client';
import React, { useEffect, useState } from 'react';
import { DevelopmentsService } from '@/services/developments.service';
import { Building2, Link2, MapPin, Loader2 } from 'lucide-react';
import { WizardFormData } from '../PropertyWizard';

interface Props {
  data: WizardFormData;
  onChange: (patch: Partial<WizardFormData>) => void;
}

export function DevelopmentLinkStep({ data, onChange }: Props) {
  const [developments, setDevelopments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [cepLoading, setCepLoading] = useState(false);

  useEffect(() => {
    DevelopmentsService.getAll()
      .then(d => setDevelopments(d || []))
      .finally(() => setLoading(false));
  }, []);

  const selectDev = (dev: any) => {
    onChange({
      development_id: dev.id,
      // Inherit address from development
      address_street: dev.location_address || '',
      address_city: dev.location_city || '',
      address_state: 'GO',
    });
  };

  const clearDev = () => onChange({ development_id: undefined });

  const lookupCep = async (cep: string) => {
    const clean = cep.replace(/\D/g, '');
    if (clean.length !== 8) return;
    setCepLoading(true);
    try {
      const r = await fetch(`https://viacep.com.br/ws/${clean}/json/`);
      const d = await r.json();
      if (!d.erro) {
        onChange({
          address_street: d.logradouro,
          address_neighborhood: d.bairro,
          address_city: d.localidade,
          address_state: d.uf,
          address_zip_code: d.cep,
        });
      }
    } catch {} finally { setCepLoading(false); }
  };

  const linked = data.development_id ? developments.find(d => d.id === data.development_id) : null;

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-bold text-heading mb-1">Localização</h2>
        <p className="text-muted-foreground text-sm">Vincule a um empreendimento ou preencha o endereço manualmente.</p>
      </div>

      {/* Mode toggle */}
      <div className="grid sm:grid-cols-2 gap-4">
        <button
          type="button"
          onClick={() => clearDev()}
          className={`p-6 rounded-xl border-2 text-left transition-all ${!data.development_id ? 'border-primary bg-blue-primary/5' : 'border-border hover:border-primary/30'}`}
        >
          <MapPin className="text-accent mb-3" size={28} />
          <h3 className="font-black text-primary mb-1">Endereço Avulso</h3>
          <p className="text-sm text-muted-foreground">Imóvel independente sem vínculo a empreendimento.</p>
        </button>
        <button
          type="button"
          onClick={() => document.getElementById('dev-list')?.scrollIntoView({ behavior: 'smooth' })}
          className={`p-6 rounded-xl border-2 text-left transition-all ${data.development_id ? 'border-primary bg-blue-primary/5' : 'border-border hover:border-primary/30'}`}
        >
          <Building2 className="text-accent mb-3" size={28} />
          <h3 className="font-black text-primary mb-1">Vincular a Empreendimento</h3>
          <p className="text-sm text-muted-foreground">Herda localização, fotos e áreas comuns automaticamente.</p>
        </button>
      </div>

      {/* Linked development badge */}
      {linked && (
        <div className="flex items-center gap-4 p-5 bg-blue-primary/5 border-2 border-primary rounded-2xl">
          <Link2 className="text-primary" size={24} />
          <div className="flex-1">
            <p className="font-black text-primary">{linked.name}</p>
            <p className="text-sm text-muted-foreground">{linked.location_city} · Endereço herdado</p>
          </div>
          <button onClick={clearDev} className="text-xs font-black text-red-500 hover:underline">Desvincular</button>
        </div>
      )}

      {/* CEP Autocomplete + Address fields (shown always for manual completion) */}
      {!linked && (
        <div className="grid sm:grid-cols-2 gap-5">
          <div className="space-y-2 sm:col-span-2">
            <label className="block text-xs font-black text-muted-foreground uppercase tracking-widest">CEP</label>
            <div className="relative">
              <input
                type="text"
                value={data.address_zip_code || ''}
                onChange={e => { onChange({ address_zip_code: e.target.value }); lookupCep(e.target.value); }}
                placeholder="00000-000"
                maxLength={9}
                className="w-full px-5 py-4 bg-surface border-2 border-border rounded-2xl focus:border-primary outline-none font-bold text-primary placeholder:text-muted-foreground/40 transition-all"
              />
              {cepLoading && <Loader2 className="absolute right-4 top-1/2 -translate-y-1/2 animate-spin text-primary" size={18} />}
            </div>
          </div>
          {[
            { label: 'Endereço', key: 'address_street', placeholder: 'Rua/Av.', span: 2 },
            { label: 'Número', key: 'address_number', placeholder: 'Nº', span: 1 },
            { label: 'Complemento', key: 'address_complement', placeholder: 'Apto, Bloco', span: 1 },
            { label: 'Bairro', key: 'address_neighborhood', placeholder: 'Bairro', span: 1 },
            { label: 'Cidade *', key: 'address_city', placeholder: 'Cidade', span: 1 },
            { label: 'Estado *', key: 'address_state', placeholder: 'UF', span: 1 },
          ].map(f => (
            <div key={f.key} className={`space-y-2 ${f.span === 2 ? 'sm:col-span-2' : ''}`}>
              <label className="block text-xs font-black text-muted-foreground uppercase tracking-widest">{f.label}</label>
              <input
                type="text"
                value={(data as any)[f.key] || ''}
                onChange={e => onChange({ [f.key]: e.target.value } as any)}
                placeholder={f.placeholder}
                className="w-full px-5 py-4 bg-surface border-2 border-border rounded-2xl focus:border-primary outline-none font-bold text-primary placeholder:text-muted-foreground/40 transition-all"
              />
            </div>
          ))}
        </div>
      )}

      {/* Development picker */}
      <div id="dev-list" className="space-y-3">
        <label className="block text-xs font-black text-muted-foreground uppercase tracking-widest">
          {loading ? 'Carregando empreendimentos...' : `${developments.length} Empreendimento${developments.length !== 1 ? 's' : ''} disponíveis`}
        </label>
        {loading ? (
          <div className="flex items-center justify-center py-10"><Loader2 className="animate-spin text-primary" size={28} /></div>
        ) : (
          <div className="grid sm:grid-cols-2 gap-4 max-h-80 overflow-y-auto pr-1">
            {developments.map(dev => (
              <button
                key={dev.id}
                type="button"
                onClick={() => selectDev(dev)}
                className={`p-4 rounded-2xl border-2 text-left transition-all flex gap-4 items-center ${
                  data.development_id === dev.id ? 'border-primary bg-blue-primary/5' : 'border-border hover:border-primary/30 bg-surface'
                }`}
              >
                <div className="w-14 h-14 rounded-xl overflow-hidden bg-muted shrink-0">
                  {dev.image_url && <img src={dev.image_url} className="w-full h-full object-cover" alt="" />}
                </div>
                <div>
                  <p className="font-black text-primary text-sm">{dev.name}</p>
                  <p className="text-xs text-muted-foreground">{dev.location_city}</p>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
