'use client';

import React from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useAuth } from '@/context/AuthContext';
import {
  TrendingUp, DollarSign, UserPlus, Target,
  ArrowUpRight, Users, ChevronRight
} from 'lucide-react';
import { DashboardService, DashboardMetrics, RankingData } from '@/services/dashboard.service';
import { ProfilesService } from '@/services/profiles.service';
import { Lead, Task, Profile } from '@/types/database';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { FunnelSimulator } from '@/components/dashboard/FunnelSimulator';
import { ChannelPerformance } from '@/components/dashboard/ChannelPerformance';
import { SaleModal } from '@/components/leads/SaleModal';
import confetti from 'canvas-confetti';
import { supabase } from '@/lib/supabase';

export default function DashboardPage() {
  const { profile, user, isRole } = useAuth();
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [hotLeads, setHotLeads] = useState<Lead[]>([]);
  const [ranking, setRanking] = useState<RankingData[]>([]);
  const [actions, setActions] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSaleModalOpen, setIsSaleModalOpen] = useState(false);
  const [teamMembers, setTeamMembers] = React.useState<Profile[]>([]);
  const [teamStats, setTeamStats] = React.useState<any>(null);

  const loadDashboardData = async () => {
    if (!user || !profile) return;
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
      if (profile.role === 'manager') {
        const [team, stats] = await Promise.all([
          ProfilesService.getTeamByManager(profile.id),
          ProfilesService.getTeamStats(profile.id),
        ]);
        setTeamMembers(team);
        setTeamStats(stats);
      }
    } catch (error) {
      console.error('Erro ao carregar dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadDashboardData(); }, [user, profile?.id]);

  // Supabase Realtime
  useEffect(() => {
    if (!profile?.id) return;
    const channel = supabase
      .channel('schema-db-changes')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'leads', filter: `assigned_to_id=eq.${profile.id}` },
        (payload) => { setHotLeads(prev => [payload.new as Lead, ...prev]); }
      )
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'leads', filter: `assigned_to_id=eq.${profile.id}` },
        (payload) => {
          if (payload.new.status === 'won') {
            confetti({ particleCount: 150, spread: 100, origin: { y: 0.6 }, colors: ['#2563EB', '#93C5FD', '#FFFFFF'] });
          }
        }
      )
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [profile?.id]);

  const fmt = (val: number) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(val);

  const fmtVGV = (val: number) => {
    if (val >= 1000000) return `R$ ${(val / 1000000).toFixed(1)}M`;
    if (val >= 1000) return `R$ ${(val / 1000).toFixed(0)}k`;
    return fmt(val);
  };

  return (
    <DashboardLayout
      actions={
        <div className="flex items-center gap-2">
          <button className="h-[32px] px-4 text-[11px] font-semibold text-slate-600 border border-[#E2E8F0] rounded-[8px] bg-white hover:bg-slate-50 transition-colors whitespace-nowrap">
            Relatórios
          </button>
          <button
            onClick={() => setIsSaleModalOpen(true)}
            className="h-[32px] px-4 text-[11px] font-semibold text-white bg-blue-600 rounded-[8px] hover:bg-blue-700 transition-colors flex items-center gap-1.5 whitespace-nowrap"
          >
            + Nova Venda
          </button>
        </div>
      }
    >
      {/* ── 3-COLUMN LAYOUT ── */}
      <div className="flex h-full min-h-0">

        {/* ── LEFT PANEL: Funil + Indicadores + Canais ── */}
        <aside className="w-[220px] flex-shrink-0 bg-white border-r border-[#E2E8F0] flex flex-col overflow-y-auto hidden lg:flex">

          {/* FUNIL */}
          <div className="p-4 border-b border-[#F1F5F9]">
            <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-slate-400 mb-3">Funil de Vendas</p>
            <FunnelBar label="Base"        color="bg-blue-500"   pct={100} count={metrics?.activeLeads || 0} loading={loading} />
            <FunnelBar label="Qualificação" color="bg-orange-500" pct={60}  count={Math.round((metrics?.activeLeads || 0) * 0.6)} loading={loading} />
            <FunnelBar label="Visita"      color="bg-purple-500" pct={40}  count={Math.round((metrics?.activeLeads || 0) * 0.4)} loading={loading} />
            <FunnelBar label="Proposta"    color="bg-pink-500"   pct={25}  count={Math.round((metrics?.activeLeads || 0) * 0.25)} loading={loading} />
            <FunnelBar label="Negociação"  color="bg-green-500"  pct={11}  count={Math.round((metrics?.activeLeads || 0) * 0.11)} loading={loading} />
          </div>

          {/* INDICADORES */}
          <div className="p-4 border-b border-[#F1F5F9]">
            <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-slate-400 mb-3">Indicadores</p>
            <div className="grid grid-cols-2 gap-2">
              <MiniStat label="Meta" value={`${metrics?.goalProgress || 0}%`} color="text-blue-600" sub="do mês" loading={loading} />
              <MiniStat label="Contatos" value={metrics?.newLeadsToday?.toString() || '0'} color="text-green-600" sub="hoje" loading={loading} />
            </div>
          </div>

          {/* CANAIS */}
          <div className="p-4 flex-1">
            <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-slate-400 mb-3">Canal de Origem</p>
            <ChannelPerformance />
          </div>
        </aside>

        {/* ── CENTER: Stats + Imóveis + Oportunidades ── */}
        <div className="flex-1 min-w-0 overflow-y-auto p-5 space-y-5">

          {/* STATS BAR */}
          <div className="grid grid-cols-2 xl:grid-cols-4 gap-3">
            <StatCard label="Meta Mensal"    value={fmt(metrics?.monthlyGoal || 0)}         delta="+3 este mês"              up   loading={loading} />
            <StatCard label="VGV Realizado"  value={fmtVGV(metrics?.realVgv || 0)}           delta={`${metrics?.goalProgress || 0}% da meta`} up loading={loading} />
            <StatCard label="Leads Ativos"   value={(metrics?.activeLeads || 0).toString()}  delta={`${metrics?.newLeadsToday || 0} novos hoje`} up loading={loading} />
            <StatCard label="Em Negociação"  value={(metrics?.newLeadsToday || 0).toString()}  delta="propostas enviadas"       up   loading={loading} />
          </div>

          {/* IMÓVEIS / HOT LEADS */}
          <SectionCard title="Leads Quentes" link={{ label: 'Ver todos', href: '/crmhabita/leads' }}>
            {loading ? (
              [1,2,3,4].map(i => <SkeletonRow key={i} />)
            ) : hotLeads.length > 0 ? (
              hotLeads.slice(0, 6).map(lead => (
                <LeadRow
                  key={lead.id}
                  id={lead.id}
                  name={lead.person?.name || lead.name}
                  stage={lead.status}
                  score={lead.score}
                />
              ))
            ) : (
              <div className="py-8 text-center">
                <p className="text-[12px] text-slate-400">Nenhum lead quente no momento.</p>
              </div>
            )}
          </SectionCard>

          {/* RANKING */}
          <SectionCard title="Ranking Mensal VGV" link={{ label: 'Ver completo', href: '/crmhabita/ranking' }}>
            {loading ? (
              [1,2,3].map(i => <SkeletonRow key={i} />)
            ) : ranking.length > 0 ? (
              ranking.map(item => (
                <RankingRow
                  key={item.name}
                  pos={item.pos}
                  name={item.name}
                  value={item.value}
                  active={!!(profile?.full_name && item.name === profile.full_name)}
                />
              ))
            ) : (
              <div className="py-8 text-center">
                <p className="text-[12px] text-slate-400">Inicie as vendas do mês!</p>
              </div>
            )}
          </SectionCard>

          {/* FUNNEL SIMULATOR */}
          <SectionCard title="Planejamento — Simulador de Funil">
            <div className="p-1">
              <FunnelSimulator />
            </div>
          </SectionCard>

        </div>

        {/* ── RIGHT: Agenda + Oportunidades ── */}
        <aside className="w-[280px] flex-shrink-0 border-l border-[#E2E8F0] bg-white overflow-y-auto hidden xl:flex flex-col">

          <SectionCard title="Agenda do dia" link={{ label: 'Ver tudo', href: '/crmhabita/agenda' }} noBorder>
            {actions.length > 0 ? actions.slice(0, 6).map((task, i) => (
              <AgendaRow key={i} time="—" type={task.category || 'Tarefa'} client={task.title} detail={task.description || ''} />
            )) : (
              <>
                <AgendaRow time="09:00" type="Visita"    client="Lead #1" detail="Aguardando confirmação" color="blue" />
                <AgendaRow time="11:00" type="Proposta"  client="Lead #2" detail="Enviar proposta comercial" color="orange" />
                <AgendaRow time="14:00" type="Reunião"   client="Lead #3" detail="Captação de imóvel" color="blue" />
                <AgendaRow time="16:30" type="Escritura" client="Lead #4" detail="Fechamento contrato" color="green" />
              </>
            )}
          </SectionCard>

          <div className="border-t border-[#E2E8F0]">
            <SectionCard title="Oportunidades em andamento" link={{ label: 'Ver todas', href: '/crmhabita/leads' }} noBorder>
              {hotLeads.slice(0, 4).map(lead => (
                <OppRow
                  key={lead.id}
                  id={lead.id}
                  name={lead.person?.name || lead.name}
                  prop="Lead ativo"
                  stage={lead.status}
                />
              ))}
              {hotLeads.length === 0 && !loading && (
                <div className="py-6 text-center">
                  <p className="text-[12px] text-slate-400">Nenhuma oportunidade ativa.</p>
                </div>
              )}
            </SectionCard>
          </div>
        </aside>
      </div>

      <SaleModal isOpen={isSaleModalOpen} onClose={() => setIsSaleModalOpen(false)} onSuccess={loadDashboardData} />
    </DashboardLayout>
  );
}

