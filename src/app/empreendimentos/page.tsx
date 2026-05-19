'use client';

import React, { useState, useEffect } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { DevelopmentsService } from '@/services/developments.service';
import { Building2, MapPin, ArrowRight, RefreshCw, Star } from 'lucide-react';
import Link from 'next/link';

export default function PublicDevelopmentsPage() {
  const [developments, setDevelopments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const data = await DevelopmentsService.getAll();
        setDevelopments(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  return (
    <div className="min-h-screen bg-background relative">
      <Navbar />

      {loading && (
        <div className="fixed inset-0 bg-white/50 backdrop-blur-[1px] z-[100] flex items-center justify-center">
          <RefreshCw className="animate-spin text-primary" size={48} />
        </div>
      )}

      <main className="pb-20 px-4 sm:px-8 max-w-7xl mx-auto w-full" style={{ paddingTop: '90px' }}>
        <div className="flex flex-col items-center text-center mb-20 space-y-4 w-full">
          <div className="inline-flex items-center gap-2 bg-primary/5 text-primary px-4 py-2 rounded-full text-xs font-black uppercase tracking-[0.2em] animate-in fade-in duration-1000">
            <Star size={14} className="text-accent fill-accent" /> Lançamentos Exclusivos
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-primary tracking-tighter leading-none text-center">
            Futuros que inspiram.
          </h1>
          <p className="text-muted-foreground text-xl max-w-2xl font-medium text-center" style={{ textAlign: 'center', margin: '0 auto' }}>
            Explore os empreendimentos mais aguardados das melhores incorporadoras.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {developments.map((dev) => (
            <Link key={dev.id} href={`/empreendimentos/${dev.id}`} className="group block">
              <div className="bg-white rounded-[3rem] overflow-hidden shadow-premium hover:shadow-luxury border border-border transition-all duration-700">
                <div className="relative aspect-[16/10] overflow-hidden bg-muted flex flex-col items-center justify-center text-muted-foreground/30 shrink-0">
                  <Building2 size={48} className="mb-2 opacity-50" />
                  <span className="text-xs font-black uppercase tracking-widest opacity-50">Sem Imagem</span>
                  <img 
                    src={dev.image_url} 
                    alt={dev.name} 
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 text-transparent" 
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity z-10" />
                  <div className="absolute top-6 left-6 bg-white/90 backdrop-blur-md px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest text-primary flex items-center gap-2 shadow-lg border border-white/20 z-20">
                    <Building2 size={12} className="text-accent" /> {dev.developer?.name || 'Construtora'}
                  </div>
                </div>

                <div className="p-10">
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <h3 className="text-2xl font-black text-primary mb-1 group-hover:text-accent transition-colors">{dev.name}</h3>
                      <p className="text-sm text-muted-foreground font-medium flex items-center gap-1.5">
                        <MapPin size={14} className="text-accent" /> {dev.location_city}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-8 py-6 border-y border-border/50 mb-8">
                    <div className="space-y-1">
                      <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">A partir de</p>
                      <p className="text-lg font-black text-primary">R$ {(dev.price_starting_at / 1000).toFixed(0)}k</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">Entrega</p>
                      <p className="text-lg font-black text-primary">{dev.launch_date || 'Em breve'}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black uppercase tracking-widest text-primary/40 group-hover:text-primary transition-colors">Conhecer projeto</span>
                    <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white group-hover:bg-accent transition-all group-hover:translate-x-1 shadow-premium">
                      <ArrowRight size={24} />
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}

          {developments.length === 0 && !loading && (
            <div className="col-span-full py-40 text-center bg-white rounded-[4rem] border-2 border-dashed border-border">
              <p className="text-muted-foreground text-xl font-medium">Nenhum lançamento cadastrado.</p>
              <p className="text-muted-foreground/60 mt-2">Novidades em breve. Fique atento!</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
