import { supabase } from '@/lib/supabase';
import { Lead, Sale, Task, Profile } from '@/types/database';
import { LEAD_CHANNELS, CHANNEL_MAP } from '@/lib/constants/channels';

export interface DashboardMetrics {
  monthlyGoal: number;
  realEarnings: number;
  vgvNeeded: number;
  activeLeads: number;
  newLeadsToday: number;
  goalProgress: number;
  realVgv: number;
  funnelStats?: {
    base: number;
    oportunidades: number;
    apresentacoes: number;
    propostas: number;
    vendas: number;
  };
}

export interface RankingData {
  pos: number;
  name: string;
  value: string;
  active?: boolean;
}

export class DashboardService {
  static async getMetrics(userId: string): Promise<DashboardMetrics> {
    const now = new Date();
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();

    // 1. Get Profile for Goal and Role
    const { data: profile } = await supabase
      .from('profiles')
      .select('earnings_goal_monthly, avg_commission_percent, role')
      .eq('id', userId)
      .single();

    const monthlyGoal = profile?.earnings_goal_monthly || 15000;
    const avgCommission = (profile?.avg_commission_percent || 4) / 100;
    const role = profile?.role || 'broker';

    // Determine target scope based on user role
    let salesQuery = supabase
      .from('sales')
      .select('id, total_price, commissions(total_commission_value, split_details)')
      .gte('sale_date', firstDayOfMonth);

    // Funil de Vendas: apenas leads compradores (buyer ou sem tipo definido)
    let leadsQuery = supabase
      .from('leads')
      .select('status, created_at')
      .or('lead_type.eq.buyer,lead_type.is.null');

    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);
    let newLeadsTodayQuery = supabase
      .from('leads')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', startOfToday.toISOString());

    if (role === 'manager') {
      const { data: team } = await supabase
        .from('profiles')
        .select('id')
        .eq('manager_id', userId);
      const teamIds = [(team || []).map((t: any) => t.id), userId].flat();
      salesQuery = salesQuery.in('broker_id', teamIds);
      leadsQuery = leadsQuery.in('assigned_to_id', teamIds);
      newLeadsTodayQuery = newLeadsTodayQuery.in('assigned_to_id', teamIds);
    } else if (role === 'admin' || role === 'director') {
      // Admins and directors get all sales and leads
    } else {
      // Broker - default behavior
      salesQuery = salesQuery.eq('broker_id', userId);
      leadsQuery = leadsQuery.eq('assigned_to_id', userId);
      newLeadsTodayQuery = newLeadsTodayQuery.eq('assigned_to_id', userId);
    }

    // 2. Get Real Earnings from Sales this month
    const { data: sales } = await salesQuery;

    const currentVGV = (sales as any)?.reduce((acc: number, sale: any) => acc + Number(sale.total_price || 0), 0) || 0;
    const realEarnings = (sales as any)?.reduce((acc: number, sale: any) => {
      const comm = sale.commissions && sale.commissions[0];
      const brokerSplit = comm?.split_details?.find((p: any) => p.role === 'broker');
      return acc + Number(brokerSplit?.value || 0);
    }, 0) || 0;

    // 3. Get Active Leads
    const { data: allLeadsData } = await leadsQuery;

    const activeLeads = (allLeadsData || []).filter(l => l.status !== 'sale' && l.status !== 'lost').length;

    const funnelStats = {
      base: 0,
      oportunidades: 0,
      apresentacoes: 0,
      propostas: 0,
      vendas: 0
    };

    const currentQuarter = Math.floor((now.getMonth() + 3) / 3);
    const currentYear = now.getFullYear();

    (allLeadsData || []).forEach((l: any) => {
      funnelStats.base++;

      if (l.status === 'lead' || l.status === 'contact') {
        funnelStats.oportunidades++;
      } else if (l.status === 'presentation' || l.status === 'visit') {
        funnelStats.apresentacoes++;
      } else if (l.status === 'proposal') {
        funnelStats.propostas++;
      } else if (l.status === 'sale') {
        const d = new Date(l.created_at);
        const q = Math.floor((d.getMonth() + 3) / 3);
        if (q === currentQuarter && d.getFullYear() === currentYear) {
          funnelStats.vendas++;
        }
      }
    });

