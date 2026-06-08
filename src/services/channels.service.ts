import { supabase } from '@/lib/supabase';

export const ChannelsService = {
  async getAll() {
    const { data, error } = await supabase
      .from('lead_channels')
      .select('*')
      .order('name');

    if (error) throw error;
    return data;
  }
};
