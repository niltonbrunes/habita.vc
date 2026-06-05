'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useAuth } from '@/context/AuthContext';
import { PropertiesService } from '@/services/properties.service';
import { Property } from '@/types/database';
import { 
  ArrowLeft, MapPin, BedDouble, Bath, Square, Car, 
  TrendingUp, Download, MessageCircle, CheckCircle2,
  RefreshCw, Pencil, Trash2, Ban, Sparkles, LayoutGrid
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import { ConfirmModal } from '@/components/common/ConfirmModal';
import { LeadFormModal } from '@/components/leads/LeadFormModal';

export default function PropertyDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { user, profile } = useAuth();
  const { id } = React.use(params);
  const router = useRouter();
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [relatedProperties, setRelatedProperties] = useState<Property[]>([]);
  const [linkedUnits, setLinkedUnits] = useState<any[]>([]);
  const [parentUnits, setParentUnits] = useState<any[]>([]);
  const [activeImage, setActiveImage] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [inactivating, setInactivating] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showInactivateModal, setShowInactivateModal] = useState(false);
  const [isLeadModalOpen, setIsLeadModalOpen] = useState(false);

  useEffect(() => {
    PropertiesService.getById(id)
      .then(async data => {
        setProperty(data);
        setActiveImage(data.main_image || data.images?.[0] || null);
        
        // Fetch related
        const related = await PropertiesService.getRelated(data);
        setRelatedProperties(related);

        // Fetch linked units
        const linkedIds = data.metadata?.linked_unit_ids || [];
        if (linkedIds.length > 0) {
          try {
            const units = await PropertiesService.getByIds(linkedIds);
            setLinkedUnits(units || []);
          } catch (err) {
            console.error('Erro ao buscar unidades vinculadas:', err);
          }
        } else {
          setLinkedUnits([]);
        }

        // Fetch parent units (if this is a box/locker)
        if (data.type === 'Box de Garagem' || data.type === 'Escaninho') {
          try {
            const { data: parents, error } = await supabase
              .from('properties')
              .select('id, title, type, reference')
              .contains('metadata', { linked_unit_ids: [id] });
            if (error) throw error;
            setParentUnits(parents || []);
          } catch (err) {
            console.error('Erro ao buscar unidades pais:', err);
          }
        } else {
          setParentUnits([]);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await PropertiesService.delete(id);
      router.push('/crmhabita/imoveis');
    } catch (err) {
      console.error(err);
      alert('Erro ao excluir imóvel.');
    } finally {
      setDeleting(false);
      setShowDeleteModal(false);
    }
  };

  const handleInactivate = async () => {
    setInactivating(true);
    const newStatus = property?.status === 'inactive' ? 'available' : 'inactive';
    try {
      await PropertiesService.update(id, { status: newStatus });
      const updated = await PropertiesService.getById(id);
      setProperty(updated);
    } catch (err) {
      console.error(err);
      alert('Erro ao mudar status do imóvel.');
    } finally {
      setInactivating(false);
      setShowInactivateModal(false);
    }
  };

  const handleDownloadFicha = () => {
    if (!property) return;
    const commission = (property.price * (property.commission_estimated_percent ?? 6)) / 100;
    const lines = [
      `HABITA.VC - FICHA TÉCNICA`,
      `IMÓVEL: ${property.title}`,
      `${'='.repeat(50)}`,
      `Tipo: ${property.type} | Padrão: ${property.pattern ?? 'N/A'} | Status: ${property.status}`,
      `Endereço: ${[property.address_street, property.address_city, property.address_state].filter(Boolean).join(', ') || 'Não informado'}`,
      ``,
      `PREÇO: R$ ${property.price.toLocaleString('pt-BR')}`,
      `Comissão (${property.commission_estimated_percent ?? 6}%): R$ ${commission.toLocaleString('pt-BR')}`,
      ``,
      `ESPECIFICAÇÕES`,
      `Quartos : ${property.metadata?.rooms ?? 0}`,
      `Banheiros: ${property.metadata?.bathrooms ?? 0}`,
      `Área    : ${property.metadata?.area ?? 0} m²`,
      `Vagas   : ${property.metadata?.parking ?? 0}`,
      ``,
      `DESCRIÇÃO`,
      property.description ?? 'Sem descrição.',
      ``,
      `DIFERENCIAIS`,
      ...(property.metadata?.features?.length
        ? property.metadata.features.map((f: string) => `  • ${f}`)
        : ['  Nenhum diferencial cadastrado.']),
      ``,
      `Gerado em: ${new Date().toLocaleString('pt-BR')} | Habita.vc`,
    ].join('\n');

    const blob = new Blob([lines], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ficha_${property.title.replace(/\s+/g, '_')}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const whatsappUrl = property
    ? `https://wa.me/?text=${encodeURIComponent(
        `🏠 *${property.title}*\n` +
        `📍 ${[property.address_street, property.address_city, property.address_state].filter(Boolean).join(', ') || 'Endereço a confirmar'}\n` +
        `💰 R$ ${property.price.toLocaleString('pt-BR')}\n` +
        `🛏 ${property.metadata?.rooms ?? 0} quartos | 📐 ${property.metadata?.area ?? 0} m² | 🚗 ${property.metadata?.parking ?? 0} vagas\n\n` +
        `Saiba mais no Habita.vc`
      )}`
    : '#';

  if (loading) return (
    <DashboardLayout>
      <div className="h-full flex items-center justify-center">
        <RefreshCw className="animate-spin text-primary" size={32} />
      </div>
    </DashboardLayout>
  );

  if (!property) return (
    <DashboardLayout>
      <div className="text-center py-20">Imóvel não encontrado.</div>
    </DashboardLayout>
  );

  const canEdit = property.registered_by_id === user?.id || ['admin', 'manager', 'director'].includes(profile?.role || '');

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto space-y-8 pb-20">
        
        {/* Header with Title (Clean) */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <Link href="/crmhabita/imoveis" className="p-3 rounded-2xl border border-border hover:bg-muted transition-all text-primary">
              <ArrowLeft size={20} />
            </Link>
            <div>
              <h1 className="text-xl font-bold text-heading truncate max-w-[400px]">{property.title}</h1>
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-1">
                REF: {property.reference || '---'} • {property.status}
              </p>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Real Gallery */}
            <div className="space-y-4">
              <div className="aspect-video bg-muted rounded-xl flex items-center justify-center overflow-hidden border-2 border-border shadow-card relative group">
                {activeImage ? (
                  <img 
                    src={activeImage} 
                    alt={property.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                ) : (
                  <MapPin size={64} className="text-primary/5" />
                )}
                
                <div className="absolute top-6 left-6 flex gap-2">
                  <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg ${property.status === 'inactive' ? 'bg-red-600 text-white' : 'bg-blue-primary/90 text-white'}`}>
                    {property.status === 'inactive' ? 'Inativo' : property.type}
                  </span>
                  {property.pattern === 'high_end' && (
                    <span className="bg-luxury-gold text-white px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg">Alto Padrão</span>
                  )}
                </div>
              </div>

              {/* Thumbnails */}
              {property.images && property.images.length > 1 && (
                <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                  {property.images.map((img: string, i: number) => (
                    <div 
                      key={i} 
                      className={`w-24 h-24 rounded-2xl overflow-hidden border-2 shrink-0 cursor-pointer transition-all ${img === activeImage ? 'border-primary shadow-md scale-95' : 'border-border hover:border-primary/40'}`}
                      onClick={() => setActiveImage(img)}
                    >
                      <img src={img} alt="" className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
              )}
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
              <SpecItem icon={BedDouble} label="Quartos" value={property.metadata?.rooms || 0} />
              <SpecItem icon={Bath} label="Banheiros" value={property.metadata?.bathrooms || 0} />
              <SpecItem icon={Square} label="Área" value={`${property.metadata?.area || 0}m²`} />
              <SpecItem icon={Car} label="Vagas" value={property.metadata?.parking || 0} />
            </div>

            <div className="space-y-4">
              <h3 className="text-xl font-bold">Descrição</h3>
              <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
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

            {/* Unidades Vinculadas (Mão Dupla) */}
            {linkedUnits.length > 0 && (
              <div className="space-y-4 pt-6 border-t border-border">
                <h3 className="text-xl font-bold flex items-center gap-2">
                  <LayoutGrid size={20} className="text-accent" /> Unidades Vinculadas (Garagem / Escaninho)
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {linkedUnits.map((unit) => (
                    <Link
                      key={unit.id}
                      href={`/crmhabita/imoveis/${unit.id}`}
                      className="flex items-center gap-4 p-4 bg-muted/30 border border-border/60 hover:border-primary/40 rounded-2xl transition-all group"
                    >
                      <div className="p-3 bg-blue-primary/5 rounded-xl text-primary group-hover:bg-blue-primary group-hover:text-white transition-all">
                        {unit.type === 'Box de Garagem' ? <Car size={20} /> : <Square size={20} />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-primary truncate text-sm">{unit.title}</p>
                        <p className="text-[10px] text-muted-foreground uppercase font-black tracking-widest">{unit.type} {unit.reference ? `• ${unit.reference}` : ''}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {parentUnits.length > 0 && (
              <div className="space-y-4 pt-6 border-t border-border">
                <h3 className="text-xl font-bold flex items-center gap-2">
                  <LayoutGrid size={20} className="text-accent" /> Unidade Principal Vinculada
                </h3>
                <div className="grid grid-cols-1 gap-4">
                  {parentUnits.map((unit) => (
                    <Link
                      key={unit.id}
                      href={`/crmhabita/imoveis/${unit.id}`}
                      className="flex items-center gap-4 p-4 bg-muted/30 border border-border/60 hover:border-primary/40 rounded-2xl transition-all group"
                    >
                      <div className="p-3 bg-blue-primary/5 rounded-xl text-primary group-hover:bg-blue-primary group-hover:text-white transition-all">
                        <BedDouble size={20} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-primary truncate text-sm">{unit.title}</p>
                        <p className="text-[10px] text-muted-foreground uppercase font-black tracking-widest">{unit.type} {unit.reference ? `• ${unit.reference}` : ''}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar Info */}
          <div className="space-y-6">
            <div className="bg-surface p-6 rounded-3xl shadow-card border border-border space-y-3">
              <button 
                onClick={() => setIsLeadModalOpen(true)}
                className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-blue-primary text-white font-black rounded-2xl hover:bg-blue-primary/90 transition-all shadow-lg shadow-primary/20 uppercase tracking-widest text-xs"
              >
                <Sparkles size={18} /> Criar Oportunidade
              </button>

              <div className="grid grid-cols-2 gap-3">
                {canEdit && (
                  <Link 
                    href={`/crmhabita/imoveis/${id}/editar`}
                    className="flex items-center justify-center gap-2 px-4 py-3 bg-surface border-2 border-border text-primary font-black rounded-2xl hover:border-primary/30 transition-all uppercase tracking-widest text-[10px]"
                  >
                    <Pencil size={16} /> Editar
                  </Link>
                )}
                
                {property.status === 'inactive' ? (
                  <button 
                    onClick={handleInactivate}
                    className="flex items-center justify-center gap-2 px-4 py-3 bg-green-500 text-white font-black rounded-2xl hover:bg-green-600 transition-all uppercase tracking-widest text-[10px]"
                  >
                    <CheckCircle2 size={16} /> Reativar
                  </button>
                ) : (
                  <button 
                    onClick={() => setShowInactivateModal(true)}
                    className="flex items-center justify-center gap-2 px-4 py-3 bg-surface border-2 border-border text-muted-foreground font-black rounded-2xl hover:border-red-200 hover:text-red-600 transition-all uppercase tracking-widest text-[10px]"
                  >
                    <Ban size={16} /> Inativar
                  </button>
                )}
              </div>

              <button 
                onClick={() => setShowDeleteModal(true)}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-surface border-2 border-border text-red-400 font-black rounded-2xl hover:border-red-500 hover:bg-red-500 hover:text-white transition-all uppercase tracking-widest text-[10px]"
              >
                <Trash2 size={16} /> Excluir Definitivamente
              </button>
            </div>
            <div className="bg-surface p-8 rounded-3xl shadow-card border border-border sticky top-24">
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-2">Preço de Venda</p>
              <h2 className="text-2xl font-bold text-heading mb-6">
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
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-blue-primary text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-blue-primary-light transition-all shadow-card group"
                >
                  <MessageCircle size={20} className="group-hover:rotate-12 transition-transform" />
                  Compartilhar no WhatsApp
                </a>
                <button
                  onClick={handleDownloadFicha}
                  className="w-full bg-surface border border-border text-primary py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-muted transition-all"
                >
                  <Download size={20} />
                  Baixar Ficha Técnica
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Related Properties Section */}
        {relatedProperties.length > 0 && (
          <div className="mt-20 space-y-8 animate-in slide-in-from-bottom duration-700">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-heading tracking-tight">Também pode lhe interessar...</h2>
              <Link href="/crmhabita/imoveis" className="text-sm font-bold text-accent hover:underline">Ver todos</Link>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {relatedProperties.map((rel) => (
                <Link 
                  key={rel.id} 
                  href={`/crmhabita/imoveis/${rel.id}`}
                  className="group bg-surface rounded-xl border-2 border-border p-4 shadow-sm hover:shadow-card hover:border-primary/20 transition-all"
                >
                  <div className="aspect-[4/3] rounded-2xl bg-muted mb-4 overflow-hidden relative">
                    {rel.main_image ? (
                      <img src={rel.main_image} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-primary/10 font-black italic">HABITA.VC</div>
                    )}
                    <div className="absolute top-3 left-3 px-2 py-1 bg-surface/90 backdrop-blur-sm rounded-lg text-[8px] font-black uppercase tracking-wider text-primary">
                      {rel.type}
                    </div>
                  </div>
                  <h3 className="font-black text-primary truncate mb-1">{rel.title}</h3>
                  <p className="text-xs text-muted-foreground font-medium flex items-center gap-1 mb-3">
                    <MapPin size={12} /> {rel.address_city}
                  </p>
                  <div className="flex items-center justify-between border-t border-border pt-3">
                    <p className="font-black text-primary text-sm">R$ {rel.price.toLocaleString()}</p>
                    <div className="flex gap-2">
                      <div className="flex items-center gap-1 text-[10px] font-bold text-muted-foreground">
                        <BedDouble size={12} /> {rel.rooms}
                      </div>
                      <div className="flex items-center gap-1 text-[10px] font-bold text-muted-foreground">
                        <Square size={12} /> {rel.area_useful}m²
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      <ConfirmModal 
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDelete}
        loading={deleting}
        title="Excluir Definitivamente?"
        message={`Você está prestes a apagar todos os dados de "${property.title}". Esta ação é irreversível e removerá também todas as fotos e documentos associados.`}
        confirmLabel="Sim, Excluir"
        isDestructive
      />

      <ConfirmModal 
        isOpen={showInactivateModal}
        onClose={() => setShowInactivateModal(false)}
        onConfirm={handleInactivate}
        loading={inactivating}
        title="Inativar Imóvel?"
        message={`O imóvel "${property.title}" ficará oculto no portal público, mas os dados internos serão preservados.`}
        confirmLabel="Sim, Inativar"
      />

      <LeadFormModal 
        isOpen={isLeadModalOpen}
        onClose={() => setIsLeadModalOpen(false)}
        onSuccess={() => {
          setIsLeadModalOpen(false);
        }}
        preSelectedPropertyId={id}
      />
    </DashboardLayout>
  );
}

const SpecItem = ({ icon: Icon, label, value }: { icon: any, label: string, value: string | number }) => (
  <div className="flex flex-col items-center justify-center text-center p-2">
    <div className="w-10 h-10 bg-muted rounded-xl flex items-center justify-center text-primary mb-2">
      <Icon size={20} />
    </div>
    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{label}</p>
    <p className="text-sm font-black text-primary">{value}</p>
  </div>
);
