'use client';

import React, { useState, useEffect } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { DevelopmentsService } from '@/services/developments.service';
import { LeadsService } from '@/services/leads.service';
import { 
  MapPin, 
  CheckCircle2, 
  ArrowRight, 
  Play, 
  Maximize2, 
  MessageCircle, 
  ShieldCheck,
  RefreshCw,
  Star,
  Zap,
  Calendar,
  FileDown,
  Building2,
  Bed,
  Bath,
  Square,
  Car,
  Download
} from 'lucide-react';
import Link from 'next/link';

export default function DevelopmentLandingPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = React.use(params);
  const [dev, setDev] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [leadSent, setLeadSent] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '' });

  useEffect(() => {
    const fetch = async () => {
      try {
        const data = await DevelopmentsService.getById(resolvedParams.id);
        setDev(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [resolvedParams.id]);

  const handleLeadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await LeadsService.create({
        ...formData,
        source: `LP: ${dev.name}`,
        status: 'lead',
        temperature: 'hot',
        history: [{ type: 'lp_capture', date: new Date().toISOString(), note: `Captado via Landing Page: ${dev.name}` }]
      });
      setLeadSent(true);
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <RefreshCw className="animate-spin text-primary" size={48} />
    </div>
  );

  if (!dev) return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-xl font-bold">Empreendimento não encontrado.</p>
    </div>
  );

  const stageLabels: any = {
    'pre_launch': 'Pré-Lançamento',
    'launch': 'Lançamento',
    'construction': 'Em Construção',
    'ready': 'Pronto para Morar'
  };

  return (
    <div className="min-h-screen bg-white selection:bg-accent selection:text-white">
      <Navbar />

      <title>{`${dev.name} | ${dev.tagline} - Habita.vc`}</title>
      <meta name="description" content={dev.description.substring(0, 160)} />

      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center pt-20 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img src={dev.image_url} alt={dev.name} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/95 via-black/40 to-transparent" />
        </div>

        <div className="container mx-auto px-6 relative z-10 text-white">
          <div className="max-w-3xl space-y-8 animate-in slide-in-from-left duration-1000">
            <div className="flex items-center gap-3">
              <div className="inline-flex items-center gap-2 bg-accent/20 backdrop-blur-md px-4 py-2 rounded-full border border-accent/30 text-accent font-black text-[10px] uppercase tracking-[0.2em]">
                <Star size={14} /> {stageLabels[dev.commercial_stage] || 'Lançamento Exclusivo'}
              </div>
              {dev.developer && (
                <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 text-white/80 font-black text-[10px] uppercase tracking-[0.2em]">
                  <Building2 size={14} /> {dev.developer.name}
                </div>
              )}
            </div>

            <h1 className="text-6xl md:text-8xl font-black leading-[0.9] tracking-tighter">
              {dev.name.split(' ').map((word: string, i: number) => (
                <span key={i} className={i === 0 ? 'text-white' : 'text-accent block'}>{word} </span>
              ))}
            </h1>
            
            <p className="text-xl md:text-2xl font-medium text-white/70 max-w-lg leading-relaxed">
              {dev.tagline}
            </p>

            <div className="flex flex-wrap gap-6 pt-4">
              <a href="#leads" className="bg-accent text-white px-10 py-5 rounded-2xl font-black text-lg hover:bg-yellow-600 transition-all shadow-luxury flex items-center gap-3">
                Receber Apresentação <ArrowRight size={24} />
              </a>
              {(dev.plans_url || dev.price_table_url) && (
                <div className="flex gap-4">
                  {dev.plans_url && (
                    <a href={dev.plans_url} target="_blank" className="flex items-center gap-2 text-white/60 hover:text-white transition-colors text-xs font-black uppercase tracking-widest border-b border-white/20 pb-1">
                      <FileDown size={18} /> Ver Planta
                    </a>
                  )}
                  {dev.price_table_url && (
                    <a href={dev.price_table_url} target="_blank" className="flex items-center gap-2 text-white/60 hover:text-white transition-colors text-xs font-black uppercase tracking-widest border-b border-white/20 pb-1">
                      <Download size={18} /> Tabela de Preços
                    </a>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Stats inheritance preview */}
      <section className="bg-muted/30 py-12 border-b border-border">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center md:text-left">
              <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">Localização</p>
              <p className="text-lg font-bold text-primary">{dev.location_city}</p>
            </div>
            <div className="text-center md:text-left">
              <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">Status</p>
              <p className="text-lg font-bold text-primary">{stageLabels[dev.commercial_stage]}</p>
            </div>
            <div className="text-center md:text-left">
              <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">Investimento</p>
              <p className="text-lg font-bold text-accent">A partir de R$ {(dev.price_starting_at / 1000).toFixed(0)}k</p>
            </div>
            <div className="text-center md:text-left">
              <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">Disponibilidade</p>
              <p className="text-lg font-bold text-primary">{dev.properties?.length || 0} Unidades</p>
            </div>
          </div>
        </div>
      </section>

      {/* Details & Gallery */}
      <section className="py-32 container mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
          <div className="space-y-8">
            <h2 className="text-5xl font-black text-primary leading-tight">
              Onde cada detalhe foi pensado para <span className="text-accent underline decoration-4 underline-offset-8">surpreender.</span>
            </h2>
            <p className="text-lg text-muted-foreground font-medium leading-relaxed">
              {dev.description}
            </p>
            <div className="grid grid-cols-2 gap-8 pt-6">
              {dev.features.map((feature: string, i: number) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="p-1.5 bg-green-50 text-green-500 rounded-lg">
                    <CheckCircle2 size={18} />
                  </div>
                  <span className="font-bold text-primary">{feature}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 relative">
            <div className="space-y-4 pt-12">
              <img src={dev.gallery[0] || dev.image_url} className="rounded-[2rem] shadow-premium aspect-[4/5] object-cover" />
              <img src={dev.gallery[1] || dev.image_url} className="rounded-[2rem] shadow-premium aspect-square object-cover" />
            </div>
            <div className="space-y-4">
              <img src={dev.gallery[2] || dev.image_url} className="rounded-[2rem] shadow-premium aspect-square object-cover" />
              <img src={dev.image_url} className="rounded-[2rem] shadow-premium aspect-[4/5] object-cover" />
            </div>
          </div>
        </div>
      </section>

      {/* [NEW] Units Inventory Section */}
      {dev.properties && dev.properties.length > 0 && (
        <section className="py-32 bg-muted/20">
          <div className="container mx-auto px-6">
            <div className="text-center max-w-2xl mx-auto mb-20">
              <div className="text-accent font-black text-xs uppercase tracking-widest mb-4">Inventário</div>
              <h2 className="text-5xl font-black text-primary">Unidades Disponíveis</h2>
              <p className="text-muted-foreground mt-4 font-medium">Escolha a unidade que melhor se adapta ao seu estilo de vida.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {dev.properties.map((prop: any) => (
                <Link 
                  key={prop.id} 
                  href={`/imoveis/${prop.id}`}
                  className="group bg-white rounded-[3rem] p-4 shadow-premium hover:shadow-luxury transition-all border border-transparent hover:border-accent/20"
                >
                  <div className="aspect-[4/3] rounded-[2.5rem] overflow-hidden mb-6 relative">
                    <img 
                      src={prop.main_image || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800'} 
                      alt={prop.title} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                    />
                    <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest text-primary border border-white/20">
                      R$ {(prop.price / 1000).toFixed(0)}k
                    </div>
                  </div>
                  <div className="px-4 pb-4 space-y-4">
                    <h3 className="text-xl font-bold text-primary group-hover:text-accent transition-colors">{prop.title}</h3>
                    <div className="flex items-center gap-6 border-t border-border pt-4">
                      <div className="flex items-center gap-1.5 text-muted-foreground">
                        <Square size={16} />
                        <span className="text-xs font-bold text-primary">{prop.area_total}m²</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-muted-foreground">
                        <Bed size={16} />
                        <span className="text-xs font-bold text-primary">{prop.rooms}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-muted-foreground">
                        <Car size={16} />
                        <span className="text-xs font-bold text-primary">{prop.parking_spaces}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Lead Capture */}
      <section id="leads" className="py-32 container mx-auto px-6">
        <div className="max-w-5xl mx-auto bg-primary rounded-[4rem] p-12 md:p-24 text-white relative overflow-hidden shadow-luxury">
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-accent/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2" />
          
          {leadSent ? (
            <div className="text-center space-y-8 animate-in zoom-in duration-500">
              <div className="w-24 h-24 bg-accent/20 text-accent rounded-full flex items-center justify-center mx-auto border border-accent/30">
                <CheckCircle2 size={48} />
              </div>
              <h2 className="text-4xl font-black">Sua jornada começa agora.</h2>
              <p className="text-xl text-white/70 font-medium">Nossa equipe entrará em contato em instantes para agendar sua visita.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
              <div className="space-y-8">
                <h2 className="text-5xl font-black leading-tight">Não perca esta oportunidade única.</h2>
                <p className="text-lg text-white/60 font-medium">
                  Deixe seus dados e receba agora mesmo o book completo do empreendimento e a tabela de preços atualizada.
                </p>
                <div className="space-y-6">
                  <div className="flex items-center gap-4 font-bold">
                    <Zap className="text-accent fill-accent" size={20} /> Retorno em menos de 10 min.
                  </div>
                  <div className="flex items-center gap-4 font-bold">
                    <ShieldCheck className="text-accent" size={20} /> Sigilo e exclusividade garantidos.
                  </div>
                </div>
              </div>

              <form onSubmit={handleLeadSubmit} className="space-y-6 bg-white/5 backdrop-blur-xl p-10 rounded-[3rem] border border-white/10">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-white/40 uppercase tracking-widest ml-1">Nome</label>
                  <input
                    required
                    type="text"
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-6 py-4 bg-white/10 border border-white/10 rounded-2xl focus:bg-white/20 focus:border-accent/50 transition-all outline-none font-bold text-white placeholder:text-white/20"
                    placeholder="Nome completo"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-white/40 uppercase tracking-widest ml-1">WhatsApp</label>
                  <input
                    required
                    type="text"
                    value={formData.phone}
                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-6 py-4 bg-white/10 border border-white/10 rounded-2xl focus:bg-white/20 focus:border-accent/50 transition-all outline-none font-bold text-white placeholder:text-white/20"
                    placeholder="(00) 00000-0000"
                  />
                </div>
                <button type="submit" className="w-full bg-accent text-white py-5 rounded-2xl font-black text-lg hover:bg-yellow-600 transition-all shadow-premium flex items-center justify-center gap-3">
                  Quero Conhecer <ArrowRight size={24} />
                </button>
              </form>
            </div>
          )}
        </div>
      </section>

      {/* Sticky Footer CTA */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 animate-in slide-in-from-bottom duration-1000 delay-500">
        <div className="bg-white/80 backdrop-blur-xl border border-border px-8 py-4 rounded-full shadow-2xl flex items-center gap-8">
          <div className="hidden md:block">
            <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Investimento a partir de</p>
            <p className="text-xl font-black text-primary">R$ {(dev.price_starting_at / 1000).toFixed(0)}k</p>
          </div>
          <a href="#leads" className="bg-primary text-white px-8 py-4 rounded-full font-black text-xs hover:scale-105 transition-all shadow-premium uppercase tracking-widest">
            Falar com Consultor
          </a>
          <a href={`https://wa.me/5562981234567?text=Olá, tenho interesse no empreendimento ${dev.name}`} target="_blank" className="w-14 h-14 bg-green-500 text-white rounded-full flex items-center justify-center hover:scale-110 transition-all shadow-lg">
            <MessageCircle size={28} />
          </a>
        </div>
      </div>
    </div>
  );
}
