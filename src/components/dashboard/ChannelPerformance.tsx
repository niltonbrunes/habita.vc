'use client';

import React, { useEffect, useState } from 'react';
import { Target, TrendingUp, TrendingDown, Info, Loader2, Minus } from 'lucide-react';
import { DashboardService } from '@/services/dashboard.service';
import { useAuth } from '@/context/AuthContext';

export function ChannelPerformance() {
  const { user } = useAuth();
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPerformance() {
      if (!user) return;
      try {
        const result = await DashboardService.getChannelPerformance(user.id);
        setData(result);
      } catch (err) {
        console.error('Failed to load channel performance', err);
      } finally {
        setLoading(false);
      }
    }
    fetchPerformance();
  }, [user]);

  if (loading) {
    return (
      <div className="bg-white p-8 rounded-[2.5rem] shadow-premium border border-border flex items-center justify-center min-h-[300px]">
        <Loader2 className="animate-spin text-primary w-8 h-8" />
      </div>
    );
  }

  const displayData = data.filter(d => d.total > 0 || d.benchmark > 0);

  return (
    <div className="bg-white p-8 rounded-[2.5rem] shadow-premium border border-border space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-accent/10 rounded-xl text-accent">
            <Target size={20} />
          </div>
          <div>
            <h2 className="text-xl font-black text-primary uppercase tracking-tight">Análise de Canais</h2>
            <p className="text-sm text-muted-foreground">Conversão Real vs Benchmark de Mercado</p>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[600px]">
          <thead>
            <tr className="border-b border-border/50">
              <th className="pb-3 text-xs font-black text-muted-foreground uppercase tracking-wider">Canal (Origem)</th>
              <th className="pb-3 text-xs font-black text-muted-foreground uppercase tracking-wider text-center">Volume (Leads ➔ Opps)</th>
              <th className="pb-3 text-xs font-black text-muted-foreground uppercase tracking-wider text-center">Conversão Real</th>
              <th className="pb-3 text-xs font-black text-muted-foreground uppercase tracking-wider text-center">Meta (Benchmark)</th>
              <th className="pb-3 text-xs font-black text-muted-foreground uppercase tracking-wider text-right">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/30">
            {displayData.map((item, idx) => {
              const isAbove = item.convReal >= item.benchmark && item.total > 0;
              const noData = item.total === 0;

              return (
                <tr key={idx} className="group hover:bg-muted/10 transition-colors">
                  <td className="py-4">
                    <span className="font-bold text-primary">{item.source}</span>
                  </td>
                  <td className="py-4 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <span className="text-sm font-medium bg-muted px-2 py-1 rounded-md">{item.total}</span>
                      <span className="text-muted-foreground text-xs">-&gt;</span>
                      <span className="text-sm font-bold text-accent bg-accent/10 px-2 py-1 rounded-md">{item.opps}</span>
                    </div>
                  </td>
                  <td className="py-4 text-center">
                    <span className={`text-lg font-black ${noData ? 'text-muted-foreground' : 'text-primary'}`}>
                      {noData ? '-' : `${item.convReal}%`}
                    </span>
                  </td>
                  <td className="py-4 text-center">
                    <span className="text-sm font-medium text-muted-foreground">
                      {item.benchmark > 0 ? `${item.benchmark}%` : 'N/A'}
                    </span>
                  </td>
                  <td className="py-4 text-right">
                    <div className="flex items-center justify-end">
                      {noData ? (
                        <div className="flex items-center gap-1 text-muted-foreground bg-muted/30 px-3 py-1 rounded-full text-xs font-bold w-fit ml-auto">
                          <Minus size={14} /> Sem dados
                        </div>
                      ) : isAbove ? (
                        <div className="flex items-center gap-1 text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full text-xs font-bold w-fit ml-auto">
                          <TrendingUp size={14} /> Acima da Média
                        </div>
                      ) : (
                        <div className="flex items-center gap-1 text-rose-500 bg-rose-50 px-3 py-1 rounded-full text-xs font-bold w-fit ml-auto">
                          <TrendingDown size={14} /> Abaixo
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="flex items-start gap-3 bg-muted/30 p-4 rounded-xl border border-border/50">
        <Info size={20} className="text-accent shrink-0 mt-0.5" />
        <div className="text-xs text-muted-foreground">
          <p><strong className="text-primary">Oportunidade Validada:</strong> Consideramos que um lead se tornou uma oportunidade real quando avançou no funil para as etapas de <strong>Apresentação, Visita, Proposta ou Venda</strong>.</p>
        </div>
      </div>
    </div>
  );
}