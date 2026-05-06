'use client';

import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { calculateCommission, CommissionType, CommissionResult } from '@/utils/commission-engine';
import { 
  TrendingUp, 
  DollarSign, 
  Split, 
  UserCheck, 
  Building2, 
  Home,
  CheckCircle2,
  Info,
  ChevronRight
} from 'lucide-react';

export default function CommissionsPage() {
  const [salePrice, setSalePrice] = useState(1200000);
  const [commType, setCommType] = useState<CommissionType>('resale');
  const [customPercent, setCustomPercent] = useState<number | undefined>(undefined);
  const [result, setResult] = useState<CommissionResult | null>(null);

  useEffect(() => {
    const res = calculateCommission(salePrice, commType, customPercent);
    setResult(res);
  }, [salePrice, commType, customPercent]);

  return (
    <DashboardLayout>
      <div className="space-y-8 pb-20">
        <div>
          <h1 className="text-3xl font-bold mb-2">Motor de Comissões & Split</h1>
          <p className="text-muted-foreground">Simule ganhos e configure a distribuição automática por venda.</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Simulation Panel */}
          <div className="space-y-6">
            <div className="bg-white p-8 rounded-3xl shadow-premium border border-border">
              <h3 className="text-lg font-bold mb-6 flex items-center gap-2 text-primary">
                <TrendingUp size={20} className="text-accent" />
                Simulador de Venda
              </h3>
              
              <div className="space-y-6">
                <div>
                  <label className="text-xs font-bold text-muted-foreground uppercase mb-1 block">Valor da Venda</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground font-bold">R$</span>
                    <input 
                      type="number" 
                      value={salePrice}
                      onChange={(e) => setSalePrice(Number(e.target.value))}
                      className="w-full pl-12 pr-4 py-3 bg-muted/50 border border-transparent rounded-xl focus:border-primary/20 focus:outline-none font-bold text-primary"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-muted-foreground uppercase mb-3 block">Tipo de Regra</label>
                  <div className="grid grid-cols-2 gap-2">
                    <RuleTab active={commType === 'launch'} onClick={() => {setCommType('launch'); setCustomPercent(undefined)}} label="Lançamento" />
                    <RuleTab active={commType === 'resale'} onClick={() => {setCommType('resale'); setCustomPercent(undefined)}} label="Revenda" />
                    <RuleTab active={commType === 'high_end'} onClick={() => {setCommType('high_end'); setCustomPercent(undefined)}} label="Alto Padrão" />
                    <RuleTab active={commType === 'independent'} onClick={() => {setCommType('independent'); setCustomPercent(undefined)}} label="Independente" />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-muted-foreground uppercase mb-1 block">Comissão Customizada (%)</label>
                  <div className="relative">
                    <input 
                      type="number" 
                      step="0.01"
                      placeholder="Deixe vazio para usar regra padrão"
                      value={customPercent || ''}
                      onChange={(e) => setCustomPercent(e.target.value ? Number(e.target.value) : undefined)}
                      className="w-full px-4 py-3 bg-muted/50 border border-transparent rounded-xl focus:border-primary/20 focus:outline-none font-bold text-primary"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground font-bold">%</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-primary text-white p-6 rounded-3xl shadow-luxury">
              <div className="flex items-start gap-4">
                <div className="p-2 bg-white/10 rounded-lg text-accent">
                  <Info size={20} />
                </div>
                <div>
                  <p className="text-sm font-bold mb-1">Regra de Revenda</p>
                  <p className="text-xs text-white/60 leading-relaxed">
                    Na revenda padrão, a comissão de 2.5% é dividida igualmente (1.25% cada) entre o captador do imóvel e o captador do comprador.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Results Panel */}
          <div className="lg:col-span-2 space-y-6">
            {result && (
              <div className="bg-white p-8 rounded-3xl shadow-premium border border-border">
                <div className="flex justify-between items-start mb-8">
                  <div>
                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1">Comissão Total Bruta</p>
                    <h2 className="text-4xl font-black text-primary">R$ {result.totalValue.toLocaleString()}</h2>
                    <span className="text-sm font-bold text-accent bg-accent/10 px-2 py-1 rounded-full mt-2 inline-block">
                      {result.totalPercentage}% do VGV
                    </span>
                  </div>
                  <div className="bg-primary/5 p-4 rounded-2xl flex items-center gap-3">
                    <div className="text-right">
                      <p className="text-[10px] font-bold text-muted-foreground uppercase">Ticket da Venda</p>
                      <p className="font-bold text-primary">R$ {salePrice.toLocaleString()}</p>
                    </div>
                    <Building2 className="text-primary/30" />
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-bold flex items-center gap-2">
                    <Split size={20} className="text-primary" />
                    Split de Participantes
                  </h3>
                  
                  <div className="grid gap-3">
                    {result.splits.map((split, i) => (
                      <div key={i} className="flex items-center justify-between p-5 bg-muted/30 rounded-2xl border border-transparent hover:border-primary/10 transition-all group">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-primary shadow-sm">
                            {split.participantRole === 'capturer' ? <Home size={20} /> : <UserCheck size={20} />}
                          </div>
                          <div>
                            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{split.participantRole === 'capturer' ? 'Captador do Imóvel' : 'Vendedor'}</p>
                            <p className="font-bold text-primary">{split.participantName}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-black text-primary">R$ {split.value.toLocaleString()}</p>
                          <p className="text-xs font-bold text-accent">{split.percentage}%</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-10 pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-6">
                  <div className="flex items-center gap-3 text-sm font-bold text-muted-foreground">
                    <CheckCircle2 className="text-green-500" /> Regra aplicada conforme parametrização
                  </div>
                  <button className="bg-primary text-white px-8 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-primary-light transition-all shadow-premium group">
                    Lançar Venda no CRM <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

const RuleTab = ({ active, onClick, label }: any) => (
  <button 
    onClick={onClick}
    className={`px-3 py-2 rounded-xl text-[10px] font-black uppercase tracking-tighter transition-all border ${
      active 
      ? 'bg-primary text-white border-primary shadow-md' 
      : 'bg-white text-muted-foreground border-border hover:border-primary/30'
    }`}
  >
    {label}
  </button>
);
