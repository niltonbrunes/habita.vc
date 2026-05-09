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

  async getBySlug(city: string, slugOrId: string) {
    // Check if it's a UUID to decide the query strategy
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(slugOrId);
    
    let query = supabase
      .from('properties')
      .select('*, development:developments(*, developer:developers(*)), registered_by_profile:profiles(*)');

    if (isUuid) {
      query = query.eq('id', slugOrId);
    } else {
      query = query.eq('slug', slugOrId);
    }

    const { data, error } = await query.maybeSingle();

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
  },

  async search(term: string) {
    // Busca em Imóveis
    const { data: properties, error: pError } = await supabase
      .from('properties')
      .select('*')
      .or(`title.ilike.%${term}%,reference.ilike.%${term}%`)
      .limit(5);

    // Busca em Empreendimentos
    const { data: developments, error: dError } = await supabase
      .from('developments')
      .select('*')
      .ilike('name', `%${term}%`)
      .limit(3);

    if (pError || dError) throw pError || dError;

    // Normaliza os resultados para o componente de busca
    const results = [
      ...(properties || []).map(p => ({ ...p, _type: 'property' })),
      ...(developments || []).map(d => ({ ...d, title: d.name, _type: 'development', price: d.price_starting_at }))
    ];

    return results;
  }
};