    // 4. New Leads Today
    const { count: newLeadsToday } = await newLeadsTodayQuery;

    // 5. Calculate VGV Needed
    const earningsGap = Math.max(0, monthlyGoal - realEarnings);
    const vgvNeeded = earningsGap / (avgCommission || 0.04);

    return {
      monthlyGoal,
      realEarnings,
      vgvNeeded,
      activeLeads: activeLeads || 0,
      newLeadsToday: newLeadsToday || 0,
      goalProgress: Math.min(100, Math.round((realEarnings / monthlyGoal) * 100)),
      realVgv: currentVGV,
      funnelStats
    };
  }

  static async getHotLeads(userId: string) {
    const { data } = await supabase
      .from('leads')
      .select(`
        *,
        person:people(*)
      `)
      .eq('assigned_to_id', userId)
      .not('status', 'in', '("sale","lost")')
      .order('score', { ascending: false })
      .limit(5);

    return data || [];
  }

  static async getRanking(): Promise<RankingData[]> {
    const now = new Date();
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();

    const { data: sales } = await supabase
      .from('sales')
      .select(`
        total_price,
        broker:profiles(full_name, id)
      `)
      .gte('sale_date', firstDayOfMonth);

    if (!sales) return [];

    // Group by broker
    const brokerSales: Record<string, { name: string, total: number }> = {};
    sales.forEach((s: any) => {
      const broker = s.broker;
      if (!broker) return;
      if (!brokerSales[broker.id]) {
        brokerSales[broker.id] = { name: broker.full_name, total: 0 };
      }
      brokerSales[broker.id].total += Number(s.total_price || 0);
    });

    return Object.entries(brokerSales)
      .map(([id, data]) => ({
        pos: 0,
        name: data.name,
        value: new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(data.total),
        id
      }))
      .sort((a, b) => {
         const valA = parseFloat(a.value.replace(/[^\d]/g, ''));
         const valB = parseFloat(b.value.replace(/[^\d]/g, ''));
         return valB - valA;
      })
      .map((item, index) => ({ ...item, pos: index + 1 }));
  }

  static async getDailyActions(userId: string) {
    const { data } = await supabase
      .from('tasks')
      .select('*')
      .eq('user_id', userId)
      .eq('completed', false)
      .order('due_date', { ascending: true })
      .limit(5);

    return data || [];
  }

  static async getFunnelConfig(userId: string) {
    const { data, error } = await supabase
      .from('profiles')
      .select('funnel_config, earnings_goal_monthly, avg_ticket, avg_commission_percent')
      .eq('id', userId)
      .single();
    
    if (error) {
      console.error('Error fetching funnel config:', error);
      return null;
    }

    if (data) {
      const rowData = data as any;
      return {
        ...(rowData.funnel_config || {}),
        goal: rowData.earnings_goal_monthly ? Number(rowData.earnings_goal_monthly) * 3 : (rowData.funnel_config?.goal || 3000000),
          commission: Number(rowData.avg_commission_percent) || 1.25,
        ticket: rowData.avg_ticket ? Number(rowData.avg_ticket) : (rowData.funnel_config?.ticket || 500000)
      };
    }
    return null;
  }


  
  static async getChannelPerformance(userId: string) {
    // 1. Get Profile for Role scoping
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', userId)
      .single();
    const role = profile?.role || 'broker';

    // 2. Build Query scopes
    let leadsQuery = supabase.from('leads').select('source, status');

    if (role === 'manager') {
      const { data: team } = await supabase
        .from('profiles')
        .select('id')
        .eq('manager_id', userId);
      const teamIds = [(team || []).map((t: any) => t.id), userId].flat();
      leadsQuery = leadsQuery.in('assigned_to_id', teamIds);
    } else if (role === 'admin' || role === 'director') {
      // All
    } else {
      leadsQuery = leadsQuery.eq('assigned_to_id', userId);
    }

    const fetchAll = async (query: any) => {
      let results: any[] = [];
      let page = 0;
      const pageSize = 1000;
      while (true) {
        const { data, error } = await query
          .range(page * pageSize, (page + 1) * pageSize - 1);
        if (error) throw error;
        if (!data || data.length === 0) break;
        results = results.concat(data);
        if (data.length < pageSize) break;
        page++;
      }
      return results;
    };

    let leads: any[] = [];

    try {
      leads = await fetchAll(leadsQuery);
    } catch (err) {
      console.error('Error fetching leads for channel performance:', err);
    }

    const benchmarks: Record<string, number> = {
      'Indicação': 70,
      'Base de Clientes': 45,
      'Network': 40,
      'Portais': 10,
      'Redes Sociais': 15,
      'Ligação Ativa': 5,
      'Ponto Avançado': 30,
      'IA Prospecção': 15,
      'Manual': 15,
      'Plantão': 15,
      'Ação de Vendas': 15,
      'Outros': 10
    };

    const stats: Record<string, { total: number; opps: number }> = {};
    Object.keys(benchmarks).forEach(k => {
      stats[k] = { total: 0, opps: 0 };
    });

    const oppStatuses = ['presentation', 'visit', 'proposal', 'sale'];

    const getNormalizedDisplaySource = (src: string | null | undefined): string => {
      if (!src) return 'Outros';
      const clean = src.trim().toLowerCase();
      if (CHANNEL_MAP[clean]) {
        return CHANNEL_MAP[clean];
      }
      const found = LEAD_CHANNELS.find(c => 
        c.id === clean || 
        c.name.toLowerCase() === clean ||
        c.name.toLowerCase().replace(/[^a-z0-9]/g, '') === clean.replace(/[^a-z0-9]/g, '')
      );
      return found ? found.name : 'Outros';
    };

    // Process leads
    (leads || []).forEach(lead => {
      const source = getNormalizedDisplaySource(lead.source);
      if (!stats[source]) {
        stats[source] = { total: 0, opps: 0 };
      }
      stats[source].total += 1;
      
      if (oppStatuses.includes(lead.status)) {
        stats[source].opps += 1;
      }
    });

    const results = Object.keys(stats).map(source => {
      const { total, opps } = stats[source];
      const convReal = total > 0 ? Math.round((opps / total) * 100) : 0;
      const benchmark = benchmarks[source] || 0;
      return {
        source,
        total,
        opps,
        convReal,
        benchmark
      };
    }).sort((a, b) => b.total - a.total); // Sort by volume

    return results;
  }

  static async saveFunnelConfig(userId: string, config: any) {
      const updateData: any = { funnel_config: config };
      
      // Sincronizar de volta para o perfil
      if (config.goal) {
        updateData.earnings_goal_monthly = config.goal / 3;
      }
      if (config.ticket) {
        updateData.avg_ticket = config.ticket;
      }

      const { error } = await supabase
        .from('profiles')
        .update(updateData)
        .eq('id', userId);
    
    if (error) {
      console.error('Error saving funnel config:', error);
      return false;
    }
    return true;
  }

  static async getPropertiesByType(): Promise<{ name: string, value: number, color: string }[]> {
    const { data, error } = await supabase
      .from('properties')
      .select('type');
      
    if (error) {
      console.error('Error fetching properties types:', error);
      return [];
    }
    
    const counts: Record<string, number> = {};
    data.forEach(p => {
      const t = p.type || 'Outros';
      counts[t] = (counts[t] || 0) + 1;
    });

    const colors = ['#3b82f6', '#60a5fa', '#93c5fd', '#bfdbfe', '#2563eb', '#1d4ed8', '#1e40af', '#172554'];
    
    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .map(([name, value], i) => ({
        name,
        value,
        color: colors[i % colors.length]
      }));
  }

}

