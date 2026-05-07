'use client';
import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { PropertiesService } from '@/services/properties.service';
import { PropertyOwnersService } from '@/services/property-owners.service';
import { PropertyWizard } from '@/components/properties/wizard/PropertyWizard';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Loader2, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function EditPropertyPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = React.use(params);
  const router = useRouter();
  const [property, setProperty] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [propData, ownersData] = await Promise.all([
          PropertiesService.getById(id as string),
          PropertyOwnersService.getByPropertyId(id as string)
        ]);
        
        setProperty({
          ...propData,
          owners: ownersData
        });
      } catch (err) {
        console.error(err);
        router.push('/crmhabita/imoveis');
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
            <Link href={`/crmhabita/imoveis/${id}`} className="text-sm font-bold text-muted-foreground hover:text-primary flex items-center gap-1 mb-2 transition-colors">
              <ArrowLeft size={16} /> Voltar para a Ficha
            </Link>
            <h1 className="text-3xl font-black text-primary tracking-tight">Editar Imóvel</h1>
            <p className="text-muted-foreground font-medium">Atualize fotos, preços ou características do imóvel.</p>
          </div>
        </div>

        <PropertyWizard initialData={property} />
      </div>
    </DashboardLayout>
  );
}
