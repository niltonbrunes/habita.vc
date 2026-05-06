'use client';

import React, { useState, useEffect } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { ProfilesService } from '@/services/profiles.service';
import { PropertiesService } from '@/services/properties.service';
import { 
  Camera, 
  MessageCircle, 
  Mail, 
  Phone, 
  MapPin, 
  Star, 
  ArrowRight,
  RefreshCw,
  Building2,
  Award
} from 'lucide-react';
import Link from 'next/link';

export default function BrokerShowcasePage({ params }: { params: Promise<{ brokerSlug: string }> }) {
  const resolvedParams = React.use(params);
  const [profile, setProfile] = useState<any>(null);
  const [properties, setProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const profileData = await ProfilesService.getBySlug(resolvedParams.brokerSlug);
        setProfile(profileData);
        
        // Buscar imoveis deste corretor
        const { data: props } = await (PropertiesService as any).getAllFiltered({
          brokerId: profileData.id
        });
        setProperties(props || []);
      } catch (err) {
        console.error('Erro ao carregar vitrine:', err);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [resolvedParams.brokerSlug]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <RefreshCw className="animate-spin text-primary" size={48} />
    </div>
  );

  if (!profile) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center space-y-4">
        <h2 className="text-2xl font-black text-primary">Corretor não encontrado.</h2>
        <Link href="/" className="text-accent font-bold underline">Voltar para a Home</Link>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      {/* Broker Profile Header */}
      <section className="pt-32 pb-20 bg-muted/30 border-b border-border">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="relative">
              <div className="w-48 h-48 rounded-[3rem] overflow-hidden border-4 border-white shadow-luxury">
                <img 
                  src={profile.avatar_url || `https://ui-avatars.com/api/?name=${profile.full_name}&background=0D1B2A&color=fff&size=200`} 
                  className="w-full h-full object-cover"
                  alt={profile.full_name}
                />
              </div>
              <div className="absolute -bottom-2 -right-2 bg-accent text-white p-3 rounded-2xl shadow-premium">
                <Award size={24} />
              </div>
            </div>

            <div className="flex-1 text-center md:text-left space-y-4">
              <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest">
                Corretor Especialista • Habita.vc
              </div>
              <h1 className="text-5xl font-black text-primary">{profile.full_name}</h1>
              <p className="text-lg text-muted-foreground font-medium max-w-2xl leading-relaxed">
                {profile.bio || `Especialista em imóveis de alto padrão em Goiânia. Minha missão é ajudar você a encontrar o lar dos seus sonhos com transparência e exclusividade.`}
              </p>
              
              <div className="flex flex-wrap justify-center md:justify-start gap-4 pt-4">
                {profile.whatsapp && (
                  <a href={`https://wa.me/${profile.whatsapp}`} target="_blank" className="bg-[#25D366] text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 hover:scale-105 transition-all">
                    <MessageCircle size={20} /> WhatsApp
                  </a>
                )}
                {profile.instagram && (
                  <a href={`https://instagram.com/${profile.instagram.replace('@','')}`} target="_blank" className="bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-600 text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 hover:scale-105 transition-all">
                    <Camera size={20} /> Instagram
                  </a>
                )}
                <a href={`mailto:${profile.email}`} className="bg-white text-primary border border-border px-6 py-3 rounded-2xl font-bold flex items-center gap-2 hover:bg-muted transition-all">
                  <Mail size={20} /> E-mail
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Counter */}
      <section className="bg-primary py-8 text-white">
        <div className="container mx-auto px-6">
          <div className="flex flex-wrap justify-center gap-12 md:gap-24">
            <div className="text-center">
              <p className="text-3xl font-black">{properties.length}</p>
              <p className="text-[10px] font-black uppercase tracking-widest text-white/40">Imóveis Ativos</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-black">{Math.floor(properties.length * 1.5)}</p>
              <p className="text-[10px] font-black uppercase tracking-widest text-white/40">Vendas Realizadas</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-black">5.0</p>
              <p className="text-[10px] font-black uppercase tracking-widest text-white/40">Avaliação Média</p>
            </div>
          </div>
        </div>
      </section>

      {/* Properties Catalog */}
      <section className="py-24 container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-end gap-8 mb-16">
          <div>
            <h2 className="text-4xl font-black text-primary">Minha Seleção Exclusiva</h2>
            <p className="text-muted-foreground mt-2 font-medium">Curadoria de imóveis prontos para morar e lançamentos em destaque.</p>
          </div>
          <div className="flex gap-2">
            <span className="px-4 py-2 bg-accent text-white rounded-xl text-xs font-black uppercase tracking-widest">Todos</span>
            <span className="px-4 py-2 bg-muted text-primary rounded-xl text-xs font-black uppercase tracking-widest hover:bg-accent/10 transition-colors">Venda</span>
            <span className="px-4 py-2 bg-muted text-primary rounded-xl text-xs font-black uppercase tracking-widest hover:bg-accent/10 transition-colors">Locação</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {properties.map((prop) => (
            <Link 
              key={prop.id} 
              href={`/imoveis/${prop.address_city?.toLowerCase() || 'goiania'}/${prop.slug}`}
              className="group bg-white rounded-[3rem] p-5 shadow-premium hover:shadow-luxury transition-all border border-transparent hover:border-accent/20"
            >
              <div className="aspect-[4/3] rounded-[2.5rem] overflow-hidden mb-6 relative">
                <img 
                  src={prop.main_image || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800'} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                  alt={prop.title}
                />
                <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-md px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest text-primary border border-white/20">
                  R$ {(prop.price / 1000).toFixed(0)}k
                </div>
                {prop.development && (
                   <div className="absolute bottom-4 left-4 bg-primary/90 backdrop-blur-md px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest text-white border border-white/10 flex items-center gap-1.5">
                    <Building2 size={12} /> {prop.development.name}
                  </div>
                )}
              </div>
              
              <div className="px-2 space-y-4">
                <h3 className="text-2xl font-bold text-primary group-hover:text-accent transition-colors leading-tight">
                  {prop.title}
                </h3>
                
                <div className="flex items-center gap-1.5 text-muted-foreground">
                  <MapPin size={16} />
                  <span className="text-sm font-medium">{prop.address_neighborhood}, {prop.address_city}</span>
                </div>

                <div className="flex items-center gap-6 border-t border-border pt-5">
                   <div className="flex items-center gap-2">
                     <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center text-primary">
                       <Award size={14} />
                     </div>
                     <span className="text-xs font-bold text-primary">{prop.area_total}m²</span>
                   </div>
                   <div className="flex items-center gap-2">
                     <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center text-primary">
                       <Star size={14} />
                     </div>
                     <span className="text-xs font-bold text-primary">{prop.rooms} Qts</span>
                   </div>
                </div>
              </div>
            </Link>
          ))}
          
          {properties.length === 0 && (
            <div className="col-span-full py-20 text-center bg-muted/30 rounded-[3rem] border-2 border-dashed border-border">
              <p className="text-muted-foreground font-medium">Este corretor ainda não publicou imóveis.</p>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-muted/20">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto bg-white rounded-[4rem] p-16 shadow-luxury text-center relative overflow-hidden border border-border">
             <div className="absolute top-0 left-0 w-full h-2 bg-accent" />
             <h2 className="text-4xl font-black text-primary mb-6">Pronto para encontrar seu novo lar?</h2>
             <p className="text-xl text-muted-foreground font-medium mb-10 max-w-2xl mx-auto">
               Entre em contato agora para receber uma consultoria personalizada e conhecer as melhores oportunidades do mercado.
             </p>
             <div className="flex flex-wrap justify-center gap-6">
                <a href={`https://wa.me/${profile.whatsapp}`} target="_blank" className="bg-primary text-white px-12 py-5 rounded-2xl font-black text-lg hover:bg-primary-light transition-all shadow-premium flex items-center gap-3">
                  Agendar Consultoria <ArrowRight size={24} />
                </a>
             </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-border">
        <div className="container mx-auto px-6 text-center">
           <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest">
             © 2026 Habita.vc • Vitrine Profissional de {profile.full_name}
           </p>
        </div>
      </footer>
    </div>
  );
}
