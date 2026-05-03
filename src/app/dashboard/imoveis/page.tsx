'use client';

import React from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useProperties } from '@/hooks/useProperties';
import { 
  Plus, 
  Search, 
  MapPin, 
  BedDouble, 
  Square, 
  Car,
  TrendingUp,
  RefreshCw
} from 'lucide-react';
import { PropertyFormModal } from '@/components/properties/PropertyFormModal';
import { ImportService } from '@/services/import.service';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';

export default function PropertiesPage() {
  const { user } = useAuth();
  const { properties, loading, refresh } = useProperties();
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [syncing, setSyncing] = React.useState(false);
  const [search, setSearch] = React.useState('');
  const [patternFilter, setPatternFilter] = React.useState('');
  const [statusFilter, setStatusFilter] = React.useState('');

  const filtered = properties.filter(p => {
    const q = search.toLowerCase();
    const matchSearch = !q ||
      (p.title ?? '').toLowerCase().includes(q) ||
      (p.address_city ?? '').toLowerCase().includes(q) ||
      (p.address_street ?? '').toLowerCase().includes(q);
    const matchPattern = !patternFilter || p.pattern === patternFilter;
    const matchStatus  = !statusFilter  || p.status  === statusFilter;
    return matchSearch && matchPattern && matchStatus;
  });

  const handleSync = async () => {
    if (!user) return;
    try {
      setSyncing(true);
      const stats = await ImportService.importFromXml('https://api.urbs.com.br/Portal/chaves.ashx?uid=4395', user.id);
      alert(`Sincronização concluída!\nImportados: ${stats.imported}\nPulados: ${stats.skipped}\nErros: ${stats.errors}`);
      refresh();
    } catch (err) {
      alert('Erro ao sincronizar XML.');
      console.error(err);
    } finally {
      setSyncing(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="flex justify-between items-end">
          <div>
            <h1 className="text-4xl font-black text-primary tracking-tight">Meus Imóveis</h1>
            <p className="text-muted-foreground text-sm">Gerencie seu portfólio e captações.</p>
          </div>
          
          <div className="flex gap-3">
            <button 
              disabled={syncing}
              onClick={handleSync}
              className="flex items-center gap-2 bg-muted text-primary px-4 py-2 rounded-xl text-sm font-bold hover:bg-muted-foreground/10 transition-all border border-border"
            >
              <RefreshCw size={16} className={syncing ? 'animate-spin' : ''} /> 
              {syncing ? 'Sincronizando...' : 'Sincronizar XML'}
            </button>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-primary-light transition-all shadow-premium"
            >
              <Plus size={16} /> Novo Imóvel
            </button>
          </div>
        </div>

        <PropertyFormModal 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)} 
          onSuccess={refresh} 
        />

        {/* Filters and Search */}
        <div className="flex flex-wrap items-center gap-4 bg-white p-4 rounded-2xl shadow-premium border border-border">
          <div className="flex-1 min-w-[240px] flex items-center gap-3 px-4 py-2 bg-muted/50 rounded-xl border border-transparent focus-within:border-primary/20 transition-all">
            <Search className="text-muted-foreground" size={18} />
            <input 
              type="text" 
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Buscar por título, endereço ou código..."
              className="w-full bg-transparent border-none focus:outline-none text-sm"
            />
          </div>
          
          <div className="flex items-center gap-2">
            <select
              value={patternFilter}
              onChange={e => setPatternFilter(e.target.value)}
              className="bg-white border border-border px-3 py-1.5 rounded-lg text-xs font-bold text-muted-foreground outline-none focus:border-primary/30"
            >
              <option value="">Padrão (todos)</option>
              <option value="high_end">Alto Padrão</option>
              <option value="medium">Médio</option>
              <option value="economic">Econômico</option>
            </select>
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              className="bg-white border border-border px-3 py-1.5 rounded-lg text-xs font-bold text-muted-foreground outline-none focus:border-primary/30"
            >
              <option value="">Status (todos)</option>
              <option value="available">Disponível</option>
              <option value="reserved">Reservado</option>
              <option value="sold">Vendido</option>
            </select>
          </div>
        </div>

        {/* Properties Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filtered.length > 0 ? (
            filtered.map(property => (
              <PropertyCard key={property.id} property={property} />
            ))
          ) : !loading && (
            <div className="col-span-full py-20 text-center bg-white rounded-3xl border-2 border-dashed border-border">
              <p className="text-muted-foreground font-medium">
                {search || patternFilter || statusFilter
                  ? 'Nenhum imóvel encontrado para os filtros aplicados.'
                  : 'Nenhum imóvel cadastrado ainda.'}
              </p>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}

const PropertyCard = ({ property }: { property: any }) => (
  <Link href={`/dashboard/imoveis/${property.id}`} className="group">
    <div className="bg-white rounded-3xl overflow-hidden shadow-premium border border-border group-hover:border-primary/20 transition-all">
      {/* Image Placeholder */}
      <div className="relative aspect-[4/3] bg-muted flex items-center justify-center overflow-hidden">
        {property.pattern === 'high_end' && (
          <span className="absolute top-4 left-4 z-10 bg-luxury-gold text-white text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-full shadow-lg">
            Alto Padrão
          </span>
        )}
        <span className={`absolute top-4 right-4 z-10 text-[10px] font-bold uppercase px-2 py-1 rounded-full shadow-md ${
          property.status === 'available' ? 'bg-green-500 text-white' : 'bg-accent text-white'
        }`}>
          {property.status}
        </span>
        <div className="w-full h-full bg-primary/5 group-hover:scale-110 transition-transform duration-500 flex items-center justify-center">
          <MapPin className="text-primary/10" size={48} />
        </div>
        
        {/* Estimated Commission Overlay */}
        <div className="absolute bottom-4 left-4 right-4 bg-white/90 backdrop-blur-md p-3 rounded-2xl flex justify-between items-center shadow-lg transform translate-y-2 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all">
          <div>
            <p className="text-[10px] font-bold text-muted-foreground uppercase">Comissão Estimada</p>
            <p className="text-sm font-black text-primary">R$ {(property.price * property.commission_estimated_percent / 100).toLocaleString()}</p>
          </div>
          <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white">
            <TrendingUp size={14} />
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-bold text-lg text-primary truncate flex-1">{property.title}</h3>
          <p className="font-black text-primary ml-4">R$ {(property.price / 1000).toLocaleString()}k</p>
        </div>
        <p className="text-xs text-muted-foreground flex items-center gap-1 mb-4">
          <MapPin size={12} /> {property.address_city}, {property.address_state}
        </p>

        <div className="flex items-center gap-4 pt-4 border-t border-border">
          <div className="flex items-center gap-1.5">
            <BedDouble size={16} className="text-muted-foreground" />
            <span className="text-xs font-bold">{property.metadata?.rooms || 0}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Square size={14} className="text-muted-foreground" />
            <span className="text-xs font-bold">{property.metadata?.area || 0}m²</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Car size={16} className="text-muted-foreground" />
            <span className="text-xs font-bold">{property.metadata?.parking || 0}</span>
          </div>
        </div>
      </div>
    </div>
  </Link>
);
