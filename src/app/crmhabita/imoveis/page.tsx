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
  RefreshCw,
  DollarSign,
  ChevronDown
} from 'lucide-react';
import { PropertyMap } from '@/components/properties/PropertyMap';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';


export default function PropertiesPage() {
  const { user, profile } = useAuth();
  const { properties, loading, refresh } = useProperties();
  const [syncing, setSyncing] = React.useState(false);
  const [search, setSearch] = React.useState('');
  const [patternFilter, setPatternFilter] = React.useState('');
  const [statusFilter, setStatusFilter] = React.useState('');
  const [hoveredPropertyId, setHoveredPropertyId] = React.useState<string | null>(null);

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
      // Uses server-side API route (no CORS issues, service role key, longer timeout)
      const res = await fetch('/api/import/xml', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          xmlUrl: 'https://api.urbs.com.br/Portal/chaves.ashx?uid=4395',
          userId: user.id,
        }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({ error: 'Erro desconhecido' }));
        throw new Error(errData.error || `HTTP ${res.status}`);
      }

      const stats = await res.json();
      alert(
        `✅ Sincronização concluída!\n\n` +
        `📥 Novos: ${stats.imported}\n` +
        `🔄 Atualizados: ${stats.updated}\n` +
        `⏭️  Sem alteração: ${stats.skipped}\n` +
        `❌ Erros: ${stats.errors}`
      );
      refresh();
    } catch (err: any) {
      alert('Erro ao sincronizar XML: ' + (err.message || 'Verifique o console.'));
      console.error(err);
    } finally {
      setSyncing(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="h-[calc(100vh-58px)] md:h-[calc(100vh-100px)] flex flex-col bg-surface overflow-hidden rounded-xl shadow-card">
        {/* Header Section */}
        <header className="p-6 border-b border-border bg-surface z-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-6">
            <div>
              <h1 className="text-3xl font-black text-primary tracking-tight">Gestão de Imóveis</h1>
              <p className="text-muted-foreground text-xs font-medium">Portfólio atualizado: {properties.length} ativos</p>
            </div>
            <div className="flex items-center gap-3">
               <button 
                disabled={syncing}
                onClick={handleSync}
                className="flex items-center gap-2 bg-muted/50 text-primary px-5 py-2.5 rounded-full text-xs font-black uppercase tracking-widest hover:bg-muted transition-all border border-border"
              >
                <RefreshCw size={14} className={syncing ? 'animate-spin' : ''} /> 
                {syncing ? 'Sincronizando...' : 'Sincronizar XML'}
              </button>
              <Link 
                href="/crmhabita/imoveis/novo"
                className="flex items-center gap-2 bg-blue-primary text-white px-6 py-2.5 rounded-full text-xs font-black uppercase tracking-widest hover:scale-105 transition-all shadow-lg shadow-primary/20"
              >
                <Plus size={14} /> Novo Imóvel
              </Link>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Search Pill */}
            <div className="flex items-center gap-3 px-5 py-2 bg-muted/30 rounded-full border border-border/50 focus-within:border-primary/40 transition-all flex-1 min-w-[280px]">
              <Search className="text-primary/30" size={16} />
              <input 
                type="text" 
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Buscar por título, endereço ou código..."
                className="bg-transparent border-none focus:outline-none text-sm font-bold text-primary placeholder:text-muted-foreground/40 w-full"
              />
            </div>
            
            <FilterPill label="Padrão" value={patternFilter} onChange={setPatternFilter} options={[
              { label: 'Todos', value: '' },
              { label: 'Alto Padrão', value: 'high_end' },
              { label: 'Médio', value: 'medium' },
              { label: 'Econômico', value: 'economic' }
            ]} />

            <FilterPill label="Status" value={statusFilter} onChange={setStatusFilter} options={[
              { label: 'Todos', value: '' },
              { label: 'Disponível', value: 'available' },
              { label: 'Reservado', value: 'reserved' },
              { label: 'Vendido', value: 'sold' }
            ]} />
          </div>
        </header>

        {/* Split View Content */}
        <div className="flex-1 flex overflow-hidden">
          {/* List Section */}
          <section className="w-full md:w-[60%] lg:w-[50%] overflow-y-auto p-3 md:p-6 scrollbar-hide bg-surface">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {filtered.length > 0 ? (
                filtered.map(property => (
                  <div key={property.id} onMouseEnter={() => setHoveredPropertyId(property.id)} onMouseLeave={() => setHoveredPropertyId(null)}>
                    <PropertyCard property={property} isHovered={hoveredPropertyId === property.id} />
                  </div>
                ))
              ) : !loading && (
                <div className="col-span-full py-20 text-center bg-muted/5 rounded-xl border-2 border-dashed border-border/20 flex flex-col items-center justify-center">
                  <Search size={40} className="text-muted-foreground/10 mb-4" />
                  <p className="text-sm font-bold text-muted-foreground/60">Nenhum imóvel encontrado.</p>
                </div>
              )}
            </div>
          </section>

          {/* Map Section */}
          <section className="hidden md:block flex-1 bg-muted/10 relative z-0">
            <PropertyMap properties={filtered} hoveredPropertyId={hoveredPropertyId} setHoveredPropertyId={setHoveredPropertyId} />
          </section>
        </div>
      </div>
    </DashboardLayout>
  );
}

