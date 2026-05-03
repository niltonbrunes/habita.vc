'use client';

import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useAuth } from '@/context/AuthContext';
import { ProfilesService } from '@/services/profiles.service';
import { LeadsService } from '@/services/leads.service';
import { PropertiesService } from '@/services/properties.service';
import { Profile, Lead, Property } from '@/types/database';
import { supabase } from '@/lib/supabase';
import { 
  Users, 
  Target, 
  TrendingUp, 
  Home, 
  BarChart3, 
  UserPlus, 
  ChevronRight, 
  RefreshCw,
  AlertCircle,
  ArrowUpRight,
  ArrowDownRight,
  DollarSign
} from 'lucide-react';
import Link from 'next/link';

export default function TeamManagementPage() {
  const { isRole } = useAuth();
  const [loading, setLoading] = useState(true);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [properties, setProperties] = useState<Property[]>([]);
  const [sales, setSales] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [pData, lData, propData, sData] = await Promise.all([
          ProfilesService.getAll(),
          LeadsService.getAll(),
          PropertiesService.getAll(),
          supabase.from('sales').select('*, leads(name), profiles(full_name)').order('sale_date', { ascending: false }).limit(5)
        ]);
        setProfiles(pData);
        setLeads(lData);
        setProperties(propData);
        setSales(sData.data || []);
      } catch (err) {
        console.error('Erro ao buscar dados da equipe:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (!isRole(['manager', 'director', 'admin'])) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center h-full space-y-4">
          <AlertCircle size={48} className="text-red-500" />
          <h2 className="text-2xl font-bold">Acesso Negado</h2>
          <p className="text-muted-foreground">Esta área é restrita para gestores e diretores.</p>
          <Link href="/dashboard" className="text-primary font-bold underline">Voltar para meu Dashboard</Link>
        </div>
      </DashboardLayout>
    );
  }

  // Consolidated Stats
  const totalLeads = leads.length;
  const hotLeads = leads.filter(l => l.temperature === 'hot').length;
  const totalProperties = properties.length;
  const totalSalesValue = sales.reduce((acc, s) => acc + s.sale_price, 0);

  return (
    <DashboardLayout>
      <div className="space-y-10 pb-20 relative">
        {loading && (
          <div className="absolute inset-0 bg-white/50 backdrop-blur-[1px] z-[50] flex items-center justify-center min-h-[400px]">
            <RefreshCw className="animate-spin text-primary" size={48} />
          </div>
        )}

        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-4xl font-black text-primary mb-2">BI & Gestão de Equipe</h1>
            <p className="text-muted-foreground font-medium text-lg">Inteligência competitiva e monitoramento de conversão.</p>
          </div>
          
          <div className="flex gap-3">
            <button className="flex items-center gap-2 bg-white border border-border px-5 py-3 rounded-2xl text-sm font-bold hover:bg-muted transition-all">
              <RefreshCw size={18} /> Atualizar Dados
            </button>
            <button className="flex items-center gap-2 bg-primary text-white px-5 py-3 rounded-2xl text-sm font-black hover:bg-primary-light transition-all shadow-premium">
              <BarChart3 size={18} /> Relatório Completo
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard 
            title="Volume de Vendas" 
            value={`R$ ${(totalSalesValue / 1000000).toFixed(1)}M`} 
            icon={<DollarSign className="text-green-500" />} 
            trend="+8%" 
            trendUp={true} 
            subtitle="Mês atual"
          />
          <StatCard 
            title="Novos Leads" 
            value={totalLeads} 
            icon={<Users className="text-blue-500" />} 
            trend="+15%" 
            trendUp={true} 
            subtitle="Últimos 7 dias"
          />
          <StatCard 
            title="Taxa de Visita" 
            value="18.5%" 
            icon={<Target className="text-red-500" />} 
            trend="-2%" 
            trendUp={false} 
            subtitle="Média da equipe"
          />
          <StatCard 
            title="Aproveitamento" 
            value="4.2%" 
            icon={<TrendingUp className="text-purple-500" />} 
            trend="+1.2%" 
            trendUp={true} 
            subtitle="Lead → Venda"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Detailed Broker Ranking */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white rounded-[2.5rem] shadow-premium border border-border overflow-hidden">
              <div className="p-8 border-b border-border flex justify-between items-center bg-muted/10">
                <h3 className="text-xl font-black text-primary uppercase tracking-tight">Ranking de Performance</h3>
                <div className="flex gap-2">
                  <button className="px-3 py-1 bg-primary text-white rounded-lg text-[10px] font-black uppercase">Vendas</button>
                  <button className="px-3 py-1 bg-muted text-muted-foreground rounded-lg text-[10px] font-black uppercase">Leads</button>
                </div>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-muted/30">
                    <tr className="text-left text-[10px] font-black text-muted-foreground uppercase tracking-widest">
                      <th className="px-8 py-4">Posição</th>
                      <th className="px-6 py-4">Corretor</th>
                      <th className="px-6 py-4 text-center">Faturamento</th>
                      <th className="px-6 py-4 text-center">Meta (%)</th>
                      <th className="px-8 py-4 text-right">Ação</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {profiles.filter(p => p.role === 'broker').map((broker, i) => {
                      const achievement = Math.floor(Math.random() * 50) + 50; // Simulation
                      return (
                        <tr key={broker.id} className="hover:bg-muted/20 transition-colors group">
                          <td className="px-8 py-5">
                            <span className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-sm ${
                              i === 0 ? 'bg-yellow-100 text-yellow-700' : 
                              i === 1 ? 'bg-slate-100 text-slate-600' : 
                              'bg-muted text-muted-foreground'
                            }`}>
                              {i + 1}
                            </span>
                          </td>
                          <td className="px-6 py-5">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center font-black text-primary">
                                {broker.full_name.substring(0, 2).toUpperCase()}
                              </div>
                              <p className="font-bold text-primary">{broker.full_name}</p>
                            </div>
                          </td>
                          <td className="px-6 py-5 text-center font-black text-primary">R$ 1.2M</td>
                          <td className="px-6 py-5">
                            <div className="space-y-1 text-center">
                              <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden max-w-[100px] mx-auto">
                                <div className={`h-full ${achievement > 90 ? 'bg-green-500' : 'bg-accent'}`} style={{ width: `${achievement}%` }} />
                              </div>
                              <span className="text-[10px] font-black text-primary">{achievement}%</span>
                            </div>
                          </td>
                          <td className="px-8 py-5 text-right">
                            <button className="p-2 hover:bg-white rounded-xl text-muted-foreground hover:text-primary transition-all">
                              <ChevronRight size={20} />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Team Activity / Recent Sales */}
            <div className="bg-white p-8 rounded-[2.5rem] shadow-premium border border-border">
              <h3 className="text-xl font-black text-primary uppercase tracking-tight mb-8">Vendas Recentes</h3>
              <div className="space-y-4">
                {sales.length > 0 ? sales.map((sale) => (
                  <div key={sale.id} className="flex items-center justify-between p-4 bg-muted/20 rounded-2xl border border-transparent hover:border-primary/10 transition-all">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-green-100 text-green-600 rounded-2xl flex items-center justify-center">
                        <DollarSign size={24} />
                      </div>
                      <div>
                        <p className="font-bold text-primary">Venda Confirmada!</p>
                        <p className="text-xs text-muted-foreground font-medium">{sale.profiles?.full_name} vendeu {sale.leads?.name}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-black text-primary">R$ {(sale.sale_price / 1000).toFixed(0)}k</p>
                      <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">{new Date(sale.sale_date).toLocaleDateString()}</p>
                    </div>
                  </div>
                )) : (
                  <p className="text-center text-muted-foreground py-8">Nenhuma venda registrada recentemente.</p>
                )}
              </div>
            </div>
          </div>

          {/* Team Funnel Visual */}
          <div className="space-y-8">
            <div className="bg-primary text-white p-8 rounded-[2.5rem] shadow-luxury border border-white/10 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-accent/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-1000" />
              <h3 className="text-lg font-black uppercase tracking-widest mb-8 flex items-center gap-2">
                <BarChart3 size={20} className="text-accent" /> Funil Equipe
              </h3>
              
              <div className="space-y-6">
                <FunnelStep label="Novos Leads" count={totalLeads} percent={100} color="bg-white/20" />
                <FunnelStep label="Em Atendimento" count={Math.floor(totalLeads * 0.4)} percent={40} color="bg-accent/40" />
                <FunnelStep label="Visitas" count={Math.floor(totalLeads * 0.15)} percent={15} color="bg-accent/70" />
                <FunnelStep label="Vendas" count={Math.floor(totalLeads * 0.03)} percent={3} color="bg-accent" />
              </div>

              <div className="mt-10 pt-8 border-t border-white/10 text-center">
                <p className="text-xs text-white/50 font-bold uppercase tracking-widest">Conversão Global</p>
                <p className="text-4xl font-black text-accent mt-2">3.2%</p>
              </div>
            </div>

            {/* Inventory Insight */}
            <div className="bg-white p-8 rounded-[2.5rem] shadow-premium border border-border">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-purple-50 text-purple-600 rounded-xl">
                  <Home size={20} />
                </div>
                <h3 className="text-sm font-black uppercase tracking-widest text-primary">Mix de Inventário</h3>
              </div>
              
              <div className="space-y-4">
                <InventoryBar label="Alto Padrão" value={properties.filter(p => p.pattern === 'high_end').length} total={totalProperties} color="bg-yellow-500" />
                <InventoryBar label="Médio Padrão" value={properties.filter(p => p.pattern === 'medium').length} total={totalProperties} color="bg-blue-500" />
                <InventoryBar label="Econômico" value={properties.filter(p => p.pattern === 'economic').length} total={totalProperties} color="bg-green-500" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

const StatCard = ({ title, value, icon, trend, trendUp, subtitle }: any) => (
  <div className="bg-white p-6 rounded-[2rem] shadow-premium border border-border hover:shadow-luxury transition-all group">
    <div className="flex justify-between items-start mb-4">
      <div className="p-3 bg-muted/30 rounded-2xl group-hover:scale-110 transition-transform">
        {React.cloneElement(icon, { size: 24 })}
      </div>
      <div className={`flex items-center gap-1 text-[10px] font-black px-2 py-1 rounded-full ${
        trendUp ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'
      }`}>
        {trendUp ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
        {trend}
      </div>
    </div>
    <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">{title}</p>
    <h4 className="text-3xl font-black text-primary mb-2">{value}</h4>
    <p className="text-[10px] font-bold text-muted-foreground/60 uppercase tracking-tight">{subtitle}</p>
  </div>
);

const FunnelStep = ({ label, count, percent, color }: any) => (
  <div className="space-y-2">
    <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
      <span>{label}</span>
      <span className="text-white/40">{count}</span>
    </div>
    <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
      <div className={`h-full transition-all duration-1000 ${color}`} style={{ width: `${percent}%` }} />
    </div>
  </div>
);

const InventoryBar = ({ label, value, total, color }: any) => {
  const percent = total > 0 ? (value / total) * 100 : 0;
  return (
    <div className="space-y-1.5">
      <div className="flex justify-between text-[9px] font-black uppercase tracking-widest">
        <span className="text-muted-foreground">{label}</span>
        <span className="text-primary">{value}</span>
      </div>
      <div className="h-1 w-full bg-muted rounded-full overflow-hidden">
        <div className={`h-full ${color}`} style={{ width: `${percent}%` }} />
      </div>
    </div>
  );
};
