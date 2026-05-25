'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { ProfilesService } from '@/services/profiles.service';
import { Profile, TeamNode } from '@/types/database';
import { useAuth } from '@/context/AuthContext';
import {
  Users, ShieldCheck, Target, Loader2, Search, Filter,
  MoreVertical, Ban, UserCheck, ChevronRight, Award,
  Building2, GitBranch, LayoutGrid, List
} from 'lucide-react';
import { InviteMemberModal } from '@/components/team/InviteMemberModal';
import { AssignManagerModal } from '@/components/team/AssignManagerModal';
import { TeamPerformancePanel } from '@/components/team/TeamPerformancePanel';

const ROLE_CONFIG: Record<string, { label: string; color: string; bg: string; border: string }> = {
  broker:   { label: 'Corretor',      color: 'text-body',  bg: 'bg-bg',  border: 'border-slate-200' },
  manager:  { label: 'Gerente',       color: 'text-blue-600',   bg: 'bg-blue-50',   border: 'border-blue-200' },
  director: { label: 'Diretor',       color: 'text-purple-600', bg: 'bg-purple-50', border: 'border-purple-200' },
  admin:    { label: 'Administrador', color: 'text-red-600',    bg: 'bg-red-50',    border: 'border-red-200' },
};

function formatCurrency(v: number) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(v);
}

