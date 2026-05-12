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

export default function DashboardPage() {
  const { profile } = useAuth();

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto space-y-12 pb-12">
        {/* Welcome Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-accent mb-2">Bem-vindo de volta</p>
            <h1 className="text-4xl font-black text-primary tracking-tight">Olá, {profile?.full_name?.split(' ')[0] || 'Corretor'}! 👋</h1>
            <p className="text-muted-foreground mt-2 font-medium">Sua performance está <span className="text-green-600 font-bold">12% acima</span> da meta este mês.</p>
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
            value="R$ 15.000" 
            subtext="Ganhos pretendidos"
            icon={<TargetIcon />}
            trend="+12%"
          />
          <StatCard 
            title="Ganhos Reais" 
            value="R$ 8.450" 
            subtext="56% da meta atingida"
            icon={<DollarSign className="text-green-600" />}
            progress={56}
          />
          <StatCard 
            title="VGV Necessário" 
            value="R$ 1.2M" 
            subtext="Falta R$ 450k"
            icon={<TrendingUp className="text-blue-600" />}
          />
          <StatCard 
            title="Leads Ativos" 
            value="24" 
            subtext="5 novos hoje"
            icon={<UserPlus className="text-purple-600" />}
            trend="+5"
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
                  <p className="text-xs text-muted-foreground mt-1 font-medium">Recomendações da Inteligência Habita para hoje</p>
                </div>
                <div className="bg-accent/5 p-3 rounded-2xl">
                   <Sparkles className="text-accent" size={20} />
                </div>
              </div>
              
              <div className="space-y-4">
                <ActionItem 
                  title="Falar com 5 novos leads" 
                  desc="Baseado na sua meta de R$ 15k, você precisa de mais volume de contato."
                  status="pending"
                />
                <ActionItem 
                  title="Agendar visita: Condomínio Vita" 
                  desc="Lead 'Ricardo Santos' demonstrou alto interesse (Score 85%)."
                  status="done"
                />
                <ActionItem 
                  title="Seguimento de proposta" 
                  desc="Revisar proposta do apto no Leblon enviado ontem."
                  status="pending"
                />
                <ActionItem 
                  title="Captar 2 novas indicações" 
                  desc="Seu histórico mostra que indicações convertem 3x mais."
                  status="pending"
                />
              </div>
            </div>

            {/* Recent Leads */}
            <div className="bg-white p-10 rounded-[2.5rem] shadow-premium">
              <div className="flex justify-between items-center mb-10">
                <h3 className="text-xl font-black text-primary">Leads Quentes</h3>
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
                    <LeadRow name="Ricardo Santos" stage="Visita" score={85} />
                    <LeadRow name="Amanda Lima" stage="Apresentação" score={72} />
                    <LeadRow name="Bruno Mendes" stage="Proposta" score={94} />
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
                <h3 className="text-xl font-black mb-2">Sugestão de Nicho</h3>
                <p className="text-sm text-white/60 mb-8 leading-relaxed font-medium">
                  Sua performance em <span className="text-accent font-bold">Alto Padrão</span> está 40% acima da média.
                </p>
                <div className="bg-white/5 p-6 rounded-3xl border border-white/10 backdrop-blur-sm">
                  <p className="text-[9px] font-black uppercase tracking-widest text-accent mb-2">Estratégia</p>
                  <p className="text-sm font-bold leading-snug">Focar em lançamentos acima de R$ 2M no Setor Marista.</p>
                </div>
              </div>
              {/* Decoration */}
              <div className="absolute top-[-20%] right-[-20%] w-64 h-64 bg-accent/20 rounded-full blur-[80px] group-hover:bg-accent/30 transition-all duration-700" />
            </div>

            <div className="bg-white p-8 rounded-[2.5rem] shadow-premium border border-transparent">
              <h3 className="text-lg font-black text-primary mb-8">Seu Ranking</h3>
              <div className="space-y-2">
                <RankingItem pos={1} name="Ana Paula" value="R$ 125k" />
                <RankingItem pos={2} name="Você" value="R$ 84k" active />
                <RankingItem pos={3} name="Carlos Ed." value="R$ 72k" />
              </div>
              <button className="w-full mt-8 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors border-t border-border/50">Ver Ranking Completo</button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

const StatCard = ({ title, value, subtext, icon, trend, progress }: any) => (
  <div className="bg-white p-8 rounded-[2.5rem] shadow-premium hover:translate-y-[-4px] transition-all duration-300 group">
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

const LeadRow = ({ name, stage, score }: any) => (
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
      <button className="p-3 bg-muted/50 hover:bg-primary hover:text-white rounded-xl transition-all shadow-sm">
        <ArrowUpRight size={18} />
      </button>
    </td>
  </tr>
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

