'use client';

import React from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { 
  Trophy, 
  Target, 
  TrendingUp, 
  Users, 
  Medal, 
  Star, 
  ArrowUpRight,
  BarChart3,
  Flame
} from 'lucide-react';

export default function RankingPage() {
  const brokers = [
    { name: 'Ricardo Silva', sales: 12, volume: 4500000, conversion: 18, points: 2450, rank: 1, avatar: 'RS' },
    { name: 'Ana Beatriz', sales: 9, volume: 3200000, conversion: 15, points: 1820, rank: 2, avatar: 'AB' },
    { name: 'Carlos Santos', sales: 8, volume: 2800000, conversion: 12, points: 1540, rank: 3, avatar: 'CS' },
    { name: 'Juliana Lima', sales: 6, volume: 1900000, conversion: 10, points: 1120, rank: 4, avatar: 'JL' },
    { name: 'Marcos Oliveira', sales: 5, volume: 1500000, conversion: 9, points: 950, rank: 5, avatar: 'MO' },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-8 animate-in fade-in duration-500">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="text-3xl font-bold text-primary mb-2">Performance & Gamificação</h1>
            <p className="text-muted-foreground">Acompanhe sua evolução e destaque-se no ranking da Habita.vc.</p>
          </div>
          <div className="flex gap-3">
            <div className="bg-white px-4 py-2 rounded-xl shadow-sm border border-border flex items-center gap-2">
              <Calendar className="w-4 h-4 text-accent" />
              <span className="text-sm font-bold text-primary">Maio 2026</span>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard 
            icon={<Trophy className="w-6 h-6 text-yellow-500" />}
            label="Sua Posição"
            value="#4"
            trend="+2 posições"
            color="bg-yellow-50"
          />
          <StatCard 
            icon={<Flame className="w-6 h-6 text-orange-500" />}
            label="Pontos Habita"
            value="1.120"
            trend="+15% este mês"
            color="bg-orange-50"
          />
          <StatCard 
            icon={<Target className="w-6 h-6 text-primary" />}
            label="Atingimento Meta"
            value="82%"
            trend="R$ 1.9M / R$ 2.3M"
            color="bg-primary/5"
          />
          <StatCard 
            icon={<TrendingUp className="w-6 h-6 text-green-500" />}
            label="Conversão Geral"
            value="10%"
            trend="Média mercado: 4%"
            color="bg-green-50"
          />
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Ranking Table */}
          <div className="lg:col-span-2 bg-white rounded-3xl shadow-premium border border-border overflow-hidden">
            <div className="p-6 border-b border-border flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Medal className="w-5 h-5 text-primary" />
                <h3 className="font-bold text-primary">Ranking de Corretores</h3>
              </div>
              <button className="text-xs font-bold text-accent hover:underline">Ver Histórico</button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-muted/50 text-[10px] font-bold uppercase tracking-widest text-muted-foreground border-b border-border">
                    <th className="px-6 py-4">Rank</th>
                    <th className="px-6 py-4">Corretor</th>
                    <th className="px-6 py-4">Vendas</th>
                    <th className="px-6 py-4">Volume (VGV)</th>
                    <th className="px-6 py-4">Pontos</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {brokers.map((broker) => (
                    <tr key={broker.rank} className={`hover:bg-muted/30 transition-colors ${broker.rank === 4 ? 'bg-primary/5' : ''}`}>
                      <td className="px-6 py-4">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${
                          broker.rank === 1 ? 'bg-yellow-100 text-yellow-700' :
                          broker.rank === 2 ? 'bg-slate-100 text-slate-700' :
                          broker.rank === 3 ? 'bg-orange-100 text-orange-700' : 'text-muted-foreground'
                        }`}>
                          {broker.rank}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center font-bold text-primary text-xs">
                            {broker.avatar}
                          </div>
                          <div>
                            <p className="font-bold text-primary text-sm">{broker.name}</p>
                            <p className="text-[10px] text-muted-foreground font-medium">{broker.conversion}% conversão</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 font-bold text-sm text-primary">{broker.sales}</td>
                      <td className="px-6 py-4 font-bold text-sm text-primary">
                        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(broker.volume)}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-primary">{broker.points}</span>
                          <ArrowUpRight className="w-3 h-3 text-green-500" />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Goals & Achievements */}
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-3xl shadow-premium border border-border">
              <h3 className="font-bold text-primary mb-6 flex items-center gap-2">
                <Target className="w-5 h-5 text-accent" />
                Meta de Faturamento
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="font-medium text-muted-foreground">Progresso Atual</span>
                  <span className="font-bold text-primary">R$ 1.950.000 / R$ 2.5M</span>
                </div>
                <div className="h-3 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-primary rounded-full" style={{ width: '78%' }} />
                </div>
                <p className="text-[10px] text-muted-foreground text-center">Faltam <b>R$ 550.000</b> para bater a meta do mês!</p>
              </div>
            </div>

            <div className="bg-primary p-6 rounded-3xl shadow-luxury text-white relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:rotate-12 transition-transform">
                <Star size={64} />
              </div>
              <h3 className="font-bold mb-4 relative z-10">Próxima Conquista</h3>
              <div className="flex items-center gap-4 relative z-10">
                <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-md border border-white/20">
                  <BarChart3 className="w-8 h-8 text-white" />
                </div>
                <div>
                  <p className="font-bold">Estrategista de VGV</p>
                  <p className="text-xs text-white/60">Venda R$ 5M em um único mês para liberar.</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-3xl shadow-premium border border-border">
              <h3 className="font-bold text-primary mb-4">Insígnias</h3>
              <div className="flex flex-wrap gap-3">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="w-12 h-12 rounded-2xl bg-muted flex items-center justify-center text-muted-foreground grayscale hover:grayscale-0 hover:bg-accent/10 hover:text-accent transition-all cursor-help border border-transparent hover:border-accent/20">
                    <Medal size={24} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

const StatCard = ({ icon, label, value, trend, color }: any) => (
  <div className="bg-white p-6 rounded-3xl shadow-premium border border-border">
    <div className={`w-12 h-12 ${color} rounded-2xl flex items-center justify-center mb-4`}>
      {icon}
    </div>
    <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1">{label}</p>
    <h3 className="text-3xl font-bold text-primary mb-1">{value}</h3>
    <p className="text-xs font-bold text-green-600">{trend}</p>
  </div>
);

const Calendar = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>
);
