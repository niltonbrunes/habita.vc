'use client';

import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { DevelopmentsService } from '@/services/developments.service';
import { Plus, Building2, MapPin, Calendar, ArrowRight, RefreshCw, Layers } from 'lucide-react';
import Link from 'next/link';
import { DevelopmentFormModal } from '@/components/developments/DevelopmentFormModal';

export default function DevelopmentsPage() {
  const [developments, setDevelopments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDevelopment, setSelectedDevelopment] = useState<any>(null);

  const fetchDevelopments = async () => {
    setLoading(true);
    try {
      const data = await DevelopmentsService.getAll();
      setDevelopments(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDevelopments();
  }, []);

  return (
    <DashboardLayout>
      <div className="space-y-8 relative">
        {loading && (
          <div className="absolute inset-0 bg-white/50 backdrop-blur-[1px] z-20 flex items-center justify-center min-h-[400px]">
            <RefreshCw className="animate-spin text-primary" size={32} />
          </div>
        )}

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold mb-1">Empreendimentos</h1>
            <p className="text-muted-foreground text-sm font-medium">Gerencie lançamentos e páginas de captação (AIDA).</p>
          </div>
          
          <button 
            onClick={() => {
              setSelectedDevelopment(null);
              setIsModalOpen(true);
            }}
            className="flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-2xl text-sm font-black hover:bg-primary-light transition-all shadow-premium"
          >
            <Plus size={20} /> Novo Lançamento
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {developments.map((dev) => (
            <div key={dev.id} className="group bg-card rounded-[2.5rem] shadow-premium border border-border/50 overflow-hidden hover:shadow-luxury transition-all flex flex-col">
              <div className="aspect-video relative overflow-hidden bg-muted flex items-center justify-center text-muted-foreground shrink-0">
                <img src={dev.image_url} alt={dev.name} className="absolute inset-0 object-cover w-full h-full group-hover:scale-110 transition-transform duration-700" />
                <div className="absolute top-4 left-4 bg-card/90 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest text-primary flex items-center gap-1.5 border border-border/50">
                  <Building2 size={12} /> {dev.developer?.name || 'Construtora'}
                </div>
              </div>
              
              <div className="p-8 space-y-4 flex-1">
                <div>
                  <h3 className="text-xl font-bold text-primary mb-1">{dev.name}</h3>
                  <div className="flex items-center gap-1.5 text-muted-foreground">
                    <MapPin size={14} />
                    <span className="text-xs font-medium">{dev.location_city}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 py-4 border-y border-border/50">
                  <div className="space-y-0.5">
                    <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">Entrega</p>
                    <p className="text-sm font-bold text-primary">{dev.launch_date || 'A definir'}</p>
                  </div>
                  <div className="space-y-0.5">
                    <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">A partir de</p>
                    <p className="text-sm font-bold text-accent">R$ {(dev.price_starting_at / 1000).toFixed(0)}k</p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Link 
                    href={`/empreendimentos/${dev.id}`} 
                    target="_blank"
                    className="flex-1 flex items-center justify-center gap-2 py-3 bg-muted text-primary rounded-xl text-xs font-black hover:bg-primary hover:text-white transition-all"
                  >
                    Ver Landing Page
                  </Link>
                  <button className="p-3 bg-muted text-primary rounded-xl hover:bg-primary hover:text-white transition-all">
                    <Layers size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))}

          {developments.length === 0 && !loading && (
            <div className="col-span-full py-20 text-center bg-white rounded-[3rem] border-2 border-dashed border-border">
              <p className="text-muted-foreground font-medium">Nenhum empreendimento cadastrado.</p>
            </div>
          )}
        </div>
      </div>

      {isModalOpen && (
        <DevelopmentFormModal 
          onClose={() => setIsModalOpen(false)}
          onSuccess={() => {
            fetchDevelopments();
            setIsModalOpen(false);
          }}
          development={selectedDevelopment}
        />
      )}
    </DashboardLayout>
  );
}
