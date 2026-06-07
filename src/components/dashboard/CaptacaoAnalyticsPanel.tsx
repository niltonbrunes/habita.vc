'use client';

import React, { useEffect, useState } from 'react';
import { Loader2, Home, TrendingUp, Package, MapPin, Clock, Percent, BarChart3, Building2 } from 'lucide-react';
import { CaptacaoAnalyticsService, CaptacaoAnalyticsData } from '@/services/captacao-analytics.service';
import { useAuth } from '@/context/AuthContext';

const fmt = (val: number) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(val);

const fmtM = (val: number) => {
  if (val >= 1_000_000) return `R$ ${(val / 1_000_000).toFixed(1)}M`;
  if (val >= 1_000)     return `R$ ${(val / 1_000).toFixed(0)}k`;
  return fmt(val);
};

const TIPO_ICON: Record<string, string> = {
  'Apartamento': '🏢', 'Casa': '🏠', 'Casa de Condomínio': '🏡',
  'Terreno': '🌱', 'Cobertura': '🌆', 'Studio / Kitnet': '🏙️',
  'Sala Comercial': '🏪', 'Loja': '🏬', 'Galpão': '🏭', 'Outro': '📦',
};

export function CaptacaoAnalyticsPanel() {
  const { user, profile } = useAuth();
  const [data, setData] = useState<CaptacaoAnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'bairros' | 'tipologias'>('bairros');

  useEffect(() => {
    if (!user) return;
    CaptacaoAnalyticsService.getData(user.id, (profile as any)?.role)
      .then(setData)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [user, profile]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="animate-spin text-emerald-500 w-8 h-8" />
      </div>
    );
  }

  if (!data) return null;

  const { kpis, funnel, bairros, tipologias } = data;
  const funnelMax = Math.max(...funnel.filter(f => f.status !== 'lost').map(f => f.count), 1);
  const activeFunnel = funnel.filter(f => f.status !== 'lost');
  const lostStage = funnel.find(f => f.status === 'lost');

  return (
    <div className="space-y-6">
      {/* ── KPI Cards ── */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-3">
        {[
          { icon: <Package size={16} />, label: 'Captados', value: kpis.totalCaptados.toString(), color: 'text-emerald-600', bg: 'bg-emerald-50 border-emerald-100' },
          { icon: <TrendingUp size={16} />, label: 'Em Andamento', value: kpis.emAndamento.toString(), color: 'text-blue-600', bg: 'bg-blue-50 border-blue-100' },
          { icon: <Building2 size={16} />, label: 'Valor Total', value: fmtM(kpis.valorTotal), color: 'text-violet-600', bg: 'bg-violet-50 border-violet-100' },
          { icon: <Home size={16} />, label: 'Ticket Médio', value: fmtM(kpis.ticketMedio), color: 'text-orange-600', bg: 'bg-orange-50 border-orange-100' },
          { icon: <Clock size={16} />, label: 'Velocidade Média', value: `${kpis.velocidadeMedia}d`, color: 'text-cyan-600', bg: 'bg-cyan-50 border-cyan-100' },
        ].map((kpi, i) => (
          <div key={i} className={`rounded-2xl border p-4 ${kpi.bg}`}>
            <div className={`flex items-center gap-1.5 mb-2 ${kpi.color}`}>
              {kpi.icon}
              <span className="text-[10px] font-black uppercase tracking-widest">{kpi.label}</span>
            </div>
            <p className={`text-2xl font-black ${kpi.color}`}>{kpi.value}</p>
            {i === 0 && kpis.taxaConversao > 0 && (
              <p className="text-[9px] text-emerald-500 font-bold mt-1">{kpis.taxaConversao}% conv. rate</p>
            )}
          </div>
        ))}
      </div>

      {/* ── Funil + Análise ── */}
      <div className="grid grid-cols-1 xl:grid-cols-[340px_1fr] gap-6">

        {/* Funil de Captação */}
        <div className="bg-surface border border-border rounded-2xl p-5 space-y-3">
          <div className="flex items-center gap-2 mb-1">
            <div className="p-1.5 bg-emerald-50 rounded-lg text-emerald-600"><BarChart3 size={15} /></div>
            <h3 className="text-xs font-black uppercase tracking-widest text-heading">Funil de Captação</h3>
          </div>

          {activeFunnel.map((stage, idx) => {
            const pct = Math.max(15, Math.round((stage.count / funnelMax) * 100));
            return (
              <div key={stage.status}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[11px] font-bold text-muted-foreground">{stage.label}</span>
                  <span className="text-[12px] font-black" style={{ color: stage.color }}>{stage.count}</span>
                </div>
                <div className="h-2 bg-border/40 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{ width: `${pct}%`, backgroundColor: stage.color }}
                  />
                </div>
              </div>
            );
          })}

          {lostStage && lostStage.count > 0 && (
            <div className="pt-2 border-t border-border/40">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-muted-foreground/60">❌ {lostStage.label}</span>
                <span className="text-[11px] font-bold text-muted-foreground/60">{lostStage.count}</span>
              </div>
            </div>
          )}
        </div>

        {/* Análise por Bairro / Tipologia */}
        <div className="bg-surface border border-border rounded-2xl p-5 space-y-4">
          {/* Tabs */}
          <div className="flex items-center gap-1 bg-muted/50 rounded-xl p-1 w-fit">
            {([
              { key: 'bairros', label: '📍 Por Bairro', icon: <MapPin size={12} /> },
              { key: 'tipologias', label: '🏗️ Por Tipologia', icon: <Home size={12} /> },
            ] as const).map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${
                  activeTab === tab.key
                    ? 'bg-emerald-500 text-white shadow-sm'
                    : 'text-muted-foreground hover:text-primary'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Bairros */}
          {activeTab === 'bairros' && (
            <div className="space-y-3">
              {bairros.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-8">Nenhum bairro identificado. Verifique o endereço nos leads de captação.</p>
              ) : (
                bairros.map((b, idx) => {
                  const total = b.captados + b.emAndamento;
                  const demandaBadge = b.demanda > 0
                    ? <span className="text-[9px] font-black px-1.5 py-0.5 bg-blue-50 text-blue-600 rounded-full">{b.demanda} demanda</span>
                    : null;
                  const alert = b.demanda > b.captados * 2
                    ? <span className="text-[9px] font-black px-1.5 py-0.5 bg-amber-50 text-amber-600 rounded-full">🔥 Alta demanda!</span>
                    : b.captados > 3 && b.demanda < 2
                      ? <span className="text-[9px] font-black px-1.5 py-0.5 bg-violet-50 text-violet-600 rounded-full">📢 Campanha oferta</span>
                      : null;

                  return (
                    <div key={b.bairro} className="flex items-center gap-3 group">
                      <div className="w-5 text-[10px] font-black text-muted-foreground/50 flex-shrink-0">{idx + 1}</div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                          <span className="text-[12px] font-black text-heading truncate">{b.bairro}</span>
                          {demandaBadge}
                          {alert}
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="flex-1 h-1.5 bg-border/40 rounded-full overflow-hidden">
                            <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${Math.min(100, (b.captados / (bairros[0]?.captados || 1)) * 100)}%` }} />
                          </div>
                          <div className="flex items-center gap-1 text-[9px] font-bold text-muted-foreground flex-shrink-0">
                            <span className="text-emerald-600">✓{b.captados}</span>
                            {b.emAndamento > 0 && <span className="text-blue-500">●{b.emAndamento}</span>}
                            {b.valorTotal > 0 && <span className="text-violet-500">{fmtM(b.valorTotal)}</span>}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
              <p className="text-[9px] text-muted-foreground/50 pt-1">✓ captados ● em andamento — 🔥 demanda alta = oportunidade de captação</p>
            </div>
          )}

          {/* Tipologias */}
          {activeTab === 'tipologias' && (
            <div className="space-y-3">
              {tipologias.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-8">Nenhuma tipologia encontrada nos leads captados.</p>
              ) : (
                tipologias.map((t) => (
                  <div key={t.tipo} className="flex items-center gap-3">
                    <span className="text-lg flex-shrink-0">{TIPO_ICON[t.tipo] || '📦'}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-0.5">
                        <span className="text-[12px] font-black text-heading">{t.tipo}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-bold text-emerald-600">{t.captados} un.</span>
                          <span className="text-[10px] font-bold text-muted-foreground">{fmtM(t.ticketMedio)}/un</span>
                        </div>
                      </div>
                      <div className="h-2 bg-border/40 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-emerald-400 to-emerald-600 rounded-full transition-all duration-700"
                          style={{ width: `${t.percentual}%` }}
                        />
                      </div>
                      <p className="text-[9px] font-bold text-muted-foreground/60 mt-0.5">{t.percentual}% do estoque captado · Total {fmtM(t.valorTotal)}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
