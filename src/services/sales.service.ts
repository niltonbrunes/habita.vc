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
    const { data: saleData, error: saleError } = await supabase
      .from('sales')
      .insert({
        ...sale,
        sale_date: new Date().toISOString(),
      })
      .select()
      .single();

    if (saleError) throw saleError;

    // 2. Update lead status to 'sale' and append to history safely
    if (sale.lead_id) {
      try {
        const { data: leadData, error: leadError } = await supabase
          .from('leads')
          .select('history')
          .eq('id', sale.lead_id)
          .single();

        let currentHistory = [];
        if (!leadError && leadData && Array.isArray(leadData.history)) {
          currentHistory = leadData.history;
        }

        const newEntry = {
          type: 'sale',
          date: new Date().toISOString(),
          note: `Venda realizada! Valor: R$ ${sale.sale_price?.toLocaleString('pt-BR') || sale.sale_price}`
        };

        const updatedHistory = [...currentHistory, newEntry];

        const { error: updateError } = await supabase
          .from('leads')
          .update({ 
            status: 'sale',
            history: updatedHistory
          })
          .eq('id', sale.lead_id);

        if (updateError) {
          console.error('Erro ao atualizar lead para status de venda:', updateError);
        }
      } catch (historyErr) {
        console.error('Erro ao processar atualizacao do lead:', historyErr);
      }
    }

    return saleData as Sale;
  }
};
