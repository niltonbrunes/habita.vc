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

  const [minArea, setMinArea] = useState<number | null>(null);
  const [bathroomsMin, setBathroomsMin] = useState<number | null>(null);
  const [parkingMin, setParkingMin] = useState<number | null>(null);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [showMapMobile, setShowMapMobile] = useState(false);
  const [hoveredPropertyId, setHoveredPropertyId] = useState<string | null>(null);

  const filteredProperties = properties.filter(p => {
    const matchSearch = !searchTerm || 
      p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.address_city.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.address_neighborhood?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchType = propertyType === 'Todos' || p.type === propertyType;
    const matchRooms = !roomsCount || p.rooms >= roomsCount;
    const matchPrice = !maxPrice || p.price <= maxPrice;
    
    // Novos filtros avançados
    const matchArea = !minArea || p.area_useful >= minArea;
    const matchBathrooms = !bathroomsMin || p.bathrooms >= bathroomsMin;
    const matchParking = !parkingMin || p.parking_spaces >= parkingMin;

    return matchSearch && matchType && matchRooms && matchPrice && matchArea && matchBathrooms && matchParking;
  });

  const toggleFilter = (name: string) => {
    setOpenFilter(openFilter === name ? null : name);
  };

  const resetAdvancedFilters = () => {
    setMinArea(null);
    setBathroomsMin(null);
    setParkingMin(null);
    setShowAdvancedFilters(false);
  };

  // Função para gerar uma posição "fixa" baseada no ID do imóvel (enquanto não temos lat/lng reais)
  const getPropertyPosition = (id: string) => {
    const hash = id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return {
      top: 15 + (hash % 70),
      left: 10 + ((hash * 7) % 80)
    };
  };

  return (
    <div className="h-screen flex flex-col bg-white overflow-hidden relative">
      <style jsx global>{`
        .map-container img {
          max-width: none !important;
          max-height: none !important;
          background: transparent !important;
        }
        nav.fixed {
          position: relative !important;
          height: 64px !important;
        }
        /* Esconder scrollbar dos filtros */
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>

      {/* Navbar */}
      <Navbar />
      
      {loading && (
        <div className="fixed inset-0 bg-white/80 backdrop-blur-md z-[200] flex items-center justify-center">
          <div className="flex flex-col items-center gap-6">
            <RefreshCw className="animate-spin text-primary" size={64} />
            <p className="font-black text-primary uppercase tracking-[0.3em] text-[10px]">Sincronizando Vitrine...</p>
          </div>
        </div>
      )}

      {/* Modal de Filtros Avançados */}
      {showAdvancedFilters && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100] flex items-end md:items-center justify-center p-0 md:p-6 transition-all">
          <div className="bg-white w-full md:max-w-2xl md:rounded-[3rem] rounded-t-[3rem] shadow-2xl overflow-hidden animate-in slide-in-from-bottom-20 duration-300">
            <div className="px-8 py-6 border-b border-border flex items-center justify-between">
              <h3 className="text-xl font-black text-primary">Filtros Avançados</h3>
              <button onClick={() => setShowAdvancedFilters(false)} className="p-2 hover:bg-muted rounded-full transition-all">
                <Search size={20} className="rotate-45" />
              </button>
            </div>
            
            <div className="p-8 space-y-10 max-h-[70vh] overflow-y-auto no-scrollbar">
              {/* Área (m²) */}
              <section>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/40 mb-4">Área Útil (m²)</p>
                <div className="flex items-center gap-4">
                  {[0, 50, 100, 200, 500].map(area => (
                    <button 
                      key={area}
                      onClick={() => setMinArea(area || null)}
                      className={`px-6 py-3 rounded-full text-xs font-bold border transition-all ${minArea === area ? 'bg-primary text-white border-primary' : 'hover:bg-muted border-border'}`}
                    >
                      {area === 0 ? 'Qualquer' : `${area}m²+`}
                    </button>
                  ))}
                </div>
              </section>

              {/* Banheiros */}
              <section>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/40 mb-4">Banheiros</p>
                <div className="flex items-center gap-4">
                  {[null, 1, 2, 3, 4].map(b => (
                    <button 
                      key={b === null ? 'any' : b}
                      onClick={() => setBathroomsMin(b)}
                      className={`px-6 py-3 rounded-full text-xs font-bold border transition-all ${bathroomsMin === b ? 'bg-primary text-white border-primary' : 'hover:bg-muted border-border'}`}
                    >
                      {b === null ? 'Qualquer' : `${b}+`}
                    </button>
                  ))}
                </div>
              </section>

              {/* Vagas de Garagem */}
              <section>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/40 mb-4">Vagas de Garagem</p>
                <div className="flex items-center gap-4">
                  {[null, 1, 2, 3, 4].map(v => (
                    <button 
                      key={v === null ? 'any' : v}
                      onClick={() => setParkingMin(v)}
                      className={`px-6 py-3 rounded-full text-xs font-bold border transition-all ${parkingMin === v ? 'bg-primary text-white border-primary' : 'hover:bg-muted border-border'}`}
                    >
                      {v === null ? 'Qualquer' : `${v}+`}
                    </button>
                  ))}
                </div>
              </section>

              {/* Amenidades (Mock) */}
              <section>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/40 mb-4">Características</p>
                <div className="flex flex-wrap gap-2">
                  {['Piscina', 'Academia', 'Mobiliado', 'Pet Friendly', 'Churrasqueira', 'Portaria 24h'].map(tag => (
                    <button key={tag} className="px-4 py-2 rounded-full text-[10px] font-bold border border-border hover:bg-muted transition-all">
                      {tag}
                    </button>
                  ))}
                </div>
              </section>
            </div>

            <div className="p-8 bg-gray-50 border-t border-border flex gap-4">
              <button 
                onClick={resetAdvancedFilters}
                className="flex-1 py-4 text-xs font-black uppercase tracking-[0.1em] text-muted-foreground hover:bg-muted rounded-2xl transition-all"
              >
                Limpar Tudo
              </button>
              <button 
                onClick={() => setShowAdvancedFilters(false)}
                className="flex-[2] py-4 bg-primary text-white text-xs font-black uppercase tracking-[0.1em] rounded-2xl shadow-xl shadow-primary/20 transition-all hover:scale-[1.02]"
              >
                Ver {filteredProperties.length} Resultados
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Header Filters - Mobile Friendly Horizontal Scroll */}
      <header className="border-b border-border bg-white z-40 relative shadow-sm">
        <div className="px-4 py-3 flex items-center gap-3 flex-wrap">
          {/* Search Input Pill - Resizes on mobile */}
          <div className="flex items-center gap-3 px-4 py-2 bg-muted/30 rounded-full border border-border/50 focus-within:border-primary/40 transition-all min-w-[200px] md:min-w-[320px]">
            <Search className="text-primary/40" size={16} />
            <input 
              type="text" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar..."
              className="bg-transparent border-none focus:outline-none text-xs font-bold text-primary placeholder:text-muted-foreground/40 w-full"
            />
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-2 flex-wrap">
            <div className="relative">
              <FilterPill label={propertyType} active={propertyType !== 'Todos'} onClick={() => toggleFilter('type')} />
              {openFilter === 'type' && (
                <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-2xl shadow-2xl border border-border p-2 z-[70]">
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

            <div className="relative">
              <FilterPill label={maxPrice ? `Até R$ ${maxPrice / 1000}k` : 'Preço'} active={!!maxPrice} onClick={() => toggleFilter('price')} />
              {openFilter === 'price' && (
                <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-2xl shadow-2xl border border-border p-6 z-[70]">
                  <p className="text-[10px] font-black uppercase tracking-widest mb-4">Até quanto?</p>
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
                  <button 
                    onClick={() => { setMaxPrice(null); setOpenFilter(null); }}
                    className="w-full mt-4 py-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground"
                  >
                    Limpar
                  </button>
                </div>
              )}
            </div>

            <div className="relative">
              <FilterPill label={roomsCount ? `${roomsCount}+ Quartos` : 'Quartos'} active={!!roomsCount} onClick={() => toggleFilter('rooms')} />
              {openFilter === 'rooms' && (
                <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-2xl shadow-2xl border border-border p-2 z-[70]">
                  {[null, 1, 2, 3, 4].map(r => (
                    <button 
                      key={r}
                      onClick={() => { setRoomsCount(r); setOpenFilter(null); }}
                      className={`w-full text-left px-4 py-2 rounded-xl text-xs font-bold ${roomsCount === r ? 'bg-primary text-white' : 'hover:bg-muted'}`}
                    >
                      {r ? `${r}+ Quartos` : 'Qualquer'}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Advanced Filters Button */}
            <button 
              onClick={() => setShowAdvancedFilters(true)}
              className={`flex items-center gap-2 px-5 py-2.5 border rounded-full text-xs font-black uppercase tracking-widest transition-all shadow-sm whitespace-nowrap
                ${(minArea || bathroomsMin || parkingMin) ? 'bg-primary text-white border-primary' : 'bg-white border-border hover:bg-muted'}
              `}
            >
               <SlidersHorizontal size={14} /> Mais filtros
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden z-10 relative">
        {/* Left: Property List */}
        <section className={`
          w-full md:w-[65%] lg:w-[60%] xl:w-[55%] overflow-y-auto px-4 md:px-6 py-6 md:py-8 scrollbar-hide bg-white border-r border-border/50
          ${showMapMobile ? 'hidden md:block' : 'block'}
        `}>
          <div className="mb-6">
            <h2 className="text-xl md:text-2xl font-black text-primary tracking-tight">
              {filteredProperties.length} imóveis
            </h2>
            <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest mt-1">Disponíveis agora</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 pb-32">
            {filteredProperties.map(property => (
              <div 
                key={property.id}
                onMouseEnter={() => setHoveredPropertyId(property.id)}
                onMouseLeave={() => setHoveredPropertyId(null)}
                className={`transition-all duration-300 rounded-[2.5rem] ${hoveredPropertyId === property.id ? 'md:ring-4 md:ring-primary/10 md:scale-[1.02]' : ''}`}
              >
                <PropertyCard 
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
              </div>
            ))}
          </div>
        </section>

        {/* Right: Map View */}
        <section className={`
          flex-1 bg-[#f0f0f0] relative map-container overflow-hidden
          ${showMapMobile ? 'block' : 'hidden md:block'}
        `}>
          {/* Mapa 2D */}
          <div 
            className="absolute inset-0 bg-cover bg-center grayscale-[0.2] opacity-90"
            style={{ backgroundImage: `url('https://static-maps.yandex.ru/1.x/?ll=-49.2608,-16.6869&size=650,450&z=12&l=map&lang=pt_BR')` }}
          >
            {/* Marcadores */}
            <div className="relative w-full h-full">
               {filteredProperties.slice(0, 30).map((p) => {
                 const pos = getPropertyPosition(p.id);
                 const isHovered = hoveredPropertyId === p.id;
                 return (
                   <div 
                     key={p.id}
                     className={`absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-300 z-20 ${isHovered ? 'z-30 scale-125' : ''}`}
                     style={{ top: `${pos.top}%`, left: `${pos.left}%` }}
                   >
                     <div className={`px-2 md:px-3 py-1.5 md:py-2 text-[9px] md:text-[11px] font-black rounded-full shadow-2xl border transition-all ${isHovered ? 'bg-primary text-white border-primary' : 'bg-white text-primary border-gray-100'}`}>
                        {(p.price / 1000).toLocaleString()}k
                     </div>
                   </div>
                 );
               })}
            </div>

            {/* Map Controls */}
            <div className="absolute bottom-24 md:bottom-10 right-4 md:right-10 flex flex-col gap-3 z-30">
               <button className="bg-primary text-white px-6 py-4 rounded-full shadow-2xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                  <MapPin size={14} /> Refazer busca
               </button>
            </div>
          </div>
        </section>

        {/* Mobile Toggle Button */}
        <button 
          onClick={() => setShowMapMobile(!showMapMobile)}
          className="md:hidden fixed bottom-8 left-1/2 -translate-x-1/2 z-50 bg-primary text-white px-8 py-4 rounded-full shadow-2xl flex items-center gap-3 font-black text-[10px] uppercase tracking-[0.2em] animate-in slide-in-from-bottom-10 duration-500"
        >
          {showMapMobile ? <><SlidersHorizontal size={16} /> Ver Lista</> : <><MapPin size={16} /> Ver Mapa</>}
        </button>
      </div>
    </div>
  );
}


const FilterPill = ({ label, active = false, onClick }: { label: string, active?: boolean, onClick?: () => void }) => (
  <button onClick={onClick} className={`
    px-5 py-2.5 rounded-full text-sm font-bold transition-all border whitespace-nowrap flex items-center gap-2
    ${active 
      ? 'bg-primary text-white border-primary shadow-lg scale-[1.02]' 
      : 'bg-white text-primary/70 border-border hover:bg-muted/50'}
  `}>
    {label}
    <ChevronDown size={14} className={active ? 'text-white' : 'text-primary/30'} />
  </button>
);

