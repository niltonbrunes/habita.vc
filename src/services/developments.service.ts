import { supabase } from '@/lib/supabase';
import { Development } from '@/types/database';

export const DevelopmentsService = {
  async getAll() {
    const { data, error } = await supabase
      .from('developments')
      .select('*, developer:developers(name, logo_url)')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  async getById(id: string) {
    const { data, error } = await supabase
      .from('developments')
      .select('*, developer:developers(name, logo_url)')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  },

  async create(development: Partial<Development>) {
    const { data, error } = await supabase
      .from('developments')
      .insert(development)
      .select()
      .single();

    if (error) throw error;
    return data as Development;
  }
};
