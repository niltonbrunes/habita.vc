import { supabase } from '@/lib/supabase';
import { Lead, LeadStatus } from '@/types/database';

export const LeadsService = {
  async getAll() {
    const { data, error } = await supabase
      .from('leads')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data as Lead[];
  },

  async getById(id: string) {
    const { data, error } = await supabase
      .from('leads')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data as Lead;
  },

  async getByStatus(status: LeadStatus) {
    const { data, error } = await supabase
      .from('leads')
      .select('*')
      .eq('status', status)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data as Lead[];
  },

  async updateStatus(id: string, status: LeadStatus) {
    const { data, error } = await supabase
      .from('leads')
      .update({ status })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
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

  async bulkCreate(leads: Partial<Lead>[]) {
    const { data, error } = await supabase
      .from('leads')
      .insert(leads)
      .select();

    if (error) throw error;
    return data as Lead[];
  },

  async exportToCSV() {
    const { data, error } = await supabase
      .from('leads')
      .select('*');
    
    if (error) throw error;
    return data;
  }
};
