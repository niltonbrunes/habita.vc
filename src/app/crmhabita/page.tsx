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
  CheckCircle2
} from 'lucide-react';

export default function DashboardPage() {
  const { profile } = useAuth();

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Welcome Section */}
        <div>
          <h1 className="text-3xl font-bold mb-2">Olá, {profile?.full_name?.split(' ')[0] || 'Corretor'}! 👋</h1>
          <p className="text-muted-foreground">Aqui está o resumo da sua performance e o plano para hoje.</p>
        </div>

        {/* Stats Grid - The "Salary/Earnings Engine" summary */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Daily Action Plan - "O que fazer hoje" */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white p-6 rounded-2xl shadow-premium border border-border">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold flex items-center gap-2">
                  <Calendar className="text-accent" size={20} />
                  Plano de Ações Diárias
                </h3>
                <span className="text-xs font-bold text-accent bg-accent/10 px-2 py-1 rounded-full uppercase">Inteligência Habita</span>
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

            {/* Recent Leads/CRM Preview */}
            <div className="bg-white p-6 rounded-2xl shadow-premium border border-border">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold">Leads Quentes</h3>
                <button className="text-sm font-bold text-primary flex items-center gap-1 hover:text-accent transition-colors">
                  Ver Funil Completo <ChevronRight size={16} />
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="text-xs font-bold text-muted-foreground uppercase tracking-wider border-b border-border pb-4">
                      <th className="pb-4">Lead</th>
                      <th className="pb-4">Estágio</th>
                      <th className="pb-4">Score</th>
                      <th className="pb-4 text-right">Ação</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    <LeadRow name="Ricardo Santos" stage="Visita" score={85} />
                    <LeadRow name="Amanda Lima" stage="Apresentação" score={72} />
                    <LeadRow name="Bruno Mendes" stage="Proposta" score={94} />
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Right Column - Gamification/Ranking & Niche Suggestion */}
          <div className="space-y-6">
            <div className="bg-primary text-white p-6 rounded-2xl shadow-luxury relative overflow-hidden">
              <div className="relative z-10">
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                  <TrendingUp size={20} className="text-accent" />
                  Sugestão de Nicho
                </h3>
                <p className="text-sm text-white/70 mb-4 leading-relaxed">
                  Sua performance em <span className="text-white font-bold italic">Alto Padrão</span> está 40% acima da média.
                </p>
                <div className="bg-white/10 p-4 rounded-xl border border-white/10">
                  <p className="text-xs font-bold uppercase tracking-widest text-accent mb-1">Estratégia Recomendada</p>
                  <p className="text-sm font-medium">Focar em lançamentos acima de R$ 2M no Setor Marista.</p>
                </div>
              </div>
              {/* Decorative element */}
              <div className="absolute top-[-20%] right-[-20%] w-40 h-40 bg-white/5 rounded-full blur-2xl" />
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-premium border border-border">
              <h3 className="text-lg font-bold mb-4">Seu Ranking</h3>
              <div className="space-y-4">
                <RankingItem pos={1} name="Ana Paula" value="R$ 125k" />
                <RankingItem pos={2} name="Você" value="R$ 84k" active />
                <RankingItem pos={3} name="Carlos Ed." value="R$ 72k" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

const StatCard = ({ title, value, subtext, icon, trend, progress }: any) => (
  <div className="bg-white p-6 rounded-2xl shadow-premium border border-border hover:scale-[1.02] transition-all">
    <div className="flex justify-between items-start mb-4">
      <div className="p-2 bg-muted rounded-xl">{icon}</div>
      {trend && <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-full">{trend}</span>}
    </div>
    <p className="text-sm font-medium text-muted-foreground mb-1">{title}</p>
    <p className="text-2xl font-bold text-primary mb-2">{value}</p>
    {progress !== undefined ? (
      <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
        <div className="h-full bg-accent rounded-full" style={{ width: `${progress}%` }} />
      </div>
    ) : (
      <p className="text-xs font-medium text-muted-foreground">{subtext}</p>
    )}
  </div>
);

const ActionItem = ({ title, desc, status }: any) => (
  <div className={`flex gap-4 p-4 rounded-xl border transition-all ${status === 'done' ? 'bg-muted/50 border-transparent opacity-60' : 'bg-white border-border hover:shadow-md'}`}>
    <div className={`mt-0.5 ${status === 'done' ? 'text-green-600' : 'text-muted-foreground'}`}>
      <CheckCircle2 size={20} />
    </div>
    <div>
      <p className={`text-sm font-bold ${status === 'done' ? 'line-through' : ''}`}>{title}</p>
      <p className="text-xs text-muted-foreground mt-1">{desc}</p>
    </div>
  </div>
);

const LeadRow = ({ name, stage, score }: any) => (
  <tr className="hover:bg-muted/30 transition-colors group">
    <td className="py-4 font-bold text-sm text-primary">{name}</td>
    <td className="py-4">
      <span className="text-xs font-bold bg-primary/5 text-primary px-2 py-1 rounded-full">{stage}</span>
    </td>
    <td className="py-4">
      <div className="flex items-center gap-2">
        <div className="w-12 h-1.5 bg-muted rounded-full overflow-hidden">
          <div className={`h-full rounded-full ${score > 80 ? 'bg-green-500' : 'bg-accent'}`} style={{ width: `${score}%` }} />
        </div>
        <span className="text-xs font-bold">{score}%</span>
      </div>
    </td>
    <td className="py-4 text-right">
      <button className="p-1.5 hover:bg-primary hover:text-white rounded-lg transition-all">
        <ArrowUpRight size={16} />
      </button>
    </td>
  </tr>
);

const RankingItem = ({ pos, name, value, active = false }: any) => (
  <div className={`flex items-center justify-between p-3 rounded-xl ${active ? 'bg-accent/10 border border-accent/20' : ''}`}>
    <div className="flex items-center gap-3">
      <span className={`text-sm font-bold w-5 ${active ? 'text-accent' : 'text-muted-foreground'}`}>{pos}º</span>
      <span className={`text-sm font-bold ${active ? 'text-primary' : 'text-primary/70'}`}>{name}</span>
    </div>
    <span className="text-sm font-bold text-primary">{value}</span>
  </div>
);

const TargetIcon = () => (
  <svg className="text-accent" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>
);
