'use client';

import React, { useState } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { useProperties } from '@/hooks/useProperties';
import { PropertyCard } from '@/components/public/PropertyCard';
import { Search, Filter, MapPin, RefreshCw, SlidersHorizontal, ChevronDown } from 'lucide-react';

export default function PublicPropertiesPage() {
  const { properties, loading } = useProperties();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredProperties = properties.filter(p => 
    p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.address_city.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.address_neighborhood?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background relative">
      <Navbar />
      
      {loading && (
        <div className="fixed inset-0 bg-white/50 backdrop-blur-[2px] z-[100] flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <RefreshCw className="animate-spin text-primary" size={48} />
            <p className="font-bold text-primary uppercase tracking-widest text-xs">Carregando Oportunidades...</p>
          </div>
        </div>
      )}
      
      <main className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-6xl font-black text-primary mb-4 tracking-tighter leading-tight">
              Curadoria <span className="text-accent">Habita.vc</span>
            </h1>
            <p className="text-muted-foreground text-xl font-medium leading-relaxed">
              Descubra imóveis selecionados com inteligência de mercado e foco em alta performance.
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">Total Disponível</p>
              <p className="text-2xl font-black text-primary">{properties.length} Imóveis</p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-primary/5 flex items-center justify-center text-primary">
               <SlidersHorizontal size={24} />
            </div>
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div className="sticky top-24 z-40 mb-16">
          <div className="bg-white/80 backdrop-blur-xl p-3 rounded-[2.5rem] shadow-luxury border border-white/50 flex flex-col md:flex-row gap-3">
            <div className="flex-[2] flex items-center gap-4 px-6 py-4 bg-muted/30 rounded-3xl border-2 border-transparent focus-within:border-primary/5 transition-all">
              <Search className="text-primary/30" size={20} />
              <input 
                type="text" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Busque por cidade, bairro ou nome do condomínio..."
                className="w-full bg-transparent border-none focus:outline-none text-base font-bold text-primary placeholder:text-muted-foreground/40"
              />
            </div>
            
            <div className="flex flex-1 items-center gap-3">
              <div className="flex-1 relative group">
                <select className="w-full h-full appearance-none px-6 py-4 bg-muted/30 rounded-3xl text-sm font-bold text-primary outline-none cursor-pointer hover:bg-muted/50 transition-colors border-2 border-transparent">
                  <option>Tipo de Imóvel</option>
                  <option>Apartamento</option>
                  <option>Casa</option>
                  <option>Lote</option>
                </select>
                <ChevronDown size={16} className="absolute right-6 top-1/2 -translate-y-1/2 text-primary/30 pointer-events-none" />
              </div>
              <button className="h-full px-10 py-4 bg-primary text-white rounded-[1.5rem] text-sm font-black hover:bg-primary-dark transition-all shadow-premium whitespace-nowrap">
                Filtrar Resultados
              </button>
            </div>
          </div>
        </div>

        {/* Results Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
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
            <div className="col-span-full py-40 text-center bg-white rounded-[4rem] border-2 border-dashed border-border flex flex-col items-center justify-center">
              <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mb-6">
                <Search size={40} className="text-muted-foreground/30" />
              </div>
              <h3 className="text-2xl font-black text-primary mb-2">Nenhum imóvel encontrado</h3>
              <p className="text-muted-foreground max-w-sm mx-auto font-medium">Tente ajustar seus filtros ou busque por termos diferentes para encontrar o que procura.</p>
              <button 
                onClick={() => setSearchTerm('')}
                className="mt-8 text-primary font-bold underline underline-offset-4 hover:text-accent transition-colors"
              >
                Limpar todos os filtros
              </button>
            </div>
          )}
        </div>
      </main>

      <footer className="bg-white py-20 border-t border-border mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-12 text-center md:text-left">
            <div>
              <span className="text-3xl font-black tracking-tighter text-primary block mb-4">Habita<span className="text-accent">.vc</span></span>
              <p className="text-muted-foreground max-w-xs font-medium">Sua jornada imobiliária de alta performance começa aqui.</p>
            </div>
            <div className="flex gap-12 text-sm font-bold text-primary/60">
               <a href="#" className="hover:text-accent transition-colors">Instagram</a>
               <a href="#" className="hover:text-accent transition-colors">LinkedIn</a>
               <a href="#" className="hover:text-accent transition-colors">WhatsApp</a>
            </div>
          </div>
          <div className="mt-20 pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] font-black text-muted-foreground uppercase tracking-widest">
            <p>© 2026 Habita.vc - Todos os direitos reservados.</p>
            <div className="flex gap-8">
              <a href="#">Privacidade</a>
              <a href="#">Termos de Uso</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
