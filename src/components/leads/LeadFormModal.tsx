'use client';

import React, { useState } from 'react';
import { X, Mail, Phone, User, Tag, ShieldCheck, Loader2, Search, Home, Building, MapPin, Sparkles } from 'lucide-react';
import { LeadsService } from '@/services/leads.service';
import { PeopleService } from '@/services/people.service';
import { PropertiesService } from '@/services/properties.service';
import { useAuth } from '@/context/AuthContext';
import { LEAD_CHANNELS } from '@/lib/constants/channels';

interface LeadFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  preSelectedPersonId?: string;
  preSelectedPropertyId?: string;
}

export const LeadFormModal = ({ isOpen, onClose, onSuccess, preSelectedPersonId, preSelectedPropertyId }: LeadFormModalProps) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [propertyResults, setPropertyResults] = useState<any[]>([]);
  const [selectedPersonId, setSelectedPersonId] = useState<string | null>(preSelectedPersonId || null);
  const [propertyMode, setPropertyMode] = useState<'none' | 'base' | 'market'>('none');
  const [selectedPropertyId, setSelectedPropertyId] = useState<string | null>(null);
  const [selectedPropertyTitle, setSelectedPropertyTitle] = useState('');
  const [selectedPropertyType, setSelectedPropertyType] = useState<'property' | 'development' | null>(null);

  React.useEffect(() => {
    if (preSelectedPersonId) {
      setSelectedPersonId(preSelectedPersonId);
      // Busca os dados da pessoa para preencher o formulÃ¡rio
      PeopleService.getById(preSelectedPersonId).then(p => {
        if (p) {
          const primaryContact = p.contacts?.find(c => c.is_primary) || p.contacts?.[0];
          setFormData(prev => ({
            ...prev,
            name: p.name,
            email: p.contacts?.find(c => (c.type as string) === 'email')?.value || '',
            phone: p.contacts?.find(c => (c.type as string) === 'whatsapp' || (c.type as string) === 'phone')?.value || ''
          ,
              source: p.commercial_info?.lead_source || 'Manual'}));
        }
      });
    }
  }, [preSelectedPersonId]);
  React.useEffect(() => {
    if (preSelectedPropertyId) {
      setPropertyMode('base');
      setSelectedPropertyId(preSelectedPropertyId);
      // Busca detalhes do imÃ³vel para mostrar o tÃ­tulo e o valor
      PropertiesService.getById(preSelectedPropertyId).then(prop => {
        if (prop) {
          setSelectedPropertyTitle(prop.title);
          setFormData(prev => ({ ...prev, value: prop.price }));
        }
      });
    }
  }, [preSelectedPropertyId]);
  
  const [formData, setFormData] = useState<{
    name: string;
    email: string;
    phone: string;
    source: string;
    temperature: 'cold' | 'warm' | 'hot';
    score: number;
    interest_description: string;
    value: number;
    probability: number;
    entry_date: string;
  }>({
    name: '',
    email: '',
    phone: '',
    source: 'Manual',
    temperature: 'warm',
    score: 50,
    interest_description: '',
    value: 0,
    probability: 50,
    entry_date: new Date().toISOString().split('T')[0],
  });

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    try {
      // 1. UnificaÃ§Ã£o com a base de Pessoas: Usar selecionada ou buscar por contato
      let personId = selectedPersonId;
      
      if (!personId) {
        const existingPerson = await PeopleService.findByContact(formData.email || formData.phone);
        if (existingPerson) {
          personId = existingPerson.id;
        } else {
          // 2. Criar nova pessoa se for um contato inÃ©dito e nÃ£o selecionado
          const newPerson = await PeopleService.create({
            name: formData.name,
            person_type: 'PF',
            roles: ['lead'],
            relationship_status: 'novo',
            contacts: [
              ...(formData.email ? [{ id: crypto.randomUUID(), type: 'email', value: formData.email, is_primary: true }] : []),
              ...(formData.phone ? [{ id: crypto.randomUUID(), type: 'whatsapp', value: formData.phone, is_primary: !formData.email }] : [])
            ],
            assigned_to_id: user?.id,
            registered_by_id: user?.id,
            commercial_info: {
              lead_source: formData.source,
              notes: 'Criado via cadastro manual de lead.'
            }
          } as any);
          personId = newPerson.id;
        }
      }

      // 3. Criar o lead vinculado
      const { entry_date, ...leadPayload } = formData;
      await LeadsService.create({
        ...leadPayload,
        person_id: personId as string, 
        property_id: (propertyMode === 'base' && selectedPropertyType === 'property') ? (selectedPropertyId || undefined) : undefined,
        interest_description: propertyMode === 'market' 
          ? formData.interest_description 
          : (propertyMode === 'base' && selectedPropertyType === 'development') 
            ? `Interesse no Empreendimento: ${selectedPropertyTitle}` 
            : undefined,
        assigned_to_id: user?.id,
        status: 'lead' as any,
        created_at: entry_date ? `${entry_date}T00:00:00.000Z` : undefined,
        history: [{ type: 'creation', date: new Date().toISOString(), note: `Lead criado e vinculado à Pessoa ID: ${personId}` }]
      });

      onSuccess();
      onClose();
    } catch (error: any) {
      console.error('Erro detalhado ao criar lead unificado:', error.message || error);
      alert('Erro ao criar lead: ' + (error.message || 'Verifique as permissÃµes no banco.'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-blue-primary/20 backdrop-blur-sm" onClick={onClose} />
      
      <div className="bg-surface w-full max-w-xl rounded-xl shadow-card border border-border relative overflow-hidden animate-in fade-in zoom-in duration-300">
        {/* Header */}
        <div className="p-8 border-b border-border flex justify-between items-center bg-muted/30">
          <div>
            <h2 className="text-xl font-bold text-heading mb-1">Novo Lead</h2>
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Adicionar prospecto manualmente</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-surface rounded-xl transition-colors text-muted-foreground">
            <X size={24} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Person Search / Name */}
            {!preSelectedPersonId ? (
              <>
                <div className="space-y-2 col-span-full">
                  <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">Vincular a uma Pessoa (Opcional)</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                </div>
                <input
                  type="text"
                  placeholder="Pesquisar por nome ou documento..."
                  className="block w-full pl-10 pr-4 py-3 bg-muted/50 border border-transparent rounded-2xl focus:bg-surface focus:border-primary/20 transition-all outline-none font-bold text-primary placeholder:text-muted-foreground/30"
                  onChange={async (e) => {
                    const term = e.target.value;
                    if (term.length > 2) {
                      const results = await PeopleService.searchForOwners(term);
                      setSearchResults(results as any[]);
                    } else {
                      setSearchResults([]);
                    }
                  }}
                />
                
                {searchResults.length > 0 && (
                  <div className="absolute z-50 left-0 right-0 mt-2 bg-surface rounded-2xl shadow-card border border-border overflow-hidden animate-in fade-in slide-in-from-top-2">
                    {searchResults.map(p => (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => {
                          setFormData({ 
                            ...formData, 
                            name: p.name, 
                            email: p.contacts?.find((c: any) => c.type === 'email')?.value || '',
                            phone: p.contacts?.find((c: any) => c.type === 'whatsapp' || c.type === 'phone')?.value || '',
                              source: p.commercial_info?.lead_source || 'Manual'});
                          setSelectedPersonId(p.id);
                          setSearchResults([]);
                        }}
                        className="w-full px-4 py-3 text-left hover:bg-blue-primary/5 transition-colors border-b border-border last:border-0"
                      >
                        <p className="font-bold text-primary text-sm">{p.name}</p>
                        <p className="text-[10px] text-muted-foreground font-medium">{p.document_id || 'Sem documento'}</p>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="w-full h-px bg-border/40 col-span-full my-2" />

            {/* Name */}
            <div className="space-y-2 col-span-full">
              <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">Nome do Prospecto</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <User className="h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                </div>
                <input
                  required
                  type="text"
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  className="block w-full pl-10 pr-4 py-3 bg-muted/50 border border-transparent rounded-2xl focus:bg-surface focus:border-primary/20 transition-all outline-none font-bold text-primary placeholder:text-muted-foreground/30"
                  placeholder="Nome do cliente"
                />
              </div>
            </div>
          </>
        ) : (
          <div className="col-span-full mb-4">
            <div className="flex items-center gap-4 p-5 bg-blue-primary/5 border-2 border-primary/10 rounded-xl shadow-sm animate-in fade-in slide-in-from-top-2">
              <div className="w-12 h-12 bg-blue-primary rounded-2xl flex items-center justify-center shadow-lg">
                <ShieldCheck className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-[10px] font-black text-primary/50 uppercase tracking-[0.2em] mb-0.5">Oportunidade Vinculada</p>
                <p className="text-lg font-black text-primary uppercase tracking-tight leading-tight">{formData.name}</p>
              </div>
            </div>
          </div>
        )}

            {/* Property Interest Section */}
            <div className="col-span-full space-y-4">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-blue-primary/10 rounded-lg">
                  <Home className="w-4 h-4 text-primary" />
                </div>
                <h3 className="text-xs font-black text-primary uppercase tracking-widest">Interesse / ImÃ³vel</h3>
              </div>

              {!preSelectedPropertyId ? (
                <>
                  <div className="flex p-1 bg-muted rounded-2xl gap-1">
                    {[
                      { id: 'none', label: 'Nenhum', icon: X },
                      { id: 'base', label: 'Minha Base', icon: Building },
                      { id: 'market', label: 'Mercado', icon: MapPin }
                    ].map((mode) => (
                      <button
                        key={mode.id}
                        type="button"
                        onClick={() => setPropertyMode(mode.id as any)}
                        className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-[10px] font-black uppercase transition-all ${
                          propertyMode === mode.id 
                            ? 'bg-surface text-primary shadow-sm ring-1 ring-black/5' 
                            : 'text-muted-foreground hover:bg-surface/50'
                        }`}
                      >
                        <mode.icon size={14} />
                        {mode.label}
                      </button>
                    ))}
                  </div>

                  {/* Base Property Selection */}
                  {propertyMode === 'base' && (
                    <>
                      <div className="relative group animate-in slide-in-from-top-2 duration-300">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                          <Search className="h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                        </div>
                        <input
                          type="text"
                          placeholder="Pesquisar nos meus imÃ³veis..."
                          className="block w-full pl-10 pr-4 py-3 bg-muted/50 border border-transparent rounded-2xl focus:bg-surface focus:border-primary/20 transition-all outline-none font-bold text-primary placeholder:text-muted-foreground/30"
                          value={selectedPropertyTitle}
                          onChange={async (e) => {
                            setSelectedPropertyTitle(e.target.value);
                            if (e.target.value.length > 2) {
                              const results = await PropertiesService.search(e.target.value);
                              setPropertyResults(results);
                            } else {
                              setPropertyResults([]);
                            }
                          }}
                        />
                      </div>
                      {propertyResults.length > 0 && (
                        <div className="absolute z-50 left-0 right-0 mt-2 bg-surface rounded-2xl shadow-card border border-border overflow-hidden animate-in fade-in slide-in-from-top-2">
                          {propertyResults.map(p => (
                            <button
                              key={p.id}
                              type="button"
                              onClick={() => {
                                setSelectedPropertyId(p.id);
                                setSelectedPropertyTitle(p.title);
                                setSelectedPropertyType(p._type);
                                setPropertyResults([]);
                                if (p.price) {
                                  setFormData(prev => ({ ...prev, value: p.price }));
                                }
                              }}
                              className="w-full px-4 py-3 text-left hover:bg-blue-primary/5 transition-colors border-b border-border last:border-0 flex items-center justify-between"
                            >
                              <div>
                                <p className="font-bold text-primary text-sm">{p.title}</p>
                                <p className="text-[10px] text-muted-foreground font-medium">{p.reference || p.address_city}</p>
                              </div>
                              <span className={`px-2 py-0.5 rounded-md text-[8px] font-black uppercase tracking-wider ${
                                p._type === 'development' ? 'bg-accent/10 text-accent' : 'bg-blue-primary/10 text-primary'
                              }`}>
                                {p._type === 'development' ? 'Empreendimento' : 'ImÃ³vel'}
                              </span>
                            </button>
                          ))}
                        </div>
                      )}
                    </>
                  )}
                </>
              ) : (
                <div className="flex items-center gap-4 p-4 bg-blue-primary/5 border-2 border-primary/10 rounded-2xl animate-in fade-in slide-in-from-top-2">
                  <div className="w-10 h-10 bg-blue-primary/10 rounded-xl flex items-center justify-center">
                    <Building className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-primary/50 uppercase tracking-widest mb-0.5">ImÃ³vel Vinculado</p>
                    <p className="text-sm font-black text-primary uppercase">{selectedPropertyTitle}</p>
                  </div>
                </div>
              )}

              {/* Market Property Details */}
              {propertyMode === 'market' && (
                <div className="animate-in slide-in-from-top-2 duration-300">
                  <textarea
                    placeholder="Descreva o imÃ³vel do mercado (Ex: Apartamento no Centro, 3 qtos, atÃ© R$ 500k...)"
                    className="w-full px-6 py-4 bg-muted/50 border border-transparent rounded-2xl focus:bg-surface focus:border-primary/20 transition-all outline-none font-bold text-primary placeholder:text-muted-foreground/30 min-h-[100px] resize-none"
                    value={formData.interest_description}
                    onChange={e => setFormData({ ...formData, interest_description: e.target.value })}
                  />
                </div>
              )}
            </div>

            <div className="w-full h-px bg-border/40 col-span-full my-2" />

            {/* Value & Probability */}
            <div className="grid grid-cols-2 gap-6 col-span-full">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">Valor Estimado (R$)</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Tag className="h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                  </div>
                  <input
                    type="number"
                    value={formData.value}
                    onChange={e => setFormData({ ...formData, value: Number(e.target.value) })}
                    className="block w-full pl-10 pr-4 py-3 bg-muted/50 border border-transparent rounded-2xl focus:bg-surface focus:border-primary/20 transition-all outline-none font-bold text-primary placeholder:text-muted-foreground/30"
                    placeholder="Ex: 500000"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">Probabilidade (%)</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Sparkles className="h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                  </div>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={formData.probability}
                    onChange={e => setFormData({ ...formData, probability: Number(e.target.value) })}
                    className="block w-full pl-10 pr-4 py-3 bg-muted/50 border border-transparent rounded-2xl focus:bg-surface focus:border-primary/20 transition-all outline-none font-bold text-primary placeholder:text-muted-foreground/30"
                    placeholder="Ex: 70"
                  />
                </div>
              </div>
            </div>

            <div className="w-full h-px bg-border/40 col-span-full my-2" />

            {/* Email */}
            <div className="space-y-2">
              <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">E-mail</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                </div>
                <input
                  type="email"
                  value={formData.email}
                  onChange={e => setFormData({ ...formData, email: e.target.value })}
                  className="block w-full pl-10 pr-4 py-3 bg-muted/50 border border-transparent rounded-2xl focus:bg-surface focus:border-primary/20 transition-all outline-none font-bold text-primary placeholder:text-muted-foreground/30"
                  placeholder="email@exemplo.com"
                />
              </div>
            </div>

            {/* Phone */}
            <div className="space-y-2">
              <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">WhatsApp</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Phone className="h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                </div>
                <input
                  required
                  type="text"
                  value={formData.phone}
                  onChange={e => setFormData({ ...formData, phone: e.target.value })}
                  className="block w-full pl-10 pr-4 py-3 bg-muted/50 border border-transparent rounded-2xl focus:bg-surface focus:border-primary/20 transition-all outline-none font-bold text-primary placeholder:text-muted-foreground/30"
                  placeholder="(62) 99999-9999"
                />
              </div>
            </div>

            {/* Source */}
            <div className="space-y-2">
              <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">Origem</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Tag className="h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                </div>
                <select
                  value={formData.source}
                  onChange={e => setFormData({ ...formData, source: e.target.value })}
                  className="block w-full pl-10 pr-4 py-3 bg-muted/50 border border-transparent rounded-2xl focus:bg-surface focus:border-primary/20 transition-all outline-none font-bold text-primary"
                >
                  <option value="">Selecione...</option>
                  {LEAD_CHANNELS.map(channel => (
                    <option key={channel.id} value={channel.id}>{channel.name}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Data de Entrada */}
            <div className="space-y-2">
              <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">📅 Data de Entrada</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <span className="text-[11px] text-muted-foreground">📅</span>
                </div>
                <input
                  type="date"
                  value={formData.entry_date}
                  max={new Date().toISOString().split('T')[0]}
                  onChange={e => setFormData({ ...formData, entry_date: e.target.value })}
                  className="block w-full pl-10 pr-4 py-3 bg-muted/50 border border-transparent rounded-2xl focus:bg-surface focus:border-primary/20 transition-all outline-none font-bold text-primary"
                />
              </div>
              <p className="text-[9px] font-medium text-muted-foreground/60 ml-1">Padrão: hoje. Edite para registrar leads de datas anteriores.</p>
            </div>

            {/* Temperature */}
            <div className="space-y-2">
              <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">Temperatura</label>
              <div className="flex gap-2">
                {(['cold', 'warm', 'hot'] as const).map(temp => (
                  <button
                    key={temp}
                    type="button"
                    onClick={() => setFormData({ ...formData, temperature: temp })}
                    className={`
                      flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border
                      ${formData.temperature === temp 
                        ? 'bg-blue-primary text-white border-primary shadow-md scale-[1.02]' 
                        : 'bg-muted/50 text-muted-foreground border-transparent hover:border-border'}
                    `}
                  >
                    {temp === 'cold' ? 'Frio' : temp === 'warm' ? 'Morno' : 'Quente'}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-border flex items-center justify-between">
            <div className="flex items-center gap-2 text-green-600">
              <ShieldCheck size={18} />
              <span className="text-[10px] font-black uppercase tracking-widest">Dados Seguros</span>
            </div>
            
            <div className="flex gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-3 rounded-2xl font-bold text-sm text-muted-foreground hover:bg-muted transition-all"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={loading}
                className="bg-blue-primary text-white px-8 py-3 rounded-2xl font-black text-sm hover:bg-blue-primary-light transition-all shadow-card flex items-center gap-2"
              >
                {loading ? <Loader2 className="animate-spin" size={18} /> : 'Cadastrar Lead'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

