'use client';
import React from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { PropertyWizard } from '@/components/properties/wizard/PropertyWizard';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function NewPropertyPage() {
  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto space-y-8 pb-20">
        <div className="flex items-center gap-4">
          <Link href="/crmhabita/imoveis" className="p-3 rounded-2xl border border-border hover:bg-muted transition-all text-primary">
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="text-3xl font-black text-primary tracking-tight">Novo Imóvel</h1>
            <p className="text-muted-foreground text-sm">Preencha as etapas abaixo para cadastrar seu imóvel no portal.</p>
          </div>
        </div>

        <PropertyWizard />
      </div>
    </DashboardLayout>
  );
}
