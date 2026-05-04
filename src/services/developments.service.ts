import { supabase } from '@/lib/supabase';

export const DevelopmentsService = {
  async getAll() {
    const { data, error } = await supabase
      .from('developments')
      .select('*, developer:developers(*)')
      .order('name');
    
    if (error) throw error;
    return data;
  },

  async getById(id: string) {
    const { data, error } = await supabase
      .from('developments')
      .select('*, developer:developers(*), properties(*)')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  },

  async create(development: any) {
    const { data, error } = await supabase
      .from('developments')
      .insert([development])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }
};
