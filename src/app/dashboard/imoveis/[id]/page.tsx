'use client';

import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { PropertiesService } from '@/services/properties.service';
import { Property } from '@/types/database';
import { 
  ArrowLeft, 
  MapPin, 
  BedDouble, 
  Square, 
  Car, 
  Bath, 
  CheckCircle2, 
  MessageCircle, 
  Phone,
  User,
  TrendingUp,
  FileText,
  RefreshCw
} from 'lucide-react';
import Link from 'next/link';

export default function PropertyDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = React.use(params);
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        setLoading(true);
        const data = await PropertiesService.getById(resolvedParams.id);
        setProperty(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [resolvedParams.id]);

  if (loading) return (
    <DashboardLayout>
      <div className="h-full flex items-center justify-center">
        <RefreshCw className="animate-spin text-primary" size={32} />
      </div>
    </DashboardLayout>
  );

  if (!property) return (
    <DashboardLayout>
      <div className="h-full flex flex-col items-center justify-center space-y-4">
        <p className="text-muted-foreground font-bold">Imóvel não encontrado.</p>
        <Link href="/dashboard/imoveis" className="text-primary font-bold underline">Voltar para lista</Link>
      </div>
    </DashboardLayout>
  );

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto space-y-8 pb-20">
        <Link href="/dashboard/imoveis" className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors font-bold text-sm">
          <ArrowLeft size={16} /> Voltar para lista
        </Link>

        <div className="grid lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Gallery Placeholder */}
            <div className="aspect-video bg-muted rounded-3xl flex items-center justify-center overflow-hidden border border-border shadow-premium">
              <MapPin size={64} className="text-primary/5" />
              <div className="absolute top-6 left-6 flex gap-2">
                <span className="bg-primary text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest">{property.type}</span>
                {property.pattern === 'high_end' && (
                  <span className="bg-luxury-gold text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest">Alto Padrão</span>
                )}
              </div>
            </div>

            <div className="space-y-4">
              <h1 className="text-4xl font-bold">{property.title}</h1>
              <p className="text-lg text-muted-foreground flex items-center gap-2">
                <MapPin size={20} className="text-accent" />
                {property.address_street}, {property.address_city} - {property.address_state}
              </p>
            </div>

            {/* Quick Specs */}
            <div className="grid grid-cols-4 gap-4 py-8 border-y border-border">
              <SpecItem icon={<BedDouble />} label="Quartos" value={property.metadata?.rooms || 0} />
              <SpecItem icon={<Bath />} label="Banheiros" value={property.metadata?.bathrooms || 0} />
              <SpecItem icon={<Square />} label="Área" value={`${property.metadata?.area || 0}m²`} />
              <SpecItem icon={<Car />} label="Vagas" value={property.metadata?.parking || 0} />
            </div>

            <div className="space-y-4">
              <h3 className="text-xl font-bold">Descrição</h3>
              <p className="text-muted-foreground leading-relaxed">
                {property.description}
              </p>
            </div>

            <div className="space-y-4">
              <h3 className="text-xl font-bold">Destaques</h3>
              <div className="grid grid-cols-2 gap-4">
                {property.metadata?.features?.map((feature: string, i: number) => (
                  <div key={i} className="flex items-center gap-3 text-sm font-medium text-primary/70">
                    <CheckCircle2 size={18} className="text-green-500" />
                    {feature}
                  </div>
                ))}
                {(!property.metadata?.features || property.metadata.features.length === 0) && (
                  <p className="text-sm text-muted-foreground">Nenhum diferencial cadastrado.</p>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar Info */}
          <div className="space-y-6">
            {/* Pricing Card */}
            <div className="bg-white p-8 rounded-3xl shadow-luxury border border-border sticky top-24">
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-2">Preço de Venda</p>
              <h2 className="text-4xl font-black text-primary mb-6">
                R$ {property.price.toLocaleString()}
              </h2>

              <div className="bg-muted/50 p-4 rounded-2xl mb-8 border border-transparent hover:border-primary/10 transition-all">
                <div className="flex justify-between items-center mb-1">
                  <p className="text-xs font-bold text-muted-foreground uppercase">Sua Comissão</p>
                  <TrendingUp size={14} className="text-accent" />
                </div>
                <p className="text-2xl font-black text-accent">
                  R$ {(property.price * (property.commission_estimated_percent ?? 6) / 100).toLocaleString()}
                </p>
                <p className="text-[10px] font-medium text-muted-foreground mt-1">Cálculo baseado em {property.commission_estimated_percent ?? 6}%</p>
              </div>

              <div className="space-y-3">
                <button className="w-full bg-primary text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-primary-light transition-all shadow-premium group">
                  <MessageCircle size={20} className="group-hover:rotate-12 transition-transform" />
                  Compartilhar no WhatsApp
                </button>
                <button className="w-full bg-white border border-border text-primary py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-muted transition-all">
                  <FileText size={20} />
                  Baixar Ficha Técnica
                </button>
              </div>

              {/* Owner Info Preview */}
              <div className="mt-8 pt-8 border-t border-border">
                <p className="text-xs font-bold text-muted-foreground uppercase mb-4">Proprietário</p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center">
                    <User size={24} className="text-primary/30" />
                  </div>
                  <div>
                    <p className="text-sm font-bold">Carlos Augusto</p>
                    <div className="flex gap-2 mt-1">
                      <button className="p-1.5 bg-muted rounded-lg text-primary hover:bg-primary hover:text-white transition-all"><Phone size={14} /></button>
                      <button className="p-1.5 bg-muted rounded-lg text-primary hover:bg-primary hover:text-white transition-all"><MessageCircle size={14} /></button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

const SpecItem = ({ icon, label, value }: any) => (
  <div className="flex flex-col items-center text-center gap-1">
    <div className="p-2 bg-muted rounded-xl text-primary/60">
      {React.cloneElement(icon, { size: 24 })}
    </div>
    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">{label}</p>
    <p className="text-sm font-black text-primary">{value}</p>
  </div>
);
