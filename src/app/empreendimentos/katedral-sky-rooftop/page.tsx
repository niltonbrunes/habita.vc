'use client';

import React, { useState } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { 
  MapPin, CheckCircle2, ArrowRight, Play, Maximize2, 
  MessageCircle, ShieldCheck, Star, Zap, Camera, 
  Building2, Bed, Car, Wine, Dumbbell
} from 'lucide-react';
import Link from 'next/link';

export default function KatedralSkyRooftopLP() {
  const [leadSent, setLeadSent] = useState(false);
  const [formData, setFormData] = useState({ name: '', phone: '', email: '' });

  const handleLeadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate lead capture
    setTimeout(() => setLeadSent(true), 1000);
    // Open WhatsApp
    const msg = `Olá! Quero saber mais sobre o Katedral Sky Rooftop. Meu nome é ${formData.name}.`;
    window.open(`https://wa.me/5562999999999?text=${encodeURIComponent(msg)}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-black selection:bg-accent selection:text-white text-white">
      <Navbar />

      {/* SEO Metadata handled by Next.js Head in a real app, but injected here via regular tags for simplicity */}
      <title>Katedral Sky Rooftop | Um novo jeito de morar no Setor Sul - Goiânia</title>
      <meta name="description" content="O Katedral Sky Rooftop é o empreendimento perfeito para quem busca um estilo de vida exclusivo. Rooftop panorâmico, lazer completo e localização premium." />

      {/* 1. ATTENTION (Atenção) - Hero Section */}
      <section className="relative min-h-[95vh] flex items-center pt-20 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="/katedral_hero_1778094352027.png" 
            alt="Katedral Sky Rooftop" 
            className="w-full h-full object-cover opacity-60 scale-105 animate-[pulse_20s_ease-in-out_infinite_alternate]" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-transparent" />
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-4xl space-y-8 animate-in slide-in-from-bottom duration-1000">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/20 text-white font-black text-xs uppercase tracking-[0.3em]">
              <Star size={14} className="text-accent" /> Lançamento Exclusivo - Setor Sul
            </div>

            <h1 className="text-6xl md:text-8xl font-black leading-[0.9] tracking-tighter">
              Katedral Sky <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-yellow-200">Rooftop.</span>
            </h1>
            
            <p className="text-2xl md:text-3xl font-medium text-white/80 max-w-2xl leading-relaxed">
              Um novo jeito de morar e viver no centro de Goiânia.
            </p>

            <div className="flex flex-col sm:flex-row gap-6 pt-8">
              <a href="#leads" className="bg-accent text-white px-10 py-5 rounded-full font-black text-lg hover:bg-yellow-600 transition-all shadow-[0_0_40px_rgba(234,179,8,0.4)] flex items-center justify-center gap-3 group">
                Agendar Visita ao Decorado <ArrowRight size={24} className="group-hover:translate-x-2 transition-transform" />
              </a>
              <a href="#galeria" className="bg-white/10 backdrop-blur-md border border-white/20 text-white px-10 py-5 rounded-full font-black text-lg hover:bg-white/20 transition-all flex items-center justify-center gap-3">
                <Camera size={24} /> Ver Imagens
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 2. INTEREST (Interesse) - Lifestyle & Features */}
      <section className="py-32 bg-black relative border-b border-white/10">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <div className="space-y-8">
              <h2 className="text-4xl md:text-6xl font-black leading-tight">
                A vista definitiva de <br />uma vida <span className="text-accent italic font-serif">extraordinária.</span>
              </h2>
              <p className="text-xl text-white/60 font-medium leading-relaxed">
                Mais do que um apartamento, um manifesto de lifestyle. O Katedral Sky Rooftop foi projetado para elevar o seu padrão de conforto a um novo patamar, literalmente.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-8">
                <FeatureCard icon={<Wine />} title="Rooftop Panorâmico" desc="Lazer nas alturas com vista 360º de Goiânia." />
                <FeatureCard icon={<Building2 />} title="Plantas Inteligentes" desc="Espaços otimizados para o seu bem-estar." />
                <FeatureCard icon={<MapPin />} title="Setor Sul" desc="Rua 132. O endereço mais charmoso da cidade." />
                <FeatureCard icon={<Dumbbell />} title="Academia High-End" desc="Equipamentos de última geração." />
              </div>
            </div>
            
            <div className="relative h-[600px] rounded-[3rem] overflow-hidden border border-white/10 shadow-2xl">
              <img src="/katedral_rooftop_1778094376825.png" alt="Rooftop Pool" className="w-full h-full object-cover hover:scale-110 transition-transform duration-1000" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-10">
                <p className="text-2xl font-black italic">"O horizonte é a sua nova varanda."</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. DESIRE (Desejo) - Technical Specs & Gallery */}
      <section id="galeria" className="py-32 bg-[#0a0a0a]">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-20 space-y-6">
            <h2 className="text-5xl font-black">Detalhes que importam.</h2>
            <p className="text-xl text-white/50 font-medium">Acabamentos premium e infraestrutura projetada para os clientes mais exigentes.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-20">
            <div className="bg-white/5 p-10 rounded-[2rem] border border-white/10 text-center space-y-4 hover:bg-white/10 transition-colors">
              <Bed size={40} className="text-accent mx-auto" />
              <h3 className="text-2xl font-black">1 a 3 Suítes</h3>
              <p className="text-white/50">Flexibilidade para o seu momento de vida.</p>
            </div>
            <div className="bg-white/5 p-10 rounded-[2rem] border border-white/10 text-center space-y-4 hover:bg-white/10 transition-colors">
              <Car size={40} className="text-accent mx-auto" />
              <h3 className="text-2xl font-black">Vagas Premium</h3>
              <p className="text-white/50">Infraestrutura para carros elétricos.</p>
            </div>
            <div className="bg-white/5 p-10 rounded-[2rem] border border-white/10 text-center space-y-4 hover:bg-white/10 transition-colors">
              <ShieldCheck size={40} className="text-accent mx-auto" />
              <h3 className="text-2xl font-black">Segurança 360º</h3>
              <p className="text-white/50">Controle de acesso biométrico e monitoramento.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. ACTION (Ação) - Lead Capture */}
      <section id="leads" className="py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-accent/20" />
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10" />
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-5xl mx-auto bg-black/80 backdrop-blur-2xl rounded-[3rem] p-12 md:p-20 border border-white/20 shadow-2xl">
            {leadSent ? (
              <div className="text-center space-y-8 py-10 animate-in zoom-in duration-500">
                <div className="w-24 h-24 bg-accent/20 text-accent rounded-full flex items-center justify-center mx-auto border border-accent/50">
                  <CheckCircle2 size={48} />
                </div>
                <h2 className="text-4xl font-black text-white">Excelente escolha.</h2>
                <p className="text-xl text-white/70 font-medium max-w-lg mx-auto">
                  Você está a um passo de viver no Katedral. Um de nossos consultores de luxo entrará em contato via WhatsApp em instantes.
                </p>
              </div>
            ) : (
              <div className="grid lg:grid-cols-2 gap-16 items-center">
                <div className="space-y-8">
                  <div className="inline-flex items-center gap-2 bg-accent/20 px-4 py-2 rounded-full text-accent font-black text-xs uppercase tracking-widest border border-accent/30">
                    <Zap size={14} /> Atendimento VIP
                  </div>
                  <h2 className="text-5xl font-black leading-tight text-white">
                    Pronto para <br/>o próximo nível?
                  </h2>
                  <p className="text-lg text-white/60 font-medium">
                    Cadastre-se para receber o Book Exclusivo Digital, Tabela de Preços e garantir condições especiais de negociação.
                  </p>
                  <ul className="space-y-4">
                    <li className="flex items-center gap-3 text-white/80 font-bold"><CheckCircle2 className="text-accent" size={20} /> Condições de pagamento flexíveis</li>
                    <li className="flex items-center gap-3 text-white/80 font-bold"><CheckCircle2 className="text-accent" size={20} /> Agendamento privativo</li>
                  </ul>
                </div>

                <form onSubmit={handleLeadSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <input
                      required
                      type="text"
                      value={formData.name}
                      onChange={e => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-6 py-5 bg-white/5 border border-white/10 rounded-2xl focus:bg-white/10 focus:border-accent transition-all outline-none font-bold text-white placeholder:text-white/30"
                      placeholder="Seu nome completo"
                    />
                  </div>
                  <div className="space-y-2">
                    <input
                      required
                      type="tel"
                      value={formData.phone}
                      onChange={e => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-6 py-5 bg-white/5 border border-white/10 rounded-2xl focus:bg-white/10 focus:border-accent transition-all outline-none font-bold text-white placeholder:text-white/30"
                      placeholder="Seu WhatsApp"
                    />
                  </div>
                  <div className="space-y-2">
                    <input
                      type="email"
                      value={formData.email}
                      onChange={e => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-6 py-5 bg-white/5 border border-white/10 rounded-2xl focus:bg-white/10 focus:border-accent transition-all outline-none font-bold text-white placeholder:text-white/30"
                      placeholder="Seu E-mail (Opcional)"
                    />
                  </div>
                  <button type="submit" className="w-full bg-accent text-white py-5 rounded-2xl font-black text-xl hover:bg-yellow-600 transition-all shadow-[0_0_30px_rgba(234,179,8,0.3)] hover:shadow-[0_0_50px_rgba(234,179,8,0.5)]">
                    Receber Material Completo
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Floating WhatsApp CTA */}
      <a 
        href="https://wa.me/5562999999999?text=Olá, quero saber mais sobre o Katedral Sky Rooftop!" 
        target="_blank" 
        className="fixed bottom-8 right-8 w-16 h-16 bg-[#25D366] text-white rounded-full flex items-center justify-center hover:scale-110 transition-transform shadow-[0_10px_30px_rgba(37,211,102,0.4)] z-50 animate-bounce"
      >
        <MessageCircle size={32} />
      </a>
    </div>
  );
}

const FeatureCard = ({ icon, title, desc }: any) => (
  <div className="flex gap-4">
    <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-accent shrink-0">
      {icon}
    </div>
    <div>
      <h4 className="text-lg font-black text-white mb-1">{title}</h4>
      <p className="text-sm text-white/50">{desc}</p>
    </div>
  </div>
);
