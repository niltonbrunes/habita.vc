import { supabase } from '@/lib/supabase';
import { Property, Lead } from '@/types/database';

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
      .select('*, development:developments(*, developer:people(id, name)), registered_by_profile:profiles(*)')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  },

  async getBySlug(city: string, slugOrId: string) {
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(slugOrId);

    let query = supabase
      .from('properties')
      .select('*, development:developments(*, developer:people(id, name)), registered_by_profile:profiles(*)');

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

  /**
   * Cria um imóvel automaticamente a partir de um lead vendedor captado.
   * O imóvel nasce com status "suspended" — aguardando fotos e descrição comercial
   * antes de ser publicado em portais.
   */
  async createFromSellerLead(lead: Lead, brokerId: string): Promise<Property> {
    // Parse o endereço se disponível
    const addressParts = (lead.seller_property_address || '').split(',');
    const street = addressParts[0]?.trim() || '';
    const neighborhood = addressParts[1]?.trim() || '';
    const city = addressParts[2]?.trim() || '';

    const ownerName = lead.person?.name || lead.name;

    const propertyPayload: Partial<Property> = {
      registered_by_id: brokerId,
      title: `${lead.seller_property_type || 'Imóvel'} - ${neighborhood || street || 'Localização a confirmar'}`,
      description: [
        `Imóvel captado via pipeline de captação.`,
        lead.seller_motivation ? `Motivação do proprietário: ${lead.seller_motivation}.` : '',
        `Proprietário: ${ownerName}.`,
        `Contato: ${lead.phone || lead.email || '-'}.`,
        `\n⚠️ Aguardando fotos e descrição comercial para publicação.`,
      ].filter(Boolean).join('\n'),
      type: lead.seller_property_type || 'Outro',
      transaction_type: 'sale',
      property_category: 'residential',
      price: lead.seller_asking_price || 0,
      area_total: lead.seller_property_area || 0,
      area_useful: lead.seller_property_area || 0,
      rooms: lead.seller_rooms || 0,
      suites: 0,
      bathrooms: 0,
      parking_spaces: 0,
      status: 'suspended' as any, // Suspenso: aguardando preparação comercial
      pattern: 'medium',
      address_street: street,
      address_neighborhood: neighborhood,
      address_city: city || 'A confirmar',
      address_state: '',
      is_highlight: false,
      images: [],
      metadata: {
        origin: 'captacao',
        seller_lead_id: lead.id,
        captured_at: new Date().toISOString(),
      },
    };

    return PropertiesService.create(propertyPayload);
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
    const { error } = await supabase.from('properties').delete().eq('id', id);
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
      .neq('id', property.id)
      .gte('price', minPrice)
      .lte('price', maxPrice)
      .limit(limit);

    if (error) return [];
    return data as Property[];
  },

  async search(term: string) {
    const { data: properties, error: pError } = await supabase
      .from('properties')
      .select('*')
      .or(`title.ilike.%${term}%,reference.ilike.%${term}%`)
      .limit(5);

    const { data: developments, error: dError } = await supabase
      .from('developments')
      .select('*')
      .ilike('name', `%${term}%`)
      .limit(3);

    if (pError || dError) throw pError || dError;

    const results = [
      ...(properties || []).map(p => ({ ...p, _type: 'property' })),
      ...(developments || []).map(d => ({
        ...d,
        title: d.name,
        _type: 'development',
        price: d.price_starting_at,
      })),
    ];

    return results;
  },
};
