'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { PropertiesService } from '@/services/properties.service';
import { Property } from '@/types/database';
import { 
  ArrowLeft, MapPin, BedDouble, Bath, Square, Car, 
  TrendingUp, Download, MessageCircle, CheckCircle2,
  RefreshCw, Pencil, Trash2, Ban
} from 'lucide-react';
import Link from 'next/link';
import { ConfirmModal } from '@/components/common/ConfirmModal';

export default function PropertyDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = React.use(params);
  const router = useRouter();
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [inactivating, setInactivating] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showInactivateModal, setShowInactivateModal] = useState(false);

  useEffect(() => {
    PropertiesService.getById(id)
      .then(data => {
        setProperty(data);
        setActiveImage(data.main_image || data.images?.[0] || null);
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
    try {
      await PropertiesService.update(id, { status: 'inactive' });
      const updated = await PropertiesService.getById(id);
      setProperty(updated);
    } catch (err) {
      console.error(err);
      alert('Erro ao inativar imóvel.');
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

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto space-y-8 pb-20">
        
        {/* Header with Actions */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <Link href="/crmhabita/imoveis" className="p-3 rounded-2xl border border-border hover:bg-muted transition-all text-primary">
              <ArrowLeft size={20} />
            </Link>
            <div>
              <h1 className="text-2xl font-black text-primary truncate max-w-[400px]">{property.title}</h1>
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-1">
                REF: {property.reference || '---'} • {property.status}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link 
              href={`/crmhabita/imoveis/${id}/editar`}
              className="flex items-center gap-2 px-5 py-3 bg-white border-2 border-border text-primary font-black rounded-2xl hover:border-primary/30 hover:bg-primary/5 transition-all shadow-sm"
            >
              <Pencil size={18} /> Editar
            </Link>
            
            {property.status !== 'inactive' && (
              <button 
                onClick={() => setShowInactivateModal(true)}
                className="flex items-center gap-2 px-5 py-3 bg-white border-2 border-border text-muted-foreground font-black rounded-2xl hover:border-red-200 hover:bg-red-50 hover:text-red-600 transition-all shadow-sm"
              >
                <Ban size={18} /> Inativar
              </button>
            )}

            <button 
              onClick={() => setShowDeleteModal(true)}
              className="p-3 bg-white border-2 border-border text-red-400 font-black rounded-2xl hover:border-red-500 hover:bg-red-500 hover:text-white transition-all shadow-sm"
              title="Excluir Definitivamente"
            >
              <Trash2 size={18} />
            </button>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Real Gallery */}
            <div className="space-y-4">
              <div className="aspect-video bg-muted rounded-[2.5rem] flex items-center justify-center overflow-hidden border-2 border-border shadow-premium relative group">
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
                  <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg ${property.status === 'inactive' ? 'bg-red-600 text-white' : 'bg-primary/90 text-white'}`}>
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
          </div>

          {/* Sidebar Info */}
          <div className="space-y-6">
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
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-primary text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-primary-light transition-all shadow-premium group"
                >
                  <MessageCircle size={20} className="group-hover:rotate-12 transition-transform" />
                  Compartilhar no WhatsApp
                </a>
                <button
                  onClick={handleDownloadFicha}
                  className="w-full bg-white border border-border text-primary py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-muted transition-all"
                >
                  <Download size={20} />
                  Baixar Ficha Técnica
                </button>
              </div>
            </div>
          </div>
        </div>
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
