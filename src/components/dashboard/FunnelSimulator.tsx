'use client';

import React, { useState, useEffect } from 'react';
import { 
  Target, 
  TrendingUp, 
  Users, 
  MessageSquare, 
  Presentation, 
  FileText, 
  CheckCircle2,
  Info,
  RefreshCcw,
  Save
} from 'lucide-react';
import { useFunnelCalculator } from '@/hooks/useFunnelCalculator';
import { useAuth } from '@/context/AuthContext';
import { DashboardService } from '@/services/dashboard.service';

export function FunnelSimulator() {
  const { user } = useAuth();
  // Estados para os inputs (Personalizáveis por Corretor)
  const [goal, setGoal] = useState(3000000);
  const [ticket, setTicket] = useState(500000);
  const [commission, setCommission] = useState(1.25);
  const [rateCallToApres, setRateCallToApres] = useState(0.20);
  const [rateApresToProp, setRateApresToProp] = useState(0.30);
  const [ratePropToSale, setRatePropToSale] = useState(0.40);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Carregar dados salvos ao iniciar
  useEffect(() => {
    async function loadConfig() {
      if (!user) return;
      try {
        setIsLoading(true);
        const config = await DashboardService.getFunnelConfig(user.id);
        if (config) {
          setGoal(config.goal || 3000000);
          setTicket(config.ticket || 500000);
          setCommission(config.commission || 1.25);
          setRateCallToApres(config.rateCallToApres || 0.20);
          setRateApresToProp(config.rateApresToProp || 0.30);
          setRatePropToSale(config.ratePropToSale || 0.40);
        }
      } catch (error) {
        console.error('Error loading funnel config', error);
      } finally {
        setIsLoading(false);
      }
    }
    loadConfig();
  }, [user]);

  const handleSave = async () => {
    if (!user) return;
    setIsSaving(true);
    try {
      const config = { goal, ticket, rateCallToApres, rateApresToProp, ratePropToSale };
      await DashboardService.saveFunnelConfig(user.id, config);
    } catch (error) {
      console.error('Error saving funnel config', error);
    } finally {
      setTimeout(() => setIsSaving(false), 800);
    }
  };

  // Hook de Cálculo (Deve ficar antes de qualquer return condicional)
  const { 
    salesNeeded, 
    proposalsNeeded, 
    presentationsNeeded, 
    callsNeeded, 
    dailyLeadGoal 
  } = useFunnelCalculator({
    quarterlyGoal: goal,
    avgTicket: ticket,
    avgCommission: commission,
    callToPresentation: rateCallToApres,
    presentationToProposal: rateApresToProp,
    proposalToSale: ratePropToSale
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-12 bg-card rounded-xl shadow-card">
        <RefreshCcw className="animate-spin text-primary" size={32} />
      </div>
    );
  }

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(val);
  };

  return (
    <div className="grid lg:grid-cols-[280px_1fr] gap-8 bg-card p-10 rounded-xl shadow-card border border-border/50">
      {/* Coluna de Configuração */}
      <div className="space-y-8 lg:border-r border-r-0 lg:border-border border-transparent lg:pr-8 pr-0">
        <div>
          <h3 className="text-xl font-black text-primary flex items-center gap-3">
            <Target className="text-accent" size={24} />
            Configuração Pessoal
          </h3>
          <p className="text-xs text-muted-foreground mt-1 font-medium">Ajuste suas metas e taxas de conversão</p>
        </div>

        <div className="space-y-6">
          <InputGroup 
            label="Meta Trimestral" 
            value={goal} 
            onChange={(v) => setGoal(Number(v))} 
            icon={<Target size={18} />}
            prefix="R$"
          />
          <InputGroup 
            label="Ticket Médio" 
            value={ticket} 
            onChange={(v) => setTicket(Number(v))} 
            icon={<TrendingUp size={18} />}
            prefix="R$"
          />
          <hr className="border-border/50" />
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Taxas de Conversão (%)</p>
          
          <SliderGroup 
            label="Ligação → Apresentação" 
            value={rateCallToApres} 
            onChange={setRateCallToApres} 
          />
          <SliderGroup 
            label="Apresentação → Proposta" 
            value={rateApresToProp} 
            onChange={setRateApresToProp} 
          />
          <SliderGroup 
            label="Proposta → Venda" 
            value={ratePropToSale} 
            onChange={setRatePropToSale} 
          />
        </div>

        <button 
          onClick={handleSave}
          className={`w-full py-4 rounded-2xl text-xs font-black uppercase tracking-widest flex items-center justify-center gap-3 transition-all shadow-lg ${isSaving ? 'bg-green-600 text-white' : 'bg-blue-primary text-white hover:scale-[1.02] shadow-primary/20'}`}
        >
          {isSaving ? <CheckCircle2 size={16} /> : <Save size={16} />} 
          {isSaving ? 'Salvo!' : 'Salvar Minhas Metas'}
        </button>

        </div>

      {/* Coluna do Funil Visual */}
      <div className="space-y-10 lg:pl-8 pl-0">
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-black text-primary">Seu Funil Necessário</h3>
          <div className="flex items-center gap-2 px-4 py-2 bg-accent/10 text-accent rounded-full text-[10px] font-black uppercase tracking-widest">
            <Info size={14} /> Baseado em VSO 45 dias
          </div>
        </div>

        <div className="relative py-10 flex flex-col items-center w-full">
          {/* Camada: Ligações */}
          <FunnelLayer 
            label="Oportunidades" 
            value={callsNeeded} 
            color="bg-blue-primary/5" 
            width="w-full"
            icon={<Users className="text-primary/40" />}
            rate={`${(rateCallToApres * 100).toFixed(0)}%`}
          />
          
          {/* Camada: Apresentações */}
          <FunnelLayer 
            label="Apresentações" 
            value={presentationsNeeded} 
            color="bg-blue-primary/10" 
            width="w-full sm:w-[90%] md:w-[85%] lg:w-[80%]"
            icon={<Presentation className="text-primary/60" />}
            rate={`${(rateApresToProp * 100).toFixed(0)}%`}
          />

          {/* Camada: Propostas */}
          <FunnelLayer 
            label="Propostas" 
            value={proposalsNeeded} 
            color="bg-blue-primary/20" 
            width="w-full sm:w-[80%] md:w-[70%] lg:w-[60%]"
            icon={<FileText className="text-primary/80" />}
            rate={`${(ratePropToSale * 100).toFixed(0)}%`}
          />

          {/* Camada: Vendas */}
          <FunnelLayer 
            label="Vendas Trimestre" 
            value={salesNeeded} 
            color="bg-accent/15 border-accent/20" 
            width="w-full sm:w-[70%] md:w-[55%] lg:w-[40%]"
            icon={<CheckCircle2 className="text-accent" />}
            rate={formatCurrency(goal)}
            rateLabel="Meta Trimestral"
          />

          {/* Meta Diária Card */}
          <div className="mt-8 mb-4 bg-surface border-2 border-accent p-6 rounded-3xl shadow-2xl lg:rotate-3 hover:rotate-0 transition-all duration-500 max-w-[240px] z-20 mx-auto w-full text-center">
             <p className="text-[10px] font-black text-accent uppercase tracking-widest mb-1">Ação Requerida</p>
             <p className="text-3xl font-black text-primary">{dailyLeadGoal}</p>
             <p className="text-xs font-bold text-muted-foreground leading-tight mt-1">contatos novos por dia útil</p>
          </div>
        </div>
      </div>
    </div>
  );
}