const FilterPill = ({ label, value, onChange, options }: any) => (
  <div className="relative group">
    <select 
      value={value}
      onChange={e => onChange(e.target.value)}
      className={`
        appearance-none pl-5 pr-10 py-2 rounded-full text-xs font-black uppercase tracking-widest transition-all border cursor-pointer
        ${value ? 'bg-blue-primary/5 text-primary border-primary/20' : 'bg-surface text-primary/40 border-border hover:bg-muted/50'}
      `}
    >
      <option value="" disabled>{label}</option>
      {options.map((opt: any) => (
        <option key={opt.value} value={opt.value}>{opt.label}</option>
      ))}
    </select>
    <ChevronDown size={12} className="absolute right-4 top-1/2 -translate-y-1/2 text-primary/30 pointer-events-none" />
  </div>
);

const PropertyCard = ({ property, isHovered }: { property: any, isHovered?: boolean }) => {
  const formattedPrice = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    maximumFractionDigits: 0
  }).format(property.price);

  return (
    <Link href={`/crmhabita/imoveis/${property.id}`} className={`group block bg-surface border rounded-xl overflow-hidden transition-all duration-300 ${isHovered ? 'ring-2 ring-blue-600 border-blue-600 scale-[1.02] shadow-xl' : 'border-border/60 hover:shadow-lg'}`}>
      <div className="relative aspect-[1.5/1] overflow-hidden bg-muted">
        <img 
          src={property.main_image || property.images?.[0] || "/hero_luxury.png"} 
          alt={property.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
        />
        
        {/* Status Badge */}
        <div className="absolute top-3 left-3">
          <span className={`text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full shadow-sm border ${
            property.status === 'available' ? 'bg-green-500 text-white border-green-400' : 'bg-accent text-white border-accent-light'
          }`}>
            {property.status}
          </span>
        </div>

        {/* Commission Badge */}
        <div className="absolute bottom-3 right-3 bg-surface/90 backdrop-blur-md px-3 py-1.5 rounded-lg shadow-lg border border-border/20 scale-90 group-hover:scale-100 transition-all">
          <p className="text-[8px] font-black text-muted-foreground uppercase leading-none">Comissão</p>
          <p className="text-xs font-black text-primary">R$ {(property.price * (property.commission_estimated_percent || 4) / 100).toLocaleString()}</p>
        </div>
      </div>

      <div className="p-4 space-y-2">
        <h3 className="text-xs font-bold text-primary/80 line-clamp-1 group-hover:text-primary transition-colors">
          {property.title}
        </h3>
        
        <p className="text-lg font-black text-primary tracking-tight">
          {formattedPrice}
        </p>

        <div className="flex items-center gap-3 pt-1 text-[11px] font-bold text-muted-foreground">
          <div className="flex items-center gap-1"><BedDouble size={14} /> {property.rooms || 0}</div>
          <div className="flex items-center gap-1"><Square size={12} /> {property.area_useful || 0}m²</div>
          <div className="flex items-center gap-1"><Car size={14} /> {property.parking_spaces || 0}</div>
        </div>

        <p className="text-[10px] text-muted-foreground font-medium truncate pt-1 flex items-center gap-1">
          <MapPin size={10} className="text-accent" /> {property.address_neighborhood || 'Bairro'}, {property.address_city}
        </p>
      </div>
    </Link>
  );
};

