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
      .select('*, development:developments(*, developer:developers(*)), registered_by_profile:profiles(*)')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  },

  async getBySlug(city: string, slug: string) {
    const { data, error } = await supabase
      .from('properties')
      .select('*, development:developments(*, developer:developers(*)), registered_by_profile:profiles(*)')
      .ilike('address_city', city)
      .eq('slug', slug)
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
  },

  async update(id: string, property: Partial<Property>) {
    const { data, error } = await supabase
      .from('properties')
      .update(property)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data as Property;
  },

  async delete(id: string) {
    const { error } = await supabase
      .from('properties')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },

  async getRelated(property: Property, limit = 3) {
    const minPrice = property.price * 0.7;
    const maxPrice = property.price * 1.3;

    const { data, error } = await supabase
      .from('properties')
      .select('*')
      .eq('type', property.type)
      .eq('address_city', property.address_city)
      .neq('id', property.id) // Excluir o atual
      .gte('price', minPrice)
      .lte('price', maxPrice)
      .limit(limit);

    if (error) return [];
    return data as Property[];
  }
};