interface InputGroupProps {
  label: string;
  value: number;
  onChange: (v: string) => void;
  icon: React.ReactNode;
  prefix?: string;
}

const InputGroup = ({ label, value, onChange, icon, prefix }: InputGroupProps) => (
  <div className="space-y-2">
    <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">{label}</label>
    <div className="flex items-center gap-3 bg-muted/50 border border-border/50 focus-within:border-accent/50 focus-within:bg-card rounded-2xl px-4 py-3 transition-all">
      <div className="text-muted-foreground">{icon}</div>
      {prefix && <span className="text-xs font-bold text-muted-foreground/80">{prefix}</span>}
      <input 
        type="number" 
        value={value} 
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange(e.target.value)}
        className="w-full bg-transparent text-sm font-bold text-primary outline-none"
      />
    </div>
  </div>
);

interface SliderGroupProps {
  label: string;
  value: number;
  onChange: (v: number) => void;
}

const SliderGroup = ({ label, value, onChange }: SliderGroupProps) => (
  <div className="space-y-3">
    <div className="flex justify-between items-center">
      <label className="text-xs font-bold text-primary">{label}</label>
      <span className="text-xs font-black text-accent bg-accent/10 px-2 py-1 rounded-md">{(value * 100).toFixed(0)}%</span>
    </div>
    <input 
      type="range" 
      min="0" 
      max="1" 
      step="0.01" 
      value={value} 
      onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange(Number(e.target.value))}
      className="w-full h-1.5 bg-muted rounded-full appearance-none cursor-pointer accent-accent"
    />
  </div>
);

interface FunnelLayerProps {
  label: string;
  value: number;
  color: string;
  width: string;
  icon: React.ReactNode;
  rate: string;
  rateLabel?: string;
}

const FunnelLayer = ({ label, value, color, width, icon, rate, rateLabel }: FunnelLayerProps) => (
  <div className={`relative ${width} ${color} py-4 px-5 sm:px-6 sm:py-5 rounded-[1.5rem] flex flex-col sm:flex-row items-center justify-between mb-4 border border-border/50 group hover:border-accent/30 hover:shadow-lg transition-all duration-500 cursor-default overflow-hidden gap-2`}>
    <div className="flex items-center gap-4 relative z-10 w-full sm:w-auto text-left">
      <div className="p-3 bg-card/80 backdrop-blur-sm rounded-xl shrink-0 group-hover:scale-110 transition-transform duration-500">
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground truncate">{label}</p>
        <p className="text-xl sm:text-xl font-bold text-heading">{value}</p>
      </div>
    </div>
    <div className="text-right relative z-10 w-full sm:w-auto flex flex-row sm:flex-col justify-between sm:justify-end items-center sm:items-end">
      <p className="text-[10px] font-black uppercase tracking-widest text-accent">{rateLabel || "Taxa Próxima"}</p>
      <p className="text-lg font-black text-primary">{rate}</p>
    </div>
    {/* Efeito de brilho ao passar o mouse */}
    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
  </div>
);

interface ChannelItemProps {
  name: string;
  percentage: number;
  leads: number;
}

const ChannelItem = ({ name, percentage, leads }: ChannelItemProps) => (
  <div className="flex items-center justify-between p-3 bg-muted/20 rounded-xl">
    <div className="flex items-center gap-3">
      <div className="w-1.5 h-1.5 rounded-full bg-accent" />
      <span className="text-[10px] font-bold text-primary">{name}</span>
    </div>
    <div className="flex items-center gap-3">
      <span className="text-[9px] font-black text-muted-foreground">{percentage}%</span>
      <span className="text-[10px] font-black text-primary">{leads} leads</span>
    </div>
  </div>
);