/* ── SUB-COMPONENTS ── */

const FunnelBar = ({ label, color, pct, count, loading }: any) => (
  <div className="mb-3">
    <div className="flex justify-between mb-1">
      <span className="text-[12px] font-semibold text-slate-600 flex items-center gap-1.5">
        <span className={`w-2 h-2 rounded-full flex-shrink-0 ${color}`} />
        {label}
      </span>
      <span className="text-[12px] font-bold text-slate-800">{loading ? '—' : count}</span>
    </div>
    <div className="h-[5px] bg-slate-100 rounded-full overflow-hidden">
      <div className={`h-full rounded-full ${color}`} style={{ width: `${pct}%` }} />
    </div>
  </div>
);

const MiniStat = ({ label, value, color, sub, loading }: any) => (
  <div className="bg-slate-50 border border-[#E2E8F0] rounded-[10px] p-3">
    <p className="text-[10px] font-bold uppercase tracking-[0.07em] text-slate-400 mb-1.5">{label}</p>
    <p className={`text-[20px] font-extrabold leading-none ${color}`}>{loading ? '—' : value}</p>
    <p className="text-[10px] text-slate-400 mt-1">{sub}</p>
  </div>
);

const StatCard = ({ label, value, delta, up, loading }: any) => (
  <div className="bg-white border border-[#E2E8F0] rounded-[12px] p-4">
    <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-slate-400 mb-2">{label}</p>
    {loading
      ? <div className="h-7 w-24 bg-slate-100 rounded animate-pulse" />
      : <p className="text-[26px] font-extrabold text-slate-900 leading-none">{value}</p>
    }
    <p className={`text-[11px] font-semibold mt-1.5 flex items-center gap-1 ${up ? 'text-green-600' : 'text-orange-500'}`}>
      {up ? '↑' : '↓'} {delta}
    </p>
  </div>
);

