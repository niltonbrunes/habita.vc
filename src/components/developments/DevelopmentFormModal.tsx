'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { 
  X, 
  Upload, 
  Image as ImageIcon, 
  Plus, 
  Trash2, 
  Save, 
  Building2, 
  MapPin, 
  DollarSign, 
  Calendar,
  FileText,
  FileDown,
  Activity
} from 'lucide-react';
import { DevelopmentsService } from '@/services/developments.service';
import { DevelopersService } from '@/services/developers.service';
import { StorageService } from '@/services/storage.service';
import { Development, Developer } from '@/types/database';

interface DevelopmentFormModalProps {
  onClose: () => void;
  onSuccess: () => void;
  development?: Development;
}

export function DevelopmentFormModal({ onClose, onSuccess, development }: DevelopmentFormModalProps) {
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [developers, setDevelopers] = useState<Developer[]>([]);
  
  const [formData, setFormData] = useState({
    name: development?.name || '',
    tagline: development?.tagline || '',
    description: development?.description || '',
    developer_id: development?.developer_id || '',
    location_address: development?.location_address || '',
    location_city: development?.location_city || 'Goiânia',
    location_neighborhood: (development as any)?.location_neighborhood || '',
    price_starting_at: development?.price_starting_at || 0,
    commercial_stage: development?.commercial_stage || 'pre_launch',
    image_url: development?.image_url || '',
    gallery: development?.gallery || [] as string[],
    features: development?.features || [] as string[],
    plans_url: development?.plans_url || '',
    price_table_url: development?.price_table_url || '',
    launch_date: development?.launch_date || '',
    slug: (development as any)?.slug || '',
  });

  const generateSlug = (text: string) => {
    return text
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/--+/g, '-')
      .trim();
  };

  useEffect(() => {
    const fetchDevelopers = async () => {
      try {
        const data = await DevelopersService.getAll();
        setDevelopers(data);
        if (!formData.developer_id && data.length > 0) {
          setFormData(prev => ({ ...prev, developer_id: data[0].id }));
        }
      } catch (err) {
        console.error('Erro ao buscar incorporadoras:', err);
      }
    };
    fetchDevelopers();
  }, []);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: 'image_url' | 'plans_url' | 'price_table_url' | 'gallery') => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const url = await StorageService.uploadFile(file, 'property-images', 'developments');
      if (field === 'gallery') {
        setFormData(prev => ({ ...prev, gallery: [...prev.gallery, url] }));
      } else {
        setFormData(prev => ({ ...prev, [field]: url }));
      }
    } catch (err) {
      console.error('Erro no upload:', err);
      alert('Falha no upload do arquivo.');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const slug = formData.slug || generateSlug(formData.name);
      const dataToSave = { 
        ...formData, 
        slug,
        launch_date: formData.launch_date || null,
        price_starting_at: Number(formData.price_starting_at) || 0,
        developer_id: formData.developer_id || null
      };

      if (development?.id) {
        await DevelopmentsService.update(development.id, dataToSave);
      } else {
        await DevelopmentsService.create(dataToSave);
      }
      onSuccess();
      onClose();
    } catch (err) {
      console.error('Erro ao salvar empreendimento:', err);
      alert('Erro ao salvar os dados.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-blue-primary/20 backdrop-blur-sm" onClick={onClose} />
      
      <div className="bg-surface w-full max-w-5xl rounded-xl shadow-card border border-border relative overflow-hidden animate-in fade-in zoom-in duration-300 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-8 border-b border-border flex justify-between items-center bg-muted/30 shrink-0">
          <div>
            <h2 className="text-xl font-bold text-heading mb-1">
              {development ? 'Editar Empreendimento' : 'Novo Empreendimento'}
            </h2>
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
              Área do Incorporador • Gestão de Lançamentos
            </p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-surface rounded-xl transition-colors text-muted-foreground">
            <X size={24} />
          </button>
        </div>

        {/* Form Body */}
        <div className="flex-1 overflow-y-auto p-8">
          <form id="dev-form" onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              
              {/* Coluna 1: Informações Básicas */}
              <div className="space-y-6">
                <h3 className="text-sm font-black text-primary uppercase tracking-[0.2em] flex items-center gap-2">
                  <Building2 size={16} /> Identificação
                </h3>
                
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">Nome do Empreendimento</label>
                    <input
                      required
                      type="text"
                      value={formData.name}
                      onChange={e => setFormData({ ...formData, name: e.target.value })}
                      className="block w-full px-5 py-4 bg-muted/50 border border-transparent rounded-2xl focus:bg-surface focus:border-primary/20 transition-all outline-none font-bold text-primary"
                      placeholder="Ex: ParqVille Cerejeira"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">Slug SEO (URL amigável)</label>
                    <input
                      type="text"
                      value={formData.slug}
                      onChange={e => setFormData({ ...formData, slug: e.target.value })}
                      className="block w-full px-5 py-4 bg-muted/50 border border-transparent rounded-2xl focus:bg-surface focus:border-primary/20 transition-all outline-none font-medium text-primary text-xs"
                      placeholder="auto-gerado-se-vazio"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">Slogan / Chamada</label>
                    <input
                      type="text"
                      value={formData.tagline}
                      onChange={e => setFormData({ ...formData, tagline: e.target.value })}
                      className="block w-full px-5 py-4 bg-muted/50 border border-transparent rounded-2xl focus:bg-surface focus:border-primary/20 transition-all outline-none font-bold text-primary"
                      placeholder="Ex: O seu refúgio na cidade"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">Construtora</label>
                      <select
                        required
                        value={formData.developer_id}
                        onChange={e => setFormData({ ...formData, developer_id: e.target.value })}
                        className="block w-full px-5 py-4 bg-muted/50 border border-transparent rounded-2xl focus:bg-surface focus:border-primary/20 transition-all outline-none font-bold text-primary"
                      >
                        {developers.map(d => (
                          <option key={d.id} value={d.id}>{d.name}</option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">Estágio da Obra</label>
                      <select
                        value={formData.commercial_stage}
                        onChange={e => setFormData({ ...formData, commercial_stage: e.target.value as any })}
                        className="block w-full px-5 py-4 bg-muted/50 border border-transparent rounded-2xl focus:bg-surface focus:border-primary/20 transition-all outline-none font-bold text-primary"
                      >
                        <option value="pre_launch">Pré-Lançamento</option>
                        <option value="launch">Lançamento</option>
                        <option value="construction">Em Construção</option>
                        <option value="ready">Pronto para Morar</option>
                      </select>
                    </div>
                  </div>
                </div>

                <h3 className="text-sm font-black text-primary uppercase tracking-[0.2em] flex items-center gap-2 pt-4">
                  <MapPin size={16} /> Localização
                </h3>
                
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">Endereço Completo</label>
                    <input
                      required
                      type="text"
                      value={formData.location_address}
                      onChange={e => setFormData({ ...formData, location_address: e.target.value })}
                      className="block w-full px-5 py-4 bg-muted/50 border border-transparent rounded-2xl focus:bg-surface focus:border-primary/20 transition-all outline-none font-bold text-primary"
                      placeholder="Ex: Av. T-10, 123"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">Bairro</label>
                      <input
                        type="text"
                        value={formData.location_neighborhood}
                        onChange={e => setFormData({ ...formData, location_neighborhood: e.target.value })}
                        className="block w-full px-5 py-4 bg-muted/50 border border-transparent rounded-2xl focus:bg-surface focus:border-primary/20 transition-all outline-none font-bold text-primary"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">Cidade</label>
                      <input
                        type="text"
                        value={formData.location_city}
                        onChange={e => setFormData({ ...formData, location_city: e.target.value })}
                        className="block w-full px-5 py-4 bg-muted/50 border border-transparent rounded-2xl focus:bg-surface focus:border-primary/20 transition-all outline-none font-bold text-primary"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Coluna 2: Documentos e Mídia */}
              <div className="space-y-6">
                <h3 className="text-sm font-black text-primary uppercase tracking-[0.2em] flex items-center gap-2">
                  <FileText size={16} /> Documentos & Tabelas
                </h3>

                <div className="grid grid-cols-1 gap-4">
                  {/* Upload de Plantas */}
                  <div className={`p-6 rounded-xl border-2 border-dashed transition-all flex flex-col items-center justify-center gap-3 ${
                    formData.plans_url ? 'border-green-200 bg-green-50' : 'border-muted-foreground/20 bg-muted/30'
                  }`}>
                    <FileDown size={32} className={formData.plans_url ? 'text-green-500' : 'text-muted-foreground'} />
                    <div className="text-center">
                      <p className="text-xs font-black text-primary uppercase tracking-widest">Planta do Empreendimento</p>
                      <p className="text-[10px] text-muted-foreground mt-1">{formData.plans_url ? 'Arquivo Carregado' : 'PDF ou Imagem da Planta'}</p>
                    </div>
                    <label className="px-4 py-2 bg-surface rounded-xl text-[10px] font-black text-primary shadow-sm hover:shadow-md transition-all cursor-pointer border border-border uppercase tracking-widest">
                      {uploading ? 'Enviando...' : formData.plans_url ? 'Alterar Arquivo' : 'Escolher Arquivo'}
                      <input type="file" className="hidden" accept=".pdf,image/*" onChange={e => handleFileUpload(e, 'plans_url')} disabled={uploading} />
                    </label>
                  </div>

                  {/* Upload de Tabela de Preços */}
                  <div className={`p-6 rounded-xl border-2 border-dashed transition-all flex flex-col items-center justify-center gap-3 ${
                    formData.price_table_url ? 'border-blue-200 bg-blue-50' : 'border-muted-foreground/20 bg-muted/30'
                  }`}>
                    <Activity size={32} className={formData.price_table_url ? 'text-blue-500' : 'text-muted-foreground'} />
                    <div className="text-center">
                      <p className="text-xs font-black text-primary uppercase tracking-widest">Tabela de Preços</p>
                      <p className="text-[10px] text-muted-foreground mt-1">{formData.price_table_url ? 'Arquivo Carregado' : 'Excel ou PDF com Valores'}</p>
                    </div>
                    <label className="px-4 py-2 bg-surface rounded-xl text-[10px] font-black text-primary shadow-sm hover:shadow-md transition-all cursor-pointer border border-border uppercase tracking-widest">
                      {uploading ? 'Enviando...' : formData.price_table_url ? 'Alterar Arquivo' : 'Escolher Arquivo'}
                      <input type="file" className="hidden" accept=".pdf,.xls,.xlsx,image/*" onChange={e => handleFileUpload(e, 'price_table_url')} disabled={uploading} />
                    </label>
                  </div>
                </div>

                <h3 className="text-sm font-black text-primary uppercase tracking-[0.2em] flex items-center gap-2 pt-4">
                  <ImageIcon size={16} /> Imagens & Galeria
                </h3>
                
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">Imagem de Capa (Principal)</label>
                    <div className="flex gap-4">
                      <div className="w-24 h-24 rounded-2xl bg-muted overflow-hidden border border-border flex items-center justify-center flex-shrink-0">
                        {formData.image_url ? (
                          <Image src={formData.image_url} alt="" fill className="w-full h-full object-cover" sizes="200px" />
                        ) : (
                          <ImageIcon className="text-muted-foreground" size={24} />
                        )}
                      </div>
                      <div className="flex-1 space-y-2">
                        <input
                          type="text"
                          value={formData.image_url}
                          onChange={e => setFormData({ ...formData, image_url: e.target.value })}
                          className="block w-full px-4 py-2.5 bg-muted/50 border border-transparent rounded-xl focus:bg-surface focus:border-primary/20 transition-all outline-none font-bold text-xs"
                          placeholder="Cole a URL da imagem ou use o botão abaixo"
                        />
                        <label className="inline-flex items-center gap-2 px-4 py-2 bg-blue-primary text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-primary-light transition-all cursor-pointer">
                          <Upload size={14} /> {uploading ? 'Enviando...' : 'Upload da Capa'}
                          <input type="file" className="hidden" accept="image/*" onChange={e => handleFileUpload(e, 'image_url')} disabled={uploading} />
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

            </div>

            <div className="space-y-4">
               <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">Descrição do Empreendimento</label>
               <textarea
                 rows={4}
                 value={formData.description}
                 onChange={e => setFormData({ ...formData, description: e.target.value })}
                 className="block w-full px-5 py-4 bg-muted/50 border border-transparent rounded-3xl focus:bg-surface focus:border-primary/20 transition-all outline-none font-bold text-primary resize-none"
                 placeholder="Descreva os diferenciais, áreas de lazer e proposta do projeto..."
               />
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="p-8 border-t border-border bg-muted/30 flex justify-end gap-4 shrink-0">
          <button
            onClick={onClose}
            className="px-8 py-4 rounded-2xl text-xs font-black uppercase tracking-widest text-muted-foreground hover:text-primary transition-all"
          >
            Cancelar
          </button>
          <button
            form="dev-form"
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 bg-blue-primary text-white px-10 py-4 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-blue-primary-light transition-all shadow-card disabled:opacity-50"
          >
            {loading ? (
              <RefreshCw className="animate-spin" size={16} />
            ) : (
              <Save size={16} />
            )}
            Salvar Empreendimento
          </button>
        </div>
      </div>
    </div>
  );
}

const RefreshCw = ({ className, size }: { className?: string, size?: number }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width={size || 24} 
    height={size || 24} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/>
    <path d="M3 3v5h5"/>
    <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16"/>
    <path d="M16 16h5v5"/>
  </svg>
);
