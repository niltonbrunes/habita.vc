'use client';

import React, { useEffect, useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useAuth } from '@/context/AuthContext';
import { GamificationService, BADGES } from '@/services/gamification.service';
import { 
  Trophy, 
  Target, 
  TrendingUp, 
  Users, 
  Medal, 
  Star, 
  ArrowUpRight,
  BarChart3,
  Flame,
  Loader2
} from 'lucide-react';

export default function RankingPage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [brokers, setBrokers] = useState<any[]>([]);
  const [myStats, setMyStats] = useState<any>(null);

  useEffect(() => {
    if (!user) return;
    async function loadData() {
      try {
        const data = await GamificationService.getRankingData();
        setBrokers(data);
        const me = data.find((b: any) => b.id === user?.id);
        if (me) setMyStats(me);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [user]);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="h-[400px] flex items-center justify-center">
          <Loader2 className="animate-spin text-primary" size={40} />
        </div>
      </DashboardLayout>
    );
  }

  const goalPercent = myStats?.goal > 0 ? Math.min(Math.round((myStats.vgv / myStats.goal) * 100), 100) : 0;
  const remainingGoal = Math.max((myStats?.goal || 0) - (myStats?.vgv || 0), 0);
  
  // To display badges nicely
  const availableBadgesList = Object.values(BADGES);
  const myBadges = myStats?.badges || [];

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto space-y-8 pb-12 animate-in fade-in duration-500">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="text-3xl font-bold text-primary mb-2">Performance & Gamificação</h1>
            <p className="text-muted-foreground">Acompanhe sua evolução e destaque-se no ranking da Habita.vc.</p>
          </div>
          <div className="flex gap-3">
            <div className="bg-white px-4 py-2 rounded-xl shadow-sm border border-border flex items-center gap-2">
              <Calendar className="w-4 h-4 text-accent" />
              <span className="text-sm font-bold text-primary">
                {new Date().toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}
              </span>
            </div>
          </div>
        </div>

        {/* Top Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard 
            icon={<Trophy className="w-6 h-6 text-yellow-600" />}
            label="Sua Posição"
            value={`#${myStats?.rank || '-'}`}
            trend=""
            color="bg-yellow-50"
          />
          <StatCard 
            icon={<Flame className="w-6 h-6 text-orange-500" />}
            label="Pontos Habita"
            value={(myStats?.points || 0).toString()}
            trend="Total no Mês"
            color="bg-orange-50"
          />
          <StatCard 
            icon={<Target className="w-6 h-6 text-primary" />}
            label="Atingimento Meta"
            value={`${goalPercent}%`}
            trend={`${formatCurrency(myStats?.vgv || 0)} / ${formatCurrency(myStats?.goal || 0)}`}
            color="bg-primary/5"
          />
          <StatCard 
            icon={<TrendingUp className="w-6 h-6 text-green-500" />}
            label="Conversão Geral"
            value={`${myStats?.conversion || 0}%`}
            trend="Proposta -> Venda"
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
                    <tr key={broker.id} className={`hover:bg-muted/30 transition-colors ${broker.id === user?.id ? 'bg-primary/5' : ''}`}>
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
                      <td className="px-6 py-4 font-bold text-sm text-primary">{broker.salesCount}</td>
                      <td className="px-6 py-4 font-bold text-sm text-primary">
                        {formatCurrency(broker.vgv)}
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
                Meta de Faturamento Mensal
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="font-medium text-muted-foreground">Progresso Atual</span>
                  <span className="font-bold text-primary">{formatCurrency(myStats?.vgv || 0)} / {formatCurrency(myStats?.goal || 0)}</span>
                </div>
                <div className="h-3 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-primary rounded-full" style={{ width: `${goalPercent}%` }} />
                </div>
                <p className="text-[10px] text-muted-foreground text-center">
                  {remainingGoal > 0 ? (
                    <>Faltam <b>{formatCurrency(remainingGoal)}</b> para bater a meta do mês!</>
                  ) : (
                    <span className="text-green-600">Parabéns! Meta do mês atingida!</span>
                  )}
                </p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-3xl shadow-premium border border-border">
              <h3 className="font-bold text-primary mb-4 flex items-center gap-2">
                <Star className="w-5 h-5 text-accent" />
                Insígnias Desbloqueadas
              </h3>
              <div className="flex flex-wrap gap-3">
                {availableBadgesList.map((badgeName, i) => {
                  const unlocked = myBadges.includes(badgeName);
                  return (
                    <div 
                      key={i} 
                      title={badgeName}
                      className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all cursor-help border ${
                        unlocked 
                          ? 'bg-accent/10 text-accent border-accent/20' 
                          : 'bg-muted text-muted-foreground grayscale opacity-50 border-transparent'
                      }`}
                    >
                      <Medal size={24} />
                    </div>
                  );
                })}
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
    <p className="text-[10px] font-bold text-muted-foreground">{trend}</p>
  </div>
);

const Calendar = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>
);

function formatCurrency(value: number) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(value);
}
