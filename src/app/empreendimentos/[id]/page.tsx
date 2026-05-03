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
  Calendar
} from 'lucide-react';

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

  return (
    <div className="min-h-screen bg-white selection:bg-accent selection:text-white">
      <Navbar />

      {/* SEO TITLE & DESCRIPTION simulation (Next.js Metadata would be in layout/page head) */}
      <title>{`${dev.name} | ${dev.tagline} - Habita.vc`}</title>
      <meta name="description" content={dev.description.substring(0, 160)} />

      {/* [ATTENTION] Hero Section */}
      <section className="relative min-h-screen flex items-center pt-20 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img src={dev.image_url} alt={dev.name} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/40 to-transparent" />
        </div>

        <div className="container mx-auto px-6 relative z-10 text-white">
          <div className="max-w-2xl space-y-8 animate-in slide-in-from-left duration-1000">
            <div className="inline-flex items-center gap-2 bg-accent/20 backdrop-blur-md px-4 py-2 rounded-full border border-accent/30 text-accent font-black text-[10px] uppercase tracking-[0.2em]">
              <Star size={14} /> Lançamento Exclusivo
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
              <button className="flex items-center gap-4 group">
                <div className="w-16 h-16 rounded-full border border-white/20 flex items-center justify-center group-hover:bg-white/10 transition-all">
                  <Play size={24} className="fill-white" />
                </div>
                <span className="text-sm font-black uppercase tracking-widest">Ver Vídeo</span>
              </button>
            </div>
          </div>
        </div>

        {/* Floating Indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce opacity-30">
          <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center p-1">
            <div className="w-1 h-2 bg-white rounded-full" />
          </div>
        </div>
      </section>

      {/* [INTEREST] Immersive Details */}
      <section className="py-32 container mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
          <div className="space-y-8">
            <h2 className="text-5xl font-black text-primary leading-tight">
              Um conceito desenhado para quem exige <span className="text-accent underline decoration-4 underline-offset-8">o extraordinário.</span>
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
              <img src={dev.gallery[0]} className="rounded-[2rem] shadow-premium" />
              <img src={dev.gallery[1]} className="rounded-[2rem] shadow-premium" />
            </div>
            <div className="space-y-4">
              <img src={dev.gallery[2]} className="rounded-[2rem] shadow-premium" />
              <img src={dev.image_url} className="rounded-[2rem] shadow-premium" />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent pointer-events-none" />
          </div>
        </div>
      </section>

      {/* [DESIRE] Lifestyle & Location */}
      <section className="py-32 bg-primary text-white overflow-hidden relative">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-accent/5 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2" />
        
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-end gap-12 mb-20">
            <div className="max-w-xl">
              <div className="text-accent font-black text-xs uppercase tracking-widest mb-4">Localização Privilegiada</div>
              <h2 className="text-5xl font-black leading-tight">No coração de {dev.location_city}, perto de tudo o que importa.</h2>
            </div>
            <div className="flex items-center gap-4 text-white/60 font-medium">
              <MapPin size={24} className="text-accent" />
              <span>{dev.location_address}</span>
            </div>
          </div>

          <div className="aspect-[21/9] rounded-[3rem] bg-white/5 border border-white/10 flex items-center justify-center relative group">
            <Maximize2 size={48} className="text-white/20 group-hover:scale-110 transition-transform" />
            <p className="absolute bottom-10 font-bold uppercase tracking-widest text-xs text-white/40">Visualização de Mapa Interativa</p>
          </div>
        </div>
      </section>

      {/* [ACTION] Lead Capture Form */}
      <section id="leads" className="py-32 container mx-auto px-6">
        <div className="max-w-5xl mx-auto bg-muted/30 rounded-[4rem] p-12 md:p-24 border border-border relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-2 bg-accent" />
          
          {leadSent ? (
            <div className="text-center space-y-8 animate-in zoom-in duration-500">
              <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 size={48} />
              </div>
              <h2 className="text-4xl font-black text-primary">Solicitação Enviada!</h2>
              <p className="text-xl text-muted-foreground font-medium">Um de nossos consultores especializados entrará em contato em instantes.</p>
              <button onClick={() => setLeadSent(false)} className="text-primary font-bold underline">Enviar outra solicitação</button>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
              <div>
                <h2 className="text-5xl font-black text-primary mb-8 leading-tight">Agende sua visita exclusiva hoje.</h2>
                <p className="text-lg text-muted-foreground font-medium mb-12">
                  Preencha os campos e receba a tabela de preços, plantas humanizadas e condições de lançamento em seu e-mail.
                </p>
                <div className="space-y-6">
                  <div className="flex items-center gap-4 text-primary font-bold">
                    <Zap className="text-accent fill-accent" size={20} /> Atendimento em menos de 10 min.
                  </div>
                  <div className="flex items-center gap-4 text-primary font-bold">
                    <ShieldCheck className="text-green-500" size={20} /> Seus dados estão 100% protegidos.
                  </div>
                </div>
              </div>

              <form onSubmit={handleLeadSubmit} className="space-y-6 bg-white p-10 rounded-[3rem] shadow-luxury border border-border">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">Nome</label>
                  <input
                    required
                    type="text"
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-6 py-4 bg-muted/50 border border-transparent rounded-2xl focus:bg-white focus:border-primary/20 transition-all outline-none font-bold text-primary"
                    placeholder="Seu nome completo"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">E-mail</label>
                  <input
                    required
                    type="email"
                    value={formData.email}
                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-6 py-4 bg-muted/50 border border-transparent rounded-2xl focus:bg-white focus:border-primary/20 transition-all outline-none font-bold text-primary"
                    placeholder="seu@email.com"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">WhatsApp</label>
                  <input
                    required
                    type="text"
                    value={formData.phone}
                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-6 py-4 bg-muted/50 border border-transparent rounded-2xl focus:bg-white focus:border-primary/20 transition-all outline-none font-bold text-primary"
                    placeholder="(00) 00000-0000"
                  />
                </div>
                <button type="submit" className="w-full bg-primary text-white py-5 rounded-2xl font-black text-lg hover:bg-primary-light transition-all shadow-premium flex items-center justify-center gap-3">
                  Garantir Condições <ArrowRight size={24} />
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
            <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Unidades a partir de</p>
            <p className="text-xl font-black text-primary">R$ {(dev.price_starting_at / 1000).toFixed(0)}k</p>
          </div>
          <a href="#leads" className="bg-primary text-white px-6 py-3 rounded-full font-black text-sm hover:scale-105 transition-all shadow-premium">
            Falar com Consultor
          </a>
          <a href="#" className="w-12 h-12 bg-green-500 text-white rounded-full flex items-center justify-center hover:scale-110 transition-all shadow-lg">
            <MessageCircle size={24} />
          </a>
        </div>
      </div>
    </div>
  );
}
