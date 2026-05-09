'use client';

import React, { useState } from 'react';
import { X, DollarSign, Percent, ShieldCheck, Loader2, CheckCircle2 } from 'lucide-react';
import { SalesService } from '@/services/sales.service';
import { PeopleService } from '@/services/people.service';
import { Lead, Property } from '@/types/database';

interface SaleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  lead: Lead;
  properties: Property[];
}

export const SaleModal = ({ isOpen, onClose, onSuccess, lead, properties }: SaleModalProps) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    property_id: '',
    sale_price: 0,
    total_commission_percent: 5,
    broker_split_percent: 50,
  });

  if (!isOpen) return null;

  const totalCommission = (formData.sale_price * formData.total_commission_percent) / 100;
  const brokerCommission = (totalCommission * formData.broker_split_percent) / 100;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      // 1. Criar o registro da venda
      await SalesService.create({
        lead_id: lead.id,
        property_id: formData.property_id,
        broker_id: lead.assigned_to_id,
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
      if (lead.person_id) {
        try {
          const person = await PeopleService.getById(lead.person_id);
          if (person && !person.roles.includes('client')) {
            const newRoles = [...person.roles, 'client'];
            await PeopleService.update(lead.person_id, { 
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
    } catch (error) {
      console.error('Erro ao lançar venda:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-primary/40 backdrop-blur-md" onClick={onClose} />
      
      <div className="bg-white w-full max-w-xl rounded-[3rem] shadow-luxury border border-border relative overflow-hidden animate-in fade-in zoom-in duration-300">
        <div className="p-10 border-b border-border bg-muted/30">
          <h2 className="text-3xl font-black text-primary mb-2">Lançar Venda! 🍾</h2>
          <p className="text-xs font-black text-muted-foreground uppercase tracking-widest">Registrar fechamento e calcular comissões</p>
          <button onClick={onClose} className="absolute top-8 right-8 p-2 hover:bg-white rounded-xl transition-colors">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-10 space-y-8">
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">Imóvel Vendido</label>
              <select
                required
                value={formData.property_id}
                onChange={e => {
                  const prop = properties.find(p => p.id === e.target.value);
                  setFormData({ ...formData, property_id: e.target.value, sale_price: prop?.price || 0 });
                }}
                className="w-full px-6 py-4 bg-muted/50 border border-transparent rounded-2xl focus:bg-white focus:border-primary/20 transition-all outline-none font-bold text-primary appearance-none"
              >
                <option value="">Selecione o imóvel...</option>
                {properties.map(p => (
                  <option key={p.id} value={p.id}>{p.title} - R$ {p.price.toLocaleString()}</option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">Valor da Venda</label>
                <div className="relative">
                  <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                  <input
                    type="number"
                    value={formData.sale_price}
                    onChange={e => setFormData({ ...formData, sale_price: Number(e.target.value) })}
                    className="w-full pl-12 pr-4 py-4 bg-muted/50 border border-transparent rounded-2xl focus:bg-white focus:border-primary/20 transition-all outline-none font-black text-primary"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">Comissão Total (%)</label>
                <div className="relative">
                  <Percent className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                  <input
                    type="number"
                    step="0.1"
                    value={formData.total_commission_percent}
                    onChange={e => setFormData({ ...formData, total_commission_percent: Number(e.target.value) })}
                    className="w-full pl-12 pr-4 py-4 bg-muted/50 border border-transparent rounded-2xl focus:bg-white focus:border-primary/20 transition-all outline-none font-black text-primary"
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

          <div className="flex items-center justify-between pt-6">
            <div className="flex items-center gap-2 text-green-600">
              <ShieldCheck size={18} />
              <span className="text-[10px] font-black uppercase tracking-widest">Dados Verificados</span>
            </div>
            
            <button
              type="submit"
              disabled={loading || !formData.property_id}
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
      </div>
    </div>
  );
};
