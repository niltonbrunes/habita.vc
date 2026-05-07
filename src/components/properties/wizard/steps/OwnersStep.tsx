'use client';
import React, { useState, useEffect } from 'react';
import { PropertyOwner } from '@/types/database';
import { PeopleService } from '@/services/people.service';
import { Plus, Trash2, User, Search, Loader2, Check } from 'lucide-react';

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
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    if (searchTerm.length < 3) {
      setSearchResults([]);
      return;
    }

    const delay = setTimeout(async () => {
      setSearching(true);
      try {
        const results = await PeopleService.searchForOwners(searchTerm);
        setSearchResults(results);
      } catch (err) {
        console.error(err);
      } finally {
        setSearching(false);
      }
    }, 400);

    return () => clearTimeout(delay);
  }, [searchTerm]);

  const add = (person?: any) => {
    const newOwner = person ? {
      person_id: person.id,
      name: person.name,
      cpf_cnpj: person.document_id,
      phone: person.contacts?.[0]?.value || '',
      email: person.contacts?.find((c: any) => c.type === 'email')?.value || '',
      ownership_percent: owners.length === 0 ? 100 : 0,
      owner_type: 'owner' as const,
    } : EMPTY_OWNER();

    const updated = [...owners, newOwner];
    
    // Auto-redistribute if it's the first ones
    if (updated.length > 0) {
      const share = parseFloat((100 / updated.length).toFixed(2));
      updated.forEach(o => { o.ownership_percent = share; });
    }

    onChange(updated);
    setSearchTerm('');
    setSearchResults([]);
  };

  const remove = (i: number) => {
    const updated = owners.filter((_, idx) => idx !== i);
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
        <p className="text-muted-foreground text-sm">Vincule pessoas cadastradas ou adicione manualmente.</p>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
          <input
            type="text"
            placeholder="Buscar por nome ou CPF/CNPJ..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-4 bg-muted/50 border-2 border-border rounded-2xl focus:border-primary outline-none font-bold text-primary transition-all"
          />
          {searching && <Loader2 className="absolute right-4 top-1/2 -translate-y-1/2 animate-spin text-primary" size={20} />}
        </div>

        {searchResults.length > 0 && (
          <div className="absolute z-10 left-0 right-0 mt-2 bg-white border-2 border-border rounded-2xl shadow-xl overflow-hidden max-h-60 overflow-y-auto">
            {searchResults.map(p => (
              <button
                key={p.id}
                type="button"
                onClick={() => add(p)}
                className="w-full flex items-center justify-between px-5 py-3 hover:bg-primary/5 text-left border-b border-border last:border-0 transition-colors"
              >
                <div>
                  <p className="font-black text-primary">{p.name}</p>
                  <p className="text-xs text-muted-foreground">{p.document_id || 'Sem documento'}</p>
                </div>
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <Plus size={16} />
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {owners.length === 0 && !searchTerm && (
        <div className="py-12 text-center bg-muted/30 rounded-[2rem] border-2 border-dashed border-border">
          <User className="mx-auto mb-3 text-muted-foreground/30" size={40} />
          <p className="font-bold text-muted-foreground">Nenhum proprietário vinculado.</p>
          <p className="text-sm text-muted-foreground/60 mt-1">Busque acima para vincular uma pessoa existente.</p>
        </div>
      )}

      <div className="space-y-6">
        {owners.map((owner, i) => (
          <div key={i} className="bg-white border-2 border-border rounded-[2rem] p-6 space-y-5 relative group">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xs font-black text-muted-foreground uppercase tracking-widest">
                  Proprietário #{i + 1}
                </span>
                {owner.person_id && (
                  <span className="flex items-center gap-1 px-2 py-0.5 bg-green-100 text-green-700 text-[9px] font-black uppercase rounded-md tracking-wider">
                    <Check size={10} strokeWidth={4} /> Vinculado à Base
                  </span>
                )}
              </div>
              <button type="button" onClick={() => remove(i)}
                className="p-2 rounded-xl text-red-400 hover:bg-red-50 hover:text-red-600 transition-all">
                <Trash2 size={16} />
              </button>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2 space-y-2">
                <label className="text-xs font-black text-muted-foreground uppercase tracking-widest">Nome Completo *</label>
                <input type="text" value={owner.name} required
                  readOnly={!!owner.person_id}
                  onChange={e => update(i, { name: e.target.value })}
                  placeholder="Nome do proprietário"
                  className={`w-full px-5 py-4 border-2 border-border rounded-2xl outline-none font-bold text-primary transition-all ${owner.person_id ? 'bg-muted/30 cursor-not-allowed' : 'focus:border-primary'}`} />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black text-muted-foreground uppercase tracking-widest">CPF / CNPJ</label>
                <input type="text" value={owner.cpf_cnpj || ''}
                  readOnly={!!owner.person_id}
                  onChange={e => update(i, { cpf_cnpj: e.target.value })}
                  placeholder="000.000.000-00"
                  className={`w-full px-5 py-4 border-2 border-border rounded-2xl outline-none font-bold text-primary transition-all ${owner.person_id ? 'bg-muted/30 cursor-not-allowed' : 'focus:border-primary'}`} />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black text-muted-foreground uppercase tracking-widest">% de Propriedade</label>
                <div className="relative">
                  <input type="number" min={0} max={100} step={0.01}
                    value={owner.ownership_percent}
                    onChange={e => update(i, { ownership_percent: parseFloat(e.target.value) || 0 })}
                    className="w-full px-5 py-4 border-2 border-border rounded-2xl focus:border-primary outline-none font-black text-primary transition-all" />
                  <span className="absolute right-5 top-1/2 -translate-y-1/2 font-black text-primary">%</span>
                </div>
              </div>
              <div className="sm:col-span-2 space-y-2">
                <label className="text-xs font-black text-muted-foreground uppercase tracking-widest">Vínculo</label>
                <select value={owner.owner_type}
                  onChange={e => update(i, { owner_type: e.target.value as any })}
                  className="w-full px-5 py-4 border-2 border-border rounded-2xl focus:border-primary outline-none font-bold text-primary transition-all bg-white">
                  <option value="owner">Proprietário Pleno</option>
                  <option value="coproprietario">Coproprietário</option>
                  <option value="heir">Inventariante / Herdeiro</option>
                  <option value="proxy">Procurador / Representante</option>
                  <option value="responsavel_financeiro">Responsável Financeiro</option>
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

      <button type="button" onClick={() => add()}
        className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl border-2 border-dashed border-border text-muted-foreground font-black hover:bg-muted/50 transition-all">
        <Plus size={20} /> Adicionar Manualmente (Legado)
      </button>
    </div>
  );
}
