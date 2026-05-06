'use client';

import React, { useState, useEffect } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { PropertiesService } from '@/services/properties.service';
import { Property } from '@/types/database';
import { 
  MapPin, BedDouble, Square, Car, Bath, CheckCircle2, MessageCircle, Phone,
  Share2, Calendar, ChevronLeft, RefreshCw, DollarSign, X, ImageIcon
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function PublicPropertyDetailSlugPage({ params }: { params: Promise<{ city: string; slug: string }> }) {
  const resolvedParams = React.use(params);
  const router = useRouter();
  const [property, setProperty] = useState<Property | null>(null);
  const [similarProperties, setSimilarProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Lightbox state
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Lead Form state
  const [leadName, setLeadName] = useState('');
  const [leadPhone, setLeadPhone] = useState('');

  useEffect(() => {
    const fetch = async () => {
      try {
        setLoading(true);
        const data = await PropertiesService.getBySlug(resolvedParams.city, resolvedParams.slug);
        setProperty(data);
        
        // Fetch similar properties
        if (data) {
          const { data: similar } = await PropertiesService.getAllFiltered({});
          const filtered = similar?.filter(p => p.id !== data.id).slice(0, 3) || [];
          setSimilarProperties(filtered);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [resolvedParams.city, resolvedParams.slug]);

  const handleWhatsApp = (message?: string) => {
    const brokerPhone = property?.registered_by_profile?.whatsapp || '5562999999999';
    const cleanPhone = brokerPhone.replace(/\D/g, '');
    const defaultMessage = `Olá! Meu nome é ${leadName || 'um cliente'}. Tenho interesse no imóvel "${property?.title}" (Ref: ${property?.reference || property?.id}).`;
    window.open(`https://wa.me/${cleanPhone}?text=${encodeURIComponent(message || defaultMessage)}`, '_blank');
  };

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

  // Prepare images array
  const allImages = property.images && property.images.length > 0 ? property.images : (property.main_image ? [property.main_image] : []);

  return (
    <div className="min-h-screen bg-white pb-24 md:pb-0"> {/* Padding bottom for mobile fixed CTA */}
      <Navbar />
      
      <main className="pt-24 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Breadcrumbs */}
          <div className="flex items-center justify-between mb-6">
            <button onClick={() => router.back()} className="flex items-center gap-1 text-sm font-bold text-muted-foreground hover:text-primary transition-colors">
              <ChevronLeft size={16} /> Voltar
            </button>
            <button className="flex items-center gap-2 text-sm font-bold text-primary hover:text-accent transition-colors bg-muted/50 px-4 py-2 rounded-full">
              <Share2 size={16} /> Compartilhar
            </button>
          </div>

          <div className="grid lg:grid-cols-3 gap-8 items-start">
            
            {/* LEFT COLUMN: Images & Details */}
            <div className="lg:col-span-2 space-y-12">
              
              {/* HERO GALLERY */}
              <div className="space-y-4">
                {allImages.length > 0 ? (
                  <div className="grid grid-cols-4 grid-rows-2 gap-4 h-[400px] md:h-[500px] rounded-[2rem] overflow-hidden relative">
                    {/* Main Image */}
                    <div className="col-span-4 md:col-span-3 row-span-2 relative group cursor-pointer" onClick={() => { setCurrentImageIndex(0); setIsLightboxOpen(true); }}>
                      <img src={allImages[0]} alt={property.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                      <div className="absolute top-4 left-4 flex gap-2">
                        <span className="bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest text-primary shadow-lg">
                          {property.type}
                        </span>
                        {property.pattern === 'high_end' && (
                          <span className="bg-accent text-white px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg">
                            Exclusividade Luxo
                          </span>
                        )}
                      </div>
                    </div>
                    
                    {/* Thumbnails (Hidden on small mobile) */}
                    {allImages[1] && (
                      <div className="hidden md:block col-span-1 row-span-1 relative cursor-pointer group" onClick={() => { setCurrentImageIndex(1); setIsLightboxOpen(true); }}>
                        <img src={allImages[1]} alt={property.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                      </div>
                    )}
                    {allImages[2] && (
                      <div className="hidden md:block col-span-1 row-span-1 relative cursor-pointer group" onClick={() => { setCurrentImageIndex(2); setIsLightboxOpen(true); }}>
                        <img src={allImages[2]} alt={property.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                        
                        {allImages.length > 3 && (
                          <div className="absolute inset-0 bg-black/50 flex items-center justify-center transition-colors group-hover:bg-black/40">
                            <span className="text-white font-black text-lg flex flex-col items-center gap-1">
                              <ImageIcon size={24} />
                              +{allImages.length - 3}
                            </span>
                          </div>
                        )}
                      </div>
                    )}
                    
                    <button 
                      onClick={() => setIsLightboxOpen(true)}
                      className="md:hidden absolute bottom-4 right-4 bg-white/90 backdrop-blur-md px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest text-primary shadow-lg flex items-center gap-2"
                    >
                      <ImageIcon size={16} /> Ver fotos ({allImages.length})
                    </button>
                  </div>
                ) : (
                  <div className="w-full h-[400px] bg-muted rounded-[2rem] flex flex-col items-center justify-center text-muted-foreground/50 border border-border">
                    <MapPin size={64} className="mb-4" />
                    <p className="font-bold">Sem imagens disponíveis</p>
                  </div>
                )}
              </div>

              {/* Mobile Title (Only visible on mobile, since Desktop has it in sidebar) */}
              <div className="lg:hidden space-y-4">
                <p className="text-sm font-black text-muted-foreground uppercase tracking-widest">Valor de Investimento</p>
                <h2 className="text-4xl font-black text-primary leading-tight">R$ {property.price.toLocaleString()}</h2>
                <h1 className="text-2xl font-black text-primary leading-tight">{property.title}</h1>
                <p className="text-muted-foreground flex items-center gap-2 font-medium">
                  <MapPin size={18} className="text-accent" />
                  {property.address_street}, {property.address_city} - {property.address_state}
                </p>
              </div>

              {/* FAST INFO ICONS */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-8 border-y border-border">
                <SpecItem icon={<BedDouble size={20} />} label="Dormitórios" value={property.rooms || property.metadata?.rooms || 0} />
                <SpecItem icon={<Bath size={20} />} label="Suítes" value={property.suites || property.metadata?.bathrooms || 0} />
                <SpecItem icon={<Square size={20} />} label="Área Útil" value={`${property.area_useful || property.metadata?.area || 0}m²`} />
                <SpecItem icon={<Car size={20} />} label="Vagas" value={property.parking_spaces || property.metadata?.parking || 0} />
              </div>

              {/* HIGHLIGHTS */}
              {property.metadata?.features && property.metadata.features.length > 0 && (
                <div className="space-y-6">
                  <h3 className="text-2xl font-black text-primary">Destaques do Imóvel</h3>
                  <div className="grid sm:grid-cols-2 gap-4">
                    {property.metadata.features.slice(0, 6).map((feature: string, i: number) => (
                      <div key={i} className="flex items-center gap-3 text-primary font-bold">
                        <CheckCircle2 size={20} className="text-accent shrink-0" />
                        {feature}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* DESCRIPTION */}
              <div className="space-y-6">
                <h3 className="text-2xl font-black text-primary">Descrição</h3>
                <p className="text-lg text-muted-foreground leading-relaxed whitespace-pre-line">
                  {property.description}
                </p>
              </div>

              {/* LOCATION */}
              <div className="space-y-6">
                <h3 className="text-2xl font-black text-primary">Localização</h3>
                <div className="w-full h-[300px] bg-muted/30 rounded-[2rem] border border-border flex items-center justify-center relative overflow-hidden">
                   {/* Here we would put a real map if we had Google Maps API. For now, a stylized placeholder */}
                   <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, #000 1px, transparent 0)', backgroundSize: '24px 24px' }} />
                   <div className="text-center relative z-10 space-y-2">
                     <div className="w-16 h-16 bg-accent/20 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                        <MapPin size={32} className="text-accent" />
                     </div>
                     <p className="font-black text-primary text-xl">{property.address_neighborhood || property.address_city}</p>
                     <p className="text-sm font-bold text-muted-foreground">{property.address_city} - {property.address_state}</p>
                   </div>
                </div>
              </div>

            </div>

            {/* RIGHT COLUMN: Sticky Sidebar */}
            <div className="lg:col-span-1 space-y-6">
              <div className="sticky top-24 space-y-6">
                
                {/* Main Conversion Card (Hidden on mobile, shown on desktop) */}
                <div className="hidden lg:block bg-white p-8 rounded-[2.5rem] shadow-luxury border border-border">
                  <p className="text-sm font-black text-muted-foreground uppercase tracking-widest mb-2">Valor de Investimento</p>
                  <h2 className="text-5xl font-black text-primary mb-4 tracking-tighter">
                    R$ {property.price.toLocaleString()}
                  </h2>
                  <h1 className="text-xl font-bold text-primary leading-tight mb-2">{property.title}</h1>
                  <p className="text-sm text-muted-foreground flex items-center gap-1.5 font-medium mb-8">
                    <MapPin size={16} className="text-accent shrink-0" />
                    {property.address_street}, {property.address_city}
                  </p>

                  <div className="space-y-3">
                    <button onClick={() => handleWhatsApp()} className="w-full bg-[#25D366] text-white py-5 rounded-[1.5rem] font-black text-lg flex items-center justify-center gap-3 hover:bg-[#128C7E] transition-all shadow-premium group">
                      <MessageCircle size={24} className="group-hover:rotate-12 transition-transform" />
                      Falar no WhatsApp
                    </button>
                    
                    <button className="w-full bg-white border border-border text-primary py-4 rounded-[1.5rem] font-bold flex items-center justify-center gap-3 hover:bg-muted transition-all">
                      <Calendar size={20} />
                      Agendar Visita
                    </button>
                  </div>
                </div>

                {/* Responsible Broker Card */}
                <div className="bg-muted/10 p-8 rounded-[2.5rem] border border-border">
                  <h3 className="text-xs font-black text-muted-foreground uppercase tracking-widest mb-6">Responsável pelo anúncio</h3>
                  <div className="flex items-center gap-4 mb-6">
                    {property.registered_by_profile?.avatar_url ? (
                      <img src={property.registered_by_profile.avatar_url} alt="Corretor" className="w-16 h-16 rounded-full object-cover shadow-md" />
                    ) : (
                      <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center font-black text-primary text-xl">
                        {property.registered_by_profile?.full_name?.substring(0, 2).toUpperCase() || 'HB'}
                      </div>
                    )}
                    <div>
                      <p className="font-black text-primary text-lg">{property.registered_by_profile?.full_name || 'Equipe Habita.vc'}</p>
                      <p className="text-xs font-bold text-muted-foreground">{property.registered_by_profile?.role === 'broker' ? 'Corretor Especialista' : 'Imobiliária'}</p>
                    </div>
                  </div>
                  
                  {/* Embedded Lead Capture Form */}
                  <form onSubmit={(e) => { e.preventDefault(); handleWhatsApp(); }} className="space-y-3 mt-6 pt-6 border-t border-border">
                    <p className="text-sm font-bold text-primary mb-2">Envie uma mensagem direta:</p>
                    <input 
                      type="text" 
                      value={leadName}
                      onChange={(e) => setLeadName(e.target.value)}
                      placeholder="Seu Nome"
                      required
                      className="w-full px-4 py-3 bg-white border border-border rounded-xl focus:border-primary focus:outline-none font-bold text-sm text-primary placeholder:text-muted-foreground/50"
                    />
                    <input 
                      type="tel" 
                      value={leadPhone}
                      onChange={(e) => setLeadPhone(e.target.value)}
                      placeholder="Seu WhatsApp"
                      required
                      className="w-full px-4 py-3 bg-white border border-border rounded-xl focus:border-primary focus:outline-none font-bold text-sm text-primary placeholder:text-muted-foreground/50"
                    />
                    <button type="submit" className="w-full bg-primary text-white py-4 rounded-xl font-black text-sm flex items-center justify-center gap-2 hover:bg-primary-light transition-all shadow-md">
                      Receber mais informações
                    </button>
                  </form>
                </div>

                {/* Legal Disclaimer */}
                <p className="text-[10px] font-bold text-muted-foreground/60 text-center px-4">
                  A plataforma apenas divulga os imóveis e seus anunciantes, não sendo responsável pela negociação. Valores sujeitos a alteração.
                </p>

              </div>
            </div>
          </div>
        </div>
      </main>

      {/* SIMILAR PROPERTIES */}
      {similarProperties.length > 0 && (
        <section className="py-20 bg-muted/20 border-t border-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-black text-primary mb-10">Imóveis Similares</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {similarProperties.map(sim => (
                <Link href={`/imoveis/${sim.address_city.toLowerCase()}/${sim.slug || sim.id}`} key={sim.id} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-border group hover:border-primary/20 transition-all">
                  <div className="aspect-[4/3] bg-muted relative overflow-hidden">
                    <img src={sim.main_image || (sim.images && sim.images[0]) || ''} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-md text-white px-2 py-1 rounded text-[10px] font-black uppercase tracking-widest">
                      {sim.pattern}
                    </div>
                  </div>
                  <div className="p-4">
                    <p className="font-bold text-primary text-lg leading-tight line-clamp-1 mb-1">{sim.title}</p>
                    <p className="text-sm text-muted-foreground mb-4">{sim.address_neighborhood || sim.address_city}</p>
                    <p className="font-black text-accent text-xl">R$ {sim.price.toLocaleString()}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* FIXED MOBILE CTA */}
      <div className="lg:hidden fixed bottom-0 left-0 w-full bg-white border-t border-border p-4 shadow-[0_-10px_40px_rgba(0,0,0,0.1)] z-40 flex gap-3">
        <button className="flex-1 bg-white border border-border text-primary py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2">
          <Calendar size={18} />
          Visita
        </button>
        <button onClick={() => handleWhatsApp()} className="flex-[2] bg-[#25D366] text-white py-3 rounded-xl font-black text-sm flex items-center justify-center gap-2 shadow-md">
          <MessageCircle size={18} />
          WhatsApp
        </button>
      </div>

      {/* LIGHTBOX MODAL */}
      {isLightboxOpen && (
        <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-sm flex flex-col">
          <div className="p-6 flex justify-between items-center text-white">
            <span className="font-black text-sm uppercase tracking-widest">{currentImageIndex + 1} / {allImages.length}</span>
            <button onClick={() => setIsLightboxOpen(false)} className="p-2 hover:bg-white/10 rounded-full transition-colors">
              <X size={24} />
            </button>
          </div>
          <div className="flex-1 flex items-center justify-center relative px-4">
            <button 
              onClick={() => setCurrentImageIndex(prev => prev > 0 ? prev - 1 : allImages.length - 1)}
              className="absolute left-4 p-4 bg-white/5 hover:bg-white/10 rounded-full text-white backdrop-blur-md transition-colors"
            >
              <ChevronLeft size={32} />
            </button>
            
            <img 
              src={allImages[currentImageIndex]} 
              className="max-w-full max-h-[80vh] object-contain rounded-lg"
              alt={`Foto ${currentImageIndex + 1}`}
            />

            <button 
              onClick={() => setCurrentImageIndex(prev => prev < allImages.length - 1 ? prev + 1 : 0)}
              className="absolute right-4 p-4 bg-white/5 hover:bg-white/10 rounded-full text-white backdrop-blur-md transition-colors rotate-180"
            >
              <ChevronLeft size={32} />
            </button>
          </div>
          {/* Thumbnails rail in modal */}
          <div className="p-4 flex gap-2 overflow-x-auto justify-center">
            {allImages.map((img, i) => (
              <button 
                key={i} 
                onClick={() => setCurrentImageIndex(i)}
                className={`w-16 h-16 rounded-lg overflow-hidden border-2 shrink-0 transition-all ${i === currentImageIndex ? 'border-accent opacity-100 scale-110' : 'border-transparent opacity-50 hover:opacity-100'}`}
              >
                <img src={img} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}

const SpecItem = ({ icon, label, value }: any) => (
  <div className="flex flex-col gap-1 items-start">
    <div className="text-primary/40 mb-1">
      {icon}
    </div>
    <p className="text-xl font-black text-primary">{value}</p>
    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{label}</p>
  </div>
);
