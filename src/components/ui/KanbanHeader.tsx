'use client';

import React from 'react';
import { TrendingUp, DollarSign, Target, Search, Filter } from 'lucide-react';
import { Lead } from '@/types/database';

interface KanbanHeaderProps {
  leads: Lead[];
  search: string;
  onSearchChange: (val: string) => void;
}

export const KanbanHeader = ({ leads, search, onSearchChange }: KanbanHeaderProps) => {
  // Financial Calculations
  const totalValue = leads.reduce((acc, lead) => acc + (lead.value || 0), 0);
  const hotValue = leads
    .filter(l => l.temperature === 'hot' && l.status !== 'lost' && l.status !== 'sale')
    .reduce((acc, lead) => acc + (lead.value || 0), 0);
  const closedValue = leads
    .filter(l => l.status === 'sale')
    .reduce((acc, lead) => acc + (lead.value || 0), 0);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      maximumFractionDigits: 0
    }).format(val);
  };

  return (
    <div className="space-y-8 mb-10">
      {/* Search & Actions */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="relative w-full md:w-[450px] group">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-accent transition-colors" size={20} />
          <input 
            type="text" 
            placeholder="Buscar por nome, e-mail ou telefone..." 
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-14 pr-6 py-4 bg-surface rounded-xl border border-border/40 shadow-sm focus:border-accent/30 focus:ring-4 focus:ring-accent/5 transition-all outline-none font-bold text-primary placeholder:text-muted-foreground/30"
            style={{ paddingLeft: "3.5rem" }}
          />
        </div>
        
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-6 py-4 bg-surface border border-border/40 rounded-2xl text-sm font-black text-muted-foreground hover:text-primary transition-all shadow-sm">
            <Filter size={18} /> Filtros
          </button>
          <div className="h-8 w-px bg-border/40 mx-2" />
          <span className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">Visão: <span className="text-primary">Pipeline Global</span></span>
        </div>
      </div>

      {/* Financial Summary Bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <SummaryCard 
          icon={<TrendingUp className="text-blue-500" />} 
          label="Volume Total" 
          value={formatCurrency(totalValue)} 
          desc={`${leads.length} prospectos ativos`}
          color="bg-blue-500/5"
        />
        <SummaryCard 
          icon={<Target className="text-orange-500" />} 
          label="Negócios Quentes" 
          value={formatCurrency(hotValue)} 
          desc="Alta probabilidade de conversão"
          color="bg-orange-500/5"
        />
        <SummaryCard 
          icon={<DollarSign className="text-green-500" />} 
          label="Vendas (Mês)" 
          value={formatCurrency(closedValue)} 
          desc="Volume convertido em contratos"
          color="bg-green-500/5"
        />
      </div>
    </div>
  );
};

const SummaryCard = ({ icon, label, value, desc, color }: any) => (
  <div className={`p-8 rounded-xl border border-border/40 shadow-sm transition-all hover:shadow-card group flex items-center gap-4 bg-surface overflow-hidden relative`}>
    <div className={`absolute top-0 right-0 w-32 h-32 ${color} rounded-full -mr-16 -mt-16 blur-3xl opacity-50`} />
    <div className={`w-16 h-16 rounded-2xl flex items-center justify-center bg-muted/30 text-primary relative z-10`}>
      {React.cloneElement(icon, { size: 28 })}
    </div>
    <div className="relative z-10">
      <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] mb-1">{label}</p>
      <p className="text-sm font-bold text-primary tracking-tighter leading-none mb-2">{value}</p>
      <p className="text-[10px] font-bold text-muted-foreground/60">{desc}</p>
    </div>
  </div>
);
