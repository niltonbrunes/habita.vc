'use client';

import React, { useState, useEffect } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { PropertiesService } from '@/services/properties.service';
import { Property } from '@/types/database';
import { 
  MapPin, 
  BedDouble, 
  Square, 
  Car, 
  Bath, 
  CheckCircle2, 
  MessageCircle, 
  Phone,
  Share2,
  Calendar,
  ChevronLeft,
  RefreshCw,
  DollarSign
} from 'lucide-react';
import Link from 'next/link';

export default function PublicPropertyDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = React.use(params);
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        setLoading(true);
        const data = await PropertiesService.getById(resolvedParams.id);
        setProperty(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [resolvedParams.id]);

  if (loading) return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <RefreshCw className="animate-spin text-primary" size={48} />
    </div>
  );

  if (!property) return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center space-y-6 px-4 text-center">
      <h2 className="text-3xl font-black text-primary">Imóvel não encontrado</h2>
      <p className="text-muted-foreground max-w-md">O link que você acessou pode estar expirado ou o imóvel já foi vendido.</p>
      <Link href="/imoveis" className="bg-primary text-white px-8 py-3 rounded-2xl font-bold">Ver outros imóveis</Link>
    </div>
  );

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      <main className="pt-24 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumbs */}
          <div className="flex items-center gap-2 mb-8">
            <Link href="/imoveis" className="flex items-center gap-1 text-sm font-bold text-muted-foreground hover:text-primary transition-colors">
              <ChevronLeft size={16} /> Imóveis
            </Link>
            <span className="text-muted-foreground/30">/</span>
            <span className="text-sm font-bold text-primary truncate max-w-xs">{property.title}</span>
          </div>

          <div className="grid lg:grid-cols-3 gap-12">
            {/* Gallery Section */}
            <div className="lg:col-span-2 space-y-8">
              <div className="relative aspect-video bg-muted rounded-[2.5rem] overflow-hidden shadow-premium border border-border">
                <div className="absolute inset-0 flex items-center justify-center">
                  <MapPin size={100} className="text-primary/5" />
                </div>
                <div className="absolute top-8 left-8 flex gap-3">
                  <span className="bg-white/90 backdrop-blur-md px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest text-primary shadow-xl">
                    {property.type}
                  </span>
                  {property.pattern === 'high_end' && (
                    <span className="bg-accent text-white px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest shadow-xl">
                      Exclusividade Luxo
                    </span>
                  )}
                </div>
                <button className="absolute bottom-8 right-8 bg-white/90 backdrop-blur-md p-4 rounded-2xl shadow-xl hover:bg-white transition-all text-primary">
                  <Share2 size={24} />
                </button>
              </div>

              {/* Title & Info */}
              <div className="space-y-4">
                <h1 className="text-4xl md:text-5xl font-black text-primary leading-tight">{property.title}</h1>
                <p className="text-xl text-muted-foreground flex items-center gap-2 font-medium">
                  <MapPin size={24} className="text-accent" />
                  {property.address_street}, {property.address_city} - {property.address_state}
                </p>
              </div>

              {/* Main Specs Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 py-10 border-y border-border">
                <SpecItem icon={<BedDouble size={24} />} label="Dormitórios" value={property.metadata?.rooms || 0} />
                <SpecItem icon={<Bath size={24} />} label="Suítes" value={property.metadata?.bathrooms || 0} />
                <SpecItem icon={<Square size={22} />} label="Área Útil" value={`${property.metadata?.area || 0}m²`} />
                <SpecItem icon={<Car size={24} />} label="Vagas" value={property.metadata?.parking || 0} />
              </div>

              {/* Description */}
              <div className="space-y-6">
                <h3 className="text-2xl font-black text-primary">Sobre o imóvel</h3>
                <p className="text-lg text-muted-foreground leading-relaxed whitespace-pre-line">
                  {property.description}
                </p>
              </div>

              {/* Development Info (Inherited) */}
              {property.development && (
                <div className="p-10 bg-primary/5 rounded-[3rem] border border-accent/20 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="px-3 py-1 bg-accent text-white text-[9px] font-black uppercase tracking-widest rounded-full shadow-lg">
                          {property.development.commercial_stage === 'pre_launch' ? 'Pré-Lançamento' : 
                           property.development.commercial_stage === 'launch' ? 'Lançamento' :
                           property.development.commercial_stage === 'construction' ? 'Em Construção' : 'Pronto para Morar'}
                        </span>
                        <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Empreendimento</span>
                      </div>
                      <h3 className="text-3xl font-black text-primary">{property.development.name}</h3>
                      <p className="text-sm font-bold text-muted-foreground">Por: {property.development.developer?.name}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">Localização</p>
                      <p className="font-bold text-primary">{property.development.location_city}, {property.development.location_address}</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="text-lg font-black text-primary flex items-center gap-2">
                      <CheckCircle2 className="text-accent" size={20} />
                      Áreas Comuns & Diferenciais
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {property.development.features?.map((f: string, i: number) => (
                        <span key={i} className="px-4 py-2 bg-white rounded-xl text-xs font-bold text-primary/70 shadow-sm border border-border">
                          {f}
                        </span>
                      ))}
                    </div>
                  </div>

                  {property.development.gallery && property.development.gallery.length > 0 && (
                    <div className="space-y-4">
                      <h4 className="text-lg font-black text-primary">Galeria do Empreendimento</h4>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {property.development.gallery.slice(0, 4).map((img: string, i: number) => (
                          <div key={i} className="aspect-square rounded-2xl overflow-hidden border border-white shadow-sm">
                            <img src={img} className="w-full h-full object-cover hover:scale-110 transition-transform duration-500" />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Features Chips */}
              <div className="space-y-6">
                <h3 className="text-2xl font-black text-primary">O que este imóvel oferece</h3>
                <div className="flex flex-wrap gap-3">
                  {property.metadata?.features?.map((feature: string, i: number) => (
                    <div key={i} className="flex items-center gap-2 px-4 py-2.5 bg-muted/50 rounded-xl text-sm font-bold text-primary/70 border border-transparent hover:border-primary/10 transition-all">
                      <CheckCircle2 size={18} className="text-accent" />
                      {feature}
                    </div>
                  ))}
                  {(!property.metadata?.features || property.metadata.features.length === 0) && (
                    <p className="text-sm text-muted-foreground">Consulte o corretor para mais detalhes sobre os diferenciais.</p>
                  )}
                </div>
              </div>
            </div>

            {/* Sticky Sidebar / Lead Form */}
            <div className="space-y-6">
              <div className="sticky top-28 space-y-6">
                {/* Price Card */}
                <div className="bg-white p-8 rounded-[2.5rem] shadow-luxury border border-border">
                  <p className="text-sm font-black text-muted-foreground uppercase tracking-widest mb-2">Valor de Investimento</p>
                  <h2 className="text-5xl font-black text-primary mb-2 tracking-tighter">
                    R$ {property.price.toLocaleString()}
                  </h2>
                  
                  <div className="flex flex-wrap gap-2 mb-8">
                    {property.accepts_financing && (
                      <span className="flex items-center gap-1.5 px-3 py-1 bg-green-50 text-green-700 text-[9px] font-black uppercase tracking-widest rounded-lg border border-green-100">
                        <DollarSign size={12} /> Aceita Financiamento
                      </span>
                    )}
                    {property.accepts_exchange && (
                      <span className="flex items-center gap-1.5 px-3 py-1 bg-blue-50 text-blue-700 text-[9px] font-black uppercase tracking-widest rounded-lg border border-blue-100">
                        <RefreshCw size={12} /> Aceita Permuta
                      </span>
                    )}
                  </div>

                  {/* Lead Form */}
                  <div className="space-y-4">
                    <div className="space-y-3 mb-6">
                      <input 
                        type="text" 
                        placeholder="Seu Nome Completo"
                        className="w-full px-5 py-4 bg-muted/50 border border-transparent rounded-2xl focus:border-primary/20 focus:outline-none font-bold text-primary placeholder:text-primary/30"
                      />
                      <input 
                        type="email" 
                        placeholder="E-mail de contato"
                        className="w-full px-5 py-4 bg-muted/50 border border-transparent rounded-2xl focus:border-primary/20 focus:outline-none font-bold text-primary placeholder:text-primary/30"
                      />
                      <input 
                        type="text" 
                        placeholder="WhatsApp (ex: 62 99999-9999)"
                        className="w-full px-5 py-4 bg-muted/50 border border-transparent rounded-2xl focus:border-primary/20 focus:outline-none font-bold text-primary placeholder:text-primary/30"
                      />
                    </div>
                    
                    <button className="w-full bg-primary text-white py-5 rounded-[1.5rem] font-black text-lg flex items-center justify-center gap-3 hover:bg-primary-light transition-all shadow-premium group">
                      <MessageCircle size={24} className="group-hover:rotate-12 transition-transform" />
                      Quero saber mais
                    </button>
                    
                    <button className="w-full bg-white border border-border text-primary py-4 rounded-[1.5rem] font-bold flex items-center justify-center gap-3 hover:bg-muted transition-all">
                      <Calendar size={20} />
                      Agendar Visita
                    </button>
                  </div>

                  <div className="mt-8 pt-8 border-t border-border flex items-center gap-4">
                    <div className="w-14 h-14 bg-muted rounded-full flex items-center justify-center font-black text-primary/30">
                      HB
                    </div>
                    <div>
                      <p className="text-xs font-black text-muted-foreground uppercase tracking-widest">Corretor Responsável</p>
                      <p className="font-black text-primary">Equipe Habita.vc</p>
                      <div className="flex gap-2 mt-1">
                        <Phone size={14} className="text-accent" />
                        <span className="text-xs font-bold text-muted-foreground">CRECI 12345-J</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Trust Badge */}
                <div className="bg-muted/30 p-6 rounded-[2rem] border border-border flex items-center gap-4">
                  <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-accent shadow-sm">
                    <CheckCircle2 size={24} />
                  </div>
                  <p className="text-xs font-bold text-primary/60 leading-relaxed">
                    Seus dados estão seguros e serão usados apenas para o atendimento deste imóvel.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

const SpecItem = ({ icon, label, value }: any) => (
  <div className="flex flex-col gap-1">
    <div className="text-accent mb-2">
      {icon}
    </div>
    <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">{label}</p>
    <p className="text-xl font-black text-primary">{value}</p>
  </div>
);
