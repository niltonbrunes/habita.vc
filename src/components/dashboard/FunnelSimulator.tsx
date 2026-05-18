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
    callToPresentation: rateCallToApres,
    presentationToProposal: rateApresToProp,
    proposalToSale: ratePropToSale
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-12 bg-white rounded-[2.5rem] shadow-premium">
        <RefreshCcw className="animate-spin text-primary" size={32} />
      </div>
    );
  }

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(val);
  };

  return (
    <div className="grid lg:grid-cols-3 gap-8 bg-white p-10 rounded-[2.5rem] shadow-premium">
      {/* Coluna de Configuração */}
      <div className="space-y-8 border-r border-border pr-8">
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
          className={`w-full py-4 rounded-2xl text-xs font-black uppercase tracking-widest flex items-center justify-center gap-3 transition-all shadow-lg ${isSaving ? 'bg-green-600 text-white' : 'bg-primary text-white hover:scale-[1.02] shadow-primary/20'}`}
        >
          {isSaving ? <CheckCircle2 size={16} /> : <Save size={16} />} 
          {isSaving ? 'Salvo!' : 'Salvar Minhas Metas'}
        </button>

        {/* Distribuição por Canais */}
        <div className="pt-8 space-y-4">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Distribuição Sugerida</p>
          <div className="space-y-3">
            <ChannelItem name="Indicação" percentage={25} leads={Math.ceil(callsNeeded * 0.25)} />
            <ChannelItem name="Redes Sociais" percentage={25} leads={Math.ceil(callsNeeded * 0.25)} />
            <ChannelItem name="Base de Clientes" percentage={20} leads={Math.ceil(callsNeeded * 0.20)} />
            <ChannelItem name="Network / Ponto" percentage={30} leads={Math.ceil(callsNeeded * 0.30)} />
          </div>
        </div>
      </div>

      {/* Coluna do Funil Visual */}
      <div className="lg:col-span-2 space-y-10 pl-4">
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-black text-primary">Seu Funil Necessário</h3>
          <div className="flex items-center gap-2 px-4 py-2 bg-accent/10 text-accent rounded-full text-[10px] font-black uppercase tracking-widest">
            <Info size={14} /> Baseado em VSO 45 dias
          </div>
        </div>

        <div className="relative py-10 flex flex-col items-center">
          {/* Camada: Ligações */}
          <FunnelLayer 
            label="Ligações / Leads" 
            value={callsNeeded} 
            color="bg-primary/5" 
            width="w-full"
            icon={<Users className="text-primary/40" />}
            rate={`${(rateCallToApres * 100).toFixed(0)}%`}
          />
          
          {/* Camada: Apresentações */}
          <FunnelLayer 
            label="Apresentações" 
            value={presentationsNeeded} 
            color="bg-primary/10" 
            width="w-[80%]"
            icon={<Presentation className="text-primary/60" />}
            rate={`${(rateApresToProp * 100).toFixed(0)}%`}
          />

          {/* Camada: Propostas */}
          <FunnelLayer 
            label="Propostas" 
            value={proposalsNeeded} 
            color="bg-primary/20" 
            width="w-[60%]"
            icon={<FileText className="text-primary/80" />}
            rate={`${(ratePropToSale * 100).toFixed(0)}%`}
          />

          {/* Camada: Vendas */}
          <div className="relative z-10 w-[40%] bg-accent text-white p-6 rounded-2xl shadow-xl shadow-accent/20 flex flex-col items-center group hover:scale-110 transition-all duration-500">
            <CheckCircle2 size={32} className="mb-2 text-white/80" />
            <span className="text-2xl font-black">{salesNeeded}</span>
            <span className="text-[10px] font-black uppercase tracking-widest opacity-80 text-center">Vendas Trimestre</span>
            <span className="mt-2 text-sm font-bold">{formatCurrency(goal)}</span>
          </div>

          {/* Meta Diária Card */}
          <div className="absolute top-10 right-0 bg-white border-2 border-accent p-6 rounded-3xl shadow-2xl rotate-3 hover:rotate-0 transition-all duration-500 max-w-[180px]">
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
    <div className="relative group">
      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-accent transition-colors">
        {icon}
      </div>
      {prefix && <span className="absolute left-10 top-1/2 -translate-y-1/2 text-xs font-bold text-muted-foreground/50">{prefix}</span>}
      <input 
        type="number" 
        value={value} 
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange(e.target.value)}
        className={`w-full bg-muted/30 border border-transparent focus:border-accent/30 focus:bg-white rounded-2xl py-4 ${prefix ? 'pl-16' : 'pl-12'} pr-4 text-sm font-bold text-primary transition-all outline-none`}
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
}

const FunnelLayer = ({ label, value, color, width, icon, rate }: FunnelLayerProps) => (
  <div className={`relative ${width} ${color} p-6 rounded-2xl flex items-center justify-between mb-4 border border-primary/5 group hover:border-accent/30 hover:shadow-lg transition-all duration-500 cursor-default overflow-hidden animate-in fade-in slide-in-from-bottom-4`}>
    <div className="flex items-center gap-4 relative z-10">
      <div className="p-3 bg-white/50 rounded-xl group-hover:scale-110 transition-transform duration-500">
        {icon}
      </div>
      <div>
        <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{label}</p>
        <p className="text-xl font-black text-primary">{value}</p>
      </div>
    </div>
    <div className="text-right relative z-10">
      <p className="text-[10px] font-black uppercase tracking-widest text-accent">Taxa Próxima</p>
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
