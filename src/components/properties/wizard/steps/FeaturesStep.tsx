'use client';
import React from 'react';
import { WizardFormData } from '../PropertyWizard';
import { CheckCircle2 } from 'lucide-react';

interface Props {
  data: WizardFormData;
  onChange: (patch: Partial<WizardFormData>) => void;
}

const AMENITIES = [
  'Piscina privativa','Varanda/Sacada','Churrasqueira','Ar-condicionado','Aquecimento solar',
  'Aquecimento a gás','Armários embutidos','Cozinha americana','Escritório/Home office',
  'Lavabo','Lavanderia','Hidromassagem','Sauna','Closet','Despensa','Vista panorâmica',
  'Vista mar','Vista para parque','Andar alto','Posição solar privilegiada',
];
const SOLAR = ['Norte','Sul','Leste','Oeste','Nordeste','Noroeste','Sudeste','Sudoeste'];

function Counter({ label, value, onChange }: { label: string; value: number; onChange: (v: number) => void }) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-xs font-black text-muted-foreground uppercase tracking-widest text-center">{label}</label>
      <div className="flex items-center justify-center gap-3 bg-white border-2 border-border rounded-2xl p-3">
        <button type="button" onClick={() => onChange(Math.max(0, value - 1))}
          className="w-8 h-8 rounded-xl bg-muted font-black text-lg hover:bg-primary hover:text-white transition-all">−</button>
        <span className="text-2xl font-black text-primary w-8 text-center">{value}</span>
        <button type="button" onClick={() => onChange(value + 1)}
          className="w-8 h-8 rounded-xl bg-muted font-black text-lg hover:bg-primary hover:text-white transition-all">+</button>
      </div>
    </div>
  );
}

export function FeaturesStep({ data, onChange }: Props) {
  const toggleFeature = (f: string) => {
    const current = data.metadata?.features || [];
    const updated = current.includes(f) ? current.filter((x: string) => x !== f) : [...current, f];
    onChange({ metadata: { ...data.metadata, features: updated } });
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-black text-primary mb-1">Características</h2>
        <p className="text-muted-foreground text-sm">Dimensões, cômodos e diferenciais do imóvel.</p>
      </div>

      {/* Counters */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Counter label="Dormitórios" value={data.rooms || 0} onChange={v => onChange({ rooms: v })} />
        <Counter label="Suítes" value={data.suites || 0} onChange={v => onChange({ suites: v })} />
        <Counter label="Banheiros" value={data.bathrooms || 0} onChange={v => onChange({ bathrooms: v })} />
        <Counter label="Vagas" value={data.parking_spaces || 0} onChange={v => onChange({ parking_spaces: v })} />
      </div>

      {/* Area */}
      <div className="grid sm:grid-cols-3 gap-5">
        {[
          { label: 'Área Privativa (m²) *', key: 'area_useful' },
          { label: 'Área Total (m²)', key: 'area_total' },
          { label: 'Andar', key: 'floor' },
        ].map(f => (
          <div key={f.key} className="space-y-2">
            <label className="block text-xs font-black text-muted-foreground uppercase tracking-widest">{f.label}</label>
            <input
              type="number" min={0}
              value={(data as any)[f.key] || (data.metadata?.[f.key]) || ''}
              onChange={e => {
                const v = parseFloat(e.target.value) || 0;
                if (f.key === 'floor') onChange({ metadata: { ...data.metadata, floor: v } });
                else onChange({ [f.key]: v } as any);
              }}
              className="w-full px-5 py-4 bg-white border-2 border-border rounded-2xl focus:border-primary outline-none font-black text-primary placeholder:text-muted-foreground/40 transition-all"
            />
          </div>
        ))}
      </div>

      {/* Solar position */}
      <div className="space-y-3">
        <label className="block text-xs font-black text-muted-foreground uppercase tracking-widest">Posição Solar</label>
        <div className="flex flex-wrap gap-2">
          {SOLAR.map(s => (
            <button key={s} type="button"
              onClick={() => onChange({ metadata: { ...data.metadata, solar: s } })}
              className={`px-4 py-2 rounded-xl text-sm font-bold border-2 transition-all ${
                data.metadata?.solar === s ? 'bg-accent text-white border-accent' : 'bg-white text-primary border-border hover:border-accent/40'
              }`}
            >{s}</button>
          ))}
        </div>
      </div>

      {/* Amenities */}
      <div className="space-y-3">
        <label className="block text-xs font-black text-muted-foreground uppercase tracking-widest">
          Diferenciais e Comodidades ({(data.metadata?.features || []).length} selecionados)
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {AMENITIES.map(f => {
            const selected = (data.metadata?.features || []).includes(f);
            return (
              <button key={f} type="button" onClick={() => toggleFeature(f)}
                className={`flex items-center gap-2 p-3 rounded-xl text-xs font-bold border-2 transition-all text-left ${
                  selected ? 'border-primary bg-primary/5 text-primary' : 'border-border bg-white text-muted-foreground hover:border-primary/30'
                }`}
              >
                {selected && <CheckCircle2 size={14} className="text-primary shrink-0" />}
                {f}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
