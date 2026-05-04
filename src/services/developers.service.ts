import { supabase } from '@/lib/supabase';
import { Developer } from '@/types/database';

export const DevelopersService = {
  async getAll() {
    const { data, error } = await supabase
      .from('developers')
      .select('*')
      .order('name');
    
    if (error) throw error;
    return data as Developer[];
  },

  async getById(id: string) {
    const { data, error } = await supabase
      .from('developers')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data as Developer;
  },

  async create(developer: Partial<Developer>) {
    const { data, error } = await supabase
      .from('developers')
      .insert([developer])
      .select()
      .single();
    
    if (error) throw error;
    return data as Developer;
  },

  async update(id: string, updates: Partial<Developer>) {
    const { data, error } = await supabase
      .from('developers')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data as Developer;
  }
};
