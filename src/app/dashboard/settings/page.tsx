'use client';

import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import { ProfilesService } from '@/services/profiles.service';
import { 
  User, 
  Target, 
  TrendingUp, 
  Sparkles, 
  Save, 
  RefreshCw, 
  ShieldCheck, 
  DollarSign, 
  Percent,
  BarChart3
} from 'lucide-react';

export default function SettingsPage() {
  const { profile, user } = useAuth();
  const { isLuxury, toggleLuxury } = useTheme();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  
  const [formData, setFormData] = useState({
    full_name: '',
    earnings_goal_monthly: 0,
    avg_ticket: 0,
    avg_commission_percent: 0,
    conversion_rates: {
      lead_to_contact: 0,
      contact_to_visit: 0,
      visit_to_proposal: 0,
      proposal_to_sale: 0,
    }
  });

  useEffect(() => {
    if (profile) {
      setFormData({
        full_name: profile.full_name || '',
        earnings_goal_monthly: profile.earnings_goal_monthly || 0,
        avg_ticket: profile.avg_ticket || 0,
        avg_commission_percent: profile.avg_commission_percent || 0,
        conversion_rates: profile.conversion_rates || {
          lead_to_contact: 30,
          contact_to_visit: 20,
          visit_to_proposal: 15,
          proposal_to_sale: 10,
        }
      });
    }
  }, [profile]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    setSuccess(false);
    try {
      await ProfilesService.update(user.id, formData);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (error: any) {
      console.error('Erro detalhado ao salvar configurações:', error.message || error);
      alert('Erro ao salvar: ' + (error.message || 'Verifique as permissões no banco.'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-10 pb-20 max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="flex justify-between items-end">
          <div>
            <h1 className="text-4xl font-black text-primary mb-2">Configurações</h1>
            <p className="text-muted-foreground font-medium">Ajuste seu motor de vendas e preferências visuais.</p>
          </div>
          {success && (
            <div className="flex items-center gap-2 text-green-600 bg-green-50 px-4 py-2 rounded-xl border border-green-100 animate-bounce">
              <ShieldCheck size={18} />
              <span className="text-sm font-bold uppercase tracking-widest text-[10px]">Salvo com Sucesso</span>
            </div>
          )}
        </div>

        <form onSubmit={handleSave} className="space-y-8">
          {/* Section: Profile */}
          <section className="bg-white p-8 rounded-[2.5rem] shadow-premium border border-border space-y-6">
            <div className="flex items-center gap-3 border-b border-border pb-4">
              <div className="p-2 bg-primary/5 rounded-xl text-primary">
                <User size={20} />
              </div>
              <h2 className="text-xl font-black text-primary uppercase tracking-tight">Perfil Profissional</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">Nome Completo</label>
                <input
                  type="text"
                  value={formData.full_name}
                  onChange={e => setFormData({ ...formData, full_name: e.target.value })}
                  className="block w-full px-5 py-4 bg-muted/30 border border-transparent rounded-2xl focus:bg-white focus:border-primary/20 transition-all outline-none font-bold text-primary"
                />
              </div>
              <div className="space-y-2 opacity-50">
                <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">E-mail (Não editável)</label>
                <input
                  disabled
                  type="email"
                  value={profile?.email || ''}
                  className="block w-full px-5 py-4 bg-muted/10 border border-transparent rounded-2xl font-bold text-muted-foreground cursor-not-allowed"
                />
              </div>
            </div>
          </section>

          {/* Section: Business Logic (Funil Reverso) */}
          <section className="bg-white p-8 rounded-[2.5rem] shadow-premium border border-border space-y-8">
            <div className="flex items-center gap-3 border-b border-border pb-4">
              <div className="p-2 bg-accent/10 rounded-xl text-accent">
                <Target size={20} />
              </div>
              <h2 className="text-xl font-black text-primary uppercase tracking-tight">Metas & Performance</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1 flex items-center gap-1">
                  <DollarSign size={10} /> Meta de Ganhos/Mês
                </label>
                <input
                  type="number"
                  value={formData.earnings_goal_monthly}
                  onChange={e => setFormData({ ...formData, earnings_goal_monthly: Number(e.target.value) })}
                  className="block w-full px-5 py-4 bg-muted/30 border border-transparent rounded-2xl focus:bg-white focus:border-primary/20 transition-all outline-none font-black text-primary text-lg"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1 flex items-center gap-1">
                  <BarChart3 size={10} /> Ticket Médio Imóvel
                </label>
                <input
                  type="number"
                  value={formData.avg_ticket}
                  onChange={e => setFormData({ ...formData, avg_ticket: Number(e.target.value) })}
                  className="block w-full px-5 py-4 bg-muted/30 border border-transparent rounded-2xl focus:bg-white focus:border-primary/20 transition-all outline-none font-black text-primary text-lg"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1 flex items-center gap-1">
                  <Percent size={10} /> Comissão Média (%)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.avg_commission_percent}
                  onChange={e => setFormData({ ...formData, avg_commission_percent: Number(e.target.value) })}
                  className="block w-full px-5 py-4 bg-muted/30 border border-transparent rounded-2xl focus:bg-white focus:border-primary/20 transition-all outline-none font-black text-primary text-lg"
                />
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <TrendingUp size={16} className="text-primary" />
                <h3 className="text-sm font-black uppercase tracking-widest text-primary">Taxas de Conversão Reais (%)</h3>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <RateInput 
                  label="Lead → Contato" 
                  value={formData.conversion_rates.lead_to_contact} 
                  onChange={v => setFormData({ ...formData, conversion_rates: { ...formData.conversion_rates, lead_to_contact: v } })} 
                />
                <RateInput 
                  label="Contato → Visita" 
                  value={formData.conversion_rates.contact_to_visit} 
                  onChange={v => setFormData({ ...formData, conversion_rates: { ...formData.conversion_rates, contact_to_visit: v } })} 
                />
                <RateInput 
                  label="Visita → Proposta" 
                  value={formData.conversion_rates.visit_to_proposal} 
                  onChange={v => setFormData({ ...formData, conversion_rates: { ...formData.conversion_rates, visit_to_proposal: v } })} 
                />
                <RateInput 
                  label="Proposta → Venda" 
                  value={formData.conversion_rates.proposal_to_sale} 
                  onChange={v => setFormData({ ...formData, conversion_rates: { ...formData.conversion_rates, proposal_to_sale: v } })} 
                />
              </div>
            </div>
          </section>

          {/* Section: Appearance */}
          <section className="bg-white p-8 rounded-[2.5rem] shadow-premium border border-border space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-yellow-500/10 rounded-xl text-yellow-600">
                  <Sparkles size={20} />
                </div>
                <div>
                  <h2 className="text-xl font-black text-primary uppercase tracking-tight">Experiência Visual</h2>
                  <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Interface de alto padrão</p>
                </div>
              </div>
              
              <button
                type="button"
                onClick={toggleLuxury}
                className={`
                  relative inline-flex h-10 w-20 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-500 ease-in-out focus:outline-none
                  ${isLuxury ? 'bg-primary shadow-luxury' : 'bg-muted'}
                `}
              >
                <span className={`
                  pointer-events-none inline-block h-9 w-9 transform rounded-full bg-white shadow-lg ring-0 transition duration-500 ease-in-out
                  ${isLuxury ? 'translate-x-10' : 'translate-x-0'}
                `} />
              </button>
            </div>
          </section>

          <div className="flex justify-end pt-4">
            <button
              type="submit"
              disabled={loading}
              className="bg-primary text-white px-12 py-5 rounded-[2rem] font-black text-lg hover:bg-primary-light transition-all shadow-premium flex items-center gap-3 active:scale-95"
            >
              {loading ? <RefreshCw className="animate-spin" size={24} /> : (
                <>
                  <Save size={24} />
                  Salvar Configurações
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}

const RateInput = ({ label, value, onChange }: { label: string, value: number, onChange: (v: number) => void }) => (
  <div className="bg-muted/30 p-4 rounded-2xl border border-transparent hover:border-primary/10 transition-all text-center">
    <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest mb-2 h-6 flex items-center justify-center">{label}</p>
    <div className="relative inline-block w-full">
      <input
        type="number"
        value={value}
        onChange={e => onChange(Number(e.target.value))}
        className="w-full bg-white border border-border/50 rounded-xl px-2 py-2 text-center font-black text-primary text-xl outline-none focus:border-primary/20"
      />
      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-black text-muted-foreground/40">%</span>
    </div>
  </div>
);
