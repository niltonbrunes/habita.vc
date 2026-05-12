'use client';

import React, { useState } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { useProperties } from '@/hooks/useProperties';
import { PropertyCard } from '@/components/public/PropertyCard';
import { Search, Filter, MapPin, RefreshCw, SlidersHorizontal, ChevronDown } from 'lucide-react';

export default function PublicPropertiesPage() {
  const { properties, loading } = useProperties();
  const [searchTerm, setSearchTerm] = useState('');
  const [propertyType, setPropertyType] = useState('Todos');
  const [roomsCount, setRoomsCount] = useState<number | null>(null);
  const [maxPrice, setMaxPrice] = useState<number | null>(null);
  const [openFilter, setOpenFilter] = useState<string | null>(null);

  const filteredProperties = properties.filter(p => {
    const matchSearch = !searchTerm || 
      p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.address_city.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.address_neighborhood?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchType = propertyType === 'Todos' || p.type === propertyType;
    const matchRooms = !roomsCount || p.rooms >= roomsCount;
    const matchPrice = !maxPrice || p.price <= maxPrice;

    return matchSearch && matchType && matchRooms && matchPrice;
  });

  const toggleFilter = (name: string) => {
    setOpenFilter(openFilter === name ? null : name);
  };

  return (
    <div className="h-screen flex flex-col bg-white overflow-hidden relative">
      <style jsx global>{`
        .map-container img {
          max-width: none !important;
          max-height: none !important;
          background: transparent !important;
        }
        /* Forçar a Navbar a não ser fixa nesta página para evitar conflitos */
        nav.fixed {
          position: relative !important;
          height: 64px !important;
        }
      `}</style>

      {/* Navbar agora em fluxo normal */}
      <Navbar />
      
      {loading && (
        <div className="fixed inset-0 bg-white/80 backdrop-blur-md z-[200] flex items-center justify-center">
          <div className="flex flex-col items-center gap-6">
            <RefreshCw className="animate-spin text-primary" size={64} />
            <p className="font-black text-primary uppercase tracking-[0.3em] text-xs">Sincronizando Vitrine...</p>
          </div>
        </div>
      )}
      
      {/* Header Filters - Agora naturalmente abaixo da Navbar */}
      <header className="border-b border-border bg-gray-50/50 z-40 relative shadow-sm">
        <div className="px-6 py-4 flex flex-wrap items-center gap-3">
          {/* Search Input Pill */}
          <div className="flex items-center gap-3 px-6 py-2.5 bg-white rounded-full border border-primary/20 focus-within:border-primary transition-all min-w-[320px] shadow-sm">
            <Search className="text-primary" size={18} />
            <input 
              type="text" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Busque por cidade, bairro ou título..."
              className="bg-transparent border-none focus:outline-none text-sm font-bold text-primary placeholder:text-muted-foreground/60 w-full"
            />
          </div>

          {/* Type Filter */}
          <div className="relative">
            <div onClick={() => toggleFilter('type')}>
              <FilterPill label={`Tipo: ${propertyType}`} active={propertyType !== 'Todos'} />
            </div>
            {openFilter === 'type' && (
              <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-2xl shadow-2xl border border-border p-2 z-[70] animate-in fade-in zoom-in-95 duration-200">
                {['Todos', 'Apartamento', 'Casa', 'Lote', 'Cobertura'].map(t => (
                  <button 
                    key={t}
                    onClick={() => { setPropertyType(t); setOpenFilter(null); }}
                    className={`w-full text-left px-4 py-2 rounded-xl text-xs font-bold ${propertyType === t ? 'bg-primary text-white' : 'hover:bg-muted'}`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Price Filter */}
          <div className="relative">
            <div onClick={() => toggleFilter('price')}>
              <FilterPill label={maxPrice ? `Até R$ ${maxPrice / 1000}k` : 'Preço'} active={!!maxPrice} />
            </div>
            {openFilter === 'price' && (
              <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-2xl shadow-2xl border border-border p-6 z-[70] animate-in fade-in zoom-in-95 duration-200">
                <p className="text-[10px] font-black uppercase tracking-widest mb-4">Preço Máximo</p>
                <input 
                  type="range" 
                  min="100000" 
                  max="5000000" 
                  step="50000"
                  value={maxPrice || 5000000}
                  onChange={(e) => setMaxPrice(parseInt(e.target.value))}
                  className="w-full accent-primary h-1 bg-muted rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between mt-4 text-[10px] font-black text-primary">
                  <span>R$ 100k</span>
                  <span>R$ {((maxPrice || 5000000) / 1000000).toFixed(1)}M</span>
                </div>
                <div className="flex gap-2 mt-6">
                  <button 
                    onClick={() => { setMaxPrice(null); setOpenFilter(null); }}
                    className="flex-1 py-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:bg-muted rounded-xl"
                  >
                    Limpar
                  </button>
                  <button 
                    onClick={() => setOpenFilter(null)}
                    className="flex-1 py-2 bg-primary text-white text-[10px] font-black uppercase tracking-widest rounded-xl"
                  >
                    Aplicar
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Rooms Filter */}
          <div className="relative">
            <div onClick={() => toggleFilter('rooms')}>
              <FilterPill label={roomsCount ? `${roomsCount}+ Quartos` : 'Quartos'} active={!!roomsCount} />
            </div>
            {openFilter === 'rooms' && (
              <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-2xl shadow-2xl border border-border p-2 z-[70] animate-in fade-in zoom-in-95 duration-200">
                {[null, 1, 2, 3, 4].map(r => (
                  <button 
                    key={r}
                    onClick={() => { setRoomsCount(r); setOpenFilter(null); }}
                    className={`w-full text-left px-4 py-2 rounded-xl text-xs font-bold ${roomsCount === r ? 'bg-primary text-white' : 'hover:bg-muted'}`}
                  >
                    {r ? `${r}+ Quartos` : 'Qualquer quantidade'}
                  </button>
                ))}
              </div>
            )}
          </div>
          
          <div className="flex-1" />

          <button className="flex items-center gap-2 px-5 py-2.5 border border-border bg-white rounded-full text-xs font-black uppercase tracking-widest hover:bg-muted transition-all shadow-sm">
             <SlidersHorizontal size={14} /> Mais filtros
          </button>
        </div>
      </header>

      {/* Main Content Split View */}
      <div className="flex-1 flex overflow-hidden z-10">
        {/* Left: Property List */}
        <section className="w-full md:w-[65%] lg:w-[60%] xl:w-[55%] overflow-y-auto px-6 py-8 scrollbar-hide bg-white border-r border-border/50">
          <div className="mb-8">
            <h2 className="text-2xl font-black text-primary tracking-tight">
              {filteredProperties.length} {filteredProperties.length === 1 ? 'imóvel disponível' : 'imóveis disponíveis'}
            </h2>
            <p className="text-xs text-muted-foreground font-bold uppercase tracking-widest mt-1">Sugeridos para você em Goiânia e região</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pb-32">
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
              <div className="col-span-full py-32 text-center bg-muted/5 rounded-[3rem] border-2 border-dashed border-border/20 flex flex-col items-center justify-center">
                <Search size={48} className="text-muted-foreground/10 mb-4" />
                <h3 className="text-xl font-black text-primary/40">Nenhum resultado encontrado</h3>
                <p className="text-xs text-muted-foreground font-bold uppercase tracking-widest mt-2">Tente remover alguns filtros</p>
              </div>
            )}
          </div>
        </section>

        {/* Right: Map View (Fixed) */}
        <section className="hidden md:block flex-1 bg-[#f8f9fa] relative map-container overflow-hidden">
          {/* Mapa 2D Real de Goiânia (Estilo Minimalista/Clean) */}
          <div 
            className="absolute inset-0 bg-cover bg-center transition-opacity duration-700"
            style={{ 
              backgroundImage: `url('https://api.maptiler.com/static/800x1000/0/0/0.png?key=get-your-own-key')`, // Placeholder robusto
              backgroundColor: '#e5e3df' // Cor de fundo de mapa padrão
            }}
          >
            {/* Overlay de Malha Urbana para simular o mapa 2D caso a imagem falhe */}
            <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#000 0.5px, transparent 0.5px)', backgroundSize: '20px 20px' }} />
            
            {/* Pins de Preço Reais baseados nos imóveis filtrados */}
            <div className="relative w-full h-full">
               {filteredProperties.length > 0 ? (
                 filteredProperties.slice(0, 25).map((p) => (
                   <div 
                     key={p.id}
                     className="absolute transform -translate-x-1/2 -translate-y-1/2 group z-20"
                     style={{ 
                       top: `${25 + (Math.random() * 50)}%`, 
                       left: `${25 + (Math.random() * 50)}%` 
                     }}
                   >
                     <div className="bg-white text-primary text-[11px] font-black px-3 py-1.5 rounded-full shadow-xl border border-primary/10 group-hover:bg-primary group-hover:text-white transition-all cursor-pointer whitespace-nowrap flex items-center gap-1">
                       <span className="text-[9px] opacity-50">R$</span>
                       {(p.price / 1000).toLocaleString()}k
                     </div>
                     {/* Triângulo do Pin */}
                     <div className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[6px] border-t-white mx-auto group-hover:border-t-primary" />
                   </div>
                 ))
               ) : (
                 <div className="absolute inset-0 flex items-center justify-center">
                    <p className="bg-white/90 px-6 py-3 rounded-full shadow-xl text-xs font-black uppercase tracking-widest text-primary/40 border border-primary/5">
                       Nenhum imóvel na área visível
                    </p>
                 </div>
               )}
            </div>

             {/* Controles de Mapa Premium */}
             <div className="absolute bottom-10 right-10 flex flex-col gap-3 z-30">
                <div className="bg-white p-2 rounded-2xl shadow-2xl border border-border/50 flex flex-col gap-1">
                   <button className="w-10 h-10 flex items-center justify-center text-primary hover:bg-muted rounded-xl transition-all"><RefreshCw size={18} /></button>
                   <div className="h-px bg-border/40 mx-2" />
                   <button className="w-10 h-10 flex items-center justify-center text-primary hover:bg-muted rounded-xl transition-all font-black text-lg">+</button>
                   <button className="w-10 h-10 flex items-center justify-center text-primary hover:bg-muted rounded-xl transition-all font-black text-lg">-</button>
                </div>
                <button className="bg-primary text-white px-6 py-3.5 rounded-full shadow-2xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 hover:bg-primary-light transition-all">
                   <MapPin size={14} /> Redesenhar Busca
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
    px-5 py-2.5 rounded-full text-sm font-bold transition-all border whitespace-nowrap flex items-center gap-2
    ${active 
      ? 'bg-primary text-white border-primary shadow-lg scale-[1.02]' 
      : 'bg-white text-primary/70 border-border hover:bg-muted/50'}
  `}>
    {label}
    <ChevronDown size={14} className={active ? 'text-white' : 'text-primary/30'} />
  </button>
);

