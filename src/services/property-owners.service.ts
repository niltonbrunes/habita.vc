import { supabase } from '@/lib/supabase';
import { PropertyOwner } from '@/types/database';

export const PropertyOwnersService = {
  async getByPropertyId(propertyId: string): Promise<PropertyOwner[]> {
    const { data, error } = await supabase
      .from('property_owners')
      .select('*')
      .eq('property_id', propertyId);
    if (error) throw error;
    return data as PropertyOwner[];
  },

  async create(owner: Omit<PropertyOwner, 'id' | 'created_at'>): Promise<PropertyOwner> {
    const { data, error } = await supabase
      .from('property_owners')
      .insert([owner])
      .select()
      .single();
    if (error) throw error;
    return data as PropertyOwner;
  },

  async update(id: string, owner: Partial<PropertyOwner>): Promise<PropertyOwner> {
    const { data, error } = await supabase
      .from('property_owners')
      .update(owner)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data as PropertyOwner;
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('property_owners')
      .delete()
      .eq('id', id);
    if (error) throw error;
  },

  async replaceAll(propertyId: string, owners: Omit<PropertyOwner, 'id' | 'created_at' | 'property_id'>[]): Promise<void> {
    // Delete existing and insert new in one operation
    const { error: delError } = await supabase
      .from('property_owners')
      .delete()
      .eq('property_id', propertyId);
    if (delError) throw delError;

    if (owners.length > 0) {
      const { error: insError } = await supabase
        .from('property_owners')
        .insert(owners.map(o => ({ ...o, property_id: propertyId })));
      if (insError) throw insError;
    }
  }
};
