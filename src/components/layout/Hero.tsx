'use client';
import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Search, MapPin, ArrowRight, Star } from 'lucide-react';
import { useRouter } from 'next/navigation';

export const Hero = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = React.useState('comprar');
  const [searchQuery, setSearchQuery] = React.useState('');
  const [propertyType, setPropertyType] = React.useState('');
  const [priceRange, setPriceRange] = React.useState('');

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (searchQuery) params.append('q', searchQuery);
    if (propertyType && propertyType !== 'Tipo de imóvel') params.append('tipo', propertyType.toLowerCase());
    if (activeTab) params.append('modalidade', activeTab);
    
    router.push(`/imoveis?${params.toString()}`);
  };

  return (
    <section className="relative min-h-[85vh] lg:min-h-screen flex items-center pt-20 pb-20 overflow-x-hidden">
      {/* Background Image with Dark Gradient Mask */}
      <div className="absolute inset-0 z-0">
        <Image src="/hero_luxury.png" alt="Luxury Real Estate" fill className="w-full h-full object-cover" sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/80 to-black/40" />
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-20">
        <div className="flex flex-col items-center text-center space-y-12 mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-6 max-w-4xl"
          >
            <h1 className="text-5xl md:text-8xl font-black text-white leading-[0.95] tracking-tighter drop-shadow-2xl">
              Encontre o seu <br />
              <span className="font-serif italic font-light text-accent">próximo momento.</span>
            </h1>
            <p className="text-lg md:text-2xl text-white/80 font-medium max-w-2xl mx-auto leading-relaxed drop-shadow-md">
              Descubra as melhores casas, apartamentos e lançamentos em Goiânia com curadoria de especialistas.
            </p>
          </motion.div>

          {/* MAIN SEARCH PORTAL - The QuintoAndar style */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="w-full max-w-5xl"
          >
            {/* Tabs Selection */}
            <div className="flex items-center justify-center md:justify-start gap-2 mb-4 px-2">
              {['comprar', 'alugar', 'lançamentos'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-8 py-3 rounded-t-[1.5rem] text-[11px] font-black uppercase tracking-[0.2em] transition-all backdrop-blur-md ${
                    activeTab === tab 
                    ? 'glass-dark text-white border-b-0 border-white/20' 
                    : 'text-white/60 hover:text-white'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Search Bar - Glassmorphism */}
            <div className="glass-dark p-3 md:p-4 rounded-xl md:rounded-full shadow-card border-white/10 flex flex-col md:flex-row items-center gap-2 group transition-all hover:border-accent/40 relative z-20">
              <div className="flex-[1.8] flex items-center px-8 gap-4 w-full">
                <Search className="text-accent shrink-0" size={24} />
                <input 
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  placeholder="Cidade, bairro ou condomínio" 
                  className="w-full py-5 bg-transparent outline-none font-bold text-white placeholder:text-white/40 text-lg md:text-xl"
                />
              </div>
              <div className="hidden md:block w-px h-12 bg-surface/20 mx-2" />
              <div className="flex-1 flex items-center px-8 gap-4 w-full">
                <MapPin className="text-accent/60" size={22} />
                <select 
                  value={propertyType}
                  onChange={(e) => setPropertyType(e.target.value)}
                  className="bg-transparent outline-none font-bold text-white appearance-none cursor-pointer w-full text-lg [&>option]:text-black"
                >
                  <option>Tipo de imóvel</option>
                  <option>Apartamento</option>
                  <option>Casa de Condomínio</option>
                  <option>Penthouse</option>
                  <option>Lote</option>
                </select>
              </div>
              <div className="hidden md:block w-px h-12 bg-surface/20 mx-2" />
              <div className="flex-1 flex items-center px-8 gap-4 w-full">
                <div className="bg-accent/20 p-2 rounded-lg">
                   <div className="w-1.5 h-1.5 rounded-full bg-accent" />
                </div>
                <select 
                  value={priceRange}
                  onChange={(e) => setPriceRange(e.target.value)}
                  className="bg-transparent outline-none font-bold text-white appearance-none cursor-pointer w-full text-lg [&>option]:text-black"
                >
                  <option>Faixa de Preço</option>
                  <option>Até R$ 500k</option>
                  <option>R$ 500k - R$ 1.5M</option>
                  <option>R$ 1.5M - R$ 5M</option>
                  <option>Acima de R$ 5M</option>
                </select>
              </div>
              <button 
                onClick={handleSearch}
                className="bg-blue-primary hover:bg-blue-primary-light text-white w-full md:w-auto px-14 py-6 rounded-full font-black text-sm tracking-[0.2em] transition-all shadow-xl hover:shadow-card active:scale-95 flex items-center justify-center gap-3"
              >
                BUSCAR <ArrowRight size={20} />
              </button>
            </div>
          </motion.div>
        </div>

        {/* Quick Discovery Chips - Mobile Focus */}
        <div className="flex flex-wrap justify-center gap-3 mt-8 relative z-20">
          <p className="text-[10px] font-black text-white/40 uppercase tracking-widest w-full text-center mb-2">Bairros mais buscados</p>
          {['Setor Marista', 'Setor Bueno', 'Jardim Goiás', 'Alphaville', 'Setor Oeste'].map(chip => (
            <button key={chip} className="px-5 py-2.5 glass-dark text-white rounded-full text-[11px] font-bold hover:border-accent hover:text-accent transition-all shadow-sm">
              {chip}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};
