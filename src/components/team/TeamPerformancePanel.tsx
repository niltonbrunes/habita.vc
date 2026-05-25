'use client';

import React from 'react';
import { Users, TrendingUp, DollarSign, Target, ArrowUpRight } from 'lucide-react';
import { Profile } from '@/types/database';
import Image from 'next/image';

interface BrokerStat {
  profile: Profile;
  activeLeads: number;
  monthlySales: number;
  monthlyVgv: number;
  goalPercent: number;
}

interface TeamPerformancePanelProps {
  brokerStats: BrokerStat[];
  teamGoal: number;
  teamVgv: number;
  teamLeads: number;
  teamSales: number;
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(value);
}

export function TeamPerformancePanel({ brokerStats, teamGoal, teamVgv, teamLeads, teamSales }: TeamPerformancePanelProps) {
  const goalPercent = teamGoal > 0 ? Math.min(100, Math.round((teamVgv / teamGoal) * 100)) : 0;

  return (
    <div className="space-y-6">
      {/* Team overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { icon: <Users size={18} className="text-primary" />, label: 'Corretores', value: brokerStats.length, color: 'bg-blue-primary/5' },
          { icon: <Target size={18} className="text-orange-500" />, label: 'Leads Ativos', value: teamLeads, color: 'bg-orange-50' },
          { icon: <TrendingUp size={18} className="text-green-500" />, label: 'Vendas do Mês', value: teamSales, color: 'bg-green-50' },
          { icon: <DollarSign size={18} className="text-accent" />, label: 'VGV do Mês', value: formatCurrency(teamVgv), color: 'bg-accent/5' },
        ].map((item, i) => (
          <div key={i} className="bg-surface p-5 rounded-2xl shadow-card border border-border/50">
            <div className={`w-9 h-9 ${item.color} rounded-xl flex items-center justify-center mb-3`}>
              {item.icon}
            </div>
            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">{item.label}</p>
            <p className="text-xl font-black text-primary">{item.value}</p>
          </div>
        ))}
      </div>

      {/* Team goal progress */}
      {teamGoal > 0 && (
        <div className="bg-gradient-to-r from-primary to-primary/80 text-white p-6 rounded-2xl shadow-card">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-white/60">Meta da Equipe</p>
              <p className="text-2xl font-black mt-1">{formatCurrency(teamVgv)} <span className="text-white/40 text-base font-medium">/ {formatCurrency(teamGoal)}</span></p>
            </div>
            <div className="text-right">
              <p className="text-3xl font-black text-accent">{goalPercent}%</p>
              <p className="text-[10px] font-bold text-white/40">atingido</p>
            </div>
          </div>
          <div className="h-2 bg-surface/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-accent rounded-full transition-all duration-1000"
              style={{ width: `${goalPercent}%` }}
            />
          </div>
        </div>
      )}

      {/* Broker cards grid */}
      <div>
        <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-4">Corretores da Equipe</p>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {brokerStats.map(({ profile, activeLeads, monthlySales, monthlyVgv, goalPercent: bp }) => (
            <div
              key={profile.id}
              className="bg-surface rounded-2xl border border-border/50 shadow-card hover:shadow-card transition-all p-6 group"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-xl bg-blue-primary/10 flex items-center justify-center font-black text-primary text-sm overflow-hidden border-2 border-white shadow-sm">
                    {profile.avatar_url
                      ? <img src={profile.avatar_url} alt="" className="w-full h-full object-cover" />
                      : profile.full_name.substring(0, 2).toUpperCase()
                    }
                  </div>
                  <div>
                    <p className="font-black text-sm text-primary leading-tight">{profile.full_name}</p>
                    <p className="text-[10px] font-bold text-muted-foreground">{profile.creci ? `CRECI ${profile.creci}` : 'Sem CRECI'}</p>
                  </div>
                </div>
                <div className={`w-2 h-2 rounded-full mt-2 ${profile.status === 'active' ? 'bg-green-500' : 'bg-red-400'}`} title={profile.status === 'active' ? 'Ativo' : 'Inativo'} />
              </div>

              <div className="grid grid-cols-3 gap-2 mb-4">
                {[
                  { label: 'Leads', value: activeLeads, color: 'text-orange-500' },
                  { label: 'Vendas', value: monthlySales, color: 'text-green-600' },
                  { label: 'VGV', value: formatCurrency(monthlyVgv), color: 'text-primary' },
                ].map((stat, i) => (
                  <div key={i} className="text-center">
                    <p className={`text-sm font-black ${stat.color}`}>{stat.value}</p>
                    <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-wide">{stat.label}</p>
                  </div>
                ))}
              </div>

              {/* Mini progress bar */}
              <div>
                <div className="flex justify-between text-[9px] font-bold text-muted-foreground mb-1">
                  <span>Meta pessoal</span>
                  <span>{bp}%</span>
                </div>
                <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${bp >= 100 ? 'bg-green-500' : bp >= 70 ? 'bg-accent' : 'bg-blue-primary/40'}`}
                    style={{ width: `${Math.min(100, bp)}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
          {brokerStats.length === 0 && (
            <div className="col-span-3 py-12 text-center border-2 border-dashed border-border/30 rounded-2xl">
              <Users size={32} className="text-muted-foreground/30 mx-auto mb-3" />
              <p className="font-bold text-muted-foreground text-sm">Nenhum corretor atribuído à sua equipe ainda.</p>
              <p className="text-xs text-muted-foreground/60 mt-1">Peça ao Administrador para atribuir corretores.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