/* ───────────── Org Chart Node ───────────── */
function OrgNode({ node, depth = 0, onAssign }: { node: TeamNode; depth?: number; onAssign: (p: Profile) => void }) {
  const [expanded, setExpanded] = useState(true);
  const cfg = ROLE_CONFIG[node.profile.role] || ROLE_CONFIG.broker;
  const hasReports = node.directReports.length > 0;

  return (
    <div className={`${depth > 0 ? 'ml-8 pl-6 border-l-2 border-border/30' : ''}`}>
      <div className={`group flex items-center gap-3 p-4 rounded-2xl border-2 ${cfg.border} ${cfg.bg} hover:shadow-md transition-all mb-3 relative`}>
        {/* Avatar */}
        <div className={`w-11 h-11 rounded-xl ${cfg.bg} flex items-center justify-center font-black text-sm overflow-hidden border-2 border-white shadow-sm flex-shrink-0`}>
          {node.profile.avatar_url
            ? <img src={node.profile.avatar_url} alt="" className="w-full h-full object-cover" />
            : node.profile.full_name.substring(0, 2).toUpperCase()
          }
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <p className={`font-black text-sm ${cfg.color} truncate`}>{node.profile.full_name}</p>
            <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full border ${cfg.bg} ${cfg.color} ${cfg.border}`}>
              {cfg.label}
            </span>
            {node.profile.status === 'inactive' && (
              <span className="text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full bg-red-50 text-red-500 border border-red-200">Inativo</span>
            )}
          </div>
          <p className="text-[10px] text-muted-foreground font-medium truncate">{node.profile.email}</p>
          {node.directReports.length > 0 && (
            <p className="text-[10px] font-bold text-muted-foreground/60 mt-0.5">{node.directReports.length} subordinado{node.directReports.length > 1 ? 's' : ''}</p>
          )}
        </div>

        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          {node.profile.role === 'broker' && (
            <button
              onClick={() => onAssign(node.profile)}
              title="Atribuir Gerente"
              className="p-2 rounded-xl bg-surface border border-border/50 hover:bg-blue-primary hover:text-white hover:border-primary transition-all text-muted-foreground"
            >
              <UserCheck size={14} />
            </button>
          )}
          {hasReports && (
            <button
              onClick={() => setExpanded(e => !e)}
              className="p-2 rounded-xl bg-surface border border-border/50 hover:bg-blue-primary hover:text-white hover:border-primary transition-all text-muted-foreground"
            >
              <ChevronRight size={14} className={`transition-transform ${expanded ? 'rotate-90' : ''}`} />
            </button>
          )}
        </div>
      </div>

      {expanded && hasReports && (
        <div className="mb-3">
          {node.directReports.map(child => (
            <OrgNode key={child.profile.id} node={child} depth={depth + 1} onAssign={onAssign} />
          ))}
        </div>
      )}
    </div>
  );
}

/* ───────────── Main Page ───────────── */
export default function EquipePage() {
  const { profile: myProfile, isRole } = useAuth();

  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [orgChart, setOrgChart] = useState<TeamNode[]>([]);
  const [myTeam, setMyTeam] = useState<Profile[]>([]);
  const [teamStats, setTeamStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [view, setView] = useState<'list' | 'org'>('list');

  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [assignTarget, setAssignTarget] = useState<Profile | null>(null);

  const isAdminOrDirector = isRole(['admin', 'director']);
  const isManagerView = isRole(['manager']) && !isAdminOrDirector;

  const load = async () => {
    setLoading(true);
    try {
      if (isAdminOrDirector) {
        const [all, chart] = await Promise.all([
          ProfilesService.getAll(),
          ProfilesService.getOrgChart(),
        ]);
        setProfiles(all);
        setOrgChart(chart);
      } else if (isManagerView && myProfile) {
        const [all, team, stats] = await Promise.all([
          ProfilesService.getAll(),
          ProfilesService.getTeamByManager(myProfile.id),
          ProfilesService.getTeamStats(myProfile.id),
        ]);
        setProfiles(all);
        setMyTeam(team);
        setTeamStats(stats);
      } else {
        const all = await ProfilesService.getAll();
        setProfiles(all);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (myProfile) load();
  }, [myProfile]);

  const filtered = useMemo(() => {
    const base = isManagerView ? myTeam : profiles;
    if (!search.trim()) return base;
    const q = search.toLowerCase();
    return base.filter(p =>
      p.full_name.toLowerCase().includes(q) ||
      (p.email || '').toLowerCase().includes(q) ||
      (p.creci || '').toLowerCase().includes(q)
    );
  }, [profiles, myTeam, search, isManagerView]);

  // Computed stats
  const totalManagers = profiles.filter(p => p.role === 'manager' || p.role === 'director').length;
  const totalActive = profiles.filter(p => p.status !== 'inactive').length;

  // Broker stats for TeamPerformancePanel (simplified - without real sales data here)
  const brokerStatsForPanel = myTeam.map(b => ({
    profile: b,
    activeLeads: 0,
    monthlySales: 0,
    monthlyVgv: 0,
    goalPercent: b.earnings_goal_monthly > 0 ? 0 : 0,
  }));

  const handleRoleChange = async (member: Profile, newRole: string) => {
    try {
      await ProfilesService.update(member.id, { role: newRole as any });
      await load();
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggleStatus = async (member: Profile) => {
    try {
      await ProfilesService.update(member.id, { status: member.status === 'inactive' ? 'active' : 'inactive' });
      await load();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-heading tracking-tight">
              {isManagerView ? 'Minha Equipe' : 'Gestão de Equipe'}
            </h1>
            <p className="text-muted-foreground font-medium mt-1">
              {isManagerView
                ? 'Acompanhe a performance e gerencie sua equipe de corretores.'
                : 'Estrutura hierárquica e gestão completa da imobiliária.'}
            </p>
          </div>
          <div className="flex items-center gap-3">
            {isAdminOrDirector && (
              <>
                <button
                  onClick={() => setView('list')}
                  className={`p-3 rounded-xl transition-all ${view === 'list' ? 'bg-blue-primary text-white shadow-lg' : 'bg-muted/30 text-muted-foreground hover:bg-muted'}`}
                  title="Vista em Lista"
                >
                  <List size={18} />
                </button>
                <button
                  onClick={() => setView('org')}
                  className={`p-3 rounded-xl transition-all ${view === 'org' ? 'bg-blue-primary text-white shadow-lg' : 'bg-muted/30 text-muted-foreground hover:bg-muted'}`}
                  title="Organograma"
                >
                  <GitBranch size={18} />
                </button>
              </>
            )}
            {isAdminOrDirector && (
              <button
                onClick={() => setIsInviteOpen(true)}
                className="flex items-center gap-2 px-6 py-3 bg-blue-primary text-white rounded-xl font-black text-sm hover:bg-blue-primary/90 transition-all shadow-lg"
              >
                <Users size={18} /> Convidar Membro
              </button>
            )}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              label: isManagerView ? 'Corretores na Equipe' : 'Total de Usuários',
              value: isManagerView ? myTeam.length : profiles.length,
              icon: <Users size={32} />,
              color: 'text-primary',
              bg: 'bg-blue-primary/5',
            },
            {
              label: 'Usuários Ativos',
              value: isManagerView ? myTeam.filter(p => p.status !== 'inactive').length : totalActive,
              icon: <ShieldCheck size={32} />,
              color: 'text-green-500',
              bg: 'bg-green-50',
            },
            {
              label: isManagerView ? 'Leads Ativos da Equipe' : 'Cargos de Gestão',
              value: isManagerView ? (teamStats?.activeLeads ?? '—') : totalManagers,
              icon: <Target size={32} />,
              color: 'text-accent',
              bg: 'bg-accent/5',
            },
          ].map((s, i) => (
            <div key={i} className="bg-surface p-8 rounded-xl shadow-card border-2 border-border flex items-center justify-between">
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">{s.label}</p>
                <p className={`text-4xl font-black ${s.color}`}>{s.value}</p>
              </div>
              <div className={`w-16 h-16 ${s.bg} rounded-[1.5rem] flex items-center justify-center ${s.color}`}>
                {s.icon}
              </div>
            </div>
          ))}
        </div>

        {/* Manager view: Team Performance Panel */}
        {isManagerView && !loading && (
          <div className="bg-surface rounded-xl shadow-card border-2 border-border p-8">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600">
                <Award size={24} />
              </div>
              <div>
                <h2 className="text-xl font-black text-primary">Performance da Equipe</h2>
                <p className="text-xs font-bold text-muted-foreground">Acompanhamento em tempo real dos seus corretores</p>
              </div>
            </div>
            <TeamPerformancePanel
              brokerStats={brokerStatsForPanel}
              teamGoal={myProfile?.team_goal_monthly || 0}
              teamVgv={teamStats?.monthlyVgv || 0}
              teamLeads={teamStats?.activeLeads || 0}
              teamSales={teamStats?.monthlySales || 0}
            />
          </div>
        )}

        {/* Org Chart View (Admin/Director) */}
        {isAdminOrDirector && view === 'org' && (
          <div className="bg-surface rounded-xl shadow-card border-2 border-border p-8">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-12 rounded-2xl bg-purple-50 flex items-center justify-center text-purple-600">
                <Building2 size={24} />
              </div>
              <div>
                <h2 className="text-xl font-black text-primary">Organograma</h2>
                <p className="text-xs font-bold text-muted-foreground">Estrutura hierárquica da imobiliária</p>
              </div>
            </div>

            {loading ? (
              <div className="p-20 flex flex-col items-center justify-center">
                <Loader2 className="animate-spin text-primary mb-4" size={40} />
                <p className="font-bold text-muted-foreground">Carregando organograma...</p>
              </div>
            ) : orgChart.length === 0 ? (
              <div className="py-16 text-center border-2 border-dashed border-border/30 rounded-2xl">
                <GitBranch size={40} className="text-muted-foreground/30 mx-auto mb-4" />
                <p className="font-bold text-muted-foreground">Nenhuma hierarquia configurada ainda.</p>
                <p className="text-xs text-muted-foreground/60 mt-1">Atribua gerentes aos corretores na visão de lista.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                {orgChart.map(node => (
                  <OrgNode key={node.profile.id} node={node} onAssign={setAssignTarget} />
                ))}
              </div>
            )}
          </div>
        )}

        {/* List View (always shown for non-org or broker view) */}
        {(!isAdminOrDirector || view === 'list') && (
          <div className="bg-surface rounded-xl shadow-card border-2 border-border overflow-hidden">
            <div className="p-8 border-b border-border flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="relative w-full md:w-96">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                <input
                  type="text"
                  placeholder="Buscar por nome, email ou CRECI..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-muted/30 border-2 border-transparent focus:border-primary/20 rounded-xl font-bold transition-all outline-none"
                />
              </div>
              <div className="flex items-center gap-2">
                <button className="p-3 bg-muted/30 rounded-xl hover:bg-muted transition-all text-muted-foreground">
                  <Filter size={20} />
                </button>
              </div>
            </div>

            {loading ? (
              <div className="p-20 flex flex-col items-center justify-center">
                <Loader2 className="animate-spin text-primary mb-4" size={40} />
                <p className="font-bold text-muted-foreground">Carregando equipe...</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="text-[10px] font-black text-muted-foreground uppercase tracking-widest bg-muted/10">
                      <th className="py-6 px-8">Membro</th>
                      <th className="py-6 px-4">CRECI</th>
                      {isAdminOrDirector && <th className="py-6 px-4">Gerente</th>}
                      <th className="py-6 px-4 text-center">Nível de Acesso</th>
                      <th className="py-6 px-4 text-center">Status</th>
                      <th className="py-6 px-8 text-right">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {filtered.map(member => {
                      const managerProfile = profiles.find(p => p.id === member.manager_id);
                      const cfg = ROLE_CONFIG[member.role] || ROLE_CONFIG.broker;
                      return (
                        <tr key={member.id} className="hover:bg-muted/10 transition-colors group">
                          <td className="py-6 px-8">
                            <div className="flex items-center gap-4">
                              <div className="w-12 h-12 bg-muted rounded-2xl overflow-hidden flex items-center justify-center font-black text-primary border-2 border-white shadow-sm">
                                {member.avatar_url
                                  ? <img src={member.avatar_url} alt="" className="w-full h-full object-cover" />
                                  : member.full_name.substring(0, 2).toUpperCase()
                                }
                              </div>
                              <div>
                                <p className="font-black text-primary">{member.full_name}</p>
                                <p className="text-xs font-medium text-muted-foreground">{member.email}</p>
                              </div>
                            </div>
                          </td>
                          <td className="py-6 px-4 font-bold text-sm text-primary/70">{member.creci || '—'}</td>
                          {isAdminOrDirector && (
                            <td className="py-6 px-4">
                              {managerProfile ? (
                                <div className="flex items-center gap-2">
                                  <div className="w-6 h-6 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 text-[10px] font-black overflow-hidden">
                                    {managerProfile.avatar_url
                                      ? <img src={managerProfile.avatar_url} alt="" className="w-full h-full object-cover" />
                                      : managerProfile.full_name.substring(0, 2).toUpperCase()
                                    }
                                  </div>
                                  <span className="text-xs font-bold text-primary/70 truncate max-w-[120px]">{managerProfile.full_name}</span>
                                </div>
                              ) : (
                                <span className="text-xs text-muted-foreground/50 font-medium">— sem gerente</span>
                              )}
                            </td>
                          )}
                          <td className="py-6 px-4 text-center">
                            {isAdminOrDirector ? (
                              <select
                                value={member.role}
                                onChange={e => handleRoleChange(member, e.target.value)}
                                className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider outline-none border-2 border-transparent ${cfg.bg} ${cfg.color}`}
                              >
                                <option value="broker">Corretor</option>
                                <option value="manager">Gerente</option>
                                <option value="director">Diretor</option>
                                <option value="admin">Administrador</option>
                              </select>
                            ) : (
                              <span className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border ${cfg.bg} ${cfg.color} ${cfg.border}`}>
                                {cfg.label}
                              </span>
                            )}
                          </td>
                          <td className="py-6 px-4 text-center">
                            <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest ${member.status === 'inactive' ? 'bg-red-50 text-red-500 border border-red-100' : 'bg-green-50 text-green-600 border border-green-100'}`}>
                              {member.status === 'inactive' ? 'Inativo' : 'Ativo'}
                            </span>
                          </td>
                          <td className="py-6 px-8 text-right">
                            <div className="flex items-center justify-end gap-2">
                              {isAdminOrDirector && member.role === 'broker' && (
                                <button
                                  onClick={() => setAssignTarget(member)}
                                  title="Atribuir Gerente"
                                  className="p-3 rounded-xl bg-blue-50 text-blue-500 hover:bg-blue-500 hover:text-white transition-all"
                                >
                                  <UserCheck size={18} />
                                </button>
                              )}
                              {isAdminOrDirector && (
                                <button
                                  onClick={() => handleToggleStatus(member)}
                                  className={`p-3 rounded-xl transition-all ${member.status === 'inactive' ? 'bg-green-50 text-green-600 hover:bg-green-600 hover:text-white' : 'bg-red-50 text-red-400 hover:bg-red-500 hover:text-white'}`}
                                  title={member.status === 'inactive' ? 'Ativar Acesso' : 'Bloquear Acesso'}
                                >
                                  {member.status === 'inactive' ? <ShieldCheck size={18} /> : <Ban size={18} />}
                                </button>
                              )}
                              <button className="p-3 bg-muted/30 text-muted-foreground rounded-xl hover:bg-blue-primary hover:text-white transition-all">
                                <MoreVertical size={18} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
                {filtered.length === 0 && (
                  <div className="py-16 text-center">
                    <Users size={32} className="text-muted-foreground/30 mx-auto mb-3" />
                    <p className="font-bold text-muted-foreground">Nenhum membro encontrado.</p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      <InviteMemberModal
        isOpen={isInviteOpen}
        onClose={() => setIsInviteOpen(false)}
        onSuccess={() => { setIsInviteOpen(false); load(); }}
      />
      <AssignManagerModal
        isOpen={!!assignTarget}
        broker={assignTarget}
        onClose={() => setAssignTarget(null)}
        onSuccess={() => { setAssignTarget(null); load(); }}
      />
    </DashboardLayout>
  );
}
