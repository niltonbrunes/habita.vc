'use client';
import React, { useEffect, useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { PeopleService } from '@/services/people.service';
import { Person } from '@/types/people';
import { ArrowLeft, User, Building2, MapPin, Phone, Mail, Briefcase, Calendar, Globe, FileText } from 'lucide-react';
import Link from 'next/link';

export default function PersonDetailPage({ params }: { params: { id: string } }) {
  const [person, setPerson] = useState<Person | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    PeopleService.getById(params.id)
      .then(setPerson)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [params.id]);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="max-w-5xl mx-auto animate-pulse space-y-8">
          <div className="h-32 bg-muted rounded-[2rem]" />
          <div className="grid grid-cols-3 gap-8">
            <div className="col-span-1 h-96 bg-muted rounded-[2rem]" />
            <div className="col-span-2 h-96 bg-muted rounded-[2rem]" />
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (!person) {
    return (
      <DashboardLayout>
        <div className="text-center py-20">Pessoa não encontrada.</div>
      </DashboardLayout>
    );
  }

  const primaryContact = person.contacts?.find(c => c.is_primary) || person.contacts?.[0];

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto space-y-8 pb-20">
        
        {/* Header */}
        <div className="flex items-center gap-4">
          <Link href="/crmhabita/pessoas" className="p-3 rounded-2xl border border-border hover:bg-muted transition-all text-primary">
            <ArrowLeft size={20} />
          </Link>
          <div className="flex-1">
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-black text-primary tracking-tight">
                {person.fantasy_name || person.name}
              </h1>
              <span className={`px-3 py-1 rounded-lg text-xs font-black uppercase tracking-widest ${
                person.relationship_status === 'ativo' ? 'bg-green-100 text-green-700' :
                person.relationship_status === 'novo' ? 'bg-blue-100 text-blue-700' :
                'bg-muted text-muted-foreground'
              }`}>
                {person.relationship_status}
              </span>
            </div>
            {person.fantasy_name && <p className="text-muted-foreground text-sm font-medium">{person.name}</p>}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Coluna Esquerda: Resumo */}
          <div className="space-y-8">
            <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-border text-center">
              <div className="w-24 h-24 bg-muted rounded-[2rem] flex items-center justify-center mx-auto mb-6 shadow-inner">
                {person.avatar_url ? (
                  <img src={person.avatar_url} alt="" className="w-full h-full object-cover rounded-[2rem]" />
                ) : person.person_type === 'PJ' ? (
                  <Building2 size={40} className="text-primary/40" />
                ) : (
                  <User size={40} className="text-primary/40" />
                )}
              </div>
              
              <div className="flex flex-wrap justify-center gap-2 mb-6">
                {person.roles?.map(r => (
                  <span key={r} className="px-3 py-1 bg-primary/5 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-wider rounded-lg">
                    {r}
                  </span>
                ))}
              </div>

              <div className="space-y-4 text-left">
                {primaryContact && (
                  <div className="flex items-center gap-3 text-sm font-medium text-foreground p-3 bg-muted/50 rounded-xl">
                    {primaryContact.type === 'email' ? <Mail size={16} className="text-primary" /> : <Phone size={16} className="text-primary" />}
                    {primaryContact.value}
                  </div>
                )}
                {person.document_id && (
                  <div className="flex items-center gap-3 text-sm font-medium text-foreground p-3 bg-muted/50 rounded-xl">
                    <FileText size={16} className="text-primary" />
                    {person.document_id}
                  </div>
                )}
              </div>
            </div>

            <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-border space-y-6">
              <h3 className="font-black text-primary text-lg">Detalhes Cadastrais</h3>
              
              <div className="space-y-4">
                {person.rg_ie && (
                  <div>
                    <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">{person.person_type === 'PF' ? 'RG / Órgão' : 'Inscrição Estadual'}</p>
                    <p className="font-bold text-foreground">{person.rg_ie}</p>
                  </div>
                )}
                {person.birth_date_or_foundation && (
                  <div>
                    <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">{person.person_type === 'PF' ? 'Nascimento' : 'Fundação'}</p>
                    <p className="font-bold text-foreground">{new Date(person.birth_date_or_foundation).toLocaleDateString('pt-BR')}</p>
                  </div>
                )}
                {person.profession && (
                  <div>
                    <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Profissão</p>
                    <p className="font-bold text-foreground">{person.profession}</p>
                  </div>
                )}
                {person.marital_status && (
                  <div>
                    <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Estado Civil</p>
                    <p className="font-bold text-foreground">{person.marital_status}</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Coluna Direita: Abas e Informações Dinâmicas */}
          <div className="col-span-2 space-y-8">
            
            {/* Endereços */}
            {person.addresses?.length > 0 && (
              <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-border">
                <h3 className="font-black text-primary text-lg mb-6 flex items-center gap-2">
                  <MapPin size={20} /> Endereços
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {person.addresses.map((addr, i) => (
                    <div key={i} className="p-4 bg-muted/30 rounded-2xl border border-border">
                      <span className="inline-block px-2 py-1 bg-white border border-border rounded-md text-[10px] font-black uppercase tracking-wider text-muted-foreground mb-3">
                        {addr.type}
                      </span>
                      <p className="font-bold text-sm text-primary">{addr.street}, {addr.number} {addr.complement}</p>
                      <p className="text-xs text-muted-foreground mt-1">{addr.neighborhood} - {addr.city}/{addr.state}</p>
                      <p className="text-xs font-medium mt-2">{addr.zip_code}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Perfil Comercial (Interesses) */}
            {(person.commercial_info?.notes || (person.commercial_info?.interests?.length ?? 0) > 0) && (
              <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-border">
                <h3 className="font-black text-primary text-lg mb-6 flex items-center gap-2">
                  <Briefcase size={20} /> Perfil Comercial
                </h3>
                
                {(person.commercial_info?.interests?.length ?? 0) > 0 && (
                  <div className="mb-6">
                    <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-2">Interesses</p>
                    <div className="flex gap-2">
                      {person.commercial_info.interests.map((int: string) => (
                        <span key={int} className="px-3 py-1.5 bg-accent/10 text-accent font-bold text-xs rounded-xl border border-accent/20">
                          {int === 'buy' ? 'Comprar' : int === 'rent' ? 'Alugar' : 'Vender'}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                
                {person.commercial_info.notes && (
                  <div>
                    <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-2">Anotações do Perfil</p>
                    <p className="text-sm font-medium text-foreground bg-muted/50 p-4 rounded-2xl whitespace-pre-wrap leading-relaxed">
                      {person.commercial_info.notes}
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Timeline CRM */}
            <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-border">
              <h3 className="font-black text-primary text-lg mb-6 flex items-center gap-2">
                <Calendar size={20} /> Histórico de Relacionamento
              </h3>
              
              <div className="text-center py-10 bg-muted/30 rounded-3xl border border-dashed border-border">
                <p className="text-sm font-bold text-muted-foreground">Timeline em desenvolvimento...</p>
                <p className="text-xs text-muted-foreground/60 mt-1">Aqui você verá o registro de ligações, reuniões e visitas.</p>
              </div>
            </div>

          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
