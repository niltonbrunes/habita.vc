'use client';
import React from 'react';
import { Search, MapPin, ArrowRight, MousePointer2 } from 'lucide-react';
import { motion } from 'framer-motion';

export const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center pt-20 overflow-hidden bg-[#fdfdfd]">
      {/* Background elements */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[60%] h-[60%] bg-primary/5 rounded-full blur-[120px] opacity-60" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-accent/5 rounded-full blur-[100px] opacity-40" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.03]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full py-20">
        <div className="grid lg:grid-cols-12 gap-12 items-center">
          
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="lg:col-span-7 space-y-10"
          >
            <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-white shadow-premium border border-primary/5 text-primary text-[11px] font-black uppercase tracking-[0.3em]">
              <span className="flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-accent opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-accent"></span>
              </span>
              Curadoria Exclusiva Goiânia
            </div>
            
            <h1 className="text-7xl md:text-[110px] font-black leading-[0.85] tracking-[-0.05em] text-primary">
              O Luxo <br />
              <span className="text-accent italic font-serif font-light lowercase tracking-normal">Redefinido.</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-muted-foreground max-w-xl leading-relaxed font-medium">
              Conectamos investidores e famílias aos imóveis mais extraordinários de Goiânia através de inteligência comercial.
            </p>

            {/* Search Bar - Premium Version */}
            <div className="bg-white p-2 rounded-[3rem] shadow-luxury flex flex-col md:flex-row gap-2 max-w-3xl border border-border/50 group focus-within:border-accent/30 transition-all duration-500">
              <div className="flex-[1.5] flex items-center gap-4 px-8 py-5">
                <Search className="w-6 h-6 text-primary/20 group-focus-within:text-accent transition-colors" />
                <input 
                  type="text" 
                  placeholder="Busque por bairro ou condomínio..."
                  className="w-full bg-transparent border-none focus:outline-none text-primary font-bold placeholder:text-muted-foreground/40 text-lg"
                />
              </div>
              
              <div className="h-10 w-[1px] bg-border/60 hidden md:block self-center" />
              
              <div className="flex-1 flex items-center gap-4 px-8 py-5">
                <MapPin className="w-6 h-6 text-primary/20" />
                <select className="w-full bg-transparent border-none focus:outline-none text-primary font-bold appearance-none cursor-pointer text-lg">
                  <option>Todos os tipos</option>
                  <option>Penthouses</option>
                  <option>Mansões</option>
                  <option>Lançamentos</option>
                </select>
              </div>
              
              <button className="bg-primary hover:bg-primary-light text-white px-12 py-5 rounded-[2.5rem] font-black text-lg transition-all shadow-premium hover:shadow-luxury active:scale-95 flex items-center justify-center gap-3">
                Explorar <ArrowRight className="w-5 h-5" />
              </button>
            </div>

            <div className="flex items-center gap-8 pt-4">
              <div className="flex -space-x-4">
                {[1,2,3,4].map(i => (
                  <div key={i} className="w-12 h-12 rounded-full border-4 border-white bg-muted overflow-hidden shadow-sm">
                    <img src={`https://i.pravatar.cc/100?u=${i+10}`} alt="Client" />
                  </div>
                ))}
              </div>
              <p className="text-sm font-bold text-primary/60">
                <span className="text-primary font-black">+450 clientes</span> satisfeitos este mês
              </p>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.8, rotate: 5 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="lg:col-span-5 relative hidden lg:block"
          >
            <div className="relative z-10 rounded-[5rem] overflow-hidden shadow-luxury border-[24px] border-white transform hover:scale-[1.02] transition-transform duration-700">
              <img 
                src="/hero_luxury.png" 
                alt="Habita.vc Luxury Experience"
                className="w-full aspect-[4/5] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/40 to-transparent opacity-60" />
            </div>

            {/* Floating Element 1 */}
            <motion.div 
              animate={{ y: [0, -15, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -top-10 -right-10 bg-white/90 backdrop-blur-xl p-8 rounded-[3rem] shadow-luxury z-20 border border-white/50"
            >
              <div className="text-center">
                <p className="text-[32px] font-black text-primary leading-none">R$ 1.2B</p>
                <p className="text-[10px] text-accent font-black uppercase tracking-widest mt-1">Volume de Vendas</p>
              </div>
            </motion.div>

            {/* Floating Element 2 */}
            <motion.div 
              animate={{ y: [0, 20, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              className="absolute -bottom-8 -left-12 bg-primary p-8 rounded-[3rem] shadow-luxury z-20 text-white"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-accent rounded-2xl flex items-center justify-center">
                  <MousePointer2 className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="font-black text-xl">Visita 360°</p>
                  <p className="text-[10px] text-white/60 font-bold uppercase tracking-widest">Disponível em 80% do estoque</p>
                </div>
              </div>
            </motion.div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};
