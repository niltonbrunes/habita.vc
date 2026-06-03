import { supabase } from '@/lib/supabase';
import { Lead, LeadStatus, SellerLeadStatus, LeadType } from '@/types/database';
import { GamificationService } from './gamification.service';

export const LeadsService = {
  async getAll() {
    try {
      const { data, error } = await supabase
        .from('leads')
        .select('*, person:people(*), property:properties(*)')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const enrichedData = (data || []).map(lead => ({
        ...lead,
        value: lead.value || 0,
        probability: lead.probability || 0,
        lead_type: lead.lead_type || 'buyer',
      }));

      return enrichedData as Lead[];
    } catch (err) {
      console.warn('Erro ao carregar com join, tentando busca simples:', err);
      const { data, error } = await supabase
        .from('leads')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      return (data || []).map(lead => ({
        ...lead,
        value: lead.value || 0,
        probability: lead.probability || 0,
        lead_type: lead.lead_type || 'buyer',
      })) as Lead[];
    }
  },

  /** Retorna apenas leads do tipo especificado (buyer ou seller) */
  async getAllByType(type: LeadType) {
    try {
      const { data, error } = await supabase
        .from('leads')
        .select('*, person:people(*), property:properties(*)')
        .eq('lead_type', type)
        .order('created_at', { ascending: false });

      if (error) throw error;

      return (data || []).map(lead => ({
        ...lead,
        value: lead.value || 0,
        probability: lead.probability || 0,
        lead_type: type,
      })) as Lead[];
    } catch (err) {
      const { data, error } = await supabase
        .from('leads')
        .select('*')
        .eq('lead_type', type)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return (data || []).map(lead => ({
        ...lead,
        value: lead.value || 0,
        probability: lead.probability || 0,
        lead_type: type,
      })) as Lead[];
    }
  },

  async getById(id: string) {
    try {
      const { data, error } = await supabase
        .from('leads')
        .select('*, person:people(*), property:properties(*)')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data as Lead;
    } catch (err) {
      const { data, error } = await supabase
        .from('leads')
        .select('*')
        .eq('id', id)
        .single();
      if (error) throw error;
      return data as Lead;
    }
  },

  async getByStatus(status: LeadStatus | SellerLeadStatus) {
    try {
      const { data, error } = await supabase
        .from('leads')
        .select('*, person:people(*), property:properties(*)')
        .eq('status', status)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Lead[];
    } catch (err) {
      const { data, error } = await supabase
        .from('leads')
        .select('*')
        .eq('status', status)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data as Lead[];
    }
  },

  async updateStatus(id: string, status: LeadStatus | SellerLeadStatus) {
    const { data, error } = await supabase
      .from('leads')
      .update({ status })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    if (data && data.assigned_to_id) {
      GamificationService.handleLeadCreated(data.assigned_to_id).catch(console.error);
    }
    return data as Lead;
  },

  async update(id: string, lead: Partial<Lead>) {
    const { data, error } = await supabase
      .from('leads')
      .update(lead)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data as Lead;
  },

  async create(lead: Partial<Lead>) {
    const { data, error } = await supabase
      .from('leads')
      .insert([lead])
      .select()
      .single();

    if (error) throw error;
    return data as Lead;
  },

  /** Cria um lead do tipo seller (captação) */
  async createSeller(lead: Partial<Lead>) {
    return LeadsService.create({
      ...lead,
      lead_type: 'seller',
      status: 'prospecting' as SellerLeadStatus,
    });
  },

  async bulkCreate(leads: Partial<Lead>[]) {
    const { data, error } = await supabase
      .from('leads')
      .insert(leads)
      .select();

    if (error) throw error;
    (data || []).forEach(lead => {
      if (lead.assigned_to_id)
        GamificationService.handleLeadCreated(lead.assigned_to_id).catch(console.error);
    });
    return data as Lead[];
  },

  async exportToCSV() {
    const { data, error } = await supabase.from('leads').select('*');
    if (error) throw error;
    return data;
  },

  async delete(id: string) {
    const { error } = await supabase.from('leads').delete().eq('id', id);
    if (error) throw error;
  },

  /** Busca leads da equipe de um gerente */
  async getByTeamOf(managerId: string) {
    const { data: teamMembers } = await supabase
      .from('profiles')
      .select('id')
      .eq('manager_id', managerId);

    const teamIds = [(teamMembers || []).map((t: any) => t.id), managerId].flat();

    try {
      const { data, error } = await supabase
        .from('leads')
        .select('*, person:people(*), property:properties(*)')
        .in('assigned_to_id', teamIds)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return (data || []) as Lead[];
    } catch {
      const { data, error } = await supabase
        .from('leads')
        .select('*')
        .in('assigned_to_id', teamIds)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return (data || []) as Lead[];
    }
  },
};
