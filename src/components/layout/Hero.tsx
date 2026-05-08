'use client';
import React from 'react';
import { Search, MapPin, ArrowRight, MousePointer2, Star } from 'lucide-react';
import { motion } from 'framer-motion';

export const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center pt-24 pb-32 bg-[#fdfdfc] overflow-x-hidden">
      {/* Cinematic Background Elements */}
      <div className="absolute top-0 right-0 w-[45%] h-full bg-[#f8f8f5] -z-10 hidden lg:block" />
      <div className="absolute top-[-15%] left-[-10%] w-[50%] h-[70%] bg-accent/5 rounded-full blur-[150px] -z-10" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-20">
        <div className="grid lg:grid-cols-12 gap-16 items-center">
          
          {/* Text Content - Aesthetic Layout */}
          <div className="lg:col-span-7 space-y-12">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-6"
            >
              <div className="inline-flex items-center gap-3 px-4 py-2 bg-white rounded-full shadow-sm border border-border/40">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-accent"></span>
                </span>
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary/60">Curadoria Exclusiva Goiânia</span>
              </div>
              
              <h1 className="text-7xl md:text-[100px] font-serif italic text-primary leading-[0.9] tracking-tighter">
                O Luxo <br />
                <span className="not-italic font-sans font-black text-accent">redefinido.</span>
              </h1>
              
              <p className="text-xl text-muted-foreground font-medium max-w-xl leading-relaxed">
                Conectamos investidores e famílias aos imóveis mais extraordinários de Goiânia através de inteligência comercial e curadoria de elite.
              </p>
            </motion.div>

            {/* Search Bar - Floating Glass Design */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="bg-white/80 backdrop-blur-2xl p-3 rounded-[3rem] shadow-luxury border border-white flex flex-col md:flex-row items-center gap-2 max-w-3xl group transition-all"
            >
              <div className="flex-[1.5] flex items-center px-8 gap-4 w-full">
                <Search className="text-accent/40 group-focus-within:text-accent transition-colors" size={24} />
                <input 
                  type="text" 
                  placeholder="Seu próximo destino em Goiânia..." 
                  className="w-full py-5 bg-transparent outline-none font-bold text-primary placeholder:text-muted-foreground/30 text-lg"
                />
              </div>
              <div className="hidden md:block w-px h-10 bg-border/40 mx-2" />
              <div className="flex-1 flex items-center px-8 gap-4 w-full">
                <MapPin className="text-accent/40" size={22} />
                <select className="bg-transparent outline-none font-bold text-primary appearance-none cursor-pointer w-full text-lg">
                  <option>Todos os tipos</option>
                  <option>Penthouses</option>
                  <option>Mansões</option>
                  <option>Condomínios</option>
                </select>
              </div>
              <button className="bg-primary hover:bg-primary-light text-white px-12 py-5 rounded-[2.5rem] font-black text-sm tracking-widest transition-all shadow-xl hover:shadow-luxury active:scale-95 flex items-center gap-3">
                EXPLORAR <ArrowRight size={20} />
              </button>
            </motion.div>

            {/* Social Proof */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="flex items-center gap-8 pt-4"
            >
              <div className="flex -space-x-4">
                {[1,2,3,4].map(i => (
                  <div key={i} className="w-12 h-12 rounded-full border-4 border-white overflow-hidden bg-muted shadow-sm">
                    <img src={`https://i.pravatar.cc/150?u=${i+20}`} alt="Client" />
                  </div>
                ))}
              </div>
              <div>
                <p className="text-sm font-black text-primary">+450 clientes</p>
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest leading-none mt-1">Satisfeitos este mês</p>
              </div>
            </motion.div>
          </div>

          {/* Right Visual - Large Framed Image */}
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="lg:col-span-5 relative"
          >
            <div className="relative z-10 rounded-[5rem] overflow-hidden shadow-[0_50px_100px_-20px_rgba(0,0,0,0.15)] border-[16px] border-white group">
              <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
              <img 
                src="/hero_luxury.png" 
                alt="Luxury Real Estate" 
                className="w-full aspect-[4/5] object-cover transition-transform duration-[3s] group-hover:scale-110"
              />
            </div>
            
            {/* Artistic Floating Badges */}
            <motion.div 
              animate={{ y: [0, -20, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -top-12 -right-12 bg-white p-8 rounded-[3rem] shadow-luxury z-20 hidden xl:block border border-border/20"
            >
              <p className="text-5xl font-serif italic text-primary leading-none mb-1">12%</p>
              <p className="text-[10px] font-black text-accent uppercase tracking-widest">Valorização Anual</p>
            </motion.div>

            <motion.div 
              animate={{ y: [0, 20, 0] }}
              transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              className="absolute -bottom-10 -left-10 bg-primary text-white p-8 rounded-[3.5rem] shadow-luxury z-20 hidden xl:block"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-accent rounded-2xl flex items-center justify-center shadow-lg">
                  <Star className="text-white" size={24} fill="currentColor" />
                </div>
                <div>
                  <p className="font-black text-xl">Top Choice</p>
                  <p className="text-[9px] text-white/50 font-bold uppercase tracking-widest">Curadoria 2026</p>
                </div>
              </div>
            </motion.div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};