const SectionCard = ({ title, link, children, noBorder }: any) => (
  <div className={noBorder ? '' : 'bg-white border border-[#E2E8F0] rounded-[12px] overflow-hidden'}>
    <div className={`flex items-center justify-between px-4 py-3 ${noBorder ? '' : 'border-b border-[#F1F5F9]'}`}>
      <p className="text-[13px] font-bold text-slate-900">{title}</p>
      {link && (
        <Link href={link.href} className="text-[11px] font-semibold text-blue-600 hover:underline">
          {link.label} →
        </Link>
      )}
    </div>
    {children}
  </div>
);

const LeadRow = ({ name, stage, score, id }: any) => (
  <Link href={`/crmhabita/leads/${id}`}
    className="flex items-center gap-3 px-4 py-2.5 hover:bg-slate-50 transition-colors border-b border-[#F1F5F9] last:border-0">
    <div className="flex-1 min-w-0">
      <p className="text-[12px] font-semibold text-slate-800 truncate">{name}</p>
    </div>
    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-500 uppercase tracking-wide flex-shrink-0">{stage}</span>
    <div className="flex items-center gap-1.5 flex-shrink-0">
      <div className="w-14 h-[4px] bg-slate-100 rounded-full overflow-hidden">
        <div className={`h-full rounded-full ${score > 80 ? 'bg-green-500' : 'bg-blue-500'}`} style={{ width: `${score}%` }} />
      </div>
      <span className="text-[10px] font-bold text-slate-500">{score}%</span>
    </div>
    <ArrowUpRight size={14} className="text-slate-300 flex-shrink-0" />
  </Link>
);

