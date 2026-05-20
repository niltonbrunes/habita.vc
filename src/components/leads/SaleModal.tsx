'use client';

import React, { useState, useEffect } from 'react';
import { X, DollarSign, Percent, ShieldCheck, Loader2, CheckCircle2 } from 'lucide-react';
import { SalesService } from '@/services/sales.service';
import { PeopleService } from '@/services/people.service';
import { LeadsService } from '@/services/leads.service';
import { PropertiesService } from '@/services/properties.service';
import { Lead, Property } from '@/types/database';
import { Person } from '@/types/people';
import { useAuth } from '@/context/AuthContext';

interface SaleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  lead?: Lead;
  properties?: Property[];
  initialData?: {
    sale_price?: number;
    total_commission_percent?: number;
    broker_split_percent?: number;
  };
}

export const SaleModal = ({ isOpen, onClose, onSuccess, lead, properties, initialData }: SaleModalProps) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(false);
  const [peopleList, setPeopleList] = useState<Person[]>([]);
  const [propertiesList, setPropertiesList] = useState<Property[]>([]);
  const [selectedPersonId, setSelectedPersonId] = useState('');
  const [error, setError] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    property_id: '',
    sale_price: 0,
    total_commission_percent: 5,
    broker_split_percent: 50,
  });

  // Reset form when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setFormData({
        property_id: '',
        sale_price: initialData?.sale_price || 0,
        total_commission_percent: initialData?.total_commission_percent ?? 5,
        broker_split_percent: initialData?.broker_split_percent ?? 50,
      });
      setSelectedPersonId('');
      setError(null);
    }
  }, [isOpen, initialData]);

  // Load people and properties if not provided as props
  useEffect(() => {
    if (!isOpen) return;

    async function loadInitialData() {
      try {
        setInitialLoading(true);
        setError(null);
        
        // Load properties if not provided
        if (!properties) {
          const props = await PropertiesService.getAll();
          setPropertiesList(props || []);
        } else {
          setPropertiesList(properties);
        }

        // Load people (contacts) if not provided
        if (!lead) {
          const allPeople = await PeopleService.getAll();
          setPeopleList(allPeople || []);
        }
      } catch (err) {
        console.error('Erro ao carregar dados iniciais no SaleModal:', err);
        setError('Falha ao carregar dados do formulário.');
      } finally {
        setInitialLoading(false);
      }
    }

    loadInitialData();
  }, [isOpen, lead, properties]);

  if (!isOpen) return null;

  const totalCommission = (formData.sale_price * formData.total_commission_percent) / 100;
  const brokerCommission = (totalCommission * formData.broker_split_percent) / 100;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!lead && !selectedPersonId) {
      setError('Selecione o cliente da venda.');
      return;
    }
    if (!formData.property_id) {
      setError('Selecione o imóvel vendido.');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      let activeLead: Lead | null = null;

      if (lead) {
        activeLead = lead;
      } else {
        // Find if this person already has a lead
        const allLeads = await LeadsService.getAll();
        const existingLead = allLeads.find(l => l.person_id === selectedPersonId);

        if (existingLead) {
          activeLead = existingLead;
        } else {
          // If no lead exists for this person, dynamically create one
          const selectedPerson = peopleList.find(p => p.id === selectedPersonId);
          if (!selectedPerson) throw new Error('Cliente selecionado não foi encontrado na base de dados.');

          const newLead = await LeadsService.create({
            name: selectedPerson.fantasy_name || selectedPerson.name || 'Sem nome',
            person_id: selectedPerson.id,
            assigned_to_id: selectedPerson.assigned_to_id || user?.id || '',
            status: 'lead',
            temperature: 'hot',
            score: 100,
            history: [],
            documents: []
          });
          activeLead = newLead;
        }
      }

      if (!activeLead) throw new Error('Não foi possível determinar ou criar o Lead correspondente.');

      // 1. Criar o registro da venda
      await SalesService.create({
        lead_id: activeLead.id,
        property_id: formData.property_id,
        broker_id: activeLead.assigned_to_id || user?.id,
        sale_price: formData.sale_price,
        total_commission: totalCommission,
        broker_commission: brokerCommission,
        manager_commission: totalCommission - brokerCommission,
        split_type: 'direct',
        split_metadata: {
          total_percent: formData.total_commission_percent,
          broker_percent: formData.broker_split_percent
        }
      });

      // 2. Unificação Master Person: Promover para 'client'
      if (activeLead.person_id) {
        try {
          const person = await PeopleService.getById(activeLead.person_id);
          if (person && !person.roles.includes('client')) {
            const newRoles = [...person.roles, 'client'] as any[];
            await PeopleService.update(activeLead.person_id, { 
              roles: newRoles,
              relationship_status: 'ativo'
            });
            console.log('Pessoa promovida a Cliente com sucesso!');
          }
        } catch (pErr) {
          console.error('Erro ao promover pessoa a cliente:', pErr);
        }
      }

      onSuccess();
      onClose();
    } catch (err: any) {
      console.error('Erro ao lançar venda:', err);
      setError(err?.message || 'Erro ao registrar a venda no banco de dados. Verifique a conexão.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-primary/40 backdrop-blur-md" onClick={onClose} />
      
      <div className="bg-white w-full max-w-xl rounded-[3rem] shadow-luxury border border-border relative max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in duration-300">
        <div className="p-8 border-b border-border bg-muted/30 shrink-0 relative">
          <h2 className="text-2xl font-black text-primary mb-1">Lançar Venda! 🎉</h2>
          <p className="text-xs font-black text-muted-foreground uppercase tracking-widest">Registrar fechamento e calcular comissões</p>
          <button onClick={onClose} className="absolute top-6 right-8 p-2 hover:bg-muted rounded-xl transition-colors">
            <X size={24} />
          </button>
        </div>

        {initialLoading ? (
          <div className="p-20 flex flex-col items-center justify-center gap-4">
            <Loader2 className="animate-spin text-primary animate-duration-1000" size={40} />
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Carregando dados...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-8 space-y-6">
            <div className="space-y-6">
              
              {/* Select Person/Contact (if not provided as lead prop) */}
              {!lead && (
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">Cliente (Contatos/Pessoas)</label>
                  <select
                    required
                    value={selectedPersonId}
                    onChange={e => setSelectedPersonId(e.target.value)}
                    className="w-full px-6 py-4 bg-muted/50 border border-transparent rounded-2xl focus:bg-white focus:border-primary/20 transition-all outline-none font-bold text-primary appearance-none"
                  >
                    <option value="">Selecione o cliente...</option>
                    {peopleList.map(p => (
                      <option key={p.id} value={p.id}>
                        {p.fantasy_name || p.name} {p.document_id ? '(' + p.document_id + ')' : ''}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Select Property */}
              <div className="space-y-2">
                <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">Imóvel Vendido</label>
                <select
                  required
                  value={formData.property_id}
                  onChange={e => {
                    const prop = propertiesList.find(p => p.id === e.target.value);
                    setFormData({ ...formData, property_id: e.target.value, sale_price: prop?.price || 0 });
                  }}
                  className="w-full px-6 py-4 bg-muted/50 border border-transparent rounded-2xl focus:bg-white focus:border-primary/20 transition-all outline-none font-bold text-primary appearance-none"
                >
                  <option value="">Selecione o imóvel...</option>
                  {propertiesList.map(p => (
                    <option key={p.id} value={p.id}>{p.title} - R$ {p.price.toLocaleString()}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">Valor da Venda</label>
                  <div className="flex items-center bg-muted/50 border border-transparent rounded-2xl focus-within:bg-white focus-within:border-primary/20 transition-all overflow-hidden">
                    <div className="pl-4 pr-1 text-muted-foreground shrink-0">
                      <DollarSign size={18} />
                    </div>
                    <input
                      type="number"
                      required
                      value={formData.sale_price || ''}
                      onChange={e => setFormData({ ...formData, sale_price: Number(e.target.value) })}
                      className="w-full py-4 pr-4 bg-transparent outline-none font-black text-primary border-none focus:ring-0"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">Comissão Total (%)</label>
                  <div className="flex items-center bg-muted/50 border border-transparent rounded-2xl focus-within:bg-white focus-within:border-primary/20 transition-all overflow-hidden">
                    <div className="pl-4 pr-1 text-muted-foreground shrink-0">
                      <Percent size={18} />
                    </div>
                    <input
                      type="number"
                      required
                      step="0.1"
                      value={formData.total_commission_percent}
                      onChange={e => setFormData({ ...formData, total_commission_percent: Number(e.target.value) })}
                      className="w-full py-4 pr-4 bg-transparent outline-none font-black text-primary border-none focus:ring-0"
                    />
                  </div>
                </div>
              </div>

              {/* Split Info */}
              <div className="bg-primary text-white p-8 rounded-[2rem] space-y-4 shadow-premium">
                <div className="flex justify-between items-center border-b border-white/10 pb-4">
                  <span className="text-xs font-black uppercase tracking-widest text-white/50">Sua Comissão</span>
                  <span className="text-2xl font-black text-accent">R$ {brokerCommission.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-[10px] font-bold text-white/40 uppercase tracking-widest">
                  <span>Comissão Bruta: R$ {totalCommission.toLocaleString()}</span>
                  <span>Split: {formData.broker_split_percent}%</span>
                </div>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-2xl text-xs font-bold uppercase tracking-wider flex items-center gap-2">
                <span>⚠️ {error}</span>
              </div>
            )}

            <div className="flex items-center justify-between pt-4">
              <div className="flex items-center gap-2 text-green-600">
                <ShieldCheck size={18} />
                <span className="text-[10px] font-black uppercase tracking-widest">Dados Verificados</span>
              </div>
              
              <button
                type="submit"
                disabled={loading || !formData.property_id || (!lead && !selectedPersonId)}
                className="bg-primary text-white px-10 py-4 rounded-2xl font-black text-lg hover:bg-primary-light transition-all shadow-premium flex items-center gap-3 disabled:opacity-50"
              >
                {loading ? <Loader2 className="animate-spin" size={24} /> : (
                  <>
                    Confirmar Venda <CheckCircle2 size={24} />
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
