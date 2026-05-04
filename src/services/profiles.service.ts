import { supabase } from '@/lib/supabase';
import { Profile } from '@/types/database';

export const ProfilesService = {
  async getById(id: string) {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
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
