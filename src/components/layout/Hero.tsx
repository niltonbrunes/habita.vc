'use client';

import React from 'react';
import { Search, MapPin, Home as HomeIcon } from 'lucide-react';
import { motion } from 'framer-motion';

export const Hero = () => {
  return (
    <section className="relative min-h-[90vh] flex items-center pt-20 overflow-hidden bg-white">
      {/* Background elements */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-accent/5 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/5 text-primary text-[10px] font-black uppercase tracking-[0.2em] mb-8 border border-primary/5">
              <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
              Sua nova jornada começa aqui
            </div>
            
            <h2 className="text-6xl md:text-8xl font-black leading-[0.95] mb-8 tracking-tighter text-primary">
              Encontre o seu <br />
              <span className="text-accent">Sonho.</span>
            </h2>
            
            <p className="text-xl text-muted-foreground mb-12 max-w-lg leading-relaxed font-medium">
              Descubra os melhores imóveis e lançamentos de alto padrão com curadoria exclusiva e consultoria de alta performance.
            </p>

            <div className="bg-white p-3 rounded-[2.5rem] shadow-luxury flex flex-col sm:flex-row gap-3 max-w-2xl border border-border group focus-within:border-accent/30 transition-all">
              <div className="flex-[1.5] flex items-center gap-4 px-6 py-4">
                <Search className="w-6 h-6 text-primary/30 group-focus-within:text-accent transition-colors" />
                <input 
                  type="text" 
                  placeholder="Cidade, bairro ou condomínio..."
                  className="w-full bg-transparent border-none focus:outline-none text-primary font-bold placeholder:text-muted-foreground/50 text-lg"
                />
              </div>
              
              <div className="h-12 w-[1px] bg-border hidden sm:block self-center" />
              
              <div className="flex-1 flex items-center gap-4 px-6 py-4">
                <MapPin className="w-6 h-6 text-primary/30" />
                <select className="w-full bg-transparent border-none focus:outline-none text-primary font-bold appearance-none cursor-pointer text-lg">
                  <option>Todos os tipos</option>
                  <option>Apartamento</option>
                  <option>Casa Luxury</option>
                  <option>Lote Premium</option>
                </select>
              </div>
              
              <button className="bg-primary hover:bg-primary-dark text-white px-10 py-5 rounded-[2rem] font-black text-lg transition-all shadow-premium active:scale-95">
                Buscar
              </button>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="relative hidden lg:block"
          >
            <div className="relative z-10 rounded-[4rem] overflow-hidden shadow-luxury border-[20px] border-white">
              <img 
                src="/modern_luxury_apartment_exterior_1777989602281.png" 
                alt="Luxury Mansion"
                className="w-full aspect-[4/5] object-cover"
              />
            </div>
            
            <motion.div 
              animate={{ y: [0, -20, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -bottom-12 -left-12 bg-white/90 backdrop-blur-xl p-8 rounded-[3rem] shadow-luxury z-20 border border-white/50"
            >
              <div className="flex items-center gap-6">
                <div className="w-16 h-16 bg-primary rounded-[1.5rem] flex items-center justify-center shadow-luxury shadow-primary/20">
                  <HomeIcon className="w-8 h-8 text-white" />
                </div>
                <div>
                  <p className="text-[10px] text-muted-foreground font-black uppercase tracking-[0.2em] mb-1">Destaque da Semana</p>
                  <p className="font-black text-2xl text-primary tracking-tight">Vila dos Jardins</p>
                  <p className="text-sm text-accent font-black">R$ 4.2M • Exclusivo</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
