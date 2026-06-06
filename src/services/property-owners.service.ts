import { supabase } from '@/lib/supabase';
import { PropertyOwner } from '@/types/database';

export const PropertyOwnersService = {
  async getByPropertyId(propertyId: string): Promise<PropertyOwner[]> {
    const { data, error } = await supabase
      .from('property_owners')
      .select('*, people(*)')
      .eq('property_id', propertyId);
    if (error) throw error;
    
    return (data || []).map((o: any) => {
      const person = o.people || {};
      const primaryEmail = person.contacts?.find((c: any) => c.type === 'email')?.value || '';
      const primaryPhone = person.contacts?.find((c: any) => c.type === 'phone' || c.type === 'whatsapp' || c.type === 'cel')?.value || '';
      return {
        id: o.id || `${o.property_id}_${o.person_id}`,
        property_id: o.property_id,
        person_id: o.person_id,
        name: person.name || '',
        cpf_cnpj: person.document_id || '',
        phone: primaryPhone,
        email: primaryEmail,
        ownership_percent: o.ownership_percent !== undefined ? o.ownership_percent : 100,
        owner_type: o.owner_type || 'owner',
        created_at: o.created_at || new Date().toISOString()
      };
    });
  },

  async create(owner: Omit<PropertyOwner, 'id' | 'created_at'>): Promise<PropertyOwner> {
    const { data, error } = await supabase
      .from('property_owners')
      .insert([{
        property_id: owner.property_id,
        person_id: owner.person_id,
        ownership_percent: owner.ownership_percent !== undefined ? owner.ownership_percent : 100,
        owner_type: owner.owner_type || 'owner'
      }])
      .select()
      .single();
    if (error) throw error;
    return data as PropertyOwner;
  },

  async update(id: string, owner: Partial<PropertyOwner>): Promise<PropertyOwner> {
    const { data, error } = await supabase
      .from('property_owners')
      .update({
        person_id: owner.person_id,
        ownership_percent: owner.ownership_percent,
        owner_type: owner.owner_type
      })
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
    // 1. Delete existing relationships first
    const { error: delError } = await supabase
      .from('property_owners')
      .delete()
      .eq('property_id', propertyId);
    if (delError) throw delError;

    if (owners.length > 0) {
      const dbOwners = [];

      for (const o of owners) {
        let personId = o.person_id;

        // If manual owner (no person_id), create a person in the base first
        if (!personId && o.name) {
          try {
            let existingPerson = null;
            if (o.cpf_cnpj) {
              const { data: dupDoc } = await supabase
                .from('people')
                .select('id')
                .eq('document_id', o.cpf_cnpj)
                .maybeSingle();
              existingPerson = dupDoc;
            }

            if (!existingPerson) {
              // Create new person in central database
              const contacts = [];
              if (o.email) contacts.push({ type: 'email', value: o.email, is_primary: true });
              if (o.phone) contacts.push({ type: 'phone', value: o.phone, is_primary: true });

              const { data: newPerson, error: createErr } = await supabase
                .from('people')
                .insert({
                  name: o.name,
                  document_id: o.cpf_cnpj || null,
                  roles: ['owner'],
                  relationship_status: 'ativo',
                  person_type: o.cpf_cnpj && o.cpf_cnpj.replace(/[^\d]/g, '').length > 11 ? 'PJ' : 'PF',
                  contacts: contacts
                })
                .select('id')
                .single();

              if (!createErr && newPerson) {
                personId = newPerson.id;
              } else if (createErr) {
                console.error('Error creating person for owner:', createErr.message);
              }
            } else {
              personId = existingPerson.id;
            }
          } catch (err) {
            console.error('Exception creating/linking owner person:', err);
          }
        }

        if (personId) {
          dbOwners.push({
            property_id: propertyId,
            person_id: personId,
            ownership_percent: o.ownership_percent !== undefined ? o.ownership_percent : 100,
            owner_type: o.owner_type || 'owner'
          });
        }
      }

      if (dbOwners.length > 0) {
        const { error: insError } = await supabase
          .from('property_owners')
          .insert(dbOwners);
        if (insError) throw insError;
      }
    }
  }
};
