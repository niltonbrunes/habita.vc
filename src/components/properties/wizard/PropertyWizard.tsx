'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { PropertiesService } from '@/services/properties.service';
import { StorageService } from '@/services/storage.service';
import { PropertyOwnersService } from '@/services/property-owners.service';
import { PropertyDocumentsService } from '@/services/property-documents.service';
import { WizardStepper, WizardStep } from './WizardStepper';
import { ImageItem } from './ImageUploader';
import { DocItem } from './steps/DocumentsStep';
import { PropertyOwner } from '@/types/database';
import { BasicInfoStep } from './steps/BasicInfoStep';
import { DevelopmentLinkStep } from './steps/DevelopmentLinkStep';
import { FinancialStep } from './steps/FinancialStep';
import { FeaturesStep } from './steps/FeaturesStep';
import { MediaStep } from './steps/MediaStep';
import { OwnersStep } from './steps/OwnersStep';
import { DocumentsStep } from './steps/DocumentsStep';
import { SeoStep } from './steps/SeoStep';
import {
  FileText, MapPin, DollarSign, LayoutGrid,
  Camera, Users, FileCheck2, Globe,
  ChevronLeft, ChevronRight, Loader2, CheckCircle2
} from 'lucide-react';

export interface WizardFormData {
  // Basic
  type: string;
  transaction_type: 'sale' | 'rent' | 'both';
  title: string;
  description: string;
  reference?: string;
  status: 'available' | 'reserved' | 'sold';
  pattern: 'economic' | 'medium' | 'high_end';
  // Address
  development_id?: string;
  address_street: string;
  address_number?: string;
  address_complement?: string;
  address_neighborhood?: string;
  address_city: string;
  address_state: string;
  address_zip_code?: string;
  // Financial
  price: number;
  price_condo?: number;
  price_iptu?: number;
  price_rent?: number;
  commission_estimated_percent: number;
  accepts_financing: boolean;
  accepts_exchange: boolean;
  // Features
  rooms: number;
  suites: number;
  bathrooms: number;
  parking_spaces: number;
  area_useful: number;
  area_total?: number;
  metadata: Record<string, any>;
  // SEO
  slug?: string;
  meta_title?: string;
  meta_description?: string;
}

const INITIAL_DATA: WizardFormData = {
  type: 'Apartamento',
  transaction_type: 'sale',
  title: '',
  description: '',
  status: 'available',
  pattern: 'medium',
  address_street: '',
  address_city: '',
  address_state: 'GO',
  price: 0,
  commission_estimated_percent: 6,
  accepts_financing: true,
  accepts_exchange: false,
  rooms: 0,
  suites: 0,
  bathrooms: 0,
  parking_spaces: 0,
  area_useful: 0,
  metadata: {},
};

const STEPS: WizardStep[] = [
  { id: 0, label: 'Básico',         icon: <FileText size={16} /> },
  { id: 1, label: 'Localização',    icon: <MapPin size={16} /> },
  { id: 2, label: 'Financeiro',     icon: <DollarSign size={16} /> },
  { id: 3, label: 'Características',icon: <LayoutGrid size={16} /> },
  { id: 4, label: 'Fotos',          icon: <Camera size={16} /> },
  { id: 5, label: 'Proprietários',  icon: <Users size={16} /> },
  { id: 6, label: 'Documentos',     icon: <FileCheck2 size={16} /> },
  { id: 7, label: 'SEO',            icon: <Globe size={16} /> },
];

