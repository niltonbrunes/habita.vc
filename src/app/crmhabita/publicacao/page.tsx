'use client';

import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { PropertiesService } from '@/services/properties.service';
import { 
  Globe, 
  Search, 
  Eye, 
  ExternalLink, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  Star,
  Settings2,
  RefreshCw
} from 'lucide-react';
import Link from 'next/link';

export default function PublicationDashboard() {
  const [properties, setProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, published, pending

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    setLoading(true);
    try {
      // In a real scenario, we'd have a specific method for this
      const data = await PropertiesService.getAll();
      setProperties(data);
    } catch (err) {
      console.error('Erro ao buscar imóveis:', err);
    } finally {
      setLoading(false);
    }
  };

  const toggleHighlight = async (id: string, current: boolean) => {
    try {
      await PropertiesService.update(id, { is_highlight: !current });
      setProperties(prev => prev.map(p => p.id === id ? { ...p, is_highlight: !current } : p));
    } catch (err) {
      console.error('Erro ao alternar destaque:', err);
    }
  };

  const filteredProperties = properties.filter(p => {
    if (filter === 'all') return true;
    if (filter === 'published') return p.status === 'available';
    if (filter === 'pending') return !p.slug || !p.main_image;
    return true;
  });

  return (
    <DashboardLayout>
      <div className="space-y-8 animate-in fade-in duration-500">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 text-accent text-[10px] font-black uppercase tracking-widest mb-4 border border-accent/20">
              <Globe size={12} /> Portal Público Habita.vc
            </div>
            <h1 className="text-3xl font-black text-primary mb-2">Publicação Automática</h1>
            <p className="text-muted-foreground font-medium">Gerencie a visibilidade e o SEO de seus imóveis na vitrine pública.</p>
          </div>
          <div className="flex gap-3">
            <button 
              onClick={fetchProperties}
              className="p-4 bg-surface rounded-2xl border border-border hover:bg-muted transition-all text-primary"
            >
              <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
            </button>
            <Link 
              href="/imoveis" 
              target="_blank"
              className="bg-blue-primary text-white px-8 py-4 rounded-2xl font-bold flex items-center gap-2 hover:bg-blue-primary-dark transition-all shadow-card"
            >
              <ExternalLink size={20} /> Ver Portal Vivo
            </Link>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatMiniCard 
            label="Total no Inventário" 
            value={properties.length} 
            icon={<Globe className="text-blue-500" />}
          />
          <StatMiniCard 
            label="Publicados no Portal" 
            value={properties.filter(p => p.status === 'available').length} 
            icon={<CheckCircle2 className="text-green-500" />}
            color="bg-green-50"
          />
          <StatMiniCard 
            label="Destaques Vitrine" 
            value={properties.filter(p => p.is_highlight).length} 
            icon={<Star className="text-yellow-500 fill-yellow-500" />}
            color="bg-yellow-50"
          />
        </div>

        {/* Filters & Search */}
        <div className="bg-surface p-4 rounded-xl border border-border flex flex-col md:flex-row gap-4 items-center justify-between shadow-sm">
          <div className="flex gap-2 p-1 bg-muted rounded-2xl w-full md:w-auto">
            <FilterBtn active={filter === 'all'} onClick={() => setFilter('all')}>Todos</FilterBtn>
            <FilterBtn active={filter === 'published'} onClick={() => setFilter('published')}>Publicados</FilterBtn>
            <FilterBtn active={filter === 'pending'} onClick={() => setFilter('pending')}>Pendentes SEO</FilterBtn>
          </div>
          <div className="relative w-full md:w-80 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-accent transition-colors" size={20} />
            <input 
              type="text" 
              placeholder="Buscar por referência ou título..."
              className="w-full pl-12 pr-6 py-3 bg-muted/50 border border-transparent rounded-xl focus:bg-surface focus:border-accent/20 transition-all outline-none font-bold text-sm" style={{ paddingLeft: "3rem" }}
            />
          </div>
        </div>

        {/* Properties Table */}
        <div className="bg-surface rounded-xl shadow-card border border-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-muted/50 text-[10px] font-black uppercase tracking-widest text-muted-foreground border-b border-border">
                  <th className="px-8 py-5">Imóvel / Referência</th>
                  <th className="px-8 py-5">Status Portal</th>
                  <th className="px-8 py-5">Qualidade SEO</th>
                  <th className="px-8 py-5">Destaque</th>
                  <th className="px-8 py-5 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredProperties.map((prop) => (
                  <tr key={prop.id} className="hover:bg-muted/30 transition-colors group">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-muted overflow-hidden flex-shrink-0 border border-border">
                          {prop.main_image ? (
                            <img src={prop.main_image} className="w-full h-full object-cover" alt="" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                              <AlertCircle size={20} />
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="font-bold text-primary leading-tight mb-1 group-hover:text-accent transition-colors">{prop.title}</p>
                          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{prop.reference || 'Sem Ref'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      {prop.status === 'available' ? (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-50 text-green-600 text-[10px] font-black uppercase tracking-widest border border-green-100">
                          <CheckCircle2 size={12} /> Online
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-50 text-orange-600 text-[10px] font-black uppercase tracking-widest border border-orange-100">
                          <Clock size={12} /> Offline
                        </span>
                      )}
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-2">
                        <SEOIndicator score={prop.slug && prop.main_image && prop.description ? 100 : 60} />
                        <span className="text-xs font-bold text-primary/70">
                          {prop.slug && prop.main_image && prop.description ? 'Excelente' : 'Pendente'}
                        </span>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <button 
                        onClick={() => toggleHighlight(prop.id, prop.is_highlight)}
                        className={`p-2 rounded-xl transition-all ${prop.is_highlight ? 'bg-yellow-100 text-yellow-600 shadow-sm' : 'bg-muted text-muted-foreground hover:bg-muted-dark'}`}
                      >
                        <Star size={18} className={prop.is_highlight ? 'fill-yellow-600' : ''} />
                      </button>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link 
                          href={`/imoveis/${prop.address_city?.toLowerCase() || 'goiania'}/${prop.slug}`}
                          target="_blank"
                          className="p-3 hover:bg-blue-primary hover:text-white rounded-xl transition-all text-muted-foreground"
                          title="Ver no Portal"
                        >
                          <Eye size={18} />
                        </Link>
                        <button className="p-3 hover:bg-accent hover:text-white rounded-xl transition-all text-muted-foreground">
                          <Settings2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {filteredProperties.length === 0 && (
            <div className="p-20 text-center">
              <div className="w-20 h-20 bg-muted rounded-xl flex items-center justify-center mx-auto mb-6">
                <Globe size={40} className="text-muted-foreground/30" />
              </div>
              <h3 className="text-xl font-bold text-primary mb-2">Nenhum imóvel encontrado</h3>
              <p className="text-muted-foreground font-medium">Tente ajustar seus filtros ou cadastre novos imóveis.</p>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}

const StatMiniCard = ({ label, value, icon, color = 'bg-surface' }: any) => (
  <div className={`${color} p-6 rounded-xl border border-border shadow-sm flex items-center gap-6`}>
    <div className="w-12 h-12 rounded-2xl bg-surface shadow-sm flex items-center justify-center border border-border">
      {icon}
    </div>
    <div>
      <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">{label}</p>
      <p className="text-3xl font-black text-primary tracking-tight">{value}</p>
    </div>
  </div>
);

const FilterBtn = ({ children, active, onClick }: any) => (
  <button 
    onClick={onClick}
    className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
      active ? 'bg-surface text-primary shadow-sm' : 'text-muted-foreground hover:text-primary'
    }`}
  >
    {children}
  </button>
);

const SEOIndicator = ({ score }: { score: number }) => (
  <div className="w-12 h-1.5 bg-muted rounded-full overflow-hidden">
    <div 
      className={`h-full rounded-full ${score > 80 ? 'bg-green-500' : 'bg-orange-400'}`} 
      style={{ width: `${score}%` }} 
    />
  </div>
);
