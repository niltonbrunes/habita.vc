'use client';

import React, { useState } from 'react';
import { 
  X, 
  MapPin, 
  BedDouble, 
  Bath, 
  Square, 
  Car, 
  Tag, 
  Image as ImageIcon, 
  Upload,
  Loader2,
  Trash2,
  Plus,
  CheckCircle2,
  DollarSign,
  Video,
  Eye,
  Hash,
  Activity
} from 'lucide-react';
import { PropertiesService } from '@/services/properties.service';
import { StorageService } from '@/services/storage.service';
import { useAuth } from '@/context/AuthContext';
import { DevelopmentsService } from '@/services/developments.service';
import { PropertyPattern, PropertyStatus } from '@/types/database';

interface PropertyFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const PropertyFormModal = ({ isOpen, onClose, onSuccess }: PropertyFormModalProps) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [step, setStep] = useState(1);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    reference: '',
    development_id: '' as string | null,
    transaction_type: 'sale' as 'sale' | 'rent' | 'both',
    property_category: 'residential' as 'residential' | 'commercial',
    type: 'Apartamento',
    price: 0,
    price_rent: 0,
    price_iptu: 0,
    price_condo: 0,
    area_total: 0,
    area_useful: 0,
    rooms: 0,
    suites: 0,
    bathrooms: 0,
    parking_spaces: 0,
    status: 'available' as PropertyStatus,
    pattern: 'medium' as PropertyPattern,
    address_street: '',
    address_number: '',
    address_complement: '',
    address_neighborhood: '',
    address_city: 'Goiânia',
    address_state: 'GO',
    address_zip_code: '',
    latitude: '',
    longitude: '',
    video_url: '',
    tour_360_url: '',
    is_highlight: false,
    accepts_financing: true,
    accepts_exchange: false,
    metadata: {
      features: [] as string[]
    },
    images: [] as string[],
    main_image: ''
  });

  const [tempId] = useState(() => Math.random().toString(36).substring(7));
  const [developments, setDevelopments] = useState<any[]>([]);

  React.useEffect(() => {
    if (isOpen) {
      DevelopmentsService.getAll().then(setDevelopments).catch(console.error);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || !user) return;

    setUploading(true);
    try {
      const uploadPromises = Array.from(files).map(file => 
        StorageService.uploadPropertyImage(file, `temp_${tempId}`)
      );
      
      const urls = await Promise.all(uploadPromises);
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, ...urls],
        main_image: prev.main_image || urls[0]
      }));
    } catch (error) {
      console.error('Erro no upload:', error);
    } finally {
      setUploading(false);
    }
  };

  const fetchCep = async (cep: string) => {
    const cleanCep = cep.replace(/\D/g, '');
    if (cleanCep.length !== 8) return;
    
    try {
      const res = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`);
      const data = await res.json();
      if (!data.erro) {
        setFormData(prev => ({
          ...prev,
          address_street: data.logradouro || prev.address_street,
          address_neighborhood: data.bairro || prev.address_neighborhood,
          address_city: data.localidade || prev.address_city,
          address_state: data.uf || prev.address_state,
          address_zip_code: cep
        }));
      }
    } catch (err) {
      console.error('Erro ao buscar CEP:', err);
    }
  };

  const removeImage = (urlToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter(url => url !== urlToRemove),
      main_image: prev.main_image === urlToRemove ? (prev.images.find(url => url !== urlToRemove) || '') : prev.main_image
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    try {
      await PropertiesService.create({
        ...formData,
        registered_by_id: user.id
      });
      onSuccess();
      onClose();
    } catch (error: any) {
      console.error('Erro detalhado ao criar imóvel:', error.message || error);
      alert('Erro ao criar imóvel: ' + (error.message || 'Verifique as permissões no banco.'));
    } finally {
      setLoading(false);
    }
  };

  const toggleFeature = (feature: string) => {
    setFormData(prev => {
      const features = prev.metadata.features.includes(feature)
        ? prev.metadata.features.filter(f => f !== feature)
        : [...prev.metadata.features, feature];
      return { ...prev, metadata: { ...prev.metadata, features } };
    });
  };

  const featuresList = [
    'Piscina', 'Academia', 'Churrasqueira', 'Portaria 24h', 
    'Elevador', 'Varanda Gourmet', 'Mobiliado', 'Ar Condicionado',
    'Pet Friendly', 'Salão de Festas', 'Sauna', 'Playground',
    'Quadra Poliesportiva', 'Espaço Gourmet', 'Brinquedoteca'
  ];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-primary/20 backdrop-blur-sm" onClick={onClose} />
      
      <div className="bg-white w-full max-w-5xl rounded-[2.5rem] shadow-luxury border border-border relative overflow-hidden animate-in fade-in zoom-in duration-300 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-8 border-b border-border flex justify-between items-center bg-muted/30 shrink-0">
          <div>
            <h2 className="text-2xl font-black text-primary mb-1">Novo Imóvel (Portal XML URBS)</h2>
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
              Passo {step} de 4: {
                step === 1 ? 'Identificação & Categoria' : 
                step === 2 ? 'Localização & Mapa' : 
                step === 3 ? 'Composição & Valores' : 'Mídia & Galeria'
              }
            </p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white rounded-xl transition-colors text-muted-foreground">
            <X size={24} />
          </button>
        </div>

        {/* Form Body */}
        <div className="flex-1 overflow-y-auto p-8">
          <form id="property-form" onSubmit={handleSubmit} className="space-y-8">
            {step === 1 && (
              <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2 col-span-full md:col-span-2">
                    <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">Vincular a Empreendimento (Opcional)</label>
                    <select
                      value={formData.development_id || ''}
                      onChange={e => {
                        const devId = e.target.value;
                        const selectedDev = developments.find(d => d.id === devId);
                        setFormData(prev => ({ 
                          ...prev, 
                          development_id: devId || null,
                          // Herança de endereço automática
                          address_street: selectedDev?.location_address || prev.address_street,
                          address_city: selectedDev?.location_city || prev.address_city,
                          address_neighborhood: selectedDev?.location_neighborhood || prev.address_neighborhood,
                        }));
                      }}
                      className="block w-full px-5 py-4 bg-muted/50 border border-transparent rounded-2xl focus:bg-white focus:border-primary/20 transition-all outline-none font-bold text-primary appearance-none"
                    >
                      <option value="">Imóvel Avulso (Sem Condomínio)</option>
                      {developments.map(d => (
                        <option key={d.id} value={d.id}>{d.name} ({d.developer?.name})</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2 col-span-full md:col-span-2">
                    <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">Título do Anúncio</label>
                    <input
                      required
                      type="text"
                      value={formData.title}
                      onChange={e => setFormData({ ...formData, title: e.target.value })}
                      className="block w-full px-5 py-4 bg-muted/50 border border-transparent rounded-2xl focus:bg-white focus:border-primary/20 transition-all outline-none font-bold text-primary"
                      placeholder="Ex: Cobertura Duplex no Setor Bueno"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">Referência (Ex: U-0030250)</label>
                    <div className="relative">
                      <Hash className="absolute left-5 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                      <input
                        type="text"
                        value={formData.reference}
                        onChange={e => setFormData({ ...formData, reference: e.target.value })}
                        className="block w-full pl-12 pr-5 py-4 bg-muted/50 border border-transparent rounded-2xl focus:bg-white focus:border-primary/20 transition-all outline-none font-bold text-primary"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">Finalidade</label>
                    <div className="flex gap-2">
                      {(['residential', 'commercial'] as const).map(c => (
                        <button
                          key={c}
                          type="button"
                          onClick={() => setFormData({ ...formData, property_category: c })}
                          className={`flex-1 py-3 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all border ${
                            formData.property_category === c ? 'bg-primary text-white border-primary' : 'bg-muted/50 text-muted-foreground border-transparent hover:border-border'
                          }`}
                        >
                          {c === 'residential' ? 'Residencial' : 'Comercial'}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">Transação</label>
                    <select
                      value={formData.transaction_type}
                      onChange={e => setFormData({ ...formData, transaction_type: e.target.value as any })}
                      className="block w-full px-5 py-3 bg-muted/50 border border-transparent rounded-2xl focus:bg-white focus:border-primary/20 transition-all outline-none font-bold text-primary appearance-none"
                    >
                      <option value="sale">Venda</option>
                      <option value="rent">Locação</option>
                      <option value="both">Ambos</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">Tipo de Imóvel</label>
                    <select
                      value={formData.type}
                      onChange={e => setFormData({ ...formData, type: e.target.value })}
                      className="block w-full px-5 py-3 bg-muted/50 border border-transparent rounded-2xl focus:bg-white focus:border-primary/20 transition-all outline-none font-bold text-primary appearance-none"
                    >
                      <option>Apartamento</option>
                      <option>Casa / Sobrado</option>
                      <option>Terreno / Lote</option>
                      <option>Flat</option>
                      <option>Loft</option>
                      <option>Penthouse</option>
                      <option>Sala Comercial</option>
                    </select>
                  </div>

                  <div className="space-y-2 col-span-full">
                    <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">Descrição Completa</label>
                    <textarea
                      rows={4}
                      value={formData.description}
                      onChange={e => setFormData({ ...formData, description: e.target.value })}
                      className="block w-full px-5 py-4 bg-muted/50 border border-transparent rounded-2xl focus:bg-white focus:border-primary/20 transition-all outline-none font-medium text-primary text-sm"
                      placeholder="Detalhes sobre o imóvel, diferenciais e localização..."
                    />
                  </div>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">Endereço</label>
                    <input
                      type="text"
                      value={formData.address_street}
                      onChange={e => setFormData({ ...formData, address_street: e.target.value })}
                      className="block w-full px-5 py-4 bg-muted/50 border border-transparent rounded-2xl focus:bg-white focus:border-primary/20 transition-all outline-none font-bold text-primary"
                      placeholder="Rua, Avenida..."
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">Número</label>
                      <input
                        type="text"
                        value={formData.address_number}
                        onChange={e => setFormData({ ...formData, address_number: e.target.value })}
                        className="block w-full px-5 py-4 bg-muted/50 border border-transparent rounded-2xl focus:bg-white focus:border-primary/20 transition-all outline-none font-bold text-primary"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">CEP</label>
                      <input
                        type="text"
                        value={formData.address_zip_code}
                        onChange={e => {
                          const val = e.target.value;
                          setFormData({ ...formData, address_zip_code: val });
                          if (val.replace(/\D/g, '').length === 8) fetchCep(val);
                        }}
                        className="block w-full px-5 py-4 bg-muted/50 border border-transparent rounded-2xl focus:bg-white focus:border-primary/20 transition-all outline-none font-bold text-primary"
                        placeholder="00000-000"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">Bairro</label>
                    <input
                      type="text"
                      value={formData.address_neighborhood}
                      onChange={e => setFormData({ ...formData, address_neighborhood: e.target.value })}
                      className="block w-full px-5 py-4 bg-muted/50 border border-transparent rounded-2xl focus:bg-white focus:border-primary/20 transition-all outline-none font-bold text-primary"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">Cidade</label>
                      <input
                        type="text"
                        value={formData.address_city}
                        onChange={e => setFormData({ ...formData, address_city: e.target.value })}
                        className="block w-full px-5 py-4 bg-muted/50 border border-transparent rounded-2xl focus:bg-white focus:border-primary/20 transition-all outline-none font-bold text-primary"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">UF</label>
                      <input
                        type="text"
                        value={formData.address_state}
                        onChange={e => setFormData({ ...formData, address_state: e.target.value })}
                        className="block w-full px-5 py-4 bg-muted/50 border border-transparent rounded-2xl focus:bg-white focus:border-primary/20 transition-all outline-none font-bold text-primary"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">Latitude</label>
                    <input
                      type="text"
                      value={formData.latitude}
                      onChange={e => setFormData({ ...formData, latitude: e.target.value })}
                      className="block w-full px-5 py-4 bg-muted/50 border border-transparent rounded-2xl focus:bg-white focus:border-primary/20 transition-all outline-none font-medium text-primary"
                      placeholder="-16.704858"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">Longitude</label>
                    <input
                      type="text"
                      value={formData.longitude}
                      onChange={e => setFormData({ ...formData, longitude: e.target.value })}
                      className="block w-full px-5 py-4 bg-muted/50 border border-transparent rounded-2xl focus:bg-white focus:border-primary/20 transition-all outline-none font-medium text-primary"
                      placeholder="-49.251057"
                    />
                  </div>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
                {/* Valores */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  <PriceInput label="Valor Venda" value={formData.price} onChange={v => setFormData({ ...formData, price: v })} />
                  <PriceInput label="Valor Aluguel" value={formData.price_rent} onChange={v => setFormData({ ...formData, price_rent: v })} />
                  <PriceInput label="Condomínio" value={formData.price_condo} onChange={v => setFormData({ ...formData, price_condo: v })} />
                  <PriceInput label="IPTU Anual" value={formData.price_iptu} onChange={v => setFormData({ ...formData, price_iptu: v })} />
                </div>

                {/* Composição */}
                <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
                  <SpecInput icon={<BedDouble size={16} />} label="Quartos" value={formData.rooms} onChange={v => setFormData({ ...formData, rooms: v })} />
                  <SpecInput icon={<Activity size={16} />} label="Suítes" value={formData.suites} onChange={v => setFormData({ ...formData, suites: v })} />
                  <SpecInput icon={<Bath size={16} />} label="Banheiros" value={formData.bathrooms} onChange={v => setFormData({ ...formData, bathrooms: v })} />
                  <SpecInput icon={<Car size={16} />} label="Vagas" value={formData.parking_spaces} onChange={v => setFormData({ ...formData, parking_spaces: v })} />
                  <SpecInput icon={<Square size={16} />} label="Área Útil" value={formData.area_useful} onChange={v => setFormData({ ...formData, area_useful: v })} />
                  <SpecInput icon={<Square size={16} />} label="Área Total" value={formData.area_total} onChange={v => setFormData({ ...formData, area_total: v })} />
                </div>

                {/* Padrão & Destaque */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">Padrão de Construção</label>
                    <div className="flex gap-2">
                      {(['economic', 'medium', 'high_end'] as const).map(p => (
                        <button
                          key={p}
                          type="button"
                          onClick={() => setFormData({ ...formData, pattern: p })}
                          className={`flex-1 py-3 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all border ${
                            formData.pattern === p ? 'bg-primary text-white border-primary shadow-md' : 'bg-muted/50 text-muted-foreground border-transparent hover:border-border'
                          }`}
                        >
                          {p === 'economic' ? 'Econômico' : p === 'medium' ? 'Médio' : 'Luxo'}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center gap-4 pt-6">
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, is_highlight: !formData.is_highlight })}
                      className={`flex items-center gap-3 px-6 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all border ${
                        formData.is_highlight ? 'bg-accent/10 text-accent border-accent/20' : 'bg-muted/50 text-muted-foreground border-transparent'
                      }`}
                    >
                      <Tag size={16} /> Imóvel em Destaque
                    </button>

                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, accepts_financing: !formData.accepts_financing })}
                      className={`flex items-center gap-3 px-6 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all border ${
                        formData.accepts_financing ? 'bg-green-50 text-green-700 border-green-200' : 'bg-muted/50 text-muted-foreground border-transparent'
                      }`}
                    >
                      <DollarSign size={16} /> Aceita Financiamento
                    </button>

                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, accepts_exchange: !formData.accepts_exchange })}
                      className={`flex items-center gap-3 px-6 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all border ${
                        formData.accepts_exchange ? 'bg-blue-50 text-blue-700 border-blue-200' : 'bg-muted/50 text-muted-foreground border-transparent'
                      }`}
                    >
                      <RefreshCw size={16} /> Aceita Permuta
                    </button>
                  </div>
                </div>
              </div>
            )}

            {step === 4 && (
              <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">Link do Vídeo (YouTube)</label>
                    <div className="relative">
                      <Video className="absolute left-5 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                      <input
                        type="text"
                        value={formData.video_url}
                        onChange={e => setFormData({ ...formData, video_url: e.target.value })}
                        className="block w-full pl-12 pr-5 py-4 bg-muted/50 border border-transparent rounded-2xl focus:bg-white focus:border-primary/20 transition-all outline-none font-medium text-primary"
                        placeholder="https://..."
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">Link Tour 360º</label>
                    <div className="relative">
                      <Eye className="absolute left-5 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                      <input
                        type="text"
                        value={formData.tour_360_url}
                        onChange={e => setFormData({ ...formData, tour_360_url: e.target.value })}
                        className="block w-full pl-12 pr-5 py-4 bg-muted/50 border border-transparent rounded-2xl focus:bg-white focus:border-primary/20 transition-all outline-none font-medium text-primary"
                        placeholder="https://..."
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">Características & Lazer</label>
                  <div className="flex flex-wrap gap-2">
                    {featuresList.map(feature => (
                      <button
                        key={feature}
                        type="button"
                        onClick={() => toggleFeature(feature)}
                        className={`px-4 py-2 rounded-full text-xs font-bold transition-all border ${
                          formData.metadata.features.includes(feature)
                            ? 'bg-primary/10 text-primary border-primary/20'
                            : 'bg-muted/50 text-muted-foreground border-transparent hover:border-border'
                        }`}
                      >
                        {feature}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  {/* Upload Trigger */}
                  <label className={`
                    aspect-square rounded-[2rem] border-2 border-dashed border-border flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-muted/30 transition-all group
                    ${uploading ? 'pointer-events-none opacity-50' : ''}
                  `}>
                    <input type="file" multiple accept="image/*" onChange={handleImageUpload} className="hidden" />
                    {uploading ? <Loader2 className="animate-spin text-primary" size={32} /> : (
                      <>
                        <div className="p-3 bg-primary/5 rounded-2xl text-primary group-hover:scale-110 transition-transform">
                          <Plus size={24} />
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Adicionar</span>
                      </>
                    )}
                  </label>

                  {/* Image Previews */}
                  {formData.images.map((url, i) => (
                    <div key={i} className="relative aspect-square rounded-[2rem] overflow-hidden group border border-border">
                      <img src={url} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                        <button 
                          type="button"
                          onClick={() => setFormData({ ...formData, main_image: url })}
                          className={`p-2 rounded-xl transition-all ${formData.main_image === url ? 'bg-accent text-white' : 'bg-white text-primary hover:bg-accent hover:text-white'}`}
                        >
                          <ImageIcon size={18} />
                        </button>
                        <button 
                          type="button"
                          onClick={() => removeImage(url)}
                          className="p-2 bg-white text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                      {formData.main_image === url && (
                        <div className="absolute top-3 left-3 bg-accent text-white text-[8px] font-black px-2 py-1 rounded-full uppercase tracking-widest shadow-lg">
                          Capa
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </form>
        </div>

        {/* Footer */}
        <div className="p-8 border-t border-border flex items-center justify-between bg-muted/30 shrink-0">
          <div className="flex items-center gap-2 text-green-600">
            <CheckCircle2 size={18} />
            <span className="text-[10px] font-black uppercase tracking-widest">Feed Portal Sincronizado</span>
          </div>
          
          <div className="flex gap-4">
            {step > 1 && (
              <button
                type="button"
                onClick={() => setStep(step - 1)}
                className="px-8 py-4 rounded-2xl font-bold text-sm text-muted-foreground hover:bg-white transition-all"
              >
                Voltar
              </button>
            )}
            
            {step < 4 ? (
              <button
                type="button"
                onClick={() => setStep(step + 1)}
                className="bg-primary text-white px-10 py-4 rounded-2xl font-black text-sm hover:bg-primary-light transition-all shadow-premium"
              >
                Próximo
              </button>
            ) : (
              <button
                form="property-form"
                type="submit"
                disabled={loading || uploading}
                className="bg-accent text-white px-12 py-4 rounded-2xl font-black text-sm hover:bg-yellow-600 transition-all shadow-premium flex items-center gap-2"
              >
                {loading ? <Loader2 className="animate-spin" size={20} /> : 'Salvar no Habita.vc'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const PriceInput = ({ label, value, onChange }: { label: string; value: number; onChange: (v: number) => void }) => (
  <div className="space-y-2">
    <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">{label}</label>
    <div className="relative">
      <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-primary/40" size={14} />
      <input
        type="number"
        value={value}
        onChange={e => onChange(Number(e.target.value))}
        className="block w-full pl-10 pr-4 py-3 bg-muted/50 border border-transparent rounded-xl focus:bg-white focus:border-primary/20 transition-all outline-none font-bold text-primary"
      />
    </div>
  </div>
);

const SpecInput = ({ icon, label, value, onChange }: { icon: React.ReactNode; label: string; value: number; onChange: (v: number) => void }) => (
  <div className="bg-muted/50 p-4 rounded-2xl border border-transparent hover:border-primary/10 transition-all text-center">
    <div className="flex items-center justify-center gap-1.5 mb-2 text-muted-foreground">
      {icon}
      <span className="text-[10px] font-black uppercase tracking-widest">{label}</span>
    </div>
    <input
      type="number"
      value={value}
      onChange={e => onChange(Number(e.target.value))}
      className="w-full bg-transparent text-center font-black text-primary text-lg outline-none"
    />
  </div>
);
