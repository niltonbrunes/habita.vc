'use client';

import React, { useState } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { useProperties } from '@/hooks/useProperties';
import { PropertyCard } from '@/components/public/PropertyCard';
import { Search, Filter, MapPin, RefreshCw, SlidersHorizontal, ChevronDown } from 'lucide-react';

export default function PublicPropertiesPage() {
  const { properties, loading } = useProperties();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('Todos');

  const filteredProperties = properties.filter(p => 
    p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.address_city.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.address_neighborhood?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="h-screen flex flex-col bg-white overflow-hidden">
      <Navbar />
      
      {loading && (
        <div className="fixed inset-0 bg-white/80 backdrop-blur-md z-[100] flex items-center justify-center">
          <div className="flex flex-col items-center gap-6">
            <RefreshCw className="animate-spin text-primary" size={64} />
            <p className="font-black text-primary uppercase tracking-[0.3em] text-xs">Sincronizando Vitrine...</p>
          </div>
        </div>
      )}
      
      {/* Header Filters - QuintoAndar Style */}
      <header className="pt-24 border-b border-border bg-white z-40">
        <div className="px-6 py-4 flex flex-wrap items-center gap-3">
          {/* Search Input Pill */}
          <div className="flex items-center gap-3 px-6 py-2.5 bg-muted/30 rounded-full border border-border/50 focus-within:border-primary/40 transition-all min-w-[300px]">
            <Search className="text-primary/30" size={18} />
            <input 
              type="text" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Onde você quer morar?"
              className="bg-transparent border-none focus:outline-none text-sm font-bold text-primary placeholder:text-muted-foreground/40 w-full"
            />
          </div>

          <FilterPill label="Comprar" active />
          <FilterPill label="Preço" />
          <FilterPill label="Condomínio + IPTU" />
          <FilterPill label="Tipo de Imóvel" />
          <FilterPill label="Quartos" />
          
          <div className="flex-1" />

          <button className="flex items-center gap-2 px-5 py-2.5 border border-border rounded-full text-xs font-black uppercase tracking-widest hover:bg-muted/50 transition-all">
             <SlidersHorizontal size={14} /> Mais filtros
          </button>
          
          <button className="flex items-center gap-2 px-6 py-2.5 bg-primary/5 text-primary border border-primary/10 rounded-full text-xs font-black uppercase tracking-widest hover:bg-primary/10 transition-all shadow-sm">
             <MapPin size={14} /> Alerta de Imóvel
          </button>
        </div>
      </header>

      {/* Main Content Split View */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left: Property List */}
        <section className="w-full md:w-[60%] lg:w-[55%] xl:w-[45%] overflow-y-auto px-6 py-8 scrollbar-hide bg-white">
          <div className="mb-8">
            <h2 className="text-xl font-black text-primary tracking-tight">
              {filteredProperties.length} {filteredProperties.length === 1 ? 'imóvel disponível' : 'imóveis disponíveis'}
            </h2>
            <p className="text-xs text-muted-foreground font-medium mt-1">Imóveis selecionados em São Paulo, SP</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {filteredProperties.length > 0 ? (
              filteredProperties.map(property => (
                <PropertyCard 
                  key={property.id}
                  id={property.id}
                  title={property.title}
                  price={property.price}
                  city={property.address_city}
                  neighborhood={property.address_neighborhood || ''}
                  bedrooms={property.rooms}
                  bathrooms={property.bathrooms}
                  area={property.area_useful}
                  imageUrl={property.images?.[0]}
                  slug={property.slug || property.id}
                  type={property.type}
                />
              ))
            ) : !loading && (
              <div className="col-span-full py-32 text-center bg-muted/10 rounded-[3rem] border-2 border-dashed border-border/20 flex flex-col items-center justify-center">
                <Search size={48} className="text-muted-foreground/20 mb-4" />
                <h3 className="text-xl font-black text-primary">Nenhum resultado</h3>
                <p className="text-xs text-muted-foreground font-bold uppercase tracking-widest mt-2">Tente ajustar sua busca</p>
              </div>
            )}
          </div>
        </section>

        {/* Right: Map View (Fixed) */}
        <section className="hidden md:block flex-1 bg-muted/20 relative">
          {/* Map Placeholder with Style */}
          <div className="absolute inset-0 bg-[url('https://api.mapbox.com/styles/v1/mapbox/light-v10/static/-46.6333,-23.5505,12/1000x1000?access_token=pk.eyJ1IjoiYm90LWNvZGUiLCJhIjoiY2w5cTVhNm5mMDBobjN2cGNmZ3NnZ3NnIn0.xxx')] bg-cover bg-center">
             <div className="absolute inset-0 bg-primary/5 backdrop-grayscale-[0.5]" />
             
             {/* Map Markers Mockup */}
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                <div className="bg-primary text-white text-[10px] font-black px-3 py-1.5 rounded-full shadow-2xl border-2 border-white animate-bounce">
                  R$ 1.2M
                </div>
             </div>
             
             <div className="absolute top-[40%] left-[30%]">
                <div className="bg-white text-primary text-[10px] font-black px-3 py-1.5 rounded-full shadow-lg border border-border/50">
                  R$ 850k
                </div>
             </div>

             <div className="absolute top-[60%] left-[70%]">
                <div className="bg-white text-primary text-[10px] font-black px-3 py-1.5 rounded-full shadow-lg border border-border/50">
                  R$ 2.5M
                </div>
             </div>

             {/* Map Controls */}
             <div className="absolute bottom-10 right-10 flex flex-col gap-2">
                <div className="bg-white p-3 rounded-2xl shadow-xl border border-border/50 flex flex-col gap-3">
                   <button className="text-primary hover:text-accent transition-colors"><RefreshCw size={20} /></button>
                   <div className="w-full h-px bg-border/40" />
                   <button className="text-primary hover:text-accent transition-colors font-black">+</button>
                   <button className="text-primary hover:text-accent transition-colors font-black">-</button>
                </div>
                <button className="bg-white px-6 py-3 rounded-full shadow-xl border border-border/50 text-[10px] font-black uppercase tracking-widest text-primary flex items-center gap-2">
                   <MapPin size={14} /> Desenhar área
                </button>
             </div>
          </div>
        </section>
      </div>
    </div>
  );
}

const FilterPill = ({ label, active = false }: { label: string, active?: boolean }) => (
  <button className={`
    px-5 py-2.5 rounded-full text-sm font-bold transition-all border whitespace-nowrap
    ${active 
      ? 'bg-primary/10 text-primary border-primary/20 shadow-sm' 
      : 'bg-white text-primary/60 border-border/60 hover:bg-muted/30 hover:border-border'}
  `}>
    <div className="flex items-center gap-2">
      {label}
      <ChevronDown size={14} className={active ? 'text-primary' : 'text-primary/30'} />
    </div>
  </button>
);

