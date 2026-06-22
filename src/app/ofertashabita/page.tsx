'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { PropertiesService } from '@/services/properties.service';
import { Property } from '@/types/database';
import { ArrowRight, Clock, Star, Flame, MapPin, CheckCircle2 } from 'lucide-react';

export default function OfertasPage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');

  useEffect(() => {
    // Fetch top properties for the landing page (3 to 6 max)
    PropertiesService.getAllFiltered({}).then(res => {
      // Just taking the first 3 active properties for the high-conversion landing
      const activeProps = res.data?.filter((p) => p.status === 'available') || [];
      setProperties(activeProps.slice(0, 3));
    });
  }, []);

  const handleWhatsAppClick = () => {
    const message = `Olá! Meu nome é ${name || 'um cliente'}. Tenho interesse nas ofertas exclusivas da Habita.vc.`;
    window.open(`https://wa.me/5562999999999?text=${encodeURIComponent(message)}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-white font-sans">
      {/* Floating WhatsApp Button */}
      <button 
        onClick={handleWhatsAppClick}
        className="fixed bottom-8 right-8 z-50 bg-[#25D366] hover:bg-[#128C7E] text-white p-4 rounded-full shadow-2xl flex items-center gap-3 transition-transform hover:scale-110"
      >
        <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center animate-pulse">
          <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M12.031 0C5.383 0 0 5.383 0 12.031c0 2.124.553 4.195 1.603 6.012L.266 23.333l5.441-1.428c1.764.954 3.766 1.458 5.824 1.458 6.648 0 12.031-5.383 12.031-12.031S18.679 0 12.031 0zm0 21.417c-1.815 0-3.593-.487-5.148-1.408l-.369-.219-3.823 1.003.882-3.823-.241-.383A9.972 9.972 0 011.946 12.03c0-5.564 4.526-10.09 10.085-10.09 5.564 0 10.09 4.526 10.09 10.09 0 5.564-4.526 10.09-10.09 10.09zm5.534-7.551c-.303-.152-1.794-.886-2.072-.988-.278-.101-.481-.152-.683.152-.202.303-.784.988-.961 1.19-.177.202-.354.227-.657.076-1.517-.762-2.617-1.47-3.61-3.213-.203-.355.203-.33.498-.921.101-.202.051-.379-.025-.531-.076-.152-.683-1.643-.935-2.25-.246-.593-.496-.513-.683-.522-.177-.009-.379-.009-.581-.009-.202 0-.531.076-.809.379-.278.303-1.062 1.037-1.062 2.528 0 1.492 1.087 2.933 1.239 3.136.152.202 2.138 3.262 5.178 4.57.722.311 1.285.497 1.724.636.726.23 1.387.197 1.905.12.58-.086 1.794-.733 2.047-1.441.253-.708.253-1.315.177-1.441-.076-.126-.278-.202-.581-.354z"/></svg>
        </div>
        <span className="font-black text-lg hidden md:block">Falar Agora</span>
      </button>

      {/* Header / Logo Only */}
      <header className="absolute top-0 w-full p-6 flex justify-center z-20">
        <span className="text-3xl font-black text-white drop-shadow-lg">Habita<span className="text-accent">.vc</span></span>
      </header>

      {/* Aggressive Hero */}
      <section className="relative pt-32 pb-20 px-4 bg-primary text-white overflow-hidden flex flex-col items-center justify-center min-h-[70vh]">
        <div className="absolute inset-0 opacity-20 bg-[url('https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80')] bg-cover bg-center" />
        <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/80 to-transparent" />
        
        <div className="relative z-10 text-center max-w-4xl mx-auto mt-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-full text-sm font-black uppercase tracking-widest mb-8 animate-pulse shadow-lg">
            <Flame size={16} /> Alta Demanda
          </div>
          <h1 className="text-5xl md:text-7xl font-black mb-6 leading-[1.1] tracking-tighter drop-shadow-lg">
            Encontre as melhores <span className="text-accent">oportunidades</span> antes de todo mundo
          </h1>
          <p className="text-xl md:text-2xl text-white/90 font-medium mb-12 max-w-2xl mx-auto">
            Imóveis selecionados a dedo com condições exclusivas que você não vai achar em nenhum outro lugar.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <div className="flex gap-2">
              <span className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest border border-white/20">
                <Clock size={16} className="text-accent" /> Atualizado Diariamente
              </span>
              <span className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest border border-white/20">
                <Star size={16} className="text-accent" /> Ofertas Limitadas
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Curated Properties Grid */}
      <section className="py-20 bg-muted/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black text-primary mb-4">Seleção Exclusiva da Semana</h2>
            <p className="text-muted-foreground font-medium text-lg">Apenas {properties.length} imóveis que passaram no nosso rigoroso filtro de qualidade.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {properties.map(property => (
              <div key={property.id} className="bg-white rounded-3xl overflow-hidden shadow-premium border border-border group hover:-translate-y-2 transition-all duration-300">
                <div className="aspect-[4/3] relative overflow-hidden">
                  {(property.main_image || (property.images && property.images.length > 0)) ? (
                    <Image src={property.main_image || property.images[0]} alt={property.title} fill className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" sizes="(max-width: 768px) 100vw, 50vw" />
                  ) : (
                    <div className="w-full h-full bg-muted flex items-center justify-center">
                      <span className="text-muted-foreground font-bold">Sem imagem</span>
                    </div>
                  )}
                  <div className="absolute top-4 right-4 bg-accent text-white px-3 py-1.5 rounded-lg text-xs font-black uppercase tracking-widest shadow-lg">
                    Oportunidade
                  </div>
                  <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/80 to-transparent p-6 pt-12">
                    <p className="text-white font-black text-2xl">R$ {(property.price / 1000000).toFixed(2)}M</p>
                  </div>
                </div>
                <div className="p-8">
                  <div className="flex items-start gap-2 mb-4">
                    <MapPin className="text-muted-foreground shrink-0 mt-1" size={18} />
                    <h3 className="font-bold text-primary text-lg leading-tight">{property.title}</h3>
                  </div>
                  <ul className="space-y-2 mb-8 text-sm font-bold text-muted-foreground">
                    <li className="flex items-center gap-2"><CheckCircle2 size={16} className="text-green-500" /> Documentação OK</li>
                    <li className="flex items-center gap-2"><CheckCircle2 size={16} className="text-green-500" /> Aceita Financiamento</li>
                  </ul>
                  <button onClick={handleWhatsAppClick} className="w-full py-4 bg-primary text-white rounded-xl font-black flex items-center justify-center gap-2 hover:bg-primary-light transition-colors group-hover:shadow-lg">
                    Quero mais informações <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Frictionless Capture Form */}
      <section className="py-24 bg-white relative overflow-hidden border-t border-border">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary rounded-full blur-3xl" />
        </div>
        <div className="max-w-xl mx-auto px-4 relative z-10">
          <div className="text-center mb-10">
            <h2 className="text-4xl font-black text-primary mb-4">Não perca o negócio da sua vida</h2>
            <p className="text-muted-foreground font-medium text-lg">Nossos melhores imóveis são vendidos em poucos dias. Deixe seu contato para receber oportunidades antes delas irem a público.</p>
          </div>

          <div className="bg-white p-8 md:p-12 rounded-[2.5rem] shadow-luxury border border-border">
            <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); handleWhatsAppClick(); }}>
              <div>
                <label className="text-xs font-black text-muted-foreground uppercase tracking-widest ml-1">Seu Nome</label>
                <input 
                  type="text" 
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Como devemos chamá-lo?" 
                  className="w-full mt-2 px-6 py-5 rounded-2xl bg-muted/30 border border-border focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/10 outline-none transition-all font-bold text-lg text-primary placeholder:text-muted-foreground/50" 
                />
              </div>
              <div>
                <label className="text-xs font-black text-muted-foreground uppercase tracking-widest ml-1">WhatsApp</label>
                <input 
                  type="tel" 
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="(00) 00000-0000" 
                  className="w-full mt-2 px-6 py-5 rounded-2xl bg-muted/30 border border-border focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/10 outline-none transition-all font-bold text-lg text-primary placeholder:text-muted-foreground/50" 
                />
              </div>
              <button type="submit" className="w-full bg-accent hover:bg-accent-light text-white py-6 rounded-2xl font-black text-xl flex items-center justify-center gap-3 transition-all shadow-premium hover:-translate-y-1">
                Falar com Especialista Agora
              </button>
              <p className="text-center text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                Seus dados estão 100% seguros conosco.
              </p>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}
