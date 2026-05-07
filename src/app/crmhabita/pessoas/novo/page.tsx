'use client';
import React from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { PeopleWizard } from '@/components/people/wizard/PeopleWizard';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function NewPersonPage() {
  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto space-y-8 pb-20">
        <div className="flex items-center gap-4">
          <Link href="/crmhabita/pessoas" className="p-3 rounded-2xl border border-border hover:bg-muted transition-all text-primary">
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="text-3xl font-black text-primary tracking-tight">Nova Pessoa</h1>
            <p className="text-muted-foreground text-sm">Cadastre um novo lead, cliente, proprietário ou empresa.</p>
          </div>
        </div>

        <PeopleWizard />
      </div>
    </DashboardLayout>
  );
}
