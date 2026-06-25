'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles, Brain, MessageSquare, Zap, Home, UserPlus, TrendingUp,
  Cpu, CheckCircle2, Loader2, Search, Copy, Check, MapPin, DollarSign,
  Users, AlertCircle, RefreshCw, Mail, Target, BarChart3
} from 'lucide-react';
import { PropertiesService } from '@/services/properties.service';
import { LeadsService } from '@/services/leads.service';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import { CaptacaoAnalyticsPanel } from '@/components/dashboard/CaptacaoAnalyticsPanel';
import type { ProspeccaoResponse } from '@/app/api/ai/prospeccao/route';

// ─── Types ──────────────────────────────────────────────────────────────────

type AiState = 'idle' | 'analyzing' | 'results' | 'error';

interface CompatibleLead {
  id: string;
  name: string;
  temperature: string;
  status: string;
  score: number;
  phone?: string;
  interest_description?: string;
  value?: number;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

const TEMP_COLORS: Record<string, string> = {
  hot: 'bg-red-500/10 text-red-400 border-red-400/30',
  warm: 'bg-orange-500/10 text-orange-400 border-orange-400/30',
  cold: 'bg-blue-500/10 text-blue-400 border-blue-400/30',
};
const TEMP_LABELS: Record<string, string> = { hot: 'Quente', warm: 'Morno', cold: 'Frio' };

// ─── Component ────────────────────────────────────────────────────────────────

export default function ProspeccaoPage() {
  const { user } = useAuth();

  const [loadingProps, setLoadingProps] = useState(true);
  const [properties, setProperties] = useState<any[]>([]);
  const [allLeads, setAllLeads] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [selectedProperty, setSelectedProperty] = useState<any>(null);
  const [aiState, setAiState] = useState<AiState>('idle');
  const [analysis, setAnalysis] = useState<ProspeccaoResponse | null>(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [compatibleLeads, setCompatibleLeads] = useState<CompatibleLead[]>([]);
  const [copied, setCopied] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);

  // Fetch properties and leads
  useEffect(() => {
    Promise.all([
      PropertiesService.getAll(),
      LeadsService.getAll(),
    ]).then(([propsData, leadsData]) => {
      setProperties(propsData.filter((p: any) => p.status === 'available'));
      setAllLeads(leadsData);
    }).catch(console.error)
      .finally(() => setLoadingProps(false));
  }, []);

  const filteredProperties = properties.filter(p =>
    p.title?.toLowerCase().includes(search.toLowerCase()) ||
    p.address_neighborhood?.toLowerCase().includes(search.toLowerCase())
  );

  const handleStartAnalysis = useCallback(async () => {
    if (!selectedProperty) return;
    setAiState('analyzing');
    setAnalysis(null);
    setCompatibleLeads([]);
    setErrorMsg('');

    try {
      const leadsPayload = allLeads
        .filter(l => l.lead_type === 'buyer' || !l.lead_type)
        .slice(0, 30)
        .map(l => ({
          id: l.id,
          name: l.name,
          temperature: l.temperature,
          status: l.status,
          interest_description: l.interest_description,
          value: l.value,
          score: l.score,
        }));

      const res = await fetch('/api/ai/prospeccao', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          property: {
            title: selectedProperty.title,
            type: selectedProperty.type,
            pattern: selectedProperty.pattern,
            price: selectedProperty.price,
            price_rent: selectedProperty.price_rent,
            area_total: selectedProperty.area_total,
            area_useful: selectedProperty.area_useful,
            rooms: selectedProperty.rooms,
            suites: selectedProperty.suites,
            bathrooms: selectedProperty.bathrooms,
            parking_spaces: selectedProperty.parking_spaces,
            address_neighborhood: selectedProperty.address_neighborhood,
            address_city: selectedProperty.address_city,
            address_state: selectedProperty.address_state,
            transaction_type: selectedProperty.transaction_type,
            accepts_financing: selectedProperty.accepts_financing,
            accepts_exchange: selectedProperty.accepts_exchange,
          },
          leads: leadsPayload,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMsg(data.message || 'Erro ao processar a analise.');
        setAiState('error');
        return;
      }

      // Find compatible leads from CRM
      const matched: CompatibleLead[] = (data.compatibleLeadIds || [])
        .map((id: string) => allLeads.find(l => l.id === id))
        .filter(Boolean)
        .map((l: any) => ({
          id: l.id,
          name: l.name,
          temperature: l.temperature,
          status: l.status,
          score: l.score,
          phone: l.phone || l.person?.phone,
          interest_description: l.interest_description,
          value: l.value,
        }));

      setCompatibleLeads(matched);
      setAnalysis(data);
      setAiState('results');
    } catch (err) {
      console.error(err);
      setErrorMsg('Erro de conexao. Verifique sua internet e tente novamente.');
      setAiState('error');
    }
  }, [selectedProperty, allLeads]);

  const copyToClipboard = (text: string, type: 'whatsapp' | 'email') => {
    navigator.clipboard.writeText(text).then(() => {
      if (type === 'whatsapp') {
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
      } else {
        setCopiedEmail(true);
        setTimeout(() => setCopiedEmail(false), 2500);
      }
    });
  };

  return (
    <div className="space-y-8 pb-20">
      {/* ── Header ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="p-2 bg-accent/20 rounded-lg">
              <Sparkles className="w-5 h-5 text-accent" />
            </div>
            <span className="text-xs font-black text-accent uppercase tracking-[0.2em]">Habita Intelligence Hub</span>
          </div>
          <h1 className="text-4xl font-black text-white">
            Prospecção <span className="text-accent">IA</span>
          </h1>
          <p className="text-muted-foreground font-medium mt-1">
            Análise real com GPT-4o — persona, estratégia e leads compatíveis do seu CRM.
          </p>
        </div>
        <Link
          href="/crmhabita"
          className="px-6 py-4 rounded-2xl font-black text-sm bg-surface border border-border text-muted-foreground hover:text-primary transition-all flex items-center gap-2 self-start"
        >
          <Home size={18} />
          VOLTAR AO INÍCIO
        </Link>
      </div>

      {/* ── Main Grid ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

        {/* Left: Property Selection */}
        <div className="lg:col-span-4 space-y-4">
          <div className="p-6 rounded-2xl border bg-surface/5 border-white/10">
            <h3 className="text-base font-black mb-4 flex items-center gap-2">
              <Home className="w-5 h-5 text-accent" />
              1. Selecione o Imóvel
            </h3>

            {/* Search */}
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Buscar por título ou bairro..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-muted/40 border border-border text-sm font-medium focus:outline-none focus:border-accent/50 transition-all"
              />
            </div>

            {/* Properties list */}
            <div className="space-y-2 max-h-[440px] overflow-y-auto pr-1 custom-scrollbar">
              {loadingProps ? (
                <div className="flex items-center justify-center py-10">
                  <Loader2 className="animate-spin text-accent" />
                </div>
              ) : filteredProperties.length === 0 ? (
                <p className="text-center text-muted-foreground text-sm py-8">Nenhum imóvel encontrado.</p>
              ) : filteredProperties.map(prop => (
                <div
                  key={prop.id}
                  onClick={() => {
                    setSelectedProperty(prop);
                    setAiState('idle');
                    setAnalysis(null);
                  }}
                  className={`
                    p-4 rounded-2xl border cursor-pointer transition-all
                    ${selectedProperty?.id === prop.id
                      ? 'bg-accent/10 border-accent shadow-sm'
                      : 'bg-muted/30 border-transparent hover:border-accent/30'}
                  `}
                >
                  <p className="font-bold text-sm truncate leading-tight">{prop.title}</p>
                  <div className="flex items-center gap-1.5 mt-1">
                    <MapPin className="w-3 h-3 text-muted-foreground shrink-0" />
                    <p className="text-[10px] font-bold text-muted-foreground uppercase truncate">
                      {prop.address_neighborhood || prop.address_city}
                    </p>
                  </div>
                  <p className="text-[11px] font-black text-accent mt-1">
                    R$ {Number(prop.price).toLocaleString('pt-BR')}
                  </p>
                </div>
              ))}
            </div>

            {/* Selected property summary */}
            {selectedProperty && (
              <div className="mt-4 p-3 rounded-xl bg-accent/5 border border-accent/20 text-xs space-y-1">
                <p className="font-black text-accent truncate">{selectedProperty.title}</p>
                <p className="text-muted-foreground">{selectedProperty.rooms} qts · {selectedProperty.area_total}m² · {selectedProperty.address_neighborhood}</p>
              </div>
            )}

            <button
              onClick={handleStartAnalysis}
              disabled={!selectedProperty || aiState === 'analyzing'}
              id="btn-analisar-ia"
              className={`
                w-full mt-5 py-4 rounded-2xl font-black text-sm flex items-center justify-center gap-2 transition-all
                ${selectedProperty && aiState !== 'analyzing'
                  ? 'bg-accent text-white shadow-card hover:scale-[1.02] hover:shadow-lg'
                  : 'bg-muted text-muted-foreground cursor-not-allowed opacity-60'}
              `}
            >
              {aiState === 'analyzing' ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  PROCESSANDO IA...
                </>
              ) : (
                <>
                  <Brain className="w-4 h-4" />
                  ANALISAR COM IA
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right: AI Output */}
        <div className="lg:col-span-8">
          <AnimatePresence mode="wait">

            {/* ── Idle ── */}
            {aiState === 'idle' && (
              <motion.div
                key="idle"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="h-full min-h-[500px] rounded-[2rem] border border-dashed border-accent/30 flex flex-col items-center justify-center p-12 text-center bg-accent/5"
              >
                <div className="w-20 h-20 bg-accent/20 rounded-full flex items-center justify-center mb-6 animate-pulse">
                  <Cpu className="w-10 h-10 text-accent" />
                </div>
                <h3 className="text-xl font-bold text-heading mb-2">Aguardando Comando</h3>
                <p className="max-w-md text-muted-foreground font-medium">
                  Selecione um imóvel ao lado e clique em <strong className="text-accent">Analisar com IA</strong> para gerar a persona compradora, estratégia de venda e leads compatíveis do seu CRM.
                </p>
                <div className="mt-8 flex gap-6 text-muted-foreground text-xs font-bold uppercase tracking-widest">
                  <span className="flex items-center gap-1"><UserPlus size={12} /> Persona</span>
                  <span className="flex items-center gap-1"><Target size={12} /> Estratégia</span>
                  <span className="flex items-center gap-1"><MessageSquare size={12} /> Script</span>
                  <span className="flex items-center gap-1"><Users size={12} /> Leads</span>
                </div>
              </motion.div>
            )}

            {/* ── Analyzing ── */}
            {aiState === 'analyzing' && (
              <motion.div
                key="analyzing"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="h-full min-h-[500px] rounded-[2rem] bg-blue-primary flex flex-col items-center justify-center p-12 overflow-hidden relative"
              >
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-accent/20 via-transparent to-transparent opacity-50" />
                <div className="relative z-10 flex flex-col items-center">
                  <div className="w-24 h-24 mb-8 relative">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                      className="absolute inset-0 border-4 border-accent border-t-transparent rounded-full"
                    />
                    <motion.div
                      animate={{ rotate: -360 }}
                      transition={{ duration: 5, repeat: Infinity, ease: 'linear' }}
                      className="absolute inset-3 border-2 border-accent/30 border-b-transparent rounded-full"
                    />
                    <div className="absolute inset-5 bg-accent/10 rounded-full flex items-center justify-center">
                      <Brain className="w-7 h-7 text-accent" />
                    </div>
                  </div>
                  <h3 className="text-2xl font-black text-white mb-2">GPT-4o Analisando</h3>
                  <p className="text-white/50 font-bold uppercase tracking-widest text-[10px]">Processando dados reais do imóvel...</p>
                  <div className="mt-4 text-center text-white/30 text-xs font-medium">
                    {selectedProperty?.address_neighborhood && (
                      <p>Bairro: {selectedProperty.address_neighborhood} · {selectedProperty.type}</p>
                    )}
                  </div>
                  <div className="mt-10 w-64 h-1 bg-surface/10 rounded-full overflow-hidden">
                    <motion.div
                      animate={{ x: [-256, 256] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                      className="w-full h-full bg-accent"
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {/* ── Error ── */}
            {aiState === 'error' && (
              <motion.div
                key="error"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="min-h-[500px] rounded-[2rem] border border-red-400/20 bg-red-500/5 flex flex-col items-center justify-center p-12 text-center"
              >
                <AlertCircle className="w-16 h-16 text-red-400 mb-6" />
                <h3 className="text-xl font-black text-red-400 mb-3">Não foi possível analisar</h3>
                <p className="text-sm text-muted-foreground max-w-md mb-8 leading-relaxed">{errorMsg}</p>
                {errorMsg.includes('OPENAI_API_KEY') && (
                  <div className="bg-surface/5 border border-white/10 rounded-2xl p-5 text-left text-xs text-muted-foreground max-w-sm mb-6">
                    <p className="font-black text-white mb-2">Como configurar:</p>
                    <p>1. Acesse <span className="text-accent">platform.openai.com/api-keys</span></p>
                    <p>2. Crie uma chave de API</p>
                    <p>3. Adicione no arquivo <span className="font-mono text-accent">.env.local</span>:</p>
                    <p className="font-mono bg-muted/50 p-2 rounded mt-1">OPENAI_API_KEY=sk-...</p>
                    <p>4. Reinicie o servidor</p>
                  </div>
                )}
                <button
                  onClick={handleStartAnalysis}
                  className="flex items-center gap-2 px-6 py-3 bg-accent text-white rounded-2xl font-black text-sm hover:scale-105 transition-all"
                >
                  <RefreshCw size={16} />
                  TENTAR NOVAMENTE
                </button>
              </motion.div>
            )}

            {/* ── Results ── */}
            {aiState === 'results' && analysis && (
              <motion.div
                key="results"
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
                className="space-y-5"
              >
                {/* Market Insight Banner */}
                {analysis.marketInsight && (
                  <div className="flex items-start gap-3 p-4 rounded-2xl bg-accent/5 border border-accent/20">
                    <BarChart3 className="w-5 h-5 text-accent shrink-0 mt-0.5" />
                    <p className="text-sm font-semibold text-muted-foreground leading-relaxed">
                      <span className="text-accent font-black">Insight de Mercado: </span>
                      {analysis.marketInsight}
                    </p>
                  </div>
                )}

                {/* Persona Card */}
                <div className="p-6 rounded-2xl border bg-surface/5 border-white/10">
                  <div className="flex items-center gap-3 mb-5">
                    <div className="p-2.5 bg-accent/20 rounded-xl text-accent">
                      <UserPlus size={20} />
                    </div>
                    <div>
                      <h4 className="font-black text-lg">Persona Ideal</h4>
                      <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Público-Alvo Detectado pela IA</p>
                    </div>
                  </div>
                  <div className="bg-muted/30 p-5 rounded-2xl border border-transparent hover:border-accent/20 transition-all">
                    <p className="text-accent font-black text-lg mb-1">{analysis.persona.title}</p>
                    <div className="flex gap-4 text-xs text-muted-foreground font-bold mb-3">
                      <span>{analysis.persona.ageRange}</span>
                      <span>·</span>
                      <span>{analysis.persona.income}</span>
                    </div>
                    <p className="text-sm font-medium text-muted-foreground leading-relaxed mb-4">{analysis.persona.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {(analysis.persona.interests || []).map((int: string) => (
                        <span key={int} className="px-3 py-1 bg-accent/10 text-accent text-[10px] font-black uppercase rounded-full border border-accent/20">
                          {int}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Strategy + WhatsApp */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {/* Strategy */}
                  <div className="p-6 rounded-2xl border bg-surface/5 border-white/10">
                    <h4 className="font-black text-base mb-5 flex items-center gap-2">
                      <TrendingUp className="text-accent" size={18} />
                      Estratégia de Venda
                    </h4>
                    <ul className="space-y-3">
                      {(analysis.strategy || []).map((item: string, i: number) => (
                        <li key={i} className="flex gap-3 text-sm font-medium">
                          <CheckCircle2 className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                          <span className="leading-snug">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* WhatsApp + Email */}
                  <div className="p-6 rounded-2xl border bg-surface/5 border-white/10 space-y-5">
                    {/* WhatsApp */}
                    <div>
                      <h4 className="font-black text-base mb-3 flex items-center gap-2">
                        <MessageSquare className="text-accent" size={18} />
                        Script WhatsApp
                      </h4>
                      <div className="bg-muted/50 p-4 rounded-2xl text-sm font-medium italic leading-relaxed">
                        "{analysis.whatsappCopy}"
                      </div>
                      <button
                        id="btn-copiar-whatsapp"
                        onClick={() => copyToClipboard(analysis.whatsappCopy, 'whatsapp')}
                        className={`w-full mt-3 py-3 rounded-xl font-black text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${copied ? 'bg-green-500 text-white' : 'bg-blue-primary text-white hover:bg-blue-primary-light'}`}
                      >
                        {copied ? <><Check size={14} /> COPIADO!</> : <><Copy size={14} /> COPIAR MENSAGEM</>}
                      </button>
                    </div>

                    {/* Email Subject */}
                    {analysis.emailSubject && (
                      <div>
                        <h4 className="font-black text-sm mb-2 flex items-center gap-2">
                          <Mail className="text-accent" size={14} />
                          Assunto de E-mail
                        </h4>
                        <div className="flex items-center gap-2">
                          <p className="flex-1 bg-muted/50 px-3 py-2 rounded-xl text-xs font-semibold italic truncate">
                            "{analysis.emailSubject}"
                          </p>
                          <button
                            onClick={() => copyToClipboard(analysis.emailSubject, 'email')}
                            className={`p-2 rounded-xl font-black text-xs transition-all shrink-0 ${copiedEmail ? 'bg-green-500 text-white' : 'bg-muted hover:bg-muted/80 text-muted-foreground'}`}
                          >
                            {copiedEmail ? <Check size={13} /> : <Copy size={13} />}
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Compatible Leads */}
                <div className="p-6 rounded-2xl border bg-surface/5 border-white/10">
                  <div className="flex items-center gap-3 mb-5">
                    <div className="p-2.5 bg-emerald-500/20 rounded-xl">
                      <Users className="w-5 h-5 text-emerald-400" />
                    </div>
                    <div>
                      <h4 className="font-black text-lg">Leads Compatíveis no CRM</h4>
                      <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">
                        Selecionados pela IA com base no perfil deste imóvel
                      </p>
                    </div>
                  </div>

                  {compatibleLeads.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <Users className="w-10 h-10 mx-auto mb-3 opacity-30" />
                      <p className="text-sm font-medium">Nenhum lead compatível encontrado no CRM.</p>
                      <p className="text-xs mt-1 opacity-60">Cadastre mais leads com interesse e orçamento descritos para melhorar o matching.</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {compatibleLeads.map(lead => (
                        <div key={lead.id} className="p-4 rounded-2xl bg-muted/30 border border-border hover:border-emerald-400/30 transition-all">
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex-1 min-w-0">
                              <p className="font-black text-sm truncate">{lead.name}</p>
                              {lead.interest_description && (
                                <p className="text-[10px] text-muted-foreground mt-0.5 line-clamp-1">{lead.interest_description}</p>
                              )}
                              {lead.value && lead.value > 0 && (
                                <p className="text-[10px] font-bold text-emerald-400 mt-1 flex items-center gap-1">
                                  <DollarSign size={10} />
                                  Budget: R$ {Number(lead.value).toLocaleString('pt-BR')}
                                </p>
                              )}
                            </div>
                            <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase border shrink-0 ${TEMP_COLORS[lead.temperature] || 'bg-muted/50 text-muted-foreground border-border'}`}>
                              {TEMP_LABELS[lead.temperature] || lead.temperature}
                            </span>
                          </div>
                          {lead.phone && (
                            <a
                              href={`https://wa.me/55${lead.phone.replace(/\D/g, '')}?text=${encodeURIComponent(analysis.whatsappCopy)}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="mt-3 w-full py-2 bg-emerald-500/10 text-emerald-400 rounded-xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-1.5 hover:bg-emerald-500/20 transition-all"
                            >
                              <Zap size={11} />
                              Enviar Script via WhatsApp
                            </a>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Refazer */}
                <button
                  onClick={handleStartAnalysis}
                  className="w-full py-3 rounded-2xl border border-border text-muted-foreground font-bold text-sm flex items-center justify-center gap-2 hover:border-accent/30 hover:text-accent transition-all"
                >
                  <RefreshCw size={14} />
                  Refazer Análise
                </button>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </div>

      {/* ── Análise de Captação ── */}
      <div className="p-6 lg:p-8 border-t border-border bg-muted/20">
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-1">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 flex items-center justify-center">
              <span className="text-lg">🌱</span>
            </div>
            <div>
              <h2 className="text-xl font-black text-heading tracking-tight">Análise de Captação</h2>
              <p className="text-xs font-bold text-muted-foreground">Estoque captado · Velocidade · Oferta vs Demanda por bairro</p>
            </div>
          </div>
        </div>
        <CaptacaoAnalyticsPanel />
      </div>
    </div>
  );
}
