'use client';

import React from 'react';
import { TrendingUp, Home, CheckCircle2, Search } from 'lucide-react';
import { Lead } from '@/types/database';

interface CaptacaoHeaderProps {
  leads: Lead[];
  search: string;
  onSearchChange: (val: string) => void;
}

export const CaptacaoHeader = ({ leads, search, onSearchChange }: CaptacaoHeaderProps) => {
  const fmt = (val: number) =>
    new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      maximumFractionDigits: 0,
    }).format(val);

  const totalVgv = leads.reduce((acc, l) => acc + (l.seller_asking_price || l.value || 0), 0);

  const capturedThisMonth = leads.filter(l => {
    if (l.status !== 'captured') return false;
    const d = new Date(l.created_at);
    const now = new Date();
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  });

  const active = leads.filter(l => l.status !== 'lost' && l.status !== 'captured');
  const convRate =
    leads.length > 0 ? ((leads.filter(l => l.status === 'captured').length / leads.length) * 100).toFixed(0) : '0';

  return (
    <div className="space-y-8 mb-10">
      {/* Search */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="relative w-full md:w-[450px] group">
          <Search
            className="absolute left-5 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-emerald-500 transition-colors"
            size={20}
          />
          <input
            type="text"
            placeholder="Buscar proprietário, endereço ou tipo..."
            value={search}
            onChange={e => onSearchChange(e.target.value)}
            className="w-full pl-14 pr-6 py-4 bg-surface rounded-xl border border-border/40 shadow-sm focus:border-emerald-400/40 focus:ring-4 focus:ring-emerald-400/5 transition-all outline-none font-bold text-primary placeholder:text-muted-foreground/30"
          />
        </div>

        <div className="flex items-center gap-2 text-xs font-black text-muted-foreground uppercase tracking-widest">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          Pipeline de Captação
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <CaptacaoKpiCard
          icon={<TrendingUp className="text-emerald-500" />}
          label="VGV Potencial em Captação"
          value={fmt(totalVgv)}
          desc={`${active.length} imóveis em negociação`}
          color="bg-emerald-500/5"
        />
        <CaptacaoKpiCard
          icon={<CheckCircle2 className="text-teal-500" />}
          label="Captados este Mês"
          value={String(capturedThisMonth.length)}
          desc="Autorizações de venda assinadas"
          color="bg-teal-500/5"
        />
        <CaptacaoKpiCard
          icon={<Home className="text-cyan-500" />}
          label="Taxa de Conversão"
          value={`${convRate}%`}
          desc="Prospecção → Captado (acumulado)"
          color="bg-cyan-500/5"
        />
      </div>
    </div>
  );
};

const CaptacaoKpiCard = ({ icon, label, value, desc, color }: any) => (
  <div className="p-8 rounded-xl border border-border/40 shadow-sm hover:shadow-card transition-all flex items-center gap-4 bg-surface overflow-hidden relative">
    <div className={`absolute top-0 right-0 w-32 h-32 ${color} rounded-full -mr-16 -mt-16 blur-3xl opacity-60`} />
    <div className="w-16 h-16 rounded-2xl flex items-center justify-center bg-muted/30 relative z-10">
      {React.cloneElement(icon, { size: 28 })}
    </div>
    <div className="relative z-10">
      <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] mb-1">{label}</p>
      <p className="text-sm font-bold text-primary tracking-tighter leading-none mb-2">{value}</p>
      <p className="text-[10px] font-bold text-muted-foreground/60">{desc}</p>
    </div>
  </div>
);