export function PropertyWizard() {
  const { user } = useAuth();
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [data, setData] = useState<WizardFormData>(INITIAL_DATA);
  const [images, setImages] = useState<ImageItem[]>([]);
  const [owners, setOwners] = useState<Omit<PropertyOwner, 'id' | 'created_at' | 'property_id'>[]>([]);
  const [documents, setDocuments] = useState<DocItem[]>([]);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const patch = (p: Partial<WizardFormData>) => setData(prev => ({ ...prev, ...p }));

  const canNext = () => {
    if (step === 0) return data.title.trim().length > 5 && data.type;
    if (step === 2) return data.price > 0;
    if (step === 3) return data.area_useful > 0;
    return true;
  };

  const handleSubmit = async () => {
    if (!user) return;
    setSaving(true);
    setError(null);

    try {
      // 1. Build DB-safe payload — only columns that exist in the schema
      const {
        // Extract wizard-only / non-DB fields
        commission_estimated_percent,
        meta_title,
        meta_description,
        rooms,
        suites,
        bathrooms,
        parking_spaces,
        area_useful,
        area_total,
        metadata: rawMetadata,
        ...dbFields
      } = data;

      const propertyPayload: any = {
        ...dbFields,
        registered_by_id: user.id,
        property_category: 'residential',
        // Numeric feature columns (these DO exist in the schema)
        rooms,
        suites,
        bathrooms,
        parking_spaces,
        area_useful,
        area_total: area_total || area_useful,
        images: [],
        main_image: null,
        is_highlight: false,
        is_unit_of_development: !!data.development_id,
        // Store commission + extras inside metadata JSON
        metadata: {
          ...rawMetadata,
          commission_estimated_percent,
          // Mirror counters into metadata for legacy compatibility
          rooms,
          bathrooms,
          area: area_useful,
          parking: parking_spaces,
        },
      };

      const created = await PropertiesService.create(propertyPayload);


      // 2. Upload images with compression
      if (images.length > 0) {
        const uploadedUrls: string[] = [];
        for (const img of images) {
          if (img.file) {
            const url = await StorageService.uploadPropertyImage(img.file, created.id);
            uploadedUrls.push(url);
          } else if (img.url) {
            uploadedUrls.push(img.url);
          }
        }
        const coverImg = images.find(i => i.isCover);
        const coverIdx = coverImg ? images.indexOf(coverImg) : 0;
        await PropertiesService.update(created.id, {
          images: uploadedUrls,
          main_image: uploadedUrls[coverIdx] || uploadedUrls[0],
        });
      }

      // 3. Save owners
      if (owners.length > 0) {
        await PropertyOwnersService.replaceAll(created.id, owners);
      }

      // 4. Upload documents
      for (const doc of documents) {
        if (doc.file) {
          await PropertyDocumentsService.upload(created.id, doc.file, doc.doc_type as any);
        }
      }

      setSaved(true);
      setTimeout(() => router.push(`/crmhabita/imoveis/${created.id}`), 1500);
    } catch (err: any) {
      console.error(err);
      setError(err?.message || 'Erro ao salvar o imóvel. Tente novamente.');
    } finally {
      setSaving(false);
    }
  };

  if (saved) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-6 animate-in zoom-in duration-500">
        <div className="w-24 h-24 bg-green-100 text-green-500 rounded-full flex items-center justify-center">
          <CheckCircle2 size={48} />
        </div>
        <h2 className="text-3xl font-black text-primary">Imóvel cadastrado!</h2>
        <p className="text-muted-foreground font-medium">Redirecionando para a ficha do imóvel...</p>
        <Loader2 className="animate-spin text-primary" size={24} />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <WizardStepper steps={STEPS} currentStep={step} onGoTo={setStep} />

      {/* Step Content */}
      <div className="bg-white rounded-[2.5rem] border-2 border-border shadow-premium p-8 md:p-12 min-h-[500px]">
        {step === 0 && <BasicInfoStep data={data} onChange={patch} />}
        {step === 1 && <DevelopmentLinkStep data={data} onChange={patch} />}
        {step === 2 && <FinancialStep data={data} onChange={patch} />}
        {step === 3 && <FeaturesStep data={data} onChange={patch} />}
        {step === 4 && <MediaStep images={images} onChange={setImages} />}
        {step === 5 && <OwnersStep owners={owners} onChange={setOwners} />}
        {step === 6 && <DocumentsStep documents={documents} onChange={setDocuments} />}
        {step === 7 && <SeoStep data={data} onChange={patch} />}
      </div>

      {/* Error */}
      {error && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-2xl text-red-600 text-sm font-bold text-center">
          {error}
        </div>
      )}

      {/* Navigation */}
      <div className="flex items-center justify-between mt-8 gap-4">
        <button
          type="button"
          onClick={() => setStep(s => s - 1)}
          disabled={step === 0}
          className="flex items-center gap-2 px-8 py-4 rounded-2xl border-2 border-border font-black text-primary hover:bg-muted transition-all disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <ChevronLeft size={20} /> Anterior
        </button>

        <div className="flex items-center gap-1">
          {STEPS.map((_, i) => (
            <div key={i} className={`h-1.5 rounded-full transition-all ${i === step ? 'w-8 bg-primary' : i < step ? 'w-3 bg-primary/40' : 'w-3 bg-border'}`} />
          ))}
        </div>

        {step < STEPS.length - 1 ? (
          <button
            type="button"
            onClick={() => setStep(s => s + 1)}
            disabled={!canNext()}
            className="flex items-center gap-2 px-8 py-4 rounded-2xl bg-primary text-white font-black hover:bg-primary-light transition-all shadow-premium disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Próximo <ChevronRight size={20} />
          </button>
        ) : (
          <button
            type="button"
            onClick={handleSubmit}
            disabled={saving}
            className="flex items-center gap-2 px-10 py-4 rounded-2xl bg-accent text-white font-black hover:bg-yellow-600 transition-all shadow-luxury disabled:opacity-50"
          >
            {saving ? <><Loader2 size={20} className="animate-spin" /> Salvando...</> : <><CheckCircle2 size={20} /> Publicar Imóvel</>}
          </button>
        )}
      </div>
    </div>
  );
}
