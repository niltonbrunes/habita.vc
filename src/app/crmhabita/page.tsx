'use client';

import React from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useAuth } from '@/context/AuthContext';
import { 
  TrendingUp, 
  DollarSign, 
  UserPlus, 
  Calendar,
  ArrowUpRight,
  ChevronRight,
  CheckCircle2,
  Sparkles
} from 'lucide-react';

import { DashboardService, DashboardMetrics, RankingData } from '@/services/dashboard.service';
import { Lead, Task } from '@/types/database';
import { useEffect, useState } from 'react';

export default function DashboardPage() {
  const { profile, user } = useAuth();
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [hotLeads, setHotLeads] = useState<Lead[]>([]);
  const [ranking, setRanking] = useState<RankingData[]>([]);
  const [actions, setActions] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboardData() {
      if (!user) return;
      try {
        setLoading(true);
        const [m, hl, r, a] = await Promise.all([
          DashboardService.getMetrics(user.id),
          DashboardService.getHotLeads(user.id),
          DashboardService.getRanking(),
          DashboardService.getDailyActions(user.id)
        ]);
        setMetrics(m);
        setHotLeads(hl);
        setRanking(r);
        setActions(a);
      } catch (error) {
        console.error('Erro ao carregar dashboard:', error);
      } finally {
        setLoading(false);
      }
    }
    loadDashboardData();
  }, [user]);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(val);
  };

  const formatVGV = (val: number) => {
    if (val >= 1000000) return `R$ ${(val / 1000000).toFixed(1)}M`;
    if (val >= 1000) return `R$ ${(val / 1000).toFixed(0)}k`;
    return formatCurrency(val);
  };

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto space-y-12 pb-12">
        {/* Welcome Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-accent mb-2">Bem-vindo de volta</p>
            <h1 className="text-4xl font-black text-primary tracking-tight">Olá, {profile?.full_name?.split(' ')[0] || 'Corretor'}! 👋</h1>
            <p className="text-muted-foreground mt-2 font-medium">
              {metrics && metrics.goalProgress >= 100 
                ? 'Você já atingiu sua meta este mês! Parabéns! 🎉' 
                : `Sua performance está em ${metrics?.goalProgress || 0}% da meta este mês.`}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button className="px-6 py-3 bg-white border border-border rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-muted/50 transition-all">Relatórios</button>
            <button className="px-6 py-3 bg-primary text-white rounded-2xl text-xs font-black uppercase tracking-widest shadow-lg shadow-primary/20 hover:scale-105 transition-all">Nova Venda</button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <StatCard 
            title="Meta Mensal" 
            value={formatCurrency(metrics?.monthlyGoal || 0)} 
            subtext="Ganhos pretendidos"
            icon={<TargetIcon />}
            trend={loading ? null : "Target"}
            loading={loading}
          />
          <StatCard 
            title="Ganhos Reais" 
            value={formatCurrency(metrics?.realEarnings || 0)} 
            subtext={`${metrics?.goalProgress || 0}% da meta atingida`}
            icon={<DollarSign className="text-green-600" />}
            progress={metrics?.goalProgress}
            loading={loading}
          />
          <StatCard 
            title="VGV Necessário" 
            value={formatVGV(metrics?.vgvNeeded || 0)} 
            subtext="Para atingir a meta"
            icon={<TrendingUp className="text-blue-600" />}
            loading={loading}
          />
          <StatCard 
            title="Leads Ativos" 
            value={metrics?.activeLeads.toString() || '0'} 
            subtext={`${metrics?.newLeadsToday || 0} novos hoje`}
            icon={<UserPlus className="text-purple-600" />}
            trend={metrics?.newLeadsToday ? `+${metrics.newLeadsToday}` : null}
            loading={loading}
          />
        </div>

        <div className="grid lg:grid-cols-3 gap-12">
          {/* Daily Action Plan */}
          <div className="lg:col-span-2 space-y-10">
            <div className="bg-white p-10 rounded-[2.5rem] shadow-premium relative overflow-hidden">
              <div className="flex justify-between items-center mb-10">
                <div>
                  <h3 className="text-xl font-black text-primary flex items-center gap-3">
                    <Calendar className="text-accent" size={24} />
                    Plano de Ações Diárias
                  </h3>
                  <p className="text-xs text-muted-foreground mt-1 font-medium">Agenda de tarefas e contatos prioritários</p>
                </div>
                <div className="bg-accent/5 p-3 rounded-2xl">
                   <Sparkles className="text-accent" size={20} />
                </div>
              </div>
              
              <div className="space-y-4">
                {loading ? (
                  <div className="animate-pulse space-y-4">
                    {[1, 2, 3].map(i => <div key={i} className="h-20 bg-muted/50 rounded-2xl" />)}
                  </div>
                ) : actions.length > 0 ? (
                  actions.map(task => (
                    <ActionItem 
                      key={task.id}
                      title={task.title} 
                      desc={task.description || task.category}
                      status={task.completed ? 'done' : 'pending'}
                    />
                  ))
                ) : (
                  <div className="p-10 text-center border-2 border-dashed border-border/20 rounded-[2rem]">
                    <p className="text-sm font-bold text-muted-foreground">Nenhuma tarefa pendente para hoje. 🌴</p>
                  </div>
                )}
              </div>
            </div>

            {/* Recent Leads */}
            <div className="bg-white p-10 rounded-[2.5rem] shadow-premium">
              <div className="flex justify-between items-center mb-10">
                <h3 className="text-xl font-black text-primary">Leads Quentes (IA Score)</h3>
                <button className="text-[10px] font-black text-primary uppercase tracking-widest flex items-center gap-2 hover:text-accent transition-all">
                  Ver Funil Completo <ChevronRight size={14} />
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] border-b border-border">
                      <th className="pb-6">Lead</th>
                      <th className="pb-6">Estágio</th>
                      <th className="pb-6">Score</th>
                      <th className="pb-6 text-right">Ação</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/50">
                    {loading ? (
                      [1, 2, 3].map(i => (
                        <tr key={i} className="animate-pulse">
                          <td colSpan={4} className="py-6"><div className="h-10 bg-muted/50 rounded-xl w-full" /></td>
                        </tr>
                      ))
                    ) : hotLeads.length > 0 ? (
                      hotLeads.map(lead => (
                        <LeadRow key={lead.id} name={lead.person?.name || lead.name} stage={lead.status} score={lead.score} id={lead.id} />
                      ))
                    ) : (
                      <tr>
                        <td colSpan={4} className="py-12 text-center text-sm font-bold text-muted-foreground">Sem leads quentes no momento.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-8">
            <div className="bg-primary text-white p-8 rounded-[2.5rem] shadow-luxury relative overflow-hidden group">
              <div className="relative z-10">
                <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center mb-6 border border-white/10 group-hover:scale-110 transition-transform">
                  <Sparkles size={24} className="text-accent" />
                </div>
                <h3 className="text-xl font-black mb-2">Análise de Nicho</h3>
                <p className="text-sm text-white/60 mb-8 leading-relaxed font-medium">
                  Com base no seu ticket médio de {formatCurrency(profile?.avg_ticket || 0)}.
                </p>
                <div className="bg-white/5 p-6 rounded-3xl border border-white/10 backdrop-blur-sm">
                  <p className="text-[9px] font-black uppercase tracking-widest text-accent mb-2">Estratégia</p>
                  <p className="text-sm font-bold leading-snug">
                    {profile?.avg_ticket && profile.avg_ticket > 1000000 
                      ? 'Seu foco em Alto Padrão está dando resultados. Continue em lançamentos de luxo.' 
                      : 'Oportunidade: Tente elevar seu ticket médio explorando novos bairros.'}
                  </p>
                </div>
              </div>
              {/* Decoration */}
              <div className="absolute top-[-20%] right-[-20%] w-64 h-64 bg-accent/20 rounded-full blur-[80px] group-hover:bg-accent/30 transition-all duration-700" />
            </div>

            <div className="bg-white p-8 rounded-[2.5rem] shadow-premium border border-transparent">
              <h3 className="text-lg font-black text-primary mb-8">Ranking Mensal VGV</h3>
              <div className="space-y-2">
                {loading ? (
                  [1, 2, 3].map(i => <div key={i} className="h-14 bg-muted/50 rounded-2xl animate-pulse" />)
                ) : ranking.length > 0 ? (
                  ranking.map(item => (
                    <RankingItem key={item.name} pos={item.pos} name={item.name} value={item.value} active={item.name.includes('Você') || (profile?.full_name && item.name === profile.full_name)} />
                  ))
                ) : (
                  <p className="text-xs font-bold text-muted-foreground text-center py-4">Inicie as vendas do mês! 🚀</p>
                )}
              </div>
              <button className="w-full mt-8 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors border-t border-border/50">Ver Ranking Completo</button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

const StatCard = ({ title, value, subtext, icon, trend, progress, loading }: any) => (
  <div className="bg-white p-8 rounded-[2.5rem] shadow-premium hover:translate-y-[-4px] transition-all duration-300 group">
    {loading ? (
      <div className="animate-pulse space-y-4">
        <div className="flex justify-between items-start">
          <div className="w-12 h-12 bg-muted rounded-2xl" />
          <div className="w-10 h-6 bg-muted rounded-full" />
        </div>
        <div className="h-4 bg-muted rounded w-1/2" />
        <div className="h-8 bg-muted rounded w-3/4" />
      </div>
    ) : (
      <>
        <div className="flex justify-between items-start mb-8">
          <div className="p-4 bg-muted/50 rounded-2xl group-hover:bg-accent/10 transition-colors">{icon}</div>
          {trend && <span className="text-[10px] font-black text-green-600 bg-green-50 px-3 py-1.5 rounded-full">{trend}</span>}
        </div>
        <p className="text-xs font-black text-muted-foreground uppercase tracking-widest mb-2">{title}</p>
        <p className="text-3xl font-black text-primary tracking-tighter mb-4">{value}</p>
        {progress !== undefined ? (
          <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
            <div className="h-full bg-accent rounded-full shadow-[0_0_10px_rgba(217,119,6,0.3)]" style={{ width: `${progress}%` }} />
          </div>
        ) : (
          <p className="text-xs font-bold text-muted-foreground/60">{subtext}</p>
        )}
      </>
    )}
  </div>
);

const ActionItem = ({ title, desc, status }: any) => (
  <div className={`flex gap-6 p-6 rounded-[1.5rem] transition-all duration-300 ${status === 'done' ? 'bg-muted/30 opacity-40' : 'bg-muted/30 hover:bg-white hover:shadow-xl group'}`}>
    <div className={`mt-1 ${status === 'done' ? 'text-green-600' : 'text-primary/20 group-hover:text-accent transition-colors'}`}>
      <CheckCircle2 size={24} strokeWidth={3} />
    </div>
    <div>
      <p className={`text-base font-black text-primary ${status === 'done' ? 'line-through' : ''}`}>{title}</p>
      <p className="text-xs text-muted-foreground mt-1 font-medium leading-relaxed">{desc}</p>
    </div>
  </div>
);

const LeadRow = ({ name, stage, score, id }: any) => (
  <Link href={`/crmhabita/leads/${id}`} className="contents">
    <tr className="hover:bg-muted/20 transition-all group cursor-pointer">
      <td className="py-8 px-2 font-black text-base text-primary">{name}</td>
      <td className="py-8 px-2">
        <span className="text-[10px] font-black bg-primary/5 text-primary px-3 py-1.5 rounded-full uppercase tracking-widest">{stage}</span>
      </td>
      <td className="py-8 px-2">
        <div className="flex items-center gap-3">
          <div className="w-16 h-1.5 bg-muted rounded-full overflow-hidden">
            <div className={`h-full rounded-full ${score > 80 ? 'bg-green-500' : 'bg-accent'}`} style={{ width: `${score}%` }} />
          </div>
          <span className="text-xs font-black text-primary">{score}%</span>
        </div>
      </td>
      <td className="py-8 px-2 text-right">
        <div className="p-3 bg-muted/50 group-hover:bg-primary group-hover:text-white rounded-xl transition-all shadow-sm inline-block">
          <ArrowUpRight size={18} />
        </div>
      </td>
    </tr>
  </Link>
);

const RankingItem = ({ pos, name, value, active = false }: any) => (
  <div className={`flex items-center justify-between p-5 rounded-2xl transition-all ${active ? 'bg-accent text-white shadow-xl shadow-accent/20 scale-[1.05] z-10' : 'hover:bg-muted/50'}`}>
    <div className="flex items-center gap-4">
      <span className={`text-xs font-black w-6 ${active ? 'text-white' : 'text-muted-foreground'}`}>{pos}º</span>
      <span className={`text-sm font-bold ${active ? 'text-white' : 'text-primary'}`}>{name}</span>
    </div>
    <span className={`text-sm font-black ${active ? 'text-white' : 'text-primary'}`}>{value}</span>
  </div>
);


const TargetIcon = () => (
  <svg className="text-accent" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>
);

