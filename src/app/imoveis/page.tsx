'use client';

import React from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { useProperties } from '@/hooks/useProperties';
import { Search, Filter, MapPin, BedDouble, Square, Car, ChevronRight, RefreshCw } from 'lucide-react';
import Link from 'next/link';

export default function PublicPropertiesPage() {
  const { properties, loading } = useProperties();

  return (
    <div className="min-h-screen bg-background relative">
      <Navbar />
      
      {loading && (
        <div className="fixed inset-0 bg-white/50 backdrop-blur-[1px] z-[100] flex items-center justify-center">
          <RefreshCw className="animate-spin text-primary" size={48} />
        </div>
      )}
      
      <main className="pt-24 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-12">
          <h1 className="text-4xl font-black text-primary mb-4">Explore nossos imóveis</h1>
          <p className="text-muted-foreground text-lg max-w-2xl">
            Encontre o lugar perfeito para sua próxima história. Curadoria exclusiva dos melhores empreendimentos.
          </p>
        </div>

        {/* Search & Filter Bar */}
        <div className="bg-white p-6 rounded-3xl shadow-premium border border-border flex flex-col md:flex-row gap-4 mb-12">
          <div className="flex-1 flex items-center gap-3 px-4 py-3 bg-muted/50 rounded-2xl border border-transparent focus-within:border-primary/20 transition-all">
            <Search className="text-muted-foreground" size={20} />
            <input 
              type="text" 
              placeholder="Busque por cidade, bairro ou condomínio..."
              className="w-full bg-transparent border-none focus:outline-none text-sm font-medium"
            />
          </div>
          
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-6 py-3 bg-white border border-border rounded-2xl text-sm font-bold hover:bg-muted transition-all">
              <Filter size={18} /> Filtros
            </button>
            <button className="px-8 py-3 bg-primary text-white rounded-2xl text-sm font-bold hover:bg-primary-light transition-all shadow-premium">
              Buscar
            </button>
          </div>
        </div>

        {/* Results Info */}
        <div className="flex justify-between items-center mb-8">
          <p className="text-sm font-bold text-muted-foreground">
            Exibindo <span className="text-primary">{properties.length}</span> imóveis encontrados
          </p>
          <select className="bg-transparent border-none text-sm font-bold text-primary outline-none cursor-pointer">
            <option>Mais recentes</option>
            <option>Menor preço</option>
            <option>Maior preço</option>
          </select>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {properties.length > 0 ? (
            properties.map(property => (
              <PublicPropertyCard key={property.id} property={property} />
            ))
          ) : !loading && (
            <div className="col-span-full py-32 text-center bg-white rounded-[3rem] border-2 border-dashed border-border">
              <p className="text-muted-foreground text-xl font-medium">Ops! Nenhum imóvel disponível no momento.</p>
              <p className="text-muted-foreground/60 mt-2">Tente novamente em breve ou entre em contato conosco.</p>
            </div>
          )}
        </div>
      </main>

      <footer className="bg-primary py-20 text-white mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-12">
            <div className="col-span-2">
              <div className="flex items-center gap-2 mb-6">
                <div className="bg-white p-1 rounded-lg">
                  <HomeIcon className="w-6 h-6 text-primary" />
                </div>
                <span className="text-2xl font-black tracking-tight">Habita<span className="text-accent">.vc</span></span>
              </div>
              <p className="text-white/60 max-w-xs mb-8">
                Transformando a experiência imobiliária com inteligência, transparência e alta performance.
              </p>
            </div>
            <div>
              <h4 className="font-bold mb-6 text-accent uppercase tracking-widest text-xs">Links Rápidos</h4>
              <ul className="space-y-4 text-sm font-medium text-white/70">
                <li><Link href="/imoveis" className="hover:text-white transition-colors">Ver Imóveis</Link></li>
                <li><Link href="/empreendimentos" className="hover:text-white transition-colors">Lançamentos</Link></li>
                <li><Link href="/sobre" className="hover:text-white transition-colors">Sobre Nós</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-6 text-accent uppercase tracking-widest text-xs">Contato</h4>
              <p className="text-sm font-medium text-white/70 mb-2">contato@habita.vc</p>
              <p className="text-sm font-medium text-white/70">+55 (62) 99999-9999</p>
            </div>
          </div>
          <div className="mt-20 pt-8 border-t border-white/10 text-center text-xs font-bold text-white/30">
            © 2026 Habita.vc - Todos os direitos reservados.
          </div>
        </div>
      </footer>
    </div>
  );
}

const PublicPropertyCard = ({ property }: { property: any }) => (
  <Link href={`/imoveis/${property.id}`} className="group block">
    <div className="bg-white rounded-[2rem] overflow-hidden shadow-premium border border-border hover:shadow-luxury transition-all duration-500">
      <div className="relative aspect-[4/3] bg-muted overflow-hidden">
        {property.status === 'reserved' && (
          <div className="absolute inset-0 z-20 bg-primary/40 backdrop-blur-[2px] flex items-center justify-center">
            <span className="bg-white text-primary px-4 py-2 rounded-full font-black text-xs uppercase tracking-widest shadow-xl">Reservado</span>
          </div>
        )}
        <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
          {property.pattern === 'high_end' && (
            <span className="bg-white/90 backdrop-blur-md text-primary text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full shadow-lg">
              Curadoria Luxo
            </span>
          )}
        </div>
        <div className="w-full h-full bg-primary/5 group-hover:scale-105 transition-transform duration-700 flex items-center justify-center">
          <MapPin className="text-primary/10" size={64} />
        </div>
      </div>

      <div className="p-8">
        <p className="text-xs font-black text-accent uppercase tracking-widest mb-2">{property.type}</p>
        <h3 className="text-xl font-bold text-primary mb-1 group-hover:text-accent transition-colors truncate">{property.title}</h3>
        <p className="text-sm text-muted-foreground mb-6 flex items-center gap-1.5 font-medium">
          <MapPin size={14} className="text-accent" /> {property.address_city}, {property.address_state}
        </p>

        <div className="flex items-center gap-6 mb-8">
          <div className="flex items-center gap-2">
            <BedDouble size={18} className="text-primary/40" />
            <span className="text-sm font-black">{property.metadata?.rooms || 0}</span>
          </div>
          <div className="flex items-center gap-2">
            <Square size={16} className="text-primary/40" />
            <span className="text-sm font-black">{property.metadata?.area || 0}m²</span>
          </div>
          <div className="flex items-center gap-2">
            <Car size={18} className="text-primary/40" />
            <span className="text-sm font-black">{property.metadata?.parking || 0}</span>
          </div>
        </div>

        <div className="flex justify-between items-center pt-6 border-t border-border">
          <div>
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-0.5">Valor do Imóvel</p>
            <p className="text-2xl font-black text-primary">R$ {property.price.toLocaleString()}</p>
          </div>
          <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white group-hover:bg-accent transition-all group-hover:translate-x-1">
            <ChevronRight size={24} />
          </div>
        </div>
      </div>
    </div>
  </Link>
);

const HomeIcon = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
);
