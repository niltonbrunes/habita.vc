'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, 
  Target, 
  Brain, 
  MessageSquare, 
  Zap, 
  ArrowRight, 
  Search, 
  Home, 
  UserPlus, 
  TrendingUp,
  Cpu,
  Globe,
  CheckCircle2,
  Loader2
} from 'lucide-react';
import { PropertiesService } from '@/services/properties.service';
import { LeadsService } from '@/services/leads.service';
import { useAuth } from '@/context/AuthContext';

import Link from 'next/link';
import { CaptacaoAnalyticsPanel } from '@/components/dashboard/CaptacaoAnalyticsPanel';

export default function ProspeccaoPage() {
  const { user } = useAuth();

  const [loading, setLoading] = useState(true);
  const [properties, setProperties] = useState<any[]>([]);
  const [selectedProperty, setSelectedProperty] = useState<any>(null);
  const [aiState, setAiState] = useState<'idle' | 'analyzing' | 'results'>('idle');
  const [analysis, setAnalysis] = useState<any>(null);

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    try {
      const data = await PropertiesService.getAll();
      setProperties(data);
    } catch (error) {
      console.error('Erro ao buscar imóveis:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStartAnalysis = () => {
    if (!selectedProperty) return;
    setAiState('analyzing');
    
    // Análise Dinâmica baseada no padrão do imóvel
    setTimeout(() => {
      const isHighEnd = selectedProperty.pattern === 'high_end' || selectedProperty.price > 1500000;
      const isEconomic = selectedProperty.pattern === 'economic';
      
      let dynamicAnalysis;

      if (isHighEnd) {
        dynamicAnalysis = {
          persona: {
            title: "Ultra-High-Net-Worth / Elite Local",
            description: "Empresários e profissionais liberais de sucesso que buscam exclusividade, segurança total e acabamentos de altíssimo padrão no Setor Marista ou Bueno.",
            interests: ["Concierge Services", "Wine Tasting", "Investimentos Internacionais", "Arquitetura Assinada"]
          },
          strategy: [
            "Focar em marketing de indicação e eventos fechados.",
            "Destacar a exclusividade (poucas unidades no prédio).",
            "Enfatizar a valorização imobiliária acima da média da região."
          ],
          whatsappCopy: `Prezado(a), analisei o perfil das suas últimas aquisições e este imóvel no ${selectedProperty.title} é uma oportunidade off-market que acredito ser do seu interesse. Podemos agendar uma visita exclusiva?`
        };
      } else if (isEconomic) {
        dynamicAnalysis = {
          persona: {
            title: "Primeiro Imóvel / Família em Ascensão",
            description: "Casais jovens ou pessoas saindo do aluguel, buscam facilidade de financiamento, lazer completo para os filhos e localização estratégica.",
            interests: ["Programas de Financiamento", "Vida em Comunidade", "Dicas de Reforma", "Pets"]
          },
          strategy: [
            "Explorar as facilidades do Minha Casa Minha Vida (se aplicável).",
            "Destacar as áreas de lazer e segurança para crianças.",
            "Mostrar comparativos de parcelas de financiamento vs aluguel."
          ],
          whatsappCopy: `Olá! Sabia que as parcelas para morar no ${selectedProperty.title} podem ser menores que um aluguel? Preparei uma simulação personalizada para você. Vamos conferir?`
        };
      } else {
        dynamicAnalysis = {
          persona: {
            title: "Upgrade de Moradia / Família Consolidada",
            description: "Público que busca mais espaço, conforto e uma localização que facilite a logística diária entre trabalho e escola dos filhos.",
            interests: ["Educação de Qualidade", "Mobilidade Urbana", "Gastronomia Local"]
          },
          strategy: [
            "Focar no custo-benefício e no tamanho das suítes.",
            "Destacar a proximidade com as melhores escolas de Goiânia.",
            "Oferecer avaliação gratuita do imóvel atual como parte do negócio."
          ],
          whatsappCopy: `Olá! Notei que você busca mais conforto para sua família. O ${selectedProperty.title} tem a planta ideal para o seu momento de vida. Que tal uma visita rápida amanhã?`
        };
      }

      setAnalysis(dynamicAnalysis);
      setAiState('results');
    }, 2500);
  };

  const generateAILeads = async () => {
    if (!user) return;
    setAiState('analyzing');
    
    try {
      // Simulação de geração de leads via IA
      const names = ['Roberto Almeida', 'Cláudia Regina', 'Marcos Vilela'];
      for (const name of names) {
        await LeadsService.create({
          name: `${name} (IA Prospect)`,
          email: `${name.toLowerCase().replace(' ', '.')}@ia.com`,
          phone: '(62) 9' + Math.floor(10000000 + Math.random() * 90000000),
          status: 'lead',
          source: 'IA Prospecção',
          temperature: 'hot',
          assigned_to_id: user.id,
          score: 85,
          history: [{ type: 'note', date: new Date().toISOString(), note: 'Lead gerado automaticamente pela Inteligência Artificial Habita.vc' }]
        });
      }
      alert('3 Leads qualificados foram gerados e adicionados ao seu CRM!');
      setAiState('results');
    } catch (error) {
      console.error('Erro ao gerar leads:', error);
    }
  };

  return (
    <div className="space-y-8 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="p-2 bg-accent/20 rounded-lg">
              <Sparkles className="w-5 h-5 text-accent" />
            </div>
            <span className="text-xs font-black text-accent uppercase tracking-[0.2em]">Habita Intelligence Hub</span>
          </div>
          <h1 className={`text-4xl font-black ${'text-white'}`}>
            Prospecção <span className="text-accent">IA</span>
          </h1>
          <p className="text-muted-foreground font-medium mt-1">Gere leads qualificados e estratégias de venda com um clique.</p>
        </div>

        <div className="flex gap-3">
           <Link 
            href="/crmhabita"
            className="px-6 py-4 rounded-2xl font-black text-sm bg-surface border border-border text-muted-foreground hover:text-primary transition-all flex items-center gap-2"
           >
            <Home size={18} />
            VOLTAR AO INÍCIO
           </Link>
           <button 
            onClick={generateAILeads}
            className="group relative px-6 py-4 rounded-2xl font-black text-sm overflow-hidden bg-blue-primary text-white shadow-card hover:scale-[1.02] transition-all"
           >
            <div className="absolute inset-0 bg-gradient-to-r from-accent/0 via-accent/30 to-accent/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
            <div className="flex items-center gap-2 relative z-10">
              <Cpu className="w-4 h-4 text-accent" />
              <span>GERAR LEADS VIA IA</span>
            </div>
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Property Selection */}
        <div className="lg:col-span-4 space-y-6">
          <div className={`p-8 rounded-xl border ${'bg-surface/5 border-white/10'}`}>
            <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
              <Home className="w-5 h-5 text-accent" />
              1. Selecione o Imóvel
            </h3>
            
            <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
              {loading ? (
                <div className="flex items-center justify-center py-10">
                  <Loader2 className="animate-spin text-accent" />
                </div>
              ) : properties.map(prop => (
                <div 
                  key={prop.id}
                  onClick={() => setSelectedProperty(prop)}
                  className={`
                    p-4 rounded-2xl border cursor-pointer transition-all
                    ${selectedProperty?.id === prop.id 
                      ? 'bg-accent/10 border-accent shadow-sm' 
                      : 'bg-muted/30 border-transparent hover:border-accent/30'}
                  `}
                >
                  <p className="font-bold text-sm truncate">{prop.title}</p>
                  <p className="text-[10px] font-black text-muted-foreground uppercase mt-1">
                    {prop.address_neighborhood} • R$ {Number(prop.price).toLocaleString('pt-BR')}
                  </p>
                </div>
              ))}
            </div>

            <button
              onClick={handleStartAnalysis}
              disabled={!selectedProperty || aiState === 'analyzing'}
              className={`
                w-full mt-8 py-4 rounded-2xl font-black text-sm flex items-center justify-center gap-2 transition-all
                ${selectedProperty && aiState !== 'analyzing'
                  ? 'bg-accent text-white shadow-card'
                  : 'bg-muted text-muted-foreground cursor-not-allowed'}
              `}
            >
              {aiState === 'analyzing' ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  PROCESSANDO...
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
            {aiState === 'idle' && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className={`h-full min-h-[500px] rounded-[3rem] border border-dashed border-accent/30 flex flex-col items-center justify-center p-12 text-center bg-accent/5`}
              >
                <div className="w-20 h-20 bg-accent/20 rounded-full flex items-center justify-center mb-6 animate-pulse">
                  <Cpu className="w-10 h-10 text-accent" />
                </div>
                <h3 className="text-xl font-bold text-heading mb-2">Aguardando Comando</h3>
                <p className="max-w-md text-muted-foreground font-medium">
                  Selecione um imóvel ao lado e peça para a IA gerar o perfil do comprador e a estratégia de prospecção.
                </p>
              </motion.div>
            )}

            {aiState === 'analyzing' && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="h-full min-h-[500px] rounded-[3rem] bg-blue-primary flex flex-col items-center justify-center p-12 overflow-hidden relative"
              >
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-accent/20 via-transparent to-transparent opacity-50" />
                <div className="relative z-10 flex flex-col items-center">
                  <div className="w-24 h-24 mb-8 relative">
                    <motion.div 
                      animate={{ rotate: 360 }}
                      transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                      className="absolute inset-0 border-4 border-accent border-t-transparent rounded-full"
                    />
                    <div className="absolute inset-4 bg-accent/10 rounded-full flex items-center justify-center">
                      <Brain className="w-8 h-8 text-accent" />
                    </div>
                  </div>
                  <h3 className="text-2xl font-black text-white mb-2">IA Analisando Big Data</h3>
                  <p className="text-white/50 font-bold uppercase tracking-widest text-[10px]">Mapeando tendências de mercado...</p>
                  
                  <div className="mt-12 w-64 h-1 bg-surface/10 rounded-full overflow-hidden">
                    <motion.div 
                      animate={{ x: [-256, 256] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                      className="w-full h-full bg-accent"
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {aiState === 'results' && analysis && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="space-y-6"
              >
                {/* Persona Card */}
                <div className={`p-8 rounded-xl border ${'bg-surface/5 border-white/10'}`}>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-3 bg-accent/20 rounded-2xl text-accent">
                      <UserPlus size={24} />
                    </div>
                    <div>
                      <h4 className="font-black text-xl">Persona Ideal</h4>
                      <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Público-Alvo Detectado</p>
                    </div>
                  </div>
                  
                  <div className="bg-muted/30 p-6 rounded-3xl border border-transparent hover:border-accent/20 transition-all">
                    <p className="text-accent font-black text-lg mb-2">{analysis.persona.title}</p>
                    <p className="text-sm font-medium text-muted-foreground leading-relaxed">{analysis.persona.description}</p>
                    <div className="flex flex-wrap gap-2 mt-4">
                      {analysis.persona.interests.map((int: string) => (
                        <span key={int} className="px-3 py-1 bg-accent/10 text-accent text-[10px] font-black uppercase rounded-full border border-accent/20">
                          {int}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Strategy Card */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className={`p-8 rounded-xl border ${'bg-surface/5 border-white/10'}`}>
                    <h4 className="font-black text-lg mb-6 flex items-center gap-2">
                      <TrendingUp className="text-accent" size={20} />
                      Estratégia de Venda
                    </h4>
                    <ul className="space-y-4">
                      {analysis.strategy.map((item: string, i: number) => (
                        <li key={i} className="flex gap-3 text-sm font-medium">
                          <CheckCircle2 className="w-5 h-5 text-accent shrink-0" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className={`p-8 rounded-xl border ${'bg-surface/5 border-white/10'}`}>
                    <h4 className="font-black text-lg mb-6 flex items-center gap-2">
                      <MessageSquare className="text-accent" size={20} />
                      Script WhatsApp
                    </h4>
                    <div className="bg-muted/50 p-6 rounded-3xl text-sm font-medium italic relative group">
                      "{analysis.whatsappCopy}"
                      <button className="absolute top-4 right-4 p-2 bg-surface rounded-lg shadow-sm opacity-0 group-hover:opacity-100 transition-opacity">
                        <Zap size={14} className="text-accent" />
                      </button>
                    </div>
                    <button className="w-full mt-6 py-4 bg-blue-primary text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-blue-primary-light transition-all">
                      Copiar Script
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* ── PAINEL DE CAPTAÇÃO ── */}
      <div className="p-6 lg:p-8 border-t border-border bg-muted/20">
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-1">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 flex items-center justify-center">
              <span className="text-lg">📦</span>
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
