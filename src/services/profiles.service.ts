import { supabase } from '@/lib/supabase';
import { Profile } from '@/types/database';

export const ProfilesService = {
  async getById(id: string) {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') { // No rows returned
        // Attempt to auto-create the profile using auth context
        const { data: { user } } = await supabase.auth.getUser();
        if (user && user.id === id) {
          const newProfile = {
            id: user.id,
            full_name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'Novo Usuário',
            email: user.email
          };
          const { data: created, error: createError } = await supabase
            .from('profiles')
            .insert([newProfile])
            .select()
            .single();
          if (createError) throw createError;
          return created as Profile;
        }
      }
      throw error;
    }
    return data as Profile;
  },  async getBySlug(slug: string) {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('slug', slug)
      .single();

    if (error) throw error;
    return data as Profile;
  },

  async getAll() {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('full_name', { ascending: true });

    if (error) throw error;
    return data as Profile[];
  },

  async update(id: string, updates: Partial<Profile>) {
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data as Profile;
  },

  async updateHighEndMode(id: string, enabled: boolean) {
    const { error } = await supabase
      .from('profiles')
      .update({ high_end_mode: enabled })
      .eq('id', id);

    if (error) throw error;
  }
};
