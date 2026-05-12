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
      <Navbar />
      
      {loading && (
        <div className="fixed inset-0 bg-white/80 backdrop-blur-md z-[200] flex items-center justify-center">
          <div className="flex flex-col items-center gap-6">
            <RefreshCw className="animate-spin text-primary" size={64} />
            <p className="font-black text-primary uppercase tracking-[0.3em] text-xs">Sincronizando Vitrine...</p>
          </div>
        </div>
      )}
      
      {/* Header Filters - QuintoAndar Style */}
      <header className="mt-16 border-b border-border bg-white z-30 relative shadow-sm">
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

          <button className="flex items-center gap-2 px-5 py-2.5 border border-border rounded-full text-xs font-black uppercase tracking-widest hover:bg-muted transition-all">
             <SlidersHorizontal size={14} /> Mais filtros
          </button>
        </div>
      </header>

      {/* Main Content Split View */}
      <div className="flex-1 flex overflow-hidden z-10">
        {/* Left: Property List */}
        <section className="w-full md:w-[60%] lg:w-[55%] xl:w-[45%] overflow-y-auto px-6 py-8 scrollbar-hide bg-white">
          <div className="mb-8">
            <h2 className="text-xl font-black text-primary tracking-tight">
              {filteredProperties.length} {filteredProperties.length === 1 ? 'imóvel disponível' : 'imóveis disponíveis'}
            </h2>
            <p className="text-xs text-muted-foreground font-medium mt-1">Imóveis selecionados para você</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pb-20">
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
          <div className="absolute inset-0 bg-[url('https://api.mapbox.com/styles/v1/mapbox/light-v10/static/-46.6333,-23.5505,12/1000x1000?access_token=pk.xxx')] bg-cover bg-center">
             <div className="absolute inset-0 bg-primary/5 backdrop-grayscale-[0.5]" />
             
             {/* Map Markers Mockup Based on Filtered Properties */}
             {filteredProperties.slice(0, 15).map((p, idx) => (
               <div 
                 key={p.id}
                 className="absolute transform -translate-x-1/2 -translate-y-1/2"
                 style={{ 
                   top: `${20 + (Math.random() * 60)}%`, 
                   left: `${20 + (Math.random() * 60)}%` 
                 }}
               >
                 <div className="bg-white text-primary text-[10px] font-black px-3 py-1.5 rounded-full shadow-lg border border-border/50 hover:bg-primary hover:text-white transition-all cursor-pointer whitespace-nowrap">
                   R$ {(p.price / 1000).toLocaleString()}k
                 </div>
               </div>
             ))}

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
    px-5 py-2.5 rounded-full text-sm font-bold transition-all border whitespace-nowrap flex items-center gap-2
    ${active 
      ? 'bg-primary text-white border-primary shadow-lg scale-[1.02]' 
      : 'bg-white text-primary/70 border-border hover:bg-muted/50'}
  `}>
    {label}
    <ChevronDown size={14} className={active ? 'text-white' : 'text-primary/30'} />
  </button>
);

