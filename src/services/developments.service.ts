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

  async getBySlug(slug: string) {
    const { data, error } = await supabase
      .from('developments')
      .select('*, developer:developers(*), properties(*)')
      .eq('slug', slug)
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
  },

  async update(id: string, development: Partial<any>) {
    const { data, error } = await supabase
      .from('developments')
      .update(development)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async delete(id: string) {
    const { error } = await supabase
      .from('developments')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }
};
