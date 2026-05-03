import React from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { MOCK_TEAM, TEAM_STATS } from '@/lib/constants/team';
import { 
  Users, 
  TrendingUp, 
  Target, 
  ArrowUpRight, 
  ChevronRight, 
  Award,
  Filter,
  Search,
  PieChart,
  BarChart3
} from 'lucide-react';

export default function TeamDashboardPage() {
  const progressPercent = (TEAM_STATS.currentVgv / TEAM_STATS.monthlyGoal) * 100;

  return (
    <DashboardLayout>
      <div className="space-y-8 pb-20">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold mb-1">Gestão de Equipe</h1>
            <p className="text-muted-foreground text-sm">Visão macro de performance e metas coletivas.</p>
          </div>
          
          <div className="flex gap-3">
            <button className="flex items-center gap-2 bg-white border border-border px-4 py-2 rounded-xl text-sm font-bold hover:bg-muted transition-all">
              <PieChart size={16} /> Relatório Completo
            </button>
            <button className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-primary-light transition-all shadow-premium">
              <Users size={16} /> Gerenciar Time
            </button>
          </div>
        </div>

        {/* Team Goal Card */}
        <div className="bg-primary text-white p-8 rounded-3xl shadow-luxury relative overflow-hidden">
          <div className="relative z-10 flex flex-col md:flex-row justify-between gap-8">
            <div className="flex-1 space-y-4">
              <div className="flex items-center gap-2 text-accent uppercase tracking-widest text-xs font-bold">
                <Target size={16} /> Meta Coletiva Mensal
              </div>
              <h2 className="text-4xl font-black">R$ {(TEAM_STATS.monthlyGoal / 1000000).toFixed(0)} Milhões</h2>
              <div className="space-y-2">
                <div className="flex justify-between text-sm font-bold">
                  <span>Progresso: R$ {(TEAM_STATS.currentVgv / 1000000).toFixed(1)}M</span>
                  <span>{progressPercent.toFixed(1)}%</span>
                </div>
                <div className="w-full h-3 bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full bg-accent rounded-full transition-all duration-1000" style={{ width: `${progressPercent}%` }} />
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/5 p-4 rounded-2xl border border-white/10">
                <p className="text-[10px] font-bold text-white/50 uppercase tracking-wider mb-1">Leads da Equipe</p>
                <p className="text-2xl font-bold">{TEAM_STATS.totalLeads}</p>
              </div>
              <div className="bg-white/5 p-4 rounded-2xl border border-white/10">
                <p className="text-[10px] font-bold text-white/50 uppercase tracking-wider mb-1">Vendas Ativas</p>
                <p className="text-2xl font-bold">{TEAM_STATS.activeSales}</p>
              </div>
            </div>
          </div>
          {/* Decorative Background Element */}
          <div className="absolute top-[-50%] right-[-10%] w-96 h-96 bg-white/5 rounded-full blur-3xl" />
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Brokers Performance Table */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white p-6 rounded-3xl shadow-premium border border-border">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold">Performance dos Corretores</h3>
                <div className="flex items-center gap-4">
                  <button className="text-muted-foreground hover:text-primary transition-colors"><Search size={20} /></button>
                  <button className="text-muted-foreground hover:text-primary transition-colors"><Filter size={20} /></button>
                </div>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest border-b border-border pb-4">
                      <th className="pb-4 px-2">Corretor</th>
                      <th className="pb-4 px-2">Vendas</th>
                      <th className="pb-4 px-2">VGV Acumulado</th>
                      <th className="pb-4 px-2 text-center">Conversão</th>
                      <th className="pb-4 px-2 text-right">Ação</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {MOCK_TEAM.map(member => (
                      <tr key={member.id} className="hover:bg-muted/30 transition-colors group">
                        <td className="py-4 px-2">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center font-bold text-xs text-primary">
                              {member.name.split(' ').map(n => n[0]).join('')}
                            </div>
                            <div>
                              <p className="text-sm font-bold text-primary">{member.name}</p>
                              <p className="text-[10px] text-muted-foreground">{member.role}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-2 text-sm font-bold">{member.sales}</td>
                        <td className="py-4 px-2 text-sm font-bold">R$ {(member.vgv / 1000000).toFixed(1)}M</td>
                        <td className="py-4 px-2">
                          <div className="flex items-center justify-center gap-2">
                            <span className="text-xs font-bold">{member.conversion}%</span>
                            <div className="w-12 h-1 bg-muted rounded-full overflow-hidden hidden sm:block">
                              <div className="h-full bg-primary rounded-full" style={{ width: `${member.conversion * 5}%` }} />
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-2 text-right">
                          <button className="p-2 hover:bg-primary hover:text-white rounded-lg transition-all">
                            <ArrowUpRight size={16} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Side Panels - Ranking & Insights */}
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-3xl shadow-premium border border-border">
              <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                <Award className="text-accent" size={20} />
                Ranking de Vendas
              </h3>
              <div className="space-y-4">
                {MOCK_TEAM.slice(0, 3).map((member, i) => (
                  <div key={member.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-2xl border border-transparent hover:border-primary/10 transition-all">
                    <div className="flex items-center gap-3">
                      <span className={`text-lg font-black ${i === 0 ? 'text-accent' : 'text-primary/30'}`}>{i + 1}º</span>
                      <p className="text-sm font-bold">{member.name}</p>
                    </div>
                    <p className="text-xs font-black text-primary">R$ {(member.vgv / 1000).toLocaleString()}k</p>
                  </div>
                ))}
              </div>
              <button className="w-full mt-6 text-sm font-bold text-primary/50 hover:text-primary transition-colors flex items-center justify-center gap-1">
                Ver Ranking Completo <ChevronRight size={16} />
              </button>
            </div>

            <div className="bg-accent text-white p-6 rounded-3xl shadow-premium border border-accent/20">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <BarChart3 size={20} />
                Insight da Equipe
              </h3>
              <p className="text-sm text-white/80 leading-relaxed">
                A equipe está performando <span className="font-bold text-white underline">15% acima</span> da meta projetada para este período. Foco em fechamento de propostas pode antecipar a meta anual em 2 meses.
              </p>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
