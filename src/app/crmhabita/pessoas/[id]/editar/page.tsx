'use client';
import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { PeopleService } from '@/services/people.service';
import { PeopleWizard } from '@/components/people/wizard/PeopleWizard';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Loader2, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function EditPersonPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = React.use(params);
  const router = useRouter();
  const [person, setPerson] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const data = await PeopleService.getById(id as string);
        setPerson(data);
      } catch (err) {
        console.error(err);
        router.push('/crmhabita/pessoas');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id, router]);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="h-[400px] flex items-center justify-center">
          <Loader2 className="animate-spin text-primary" size={40} />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <Link href={`/crmhabita/pessoas/${id}`} className="text-sm font-bold text-muted-foreground hover:text-primary flex items-center gap-1 mb-2 transition-colors">
              <ArrowLeft size={16} /> Voltar para o Perfil
            </Link>
            <h1 className="text-3xl font-black text-primary tracking-tight">Editar Pessoa</h1>
            <p className="text-muted-foreground font-medium">Corrija os dados cadastrais ou mude a classificação.</p>
          </div>
        </div>

        <PeopleWizard initialData={person} />
      </div>
    </DashboardLayout>
  );
}
