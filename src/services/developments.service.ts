import { supabase } from '@/lib/supabase';

export const DevelopmentsService = {
  async getAll() {
    const { data, error } = await supabase
      .from('developments')
      .select('*, developer:people(id, name)')
      .order('name');
    
    if (error) throw error;
    return data;
  },

  async getById(id: string) {
    const { data, error } = await supabase
      .from('developments')
      .select('*, developer:people(id, name), properties(*)')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  },

  async getBySlug(slug: string) {
    const { data, error } = await supabase
      .from('developments')
      .select('*, developer:people(id, name), properties(*)')
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

    // Propagar dados de localização para imóveis vinculados
    const updatePayload: any = {};
    if (development.location_address !== undefined) updatePayload.address_street = development.location_address;
    if (development.location_neighborhood !== undefined) updatePayload.address_neighborhood = development.location_neighborhood;
    if (development.location_city !== undefined) updatePayload.address_city = development.location_city;
    if (development.location_cep !== undefined) updatePayload.address_zip_code = development.location_cep;
    if (development.location_lat !== undefined) updatePayload.latitude = development.location_lat?.toString() || null;
    if (development.location_lng !== undefined) updatePayload.longitude = development.location_lng?.toString() || null;

    if (Object.keys(updatePayload).length > 0) {
      const { error: propError } = await supabase
        .from('properties')
        .update(updatePayload)
        .eq('development_id', id);

      if (propError) {
        console.error('Erro ao propagar localização para imóveis:', propError);
      }
    }
    
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
