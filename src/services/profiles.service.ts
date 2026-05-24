import { supabase } from '@/lib/supabase';
import { Profile } from '@/types/database';

export interface TeamNode {
  profile: Profile;
  directReports: TeamNode[];
  stats?: {
    activeLeads: number;
    monthlySales: number;
    monthlyVgv: number;
    conversionRate: number;
  };
}


export const ProfilesService = {
  async getById(id: string) {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') { // No rows returned
        // Attempt to auto-create the profile using auth context
        const { data: { user } } = await supabase.auth.getUser();
        if (user && user.id === id) {
          const newProfile = {
            id: user.id,
            full_name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'Novo UsuÃ¡rio',
            email: user.email
          };
          const { data: created, error: createError } = await supabase
            .from('profiles')
            .insert([newProfile])
            .select()
            .single();
          if (createError) throw createError;
          return created as Profile;
        }
      }
      throw error;
    }
    return data as Profile;
  },  async getBySlug(slug: string) {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('slug', slug)
      .single();

    if (error) throw error;
    return data as Profile;
  },

  async getAll() {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('full_name', { ascending: true });

    if (error) throw error;
    return data as Profile[];
  },

  async update(id: string, updates: Partial<Profile>) {
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data as Profile;
  },

  async updateHighEndMode(id: string, enabled: boolean) {
    const { error } = await supabase
      .from('profiles')
      .update({ high_end_mode: enabled })
      .eq('id', id);

    if (error) throw error;
  },

  /** Busca todos os corretores vinculados a um gerente */
  async getTeamByManager(managerId: string) {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('manager_id', managerId)
      .order('full_name', { ascending: true });
    if (error) throw error;
    return (data || []) as Profile[];
  },

  /** Busca todos os gerentes vinculados a um diretor */
  async getManagersByDirector(directorId: string) {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('manager_id', directorId)
      .in('role', ['manager'])
      .order('full_name', { ascending: true });
    if (error) throw error;
    return (data || []) as Profile[];
  },

  /** Retorna toda a arvore hierarquica para admin/diretor */
  async getOrgChart(): Promise<TeamNode[]> {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('full_name', { ascending: true });
    if (error) throw error;

    const all = (data || []) as Profile[];
    const map = new Map<string, TeamNode>();
    all.forEach(p => map.set(p.id, { profile: p, directReports: [] }));

    const roots: TeamNode[] = [];
    all.forEach(p => {
      const mid = (p as Profile & { manager_id?: string }).manager_id;
      if (mid && map.has(mid)) {
        map.get(mid!)!.directReports.push(map.get(p.id)!);
      } else {
        roots.push(map.get(p.id)!);
      }
    });
    return roots;
  },

  /** Atribui um gerente a um corretor (ou remove com null) */
  async assignManager(brokerId: string, managerId: string | null) {
    const { data, error } = await supabase
      .from('profiles')
      .update({ manager_id: managerId })
      .eq('id', brokerId)
      .select()
      .single();
    if (error) throw error;
    return data as Profile;
  },

  /** Agrega stats da equipe de um gerente no mes corrente */
  async getTeamStats(managerId: string) {
    const now = new Date();
    const firstDay = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();

    const { data: team } = await supabase
      .from('profiles')
      .select('id')
      .eq('manager_id', managerId);

    const teamIds = (team || []).map((t: any) => t.id);
    teamIds.push(managerId); // inclui o proprio gerente

    if (teamIds.length === 0) {
      return { activeLeads: 0, monthlySales: 0, monthlyVgv: 0, teamSize: 0 };
    }

    const { count: activeLeads } = await supabase
      .from('leads')
      .select('*', { count: 'exact', head: true })
      .in('assigned_to_id', teamIds)
      .not('status', 'in', '("sale","lost")');

    const { data: sales } = await supabase
      .from('sales')
      .select('total_price')
      .in('broker_id', teamIds)
      .gte('sale_date', firstDay);

    const monthlySales = (sales || []).length;
    const monthlyVgv = (sales || []).reduce((acc: number, s: any) => acc + Number(s.total_price || 0), 0);

    return { activeLeads: activeLeads || 0, monthlySales, monthlyVgv, teamSize: teamIds.length - 1 };
  },
};

