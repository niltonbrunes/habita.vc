import { supabase } from '@/lib/supabase';
import { Person } from '@/types/people';

export const PeopleService = {
  async getAll(filters?: { role?: string; search?: string; type?: 'PF' | 'PJ' }) {
    let query = supabase
      .from('people')
      .select('*')
      .order('created_at', { ascending: false });

    if (filters?.role) {
      query = query.contains('roles', [filters.role]);
    }
    if (filters?.type) {
      query = query.eq('person_type', filters.type);
    }
    if (filters?.search) {
      const searchTerm = `%${filters.search}%`;
      query = query.or(`name.ilike.${searchTerm},document_id.ilike.${searchTerm},fantasy_name.ilike.${searchTerm}`);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data as Person[];
  },

  async getById(id: string) {
    const { data, error } = await supabase
      .from('people')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data as Person;
  },

  async checkDuplicateDocument(documentId: string, excludeId?: string) {
    if (!documentId) return false;
    let query = supabase
      .from('people')
      .select('id, name')
      .eq('document_id', documentId);
      
    if (excludeId) {
      query = query.neq('id', excludeId);
    }
    
    const { data, error } = await query.limit(1);
    if (error) return false;
    return data && data.length > 0 ? data[0] : null;
  },

  async findByContact(contact: string) {
    if (!contact) return null;
    const { data, error } = await supabase
      .from('people')
      .select('id, name, contacts')
      .or(`contacts.cs.[{"value":"${contact}"}]`) // Busca dentro do JSONB de contatos
      .limit(1);

    if (error) {
      // Fallback para busca mais simples se o contains falhar (depende da config do postgres)
      const { data: fallbackData } = await supabase
        .from('people')
        .select('id, name')
        .ilike('name', `%${contact}%`)
        .limit(1);
      return fallbackData?.[0] || null;
    }
    return data?.[0] || null;
  },

  async create(personData: Partial<Person>) {
    const { data, error } = await supabase
      .from('people')
      .insert([personData])
      .select()
      .single();

    if (error) throw error;
    return data as Person;
  },

  async update(id: string, personData: Partial<Person>) {
    const { data, error } = await supabase
      .from('people')
      .update({ ...personData, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data as Person;
  },

  async delete(id: string) {
    const { error } = await supabase
      .from('people')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },

  // Helper for PropertyWizard: Search people to link as owners
  async searchForOwners(searchQuery: string) {
    const term = `%${searchQuery}%`;
    const { data, error } = await supabase
      .from('people')
      .select('id, name, document_id, contacts')
      .or(`name.ilike.${term},document_id.ilike.${term}`)
      .limit(10);

    if (error) throw error;
    return data;
  }
};
