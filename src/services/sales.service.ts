import { supabase } from '@/lib/supabase';
import { Sale } from '@/types/database';

import { GamificationService } from './gamification.service';

export const SalesService = {
  async getAll() {
    const { data: sales, error: salesErr } = await supabase
      .from('sales')
      .select('*, leads(name), properties(title)')
      .order('sale_date', { ascending: false });

    if (salesErr) throw salesErr;

    const { data: commissions } = await supabase
      .from('commissions')
      .select('*');

    return (sales || []).map(s => {
      const comm = commissions?.find(c => c.sale_id === s.id);
      const brokerSplit = comm?.split_details?.find((p: any) => p.role === 'broker');
      const managerSplit = comm?.split_details?.find((p: any) => p.role === 'manager');
      const totalComm = Number(comm?.total_commission_value || 0);
      const brokerComm = Number(brokerSplit?.value || 0);
      const managerComm = Number(managerSplit?.value || 0);
      
      const brokerPercent = brokerSplit?.percent || 50;
      const totalPercent = s.total_price > 0 ? (totalComm / Number(s.total_price)) * 100 : 5;

      return {
        ...s,
        sale_price: Number(s.total_price || 0),
        total_commission: totalComm,
        broker_commission: brokerComm,
        manager_commission: managerComm,
        split_type: 'direct',
        split_metadata: {
          total_percent: totalPercent,
          broker_percent: brokerPercent
        }
      };
    });
  },


  async update(id: string, sale: Partial<any>) {
    const { error } = await supabase
      .from('sales')
      .update({
        total_price: sale.sale_price,
        property_id: sale.property_id,
        lead_id: sale.lead_id,
      })
      .eq('id', id);
    if (error) throw error;

    // Update commission if needed
    if (sale.total_commission !== undefined || sale.broker_commission !== undefined) {
      const brokerPercent = sale.split_metadata?.broker_percent || 50;
      const totalCommVal = sale.total_commission || 0;
      const brokerCommVal = sale.broker_commission || 0;
      const managerCommVal = sale.manager_commission || (totalCommVal - brokerCommVal);

      const { data: existingComm } = await supabase
        .from('commissions')
        .select('id')
        .eq('sale_id', id)
        .single();

      if (existingComm) {
        await supabase.from('commissions').update({
          total_commission_value: totalCommVal,
          split_details: [
            { role: 'broker', value: brokerCommVal, percent: brokerPercent },
            { role: 'manager', value: managerCommVal, percent: 100 - brokerPercent }
          ]
        }).eq('sale_id', id);
      }
    }
  },

  async delete(id: string) {
    // Delete commissions first (foreign key)
    await supabase.from('commissions').delete().eq('sale_id', id);
    
    const { error } = await supabase.from('sales').delete().eq('id', id);
    if (error) throw error;
  },

  async getAllFull() {
    const { data: sales, error } = await supabase
      .from('sales')
      .select('*, leads(name, person_id), properties(title, price), profiles(full_name)')
      .order('sale_date', { ascending: false });
    if (error) throw error;

    const { data: commissions } = await supabase.from('commissions').select('*');

    return (sales || []).map(s => {
      const comm = commissions?.find((c: any) => c.sale_id === s.id);
      const brokerSplit = comm?.split_details?.find((p: any) => p.role === 'broker');
      const totalComm = Number(comm?.total_commission_value || 0);
      const brokerComm = Number(brokerSplit?.value || 0);
      const brokerPercent = brokerSplit?.percent || 50;
      const salePrice = Number(s.total_price || 0);
      const totalPercent = salePrice > 0 ? (totalComm / salePrice) * 100 : 5;

      return {
        ...s,
        sale_price: salePrice,
        total_commission: totalComm,
        broker_commission: brokerComm,
        manager_commission: totalComm - brokerComm,
        split_type: 'direct',
        split_metadata: { total_percent: totalPercent, broker_percent: brokerPercent }
      };
    });
  },
  async create(sale: Partial<Sale>) {
    // 1. Create the sale record in the database using exact database columns
    const { data: saleData, error: saleError } = await supabase
      .from('sales')
      .insert({
        lead_id: sale.lead_id,
        property_id: sale.property_id,
        broker_id: sale.broker_id,
        total_price: sale.sale_price || 0,
        sale_date: new Date().toISOString(),
      })
      .select()
      .single();

    if (saleError) throw saleError;

    if (saleData.broker_id) {
      GamificationService.handleSale(saleData.broker_id, saleData.total_price).catch(console.error);
    }

    // 2. Create the commission and split details record
    try {
      const brokerPercent = sale.split_metadata?.broker_percent || 50;
      const totalCommVal = sale.total_commission || 0;
      const brokerCommVal = sale.broker_commission || 0;
      const managerCommVal = sale.manager_commission || (totalCommVal - brokerCommVal);

      const { error: commError } = await supabase
        .from('commissions')
        .insert({
          sale_id: saleData.id,
          total_commission_value: totalCommVal,
          split_details: [
            {
              participant_id: sale.broker_id,
              role: 'broker',
              value: brokerCommVal,
              percent: brokerPercent
            },
            {
              participant_id: null,
              role: 'manager',
              value: managerCommVal,
              percent: 100 - brokerPercent
            }
          ],
          status: 'projected'
        });

      if (commError) {
        console.error('Erro ao registrar comissão no banco de dados:', commError);
      }
    } catch (commErr) {
      console.error('Erro ao processar objeto de comissão:', commErr);
    }

    // 3. Update lead status to 'sale' and append to history safely
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

    // Return the mapped Sale object format expected by the frontend
    return {
      ...saleData,
      sale_price: Number(saleData.total_price || 0),
      total_commission: sale.total_commission || 0,
      broker_commission: sale.broker_commission || 0,
      manager_commission: sale.manager_commission || 0,
      split_type: 'direct',
      split_metadata: sale.split_metadata
    } as any;
  }
};
