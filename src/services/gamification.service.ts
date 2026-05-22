import { supabase } from '@/lib/supabase';

// Define the logic for Points and Badges based on approved rules
export const POINTS_RULES = {
  LEAD_CREATED: 10,
  VISIT_DONE: 50,
  PROPOSAL_SENT: 80,
  SALE_CLOSED_BASE: 1000,
};

export const BADGES = {
  FIRST_SALE: 'Primeira Venda',
  VGV_1M: '1 Milhão em VGV',
  VGV_3M: '3 Milhões em VGV',
  VGV_10M: '10 Milhões em VGV',
};

export const GamificationService = {
  async addPoints(userId: string, points: number, vgv: number = 0) {
    try {
    // 1. Get current user profile
    const { data: profile, error: profErr } = await supabase
      .from('profiles')
      .select('total_points, badges')
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
  },

  async handleLeadCreated(userId: string) {
    await this.addPoints(userId, POINTS_RULES.LEAD_CREATED);
  },

  async handleVisit(userId: string) {
    await this.addPoints(userId, POINTS_RULES.VISIT_DONE);
  },

  async handleProposal(userId: string) {
    await this.addPoints(userId, POINTS_RULES.PROPOSAL_SENT);
  },

  async handleSale(userId: string, salePrice: number) {
    // 1000 base + 1000 per 100k
    const extraPoints = Math.floor(salePrice / 100000) * 100;
    const totalSalePoints = POINTS_RULES.SALE_CLOSED_BASE + extraPoints;
    await this.addPoints(userId, totalSalePoints, salePrice);
  },

  async getRankingData(monthYear?: string) {
    // Fetch all profiles and their stats for a given month
    const targetMonth = monthYear || new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0];

    const { data: profiles } = await supabase
      .from('profiles')
      .select('id, full_name, avatar_url, earnings_goal_monthly, badges, conversion_rates');

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
        goal: profile.earnings_goal_monthly || 0,
        conversion: profile.conversion_rates?.proposal_to_sale || 0,
        salesCount: salesCountMap[profile.id] || 0
      };
    });

    // Sort by points descending
    ranking.sort((a, b) => b.points - a.points);
    
    return ranking.map((r, i) => ({ ...r, rank: i + 1 }));
  }
};
