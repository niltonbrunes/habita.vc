'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { PeopleService } from '@/services/people.service';
import { Person } from '@/types/people';
import { ArrowLeft, User, Building2, MapPin, Phone, Mail, Briefcase, Calendar, Globe, FileText, Pencil, Trash2, Ban } from 'lucide-react';
import Link from 'next/link';
import { ConfirmModal } from '@/components/common/ConfirmModal';

export default function PersonDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = React.use(params);
  const router = useRouter();
  const [person, setPerson] = useState<Person | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [inactivating, setInactivating] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showInactivateModal, setShowInactivateModal] = useState(false);

  useEffect(() => {
    PeopleService.getById(id)
      .then(setPerson)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await PeopleService.delete(id);
      router.push('/crmhabita/pessoas');
    } catch (err) {
      console.error(err);
      alert('Erro ao excluir pessoa.');
    } finally {
      setDeleting(false);
      setShowDeleteModal(false);
    }
  };

  const handleInactivate = async () => {
    setInactivating(true);
    const newStatus = person?.relationship_status === 'inativo' ? 'ativo' : 'inativo';
    try {
      await PeopleService.update(id, { relationship_status: newStatus });
      const updated = await PeopleService.getById(id);
      setPerson(updated);
    } catch (err) {
      console.error(err);
      alert('Erro ao mudar status da pessoa.');
    } finally {
      setInactivating(false);
      setShowInactivateModal(false);
    }
  };

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
        
        {/* Header with Actions */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <Link href="/crmhabita/pessoas" className="p-3 rounded-2xl border border-border hover:bg-muted transition-all text-primary">
              <ArrowLeft size={20} />
            </Link>
            <div className="flex-1">
              <div className="flex items-center gap-3">
                <h1 className="text-3xl font-black text-primary tracking-tight">
                  {person.fantasy_name || person.name}
                </h1>
                <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${
                  person.relationship_status === 'ativo' ? 'bg-green-100 text-green-700' :
                  person.relationship_status === 'inativo' ? 'bg-red-100 text-red-700' :
                  person.relationship_status === 'novo' ? 'bg-blue-100 text-blue-700' :
                  'bg-muted text-muted-foreground'
                }`}>
                  {person.relationship_status}
                </span>
              </div>
              {person.fantasy_name && <p className="text-muted-foreground text-sm font-medium">{person.name}</p>}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link 
              href={`/crmhabita/pessoas/${id}/editar`}
              className="flex items-center gap-2 px-5 py-3 bg-white border-2 border-border text-primary font-black rounded-2xl hover:border-primary/30 hover:bg-primary/5 transition-all shadow-sm"
            >
              <Pencil size={18} /> Editar
            </Link>
            
            {person.relationship_status === 'inativo' ? (
              <button 
                onClick={handleInactivate} // Reutiliza a lógica mas mudando para ativo
                className="flex items-center gap-2 px-5 py-3 bg-green-500 text-white font-black rounded-2xl hover:bg-green-600 transition-all shadow-md"
              >
                <CheckCircle2 size={18} /> Reativar Pessoa
              </button>
            ) : (
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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Coluna Esquerda: Resumo */}
          <div className="space-y-8">
            <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-border text-center">
              <div className="w-24 h-24 bg-muted rounded-[2rem] flex items-center justify-center mx-auto mb-6 shadow-inner relative overflow-hidden">
                {person.avatar_url ? (
                  <img src={person.avatar_url} alt="" className="w-full h-full object-cover" />
                ) : person.person_type === 'PJ' ? (
                  <Building2 size={40} className="text-primary/40" />
                ) : (
                  <User size={40} className="text-primary/40" />
                )}
                {person.relationship_status === 'inativo' && (
                   <div className="absolute inset-0 bg-red-500/20 backdrop-blur-[1px] flex items-center justify-center">
                      <Ban className="text-white drop-shadow-md" size={32} />
                   </div>
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

            {/* Endereços */}
            {person.addresses && person.addresses.length > 0 && (
              <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-border">
                <h3 className="font-black text-primary text-sm mb-4 flex items-center gap-2">
                  <MapPin size={18} /> Endereços
                </h3>
                <div className="space-y-4">
                  {person.addresses.map((addr, i) => (
                    <div key={i} className="text-sm border-l-2 border-primary/20 pl-4 py-1">
                      <p className="font-bold text-primary">{addr.street}, {addr.number}</p>
                      <p className="text-muted-foreground">{addr.neighborhood}</p>
                      <p className="text-muted-foreground">{addr.city} - {addr.state}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Coluna Direita: Conteúdo Principal */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Informações Detalhadas */}
            <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-border">
              <h3 className="font-black text-primary text-lg mb-6 flex items-center gap-2">
                <FileText size={20} /> Detalhes Cadastrais
              </h3>
              
              <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
                <div>
                  <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">Nacionalidade</p>
                  <p className="text-sm font-bold text-primary">{person.nationality || 'Não informada'}</p>
                </div>
                <div>
                  <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">Estado Civil</p>
                  <p className="text-sm font-bold text-primary">{person.marital_status || 'Não informado'}</p>
                </div>
                <div>
                  <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">Profissão</p>
                  <p className="text-sm font-bold text-primary">{person.profession || 'Não informada'}</p>
                </div>
                <div>
                  <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">Data Nasc./Fund.</p>
                  <p className="text-sm font-bold text-primary">
                    {person.birth_date_or_foundation ? new Date(person.birth_date_or_foundation).toLocaleDateString() : 'Não informada'}
                  </p>
                </div>
                {person.rg_ie && (
                  <div>
                    <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">RG / IE</p>
                    <p className="text-sm font-bold text-primary">{person.rg_ie}</p>
                  </div>
                )}
              </div>
            </div>

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
                      {person.commercial_info.interests?.map((int: string) => (
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

      <ConfirmModal 
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDelete}
        loading={deleting}
        title="Excluir Definitivamente?"
        message={`Você está prestes a apagar todos os dados de ${person.name}. Esta ação é irreversível e removerá também todos os vínculos de propriedade e documentos associados.`}
        confirmLabel="Sim, Excluir"
        isDestructive
      />

      <ConfirmModal 
        isOpen={showInactivateModal}
        onClose={() => setShowInactivateModal(false)}
        onConfirm={handleInactivate}
        loading={inactivating}
        title="Inativar Pessoa?"
        message={`O cadastro de ${person.name} ficará oculto na maioria das buscas, mas os dados históricos e documentos serão preservados.`}
        confirmLabel="Sim, Inativar"
      />
    </DashboardLayout>
  );
}
