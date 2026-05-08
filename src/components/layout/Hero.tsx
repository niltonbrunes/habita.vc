'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { Search, MapPin, ArrowRight, Star } from 'lucide-react';

export const Hero = () => {
  const [activeTab, setActiveTab] = React.useState('comprar');

  return (
    <section className="relative min-h-[85vh] lg:min-h-screen flex items-center pt-20 pb-20 bg-[#fdfdfc] overflow-x-hidden">
      {/* Background - Soft Dynamic Mosaic Pattern */}
      <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]" />
      <div className="absolute top-0 right-0 w-[40%] h-full bg-[#f8f8f5] -z-10 hidden lg:block" />
      <div className="absolute top-[-10%] left-[-5%] w-[40%] h-[50%] bg-accent/5 rounded-full blur-[120px] -z-10" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-20">
        <div className="flex flex-col items-center text-center space-y-12 mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-6 max-w-4xl"
          >
            <h1 className="text-5xl md:text-8xl font-black text-primary leading-[0.95] tracking-tighter">
              Encontre o seu <br />
              <span className="font-serif italic font-light text-accent">próximo momento.</span>
            </h1>
            <p className="text-lg md:text-2xl text-muted-foreground font-medium max-w-2xl mx-auto leading-relaxed">
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
                  className={`px-8 py-3 rounded-t-[1.5rem] text-[11px] font-black uppercase tracking-[0.2em] transition-all ${
                    activeTab === tab 
                    ? 'bg-white text-primary shadow-[-10px_-10px_30px_rgba(0,0,0,0.05)] border-t border-x border-border/40' 
                    : 'text-muted-foreground/60 hover:text-primary'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Search Bar - High Contrast & Premium */}
            <div className="bg-white p-3 md:p-4 rounded-[2.5rem] md:rounded-full shadow-[0_30px_100px_-20px_rgba(0,0,0,0.12)] border border-border/40 flex flex-col md:flex-row items-center gap-2 group transition-all hover:border-accent/20">
              <div className="flex-[1.8] flex items-center px-8 gap-4 w-full">
                <Search className="text-accent shrink-0" size={24} />
                <input 
                  type="text" 
                  placeholder="Cidade, bairro ou condomínio" 
                  className="w-full py-5 bg-transparent outline-none font-bold text-primary placeholder:text-muted-foreground/30 text-lg md:text-xl"
                />
              </div>
              <div className="hidden md:block w-px h-12 bg-border/60 mx-2" />
              <div className="flex-1 flex items-center px-8 gap-4 w-full">
                <MapPin className="text-accent/40" size={22} />
                <select className="bg-transparent outline-none font-bold text-primary appearance-none cursor-pointer w-full text-lg">
                  <option>Tipo de imóvel</option>
                  <option>Apartamento</option>
                  <option>Casa de Condomínio</option>
                  <option>Penthouse</option>
                  <option>Lote</option>
                </select>
              </div>
              <div className="hidden md:block w-px h-12 bg-border/60 mx-2" />
              <div className="flex-1 flex items-center px-8 gap-4 w-full">
                <div className="bg-accent/10 p-2 rounded-lg">
                   <div className="w-1.5 h-1.5 rounded-full bg-accent" />
                </div>
                <select className="bg-transparent outline-none font-bold text-primary appearance-none cursor-pointer w-full text-lg">
                  <option>Faixa de Preço</option>
                  <option>Até R$ 500k</option>
                  <option>R$ 500k - R$ 1.5M</option>
                  <option>R$ 1.5M - R$ 5M</option>
                  <option>Acima de R$ 5M</option>
                </select>
              </div>
              <button className="bg-primary hover:bg-primary-light text-white w-full md:w-auto px-14 py-6 rounded-full font-black text-sm tracking-[0.2em] transition-all shadow-xl hover:shadow-luxury active:scale-95 flex items-center justify-center gap-3">
                BUSCAR <ArrowRight size={20} />
              </button>
            </div>
          </motion.div>
        </div>

        {/* Quick Discovery Chips - Mobile Focus */}
        <div className="flex flex-wrap justify-center gap-3 mt-8">
          <p className="text-[10px] font-black text-muted-foreground/40 uppercase tracking-widest w-full text-center mb-2">Bairros mais buscados</p>
          {['Setor Marista', 'Setor Bueno', 'Jardim Goiás', 'Alphaville', 'Setor Oeste'].map(chip => (
            <button key={chip} className="px-5 py-2.5 bg-white border border-border/60 rounded-full text-[11px] font-bold text-primary hover:border-accent hover:text-accent transition-all shadow-sm">
              {chip}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};
