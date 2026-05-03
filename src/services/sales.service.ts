import { supabase } from '@/lib/supabase';
import { Sale } from '@/types/database';

export const SalesService = {
  async getAll() {
    const { data, error } = await supabase
      .from('sales')
      .select('*, leads(name), properties(title)')
      .order('sale_date', { ascending: false });

    if (error) throw error;
    return data;
  },

  async create(sale: Partial<Sale>) {
    // 1. Create the sale record
    const { data, error } = await supabase
      .from('sales')
      .insert({
        ...sale,
        sale_date: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) throw error;

    // 2. Update lead status to 'sale'
    if (sale.lead_id) {
      await supabase
        .from('leads')
        .update({ 
          status: 'sale',
          history: supabase.rpc('append_to_history', { 
            new_entry: { type: 'sale', date: new Date().toISOString(), note: `Venda realizada! Valor: R$ ${sale.sale_price}` } 
          })
        })
        .eq('id', sale.lead_id);
    }

    return data as Sale;
  }
};
