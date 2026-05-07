'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { PeopleService } from '@/services/people.service';
import { Person, PersonType, PersonContact, PersonAddress, PersonDocument, PersonResponsible, PersonRole, RelationshipStatus } from '@/types/people';
import { WizardStepper, WizardStep } from '@/components/properties/wizard/WizardStepper'; // Reuse the generic stepper
import { User, MapPin, Briefcase, FileCheck2, ChevronLeft, ChevronRight, Loader2, CheckCircle2 } from 'lucide-react';
import { BasicInfoStep } from './steps/BasicInfoStep';
import { ContactsStep } from './steps/ContactsStep';
import { ClassificationStep } from './steps/ClassificationStep';
// import { DocumentsStep } from './steps/DocumentsStep'; // Will create soon

export interface PeopleWizardData {
  person_type: PersonType;
  name: string;
  fantasy_name: string;
  document_id: string;
  rg_ie: string;
  im: string;
  birth_date_or_foundation: string;
  marital_status: string;
  nationality: string;
  profession: string;
  roles: PersonRole[];
  relationship_status: RelationshipStatus;
  commercial_info: any;
  contacts: PersonContact[];
  addresses: PersonAddress[];
  documents: PersonDocument[];
  responsibles: PersonResponsible[];
  metadata: any;
}

const INITIAL_DATA: PeopleWizardData = {
  person_type: 'PF',
  name: '',
  fantasy_name: '',
  document_id: '',
  rg_ie: '',
  im: '',
  birth_date_or_foundation: '',
  marital_status: '',
  nationality: 'Brasileiro(a)',
  profession: '',
  roles: ['lead'],
  relationship_status: 'novo',
  commercial_info: {},
  contacts: [{ id: '1', type: 'whatsapp', value: '', is_primary: true }],
  addresses: [],
  documents: [],
  responsibles: [],
  metadata: {},
};

const STEPS: WizardStep[] = [
  { id: 0, label: 'Básico', icon: <User size={16} /> },
  { id: 1, label: 'Contatos', icon: <MapPin size={16} /> },
  { id: 2, label: 'Classificação', icon: <Briefcase size={16} /> },
  { id: 3, label: 'Documentos', icon: <FileCheck2 size={16} /> },
];

export function PeopleWizard() {
  const { user } = useAuth();
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [data, setData] = useState<PeopleWizardData>(INITIAL_DATA);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const patch = (p: Partial<PeopleWizardData>) => setData(prev => ({ ...prev, ...p }));

  const canNext = () => {
    if (step === 0) return data.name.trim().length > 2;
    if (step === 1) return data.contacts.some(c => c.value.trim().length > 0);
    return true;
  };

  const handleSubmit = async () => {
    if (!user) return;
    setSaving(true);
    setError(null);

    try {
      // Sanitização de campos para o PostgreSQL (strings vazias -> null)
      const sanitizedData = {
        ...data,
        birth_date_or_foundation: data.birth_date_or_foundation || null,
        document_id: data.document_id || null,
        rg_ie: data.rg_ie || null,
        im: data.im || null,
        registered_by_id: user.id,
        assigned_to_id: user.id,
      };

      const created = await PeopleService.create(sanitizedData);

      setSaved(true);
      setTimeout(() => router.push(`/crmhabita/pessoas/${created.id}`), 1500);
    } catch (err: any) {
      console.error(err);
      setError(err?.message || 'Erro ao salvar a pessoa. Verifique se o CPF/CNPJ já existe.');
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
        <h2 className="text-3xl font-black text-primary">Cadastro concluído!</h2>
        <p className="text-muted-foreground font-medium">Redirecionando para a ficha do cliente...</p>
        <Loader2 className="animate-spin text-primary" size={24} />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <WizardStepper steps={STEPS} currentStep={step} onGoTo={setStep} />

      <div className="bg-white rounded-[2.5rem] border-2 border-border shadow-premium p-8 md:p-12 min-h-[400px]">
        {step === 0 && <BasicInfoStep data={data} onChange={patch} />}
        {step === 1 && <ContactsStep data={data} onChange={patch} />}
        {step === 2 && <ClassificationStep data={data} onChange={patch} />}
        {step === 3 && <div>Em breve: Upload de Documentos e Foto</div>}
      </div>

      {error && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-2xl text-red-600 text-sm font-bold text-center">
          {error}
        </div>
      )}

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
            {saving ? <><Loader2 size={20} className="animate-spin" /> Salvando...</> : <><CheckCircle2 size={20} /> Concluir Cadastro</>}
          </button>
        )}
      </div>
    </div>
  );
}
