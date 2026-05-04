import { supabase } from '@/lib/supabase';
import { Property } from '@/types/database';

export const PropertiesService = {
  async getAllFiltered(filters: { brokerId?: string }) {
    let query = supabase
      .from('properties')
      .select('*, development:developments(*)');
    
    if (filters.brokerId) {
      query = query.eq('registered_by_id', filters.brokerId);
    }
    
    const { data, error } = await query.order('created_at', { ascending: false });
    
    if (error) throw error;
    return { data };
  },

  async getAll() {
    const { data, error } = await supabase
      .from('properties')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data as Property[];
  },

  async getById(id: string) {
    const { data, error } = await supabase
      .from('properties')
      .select('*, development:developments(*, developer:developers(*))')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  },

  async getByReference(reference: string) {
    return await supabase
      .from('properties')
      .select('*')
      .eq('reference', reference)
      .maybeSingle();
  },

  async create(property: Partial<Property>) {
    const { data, error } = await supabase
      .from('properties')
      .insert([property])
      .select()
      .single();

    if (error) throw error;
    return data as Property;
  }
};
