import { supabase } from '@/lib/supabase';

// Define the logic for Points and Badges based on approved rules
export const POINTS_RULES = {
  LEAD_CREATED: 10,
  VISIT_DONE: 50,
  PROPOSAL_SENT: 80,
  SALE_CLOSED_BASE: 1000,
};

export const BADGES = {
  // Volume VGV
  FIRST_SALE: 'Primeira Venda',
  VGV_1M: '1 Milhão em VGV',
  VGV_3M: '3 Milhões em VGV',
  VGV_10M: '10 Milhões em VGV',
  VGV_50M: 'Clube dos 50 Milhões',
  
  // Consistência & Atividade
  VISITS_10: 'Máquina de Agendamentos',
  LEADS_50: 'Top Prospector',
  SALES_3: 'Fechador Serial',
  
  // Conversão e Eficiência
  SNIPER: 'Sniper / Tiro Certo',
  AGILE: 'Negociador Ágil',
  
  // Produto e Retenção
  LUXURY: 'Rei do Alto Padrão',
  DEVELOPMENT: 'Lançamento Sucesso',
  VETERAN: 'Veterano Habita',
};

export const GamificationService = {
  async addPoints(userId: string, points: number, vgv: number = 0) {
    try {
    // 1. Get current user profile
    const { data: profile, error: profErr } = await supabase
      .from('profiles')
      .select('total_points, badges, created_at')
      .eq('id', userId)
      .single();

    if (!profile) {
      console.error('Profile not found for Gamification:', userId, profErr);
      return;
    }

    let currentTotalPoints = profile.total_points || 0;
    let currentBadges = profile.badges || [];
    currentTotalPoints += points;

    // 2. Get current month performance stats
    const now = new Date();
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0];

    const { data: stats } = await supabase
      .from('performance_stats')
      .select('*')
      .eq('user_id', userId)
      .eq('month_year', firstDayOfMonth)
      .single();

    let newMonthlyPoints = points;
    let newVgvAchieved = vgv;

    if (stats) {
      newMonthlyPoints += (stats.monthly_points || 0);
      newVgvAchieved += (stats.vgv_achieved || 0);

      await supabase
        .from('performance_stats')
        .update({
          monthly_points: newMonthlyPoints,
          vgv_achieved: newVgvAchieved
        })
        .eq('id', stats.id);
    } else {
      await supabase
        .from('performance_stats')
        .insert([{
          user_id: userId,
          month_year: firstDayOfMonth,
          monthly_points: newMonthlyPoints,
          vgv_achieved: newVgvAchieved
        }]);
    }

    // 3. Evaluate Badges
    const { data: allStats } = await supabase
      .from('performance_stats')
      .select('vgv_achieved')
      .eq('user_id', userId);

    const totalVgv = (allStats || []).reduce((acc, curr) => acc + (curr.vgv_achieved || 0), 0);

    const newBadges = [...currentBadges];
    if (vgv > 0 && !newBadges.includes(BADGES.FIRST_SALE)) {
      newBadges.push(BADGES.FIRST_SALE);
    }
    if (totalVgv >= 1000000 && !newBadges.includes(BADGES.VGV_1M)) {
      newBadges.push(BADGES.VGV_1M);
    }
    if (totalVgv >= 3000000 && !newBadges.includes(BADGES.VGV_3M)) {
      newBadges.push(BADGES.VGV_3M);
    }
    if (totalVgv >= 10000000 && !newBadges.includes(BADGES.VGV_10M)) {
      newBadges.push(BADGES.VGV_10M);
    }

    // 4. Update Profile
    await supabase
      .from('profiles')
      .update({
        total_points: currentTotalPoints,
        badges: newBadges
      })
      .eq('id', userId);
    } catch (err) {
      console.error('Gamification Error:', err);
    }
  },

  async evaluateActivityBadges(userId: string) {
    try {
      const now = new Date();
      const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0];

      const { data: stats } = await supabase
        .from('performance_stats')
        .select('*')
        .eq('user_id', userId)
        .eq('month_year', firstDayOfMonth)
        .single();

      if (!stats) return;

      const { data: profile } = await supabase
        .from('profiles')
        .select('badges')
        .eq('id', userId)
        .single();
      
      if (!profile) return;
      const currentBadges = profile.badges || [];
      const newBadges = [...currentBadges];

      // Assuming leads_converted means leads created in the month context or we add leads_created/visits_done if they exist
      // Since schema has leads_converted and visits_done, let's increment them if needed. 
      // Wait, GamificationService doesn't increment visits_done in addPoints. 
      // We need to count from DB directly or rely on addPoints.
      // Actually, since we need to check DB, let's query the counts!
      const targetMonthPrefix = firstDayOfMonth.substring(0, 7);

      const { count: visitsCount } = await supabase
        .from('tasks') // or whatever table stores visits
        .select('*', { count: 'exact', head: true })
        .eq('assigned_to_id', userId)
        .eq('type', 'visit')
        .like('created_at', targetMonthPrefix + '%');
      
      if (visitsCount && visitsCount >= 10 && !newBadges.includes(BADGES.VISITS_10)) {
        newBadges.push(BADGES.VISITS_10);
      }

      const { count: leadsCount } = await supabase
        .from('leads')
        .select('*', { count: 'exact', head: true })
        .eq('assigned_to_id', userId)
        .like('created_at', targetMonthPrefix + '%');

      if (leadsCount && leadsCount >= 50 && !newBadges.includes(BADGES.LEADS_50)) {
        newBadges.push(BADGES.LEADS_50);
      }

      if (newBadges.length > currentBadges.length) {
        await supabase.from('profiles').update({ badges: newBadges }).eq('id', userId);
      }
    } catch (err) {
      console.error(err);
    }
  },

  async handleLeadCreated(userId: string) {
    await this.addPoints(userId, POINTS_RULES.LEAD_CREATED);
    this.evaluateActivityBadges(userId);
  },

  async handleVisit(userId: string) {
    await this.addPoints(userId, POINTS_RULES.VISIT_DONE);
    this.evaluateActivityBadges(userId);
  },

  async handleProposal(userId: string) {
    await this.addPoints(userId, POINTS_RULES.PROPOSAL_SENT);
  },


  async handleSale(userId: string, salePrice: number, leadCreatedAt?: string, isDevelopment?: boolean) {
    // 1000 base + 100 per 100k
    const extraPoints = Math.floor(salePrice / 100000) * 100;
    const totalSalePoints = POINTS_RULES.SALE_CLOSED_BASE + extraPoints;
    await this.addPoints(userId, totalSalePoints, salePrice);

    // Avaliar as badges especiais de venda
    try {
      const now = new Date();
      const targetMonthPrefix = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0].substring(0, 7);

      const { data: profile } = await supabase.from('profiles').select('badges').eq('id', userId).single();
      if (!profile) return;
      const currentBadges = profile.badges || [];
      const newBadges = [...currentBadges];

      // Rei do Alto Padrão
      if (salePrice >= 2000000 && !newBadges.includes(BADGES.LUXURY)) {
        newBadges.push(BADGES.LUXURY);
      }

      // Lançamento Sucesso
      if (isDevelopment && !newBadges.includes(BADGES.DEVELOPMENT)) {
        newBadges.push(BADGES.DEVELOPMENT);
      }

      // Negociador Ágil (< 15 dias)
      if (leadCreatedAt && !newBadges.includes(BADGES.AGILE)) {
        const leadDate = new Date(leadCreatedAt);
        const diffDays = Math.ceil(Math.abs(now.getTime() - leadDate.getTime()) / (1000 * 60 * 60 * 24));
        if (diffDays <= 15) {
          newBadges.push(BADGES.AGILE);
        }
      }

      // Sniper (< 10 leads no mês atual) e Fechador Serial (>= 3 vendas no mês)
      const { count: leadsCount } = await supabase.from('leads').select('*', { count: 'exact', head: true })
        .eq('assigned_to_id', userId).like('created_at', targetMonthPrefix + '%');
        
      const { count: salesCount } = await supabase.from('sales').select('*', { count: 'exact', head: true })
        .eq('broker_id', userId).like('sale_date', targetMonthPrefix + '%');

      if (leadsCount !== null && leadsCount < 10 && !newBadges.includes(BADGES.SNIPER)) {
        newBadges.push(BADGES.SNIPER);
      }

      if (salesCount !== null && salesCount >= 3 && !newBadges.includes(BADGES.SALES_3)) {
        newBadges.push(BADGES.SALES_3);
      }

      if (newBadges.length > currentBadges.length) {
        await supabase.from('profiles').update({ badges: newBadges }).eq('id', userId);
      }
    } catch (err) {
      console.error(err);
    }
  },


  async getRankingData(monthYear?: string) {
    // Fetch all profiles and their stats for a given month
    const targetMonth = monthYear || new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0];

    const { data: profiles } = await supabase
      .from('profiles')
      .select('id, full_name, avatar_url, earnings_goal_monthly, badges, conversion_rates, avg_commission_percent');

    const { data: stats } = await supabase
      .from('performance_stats')
      .select('*')
      .eq('month_year', targetMonth);

    // Fetch sales counts for the month
    const { data: salesData } = await supabase
      .from('sales')
      .select('broker_id, sale_date');
      
    // Count sales per broker for the target month
    const salesCountMap: Record<string, number> = {};
    const targetMonthPrefix = targetMonth.substring(0, 7); // YYYY-MM
    (salesData || []).forEach(sale => {
      if (sale.sale_date && sale.sale_date.startsWith(targetMonthPrefix)) {
        salesCountMap[sale.broker_id] = (salesCountMap[sale.broker_id] || 0) + 1;
      }
    });

    const ranking = (profiles || []).map(profile => {
      const pStats = (stats || []).find(s => s.user_id === profile.id);
      return {
        id: profile.id,
        name: profile.full_name,
        avatar: profile.avatar_url || profile.full_name.substring(0, 2).toUpperCase(),
        badges: profile.badges || [],
        points: pStats?.monthly_points || 0,
        vgv: pStats?.vgv_achieved || 0,
        goal: profile.earnings_goal_monthly ? Math.round(Number(profile.earnings_goal_monthly) / ((Number(profile.avg_commission_percent) || 1.25) / 100)) : 0,
        conversion: profile.conversion_rates?.proposal_to_sale || 0,
        salesCount: salesCountMap[profile.id] || 0
      };
    });

    // Sort by points descending
    ranking.sort((a, b) => b.points - a.points);
    
    return ranking.map((r, i) => ({ ...r, rank: i + 1 }));
  }
};
