'use client';

import React from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useProperties } from '@/hooks/useProperties';
import { 
  Plus, Search, MapPin, BedDouble, Square, Car, RefreshCw, ChevronDown
} from 'lucide-react';
import { PropertyMap } from '@/components/properties/PropertyMap';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

export default function PropertiesPage() {
  const { user } = useAuth();
  const { properties, loading, refresh } = useProperties();
  const [syncing, setSyncing] = React.useState(false);
  const [syncStatus, setSyncStatus] = React.useState('');
  const [search, setSearch] = React.useState('');
  const [patternFilter, setPatternFilter] = React.useState('');
  const [statusFilter, setStatusFilter] = React.useState('available');
  const [hoveredPropertyId, setHoveredPropertyId] = React.useState<string | null>(null);

  const filtered = properties.filter(p => {
    const q = search.toLowerCase();
    const matchSearch = !q ||
      (p.title ?? '').toLowerCase().includes(q) ||
      (p.address_city ?? '').toLowerCase().includes(q) ||
      (p.address_street ?? '').toLowerCase().includes(q) ||
      (p.reference ?? '').toLowerCase().includes(q);
    const matchPattern = !patternFilter || patternFilter === 'all' || p.pattern === patternFilter;
    const matchStatus = statusFilter === 'all' ? true : (statusFilter ? p.status === statusFilter : p.status === 'available');
    return matchSearch && matchPattern && matchStatus;
  });

  const getTagValue = (parent: Element, tagName: string): string => {
    const element = parent.getElementsByTagName(tagName)[0];
    return element ? (element.textContent || '').trim() : '';
  };

  const getImages = (parent: Element): string[] => {
    const fotos = parent.getElementsByTagName('foto');
    const urls: string[] = [];
    for (let i = 0; i < fotos.length; i++) {
      const urlTag = fotos[i].getElementsByTagName('url')[0];
      if (urlTag && urlTag.textContent) urls.push(urlTag.textContent.trim());
    }
    return urls;
  };

  const getFeatures = (parent: Element): string[] => {
    const features: string[] = [];
    const common = parent.getElementsByTagName('area_comum')[0];
    const private_area = parent.getElementsByTagName('area_privativa')[0];

    const extractItems = (node: Element) => {
      if (!node) return;
      const items = node.getElementsByTagName('item');
      for (let i = 0; i < items.length; i++) {
        const text = items[i].textContent?.trim();
        if (text) features.push(text);
      }
    };
    if (common) extractItems(common);
    if (private_area) extractItems(private_area);
    return Array.from(new Set(features));
  };

  const handleSync = async () => {
    if (!user) return;
    try {
      setSyncing(true);
      
      setSyncStatus('Baixando XML...');
      const targetUrl = 'https://api.urbs.com.br/Portal/chaves.ashx?uid=4395';
      const xmlRes = await fetch(targetUrl);
      if (!xmlRes.ok) throw new Error('Falha ao baixar o XML direto da URBS');
      
      const xmlText = await xmlRes.text();
      
      setSyncStatus('Analisando XML...');
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(xmlText, 'text/xml');
      const imoveis = xmlDoc.getElementsByTagName('imovel');
      
      if (!imoveis || imoveis.length === 0) {
        throw new Error('Nenhum imovel encontrado no XML.');
      }

      setSyncStatus('Buscando imoveis do banco...');
      let existingProperties: any[] = [];
      let page = 0;
      const pageSize = 1000;
      while (true) {
        const { data, error } = await supabase
          .from('properties')
          .select('id, reference, price, status, images')
          .range(page * pageSize, (page + 1) * pageSize - 1);
        if (error) throw error;
        if (!data || data.length === 0) break;
        existingProperties = existingProperties.concat(data);
        if (data.length < pageSize) break;
        page++;
      }

      const existingMap = new Map();
      existingProperties.forEach(p => {
        if (p.reference) existingMap.set(p.reference, p);
      });

      const xmlReferences = new Set<string>();
      const inserts = [];
      const updates = [];

      setSyncStatus('Calculando alteracoes...');
      for (let i = 0; i < imoveis.length; i++) {
        const item = imoveis[i];
        const reference = getTagValue(item, 'referencia');
        if (!reference) continue;
        
        xmlReferences.add(reference);
        const images = getImages(item);
        const features = getFeatures(item);
        const newPrice = parseFloat(getTagValue(item, 'valor')) || 0;
        const isHighlight = getTagValue(item, 'destaque') === '1';

        const updateFields = {
          title: getTagValue(item, 'titulo'),
          description: getTagValue(item, 'descritivo'),
          price: newPrice,
          price_iptu: parseFloat(getTagValue(item, 'valor_iptu')) || 0,
          price_condo: parseFloat(getTagValue(item, 'valor_condominio')) || 0,
          area_total: parseFloat(getTagValue(item, 'area_total')) || 0,
          area_useful: parseFloat(getTagValue(item, 'area_util')) || 0,
          rooms: parseInt(getTagValue(item, 'quartos')) || 0,
          suites: parseInt(getTagValue(item, 'suites')) || 0,
          bathrooms: parseInt(getTagValue(item, 'banheiro')) || 0,
          parking_spaces: parseInt(getTagValue(item, 'garagem')) || 0,
          images: images,
          main_image: images[0] || '',
          is_highlight: isHighlight,
          video_url: getTagValue(item, 'video'),
          metadata: { features, commission_estimated_percent: 6 },
        };

        const existing = existingMap.get(reference);
        if (existing) {
          const priceChanged = Math.abs(existing.price - newPrice) >= 1;
          const imagesChanged = JSON.stringify(existing.images || []) !== JSON.stringify(images);
          const statusChanged = existing.status !== 'available';

          if (priceChanged || imagesChanged || statusChanged) {
            updates.push({
              id: existing.id,
              fields: { ...updateFields, ...(statusChanged ? { status: 'available' } : {}) }
            });
          }
        } else {
          inserts.push({
            ...updateFields,
            registered_by_id: user.id,
            reference: reference,
            type: getTagValue(item, 'tipo'),
            transaction_type: getTagValue(item, 'transacao') === 'V' ? 'sale' : 'rent',
            address_street: getTagValue(item, 'endereco'),
            address_neighborhood: getTagValue(item, 'bairro'),
            address_city: getTagValue(item, 'cidade'),
            address_state: getTagValue(item, 'estado'),
            address_zip_code: getTagValue(item, 'cep'),
            latitude: getTagValue(item, 'latitude'),
            longitude: getTagValue(item, 'longitude'),
            status: 'available',
            pattern: 'medium',
          });
        }
      }

      const suspends = existingProperties
        .filter(p => p.reference && !xmlReferences.has(p.reference) && p.status !== 'suspended')
        .map(p => p.id);

      // --- Batch sending ---
      let totalInserted = 0, totalUpdated = 0, totalSuspended = 0;
      const allTasks = [];
      const batchSize = 50;

      // Group inserts
      for (let i = 0; i < inserts.length; i += batchSize) {
        allTasks.push({ type: 'inserts', data: inserts.slice(i, i + batchSize) });
      }
      // Group updates
      for (let i = 0; i < updates.length; i += batchSize) {
        allTasks.push({ type: 'updates', data: updates.slice(i, i + batchSize) });
      }
      // Group suspends
      for (let i = 0; i < suspends.length; i += batchSize) {
        allTasks.push({ type: 'suspends', data: suspends.slice(i, i + batchSize) });
      }

      for (let i = 0; i < allTasks.length; i++) {
        setSyncStatus(`Salvando lote ${i + 1} de ${allTasks.length}...`);
        const task = allTasks[i];
        const payload = {
          inserts: task.type === 'inserts' ? task.data : [],
          updates: task.type === 'updates' ? task.data : [],
          suspends: task.type === 'suspends' ? task.data : [],
        };

        const batchRes = await fetch('/api/import/batch', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });

        if (!batchRes.ok) throw new Error('Erro ao salvar lote no banco.');
        const batchStats = await batchRes.json();
        totalInserted += batchStats.inserted || 0;
        totalUpdated += batchStats.updated || 0;
        totalSuspended += batchStats.suspended || 0;
      }

      alert(
        `Sincronizacao concluida!\n\n` +
        `Novos: ${totalInserted}\n` +
        `Atualizados: ${totalUpdated}\n` +
        `Suspensos: ${totalSuspended}\n`
      );
      refresh();
    } catch (err: any) {
      alert('Erro ao sincronizar XML: ' + (err.message || 'Verifique o console.'));
      console.error(err);
    } finally {
      setSyncing(false);
      setSyncStatus('');
    }
  };

  return (
    <DashboardLayout>
      <div className="h-[calc(100vh-58px)] md:h-[calc(100vh-100px)] flex flex-col bg-surface overflow-hidden rounded-xl shadow-card">
        <header className="p-6 border-b border-border bg-surface z-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-6">
            <div>
              <h1 className="text-3xl font-black text-primary tracking-tight">Gestao de Imoveis</h1>
              <p className="text-muted-foreground text-xs font-medium">
                {filtered.length} imoveis exibidos de {properties.length} no portfolio
              </p>
            </div>
            <div className="flex items-center gap-3">
               <button 
                disabled={syncing}
                onClick={handleSync}
                className="flex items-center gap-2 bg-muted/50 text-primary px-5 py-2.5 rounded-full text-xs font-black uppercase tracking-widest hover:bg-muted transition-all border border-border"
              >
                <RefreshCw size={14} className={syncing ? 'animate-spin text-blue-500' : ''} /> 
                {syncing ? syncStatus || 'Sincronizando...' : 'Sincronizar XML'}
              </button>
              <Link 
                href="/crmhabita/imoveis/novo"
                className="flex items-center gap-2 bg-blue-primary text-white px-6 py-2.5 rounded-full text-xs font-black uppercase tracking-widest hover:scale-105 transition-all shadow-lg shadow-primary/20"
              >
                <Plus size={14} /> Novo Imovel
              </Link>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-3 px-5 py-2 bg-muted/30 rounded-full border border-border/50 focus-within:border-primary/40 transition-all flex-1 min-w-[280px]">
              <Search className="text-primary/30" size={16} />
              <input 
                type="text" 
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Buscar por titulo, endereco ou codigo..."
                className="bg-transparent border-none focus:outline-none text-sm font-bold text-primary placeholder:text-muted-foreground/40 w-full"
              />
            </div>
            <FilterPill label="Padrao" value={patternFilter} onChange={setPatternFilter} options={[
              { label: 'Todos', value: 'all' },
              { label: 'Alto Padrao', value: 'high_end' },
              { label: 'Medio', value: 'medium' },
              { label: 'Economico', value: 'economic' }
            ]} />
            <FilterPill label="Status" value={statusFilter} onChange={setStatusFilter} options={[
              { label: 'Ativos', value: 'available' },
              { label: 'Reservados', value: 'reserved' },
              { label: 'Vendidos', value: 'sold' },
              { label: 'Suspensos', value: 'suspended' },
              { label: 'Inativos', value: 'inactive' },
              { label: 'Todos', value: 'all' },
            ]} />
          </div>
        </header>

        <div className="flex-1 flex overflow-hidden">
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
                  <p className="text-sm font-bold text-muted-foreground/60">Nenhum imovel encontrado.</p>
                </div>
              )}
            </div>
          </section>

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
        ${(value && value !== 'all') ? 'bg-blue-primary/5 text-primary border-primary/20' : 'bg-surface text-primary/40 border-border hover:bg-muted/50'}
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
        <div className="absolute top-3 left-3">
          <span className={`text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full shadow-sm border ${
            property.status === 'available' ? 'bg-green-500 text-white border-green-400' : 'bg-accent text-white border-accent-light'
          }`}>
            {property.status}
          </span>
        </div>
        <div className="absolute bottom-3 right-3 bg-surface/90 backdrop-blur-md px-3 py-1.5 rounded-lg shadow-lg border border-border/20 scale-90 group-hover:scale-100 transition-all">
          <p className="text-[8px] font-black text-muted-foreground uppercase leading-none">Comissao</p>
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
          <div className="flex items-center gap-1"><Square size={12} /> {property.area_useful || 0}m2</div>
          <div className="flex items-center gap-1"><Car size={14} /> {property.parking_spaces || 0}</div>
        </div>
        <p className="text-[10px] text-muted-foreground font-medium truncate pt-1 flex items-center gap-1">
          <MapPin size={10} className="text-accent" /> {property.address_neighborhood || 'Bairro'}, {property.address_city}
        </p>
      </div>
    </Link>
  );
};

