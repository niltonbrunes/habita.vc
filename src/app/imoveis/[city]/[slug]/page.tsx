import React from 'react';
import { Metadata } from 'next';
import { Navbar } from '@/components/layout/Navbar';
import { PropertiesService } from '@/services/properties.service';
import { LeadForm } from '@/components/public/LeadForm';
import { 
  MapPin, 
  BedDouble, 
  Square, 
  Car, 
  Bath, 
  CheckCircle2, 
  Share2,
  ChevronLeft,
  ArrowRight
} from 'lucide-react';
import Link from 'next/link';

interface PageProps {
  params: Promise<{ city: string; slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { city, slug } = await params;
  const property = await PropertiesService.getBySlug(city, slug);

  if (!property) return { title: 'Imóvel não encontrado | Habita.vc' };

  return {
    title: `${property.title} | ${property.address_neighborhood}, ${property.address_city} | Habita.vc`,
    description: property.description.substring(0, 160),
    openGraph: {
      title: property.title,
      description: property.description.substring(0, 160),
      images: property.images && property.images.length > 0 ? [property.images[0]] : [],
    }
  };
}

export default async function PropertyDetailPage({ params }: PageProps) {
  const { city, slug } = await params;
  const property = await PropertiesService.getBySlug(city, slug);

  if (!property) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center space-y-6 px-4 text-center">
        <h2 className="text-3xl font-black text-primary">Imóvel não encontrado</h2>
        <p className="text-muted-foreground max-w-md">O link que você acessou pode estar expirado ou o imóvel já foi vendido.</p>
        <Link href="/imoveis" className="bg-primary text-white px-8 py-3 rounded-2xl font-bold">Ver outros imóveis</Link>
      </div>
    );
  }

  const formattedPrice = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    maximumFractionDigits: 0
  }).format(property.price);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-24 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumbs */}
          <div className="flex items-center gap-2 mb-8 overflow-x-auto whitespace-nowrap pb-2 scrollbar-hide">
            <Link href="/" className="text-xs font-bold text-muted-foreground hover:text-primary transition-colors">Home</Link>
            <ChevronLeft size={12} className="text-muted-foreground/30 rotate-180" />
            <Link href="/imoveis" className="text-xs font-bold text-muted-foreground hover:text-primary transition-colors">Imóveis</Link>
            <ChevronLeft size={12} className="text-muted-foreground/30 rotate-180" />
            <Link href={`/imoveis/${city.toLowerCase()}`} className="text-xs font-bold text-muted-foreground hover:text-primary transition-colors capitalize">{city}</Link>
            <ChevronLeft size={12} className="text-muted-foreground/30 rotate-180" />
            <span className="text-xs font-bold text-primary truncate max-w-[200px]">{property.title}</span>
          </div>

          <div className="grid lg:grid-cols-3 gap-12">
            {/* Gallery Section */}
            <div className="lg:col-span-2 space-y-10">
              <div className="relative aspect-[16/9] bg-muted rounded-[2.5rem] overflow-hidden shadow-luxury border border-border group">
                <img 
                  src={property.images && property.images.length > 0 ? property.images[0] : "/modern_luxury_apartment_exterior_1777989602281.png"} 
                  alt={property.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-8 left-8 flex gap-3">
                  <span className="bg-primary/90 backdrop-blur-md px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest text-white shadow-xl">
                    {property.type}
                  </span>
                  {property.pattern === 'high_end' && (
                    <span className="bg-accent text-white px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest shadow-xl">
                      Exclusividade Luxo
                    </span>
                  )}
                </div>
                <button className="absolute bottom-8 right-8 bg-white/90 backdrop-blur-md p-4 rounded-2xl shadow-xl hover:bg-white transition-all text-primary opacity-0 group-hover:opacity-100 duration-300">
                  <Share2 size={24} />
                </button>
              </div>

              {/* Title & Info */}
              <div className="space-y-4">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                  <div className="space-y-2">
                    <h1 className="text-4xl md:text-6xl font-black text-primary leading-tight tracking-tighter">
                      {property.title}
                    </h1>
                    <p className="text-xl text-muted-foreground flex items-center gap-2 font-medium">
                      <MapPin size={24} className="text-accent" />
                      {property.address_neighborhood}, {property.address_city}
                    </p>
                  </div>
                  <div className="text-right hidden md:block">
                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1">Valor de Investimento</p>
                    <p className="text-4xl font-black text-primary tracking-tighter">{formattedPrice}</p>
                  </div>
                </div>
              </div>

              {/* Main Specs Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-12 border-y border-border">
                <SpecItem icon={<BedDouble size={28} />} label="Dormitórios" value={property.rooms} />
                <SpecItem icon={<Bath size={28} />} label="Suítes" value={property.suites} />
                <SpecItem icon={<Square size={26} />} label="Área Útil" value={`${property.area_useful}m²`} />
                <SpecItem icon={<Car size={28} />} label="Vagas" value={property.parking_spaces} />
              </div>

              {/* Description */}
              <div className="space-y-8">
                <h3 className="text-3xl font-black text-primary tracking-tight">O Imóvel</h3>
                <p className="text-xl text-muted-foreground leading-relaxed whitespace-pre-line font-medium">
                  {property.description}
                </p>
              </div>

              {/* Features Chips */}
              <div className="space-y-8 p-10 bg-muted/30 rounded-[3rem] border border-border">
                <h3 className="text-2xl font-black text-primary tracking-tight">Diferenciais e Comodidades</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {property.metadata?.features?.map((feature: string, i: number) => (
                    <div key={i} className="flex items-center gap-3 py-1">
                      <div className="w-6 h-6 rounded-full bg-accent/10 flex items-center justify-center">
                        <CheckCircle2 size={14} className="text-accent" />
                      </div>
                      <span className="text-lg font-bold text-primary/80">{feature}</span>
                    </div>
                  ))}
                  {(!property.metadata?.features || property.metadata.features.length === 0) && (
                    <div className="col-span-full">
                      <p className="text-muted-foreground font-medium italic">Consulte nossos consultores para a lista completa de diferenciais deste imóvel.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Sticky Sidebar / Lead Form */}
            <div className="space-y-6">
              <div className="sticky top-28 space-y-6">
                {/* Mobile Price Display */}
                <div className="md:hidden bg-white p-8 rounded-[2.5rem] shadow-premium border border-border text-center">
                   <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-2">Valor de Investimento</p>
                   <p className="text-4xl font-black text-primary tracking-tighter">{formattedPrice}</p>
                </div>

                {/* Lead Form Card */}
                <LeadForm 
                  propertyId={property.id} 
                  propertyTitle={property.title} 
                  brokerId={property.registered_by_id} 
                />

                {/* Related CTA */}
                <Link href="/imoveis" className="group bg-primary p-8 rounded-[2.5rem] flex flex-col gap-4 text-white hover:bg-primary-dark transition-all overflow-hidden relative shadow-luxury">
                   <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:translate-x-2 transition-transform">
                     <ArrowRight size={80} />
                   </div>
                   <h4 className="text-xl font-bold relative z-10">Busca Personalizada</h4>
                   <p className="text-sm text-white/70 relative z-10 leading-relaxed font-medium">Não encontrou o imóvel perfeito? Deixe que nossos especialistas busquem para você.</p>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

const SpecItem = ({ icon, label, value }: any) => (
  <div className="flex flex-col items-center md:items-start text-center md:text-left gap-1">
    <div className="text-accent mb-3 p-3 bg-accent/5 rounded-2xl">
      {icon}
    </div>
    <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">{label}</p>
    <p className="text-2xl font-black text-primary tracking-tighter">{value}</p>
  </div>
);