const RankingRow = ({ pos, name, value, active }: any) => (
  <div className={`flex items-center gap-3 px-4 py-2.5 border-b border-[#F1F5F9] last:border-0 transition-colors ${active ? 'bg-blue-50' : 'hover:bg-slate-50'}`}>
    <span className="text-[11px] font-bold text-slate-400 w-4 flex-shrink-0">{pos}</span>
    <span className={`text-[12px] font-semibold flex-1 ${active ? 'text-blue-700' : 'text-slate-800'}`}>{name}</span>
    <span className={`text-[12px] font-bold ${active ? 'text-blue-600' : 'text-slate-600'}`}>{value}</span>
  </div>
);

const AgendaRow = ({ time, type, client, detail, color = 'blue' }: any) => {
  const colors: Record<string, string> = { blue: 'text-blue-600', orange: 'text-orange-600', green: 'text-green-600', purple: 'text-purple-600' };
  return (
    <div className="flex gap-3 px-4 py-2.5 hover:bg-slate-50 transition-colors border-b border-[#F1F5F9] last:border-0 cursor-pointer">
      <p className="text-[10px] font-bold text-slate-400 w-10 flex-shrink-0 pt-0.5">{time}</p>
      <div className="flex-1 min-w-0">
        <p className={`text-[11px] font-bold mb-0.5 ${colors[color] || colors.blue}`}>▸ {type}</p>
        <p className="text-[12px] font-semibold text-slate-800 truncate">{client}</p>
        <p className="text-[11px] text-slate-400 truncate">{detail}</p>
      </div>
    </div>
  );
};

const OppRow = ({ id, name, prop, stage }: any) => {
  const stageStyle: Record<string, string> = {
    lead: 'bg-blue-50 text-blue-600',
    qualified: 'bg-orange-50 text-orange-600',
    proposal: 'bg-purple-50 text-purple-600',
    won: 'bg-green-50 text-green-600',
  };
  return (
    <div className="flex items-center gap-2.5 px-4 py-2.5 hover:bg-slate-50 transition-colors border-b border-[#F1F5F9] last:border-0 cursor-pointer">
      <div className="flex-1 min-w-0">
        <p className="text-[12px] font-semibold text-slate-800 truncate">{name}</p>
        <p className="text-[11px] text-slate-400 truncate">{prop}</p>
      </div>
      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex-shrink-0 uppercase tracking-wide ${stageStyle[stage] || 'bg-slate-100 text-slate-500'}`}>
        {stage}
      </span>
      <Link href={`/crmhabita/leads/${id}`} className="text-[11px] font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-[6px] flex-shrink-0 hover:bg-blue-100 transition-colors">
        →
      </Link>
    </div>
  );
};

const SkeletonRow = () => (
  <div className="flex items-center gap-3 px-4 py-3 border-b border-[#F1F5F9]">
    <div className="h-3 bg-slate-100 rounded flex-1 animate-pulse" />
    <div className="h-3 w-16 bg-slate-100 rounded animate-pulse" />
  </div>
);

const TargetIcon = () => (
  <svg className="text-blue-500" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>
  </svg>
);
