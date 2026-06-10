'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { PeopleService } from '@/services/people.service';
import { Person } from '@/types/people';
import { ArrowLeft, User, Building2, MapPin, Phone, Mail, Briefcase, Calendar, Globe, FileText, Pencil, Trash2, Ban, CheckCircle2, Sparkles, ExternalLink, Loader2, Clock, PlusCircle, RefreshCw, MessageSquare, Search, UserPlus } from 'lucide-react';
import Link from 'next/link';
import { ConfirmModal } from '@/components/common/ConfirmModal';
import { LeadFormModal } from '@/components/leads/LeadFormModal';
import { supabase } from '@/lib/supabase';

export default function PersonDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = React.use(params);
  const router = useRouter();
  const [person, setPerson] = useState<Person | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [inactivating, setInactivating] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showInactivateModal, setShowInactivateModal] = useState(false);
  const [isLeadModalOpen, setIsLeadModalOpen] = useState(false);
  const [leads, setLeads] = useState<any[]>([]);
  const [loadingLeads, setLoadingLeads] = useState(true);
  const [tasks, setTasks] = useState<any[]>([]);

  // States for PJ/PF relationships
  const [linkedCompanies, setLinkedCompanies] = useState<Person[]>([]);
  const [repsDetails, setRepsDetails] = useState<Person[]>([]);
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [linkSearch, setLinkSearch] = useState('');
  const [linkSearchResults, setLinkSearchResults] = useState<any[]>([]);
  const [selectedPersonToLink, setSelectedPersonToLink] = useState<any | null>(null);
  const [representativeRole, setRepresentativeRole] = useState('');
  const [linking, setLinking] = useState(false);

  // ⚡ Compile history from all leads ⚡
  const compiledHistory = React.useMemo(() => {
    const allEntries: any[] = [];

    if (leads && leads.length > 0) {
      leads.forEach((lead: any) => {
        if (Array.isArray(lead.history)) {
          lead.history.forEach((entry: any) => {
            allEntries.push({
              ...entry,
              leadId: lead.id,
              leadType: lead.lead_type || 'buyer',
              leadTitle: lead.property?.title || lead.interest_description || 'Oportunidade',
            });
          });
        }
      });
    }

    if (tasks && tasks.length > 0) {
      tasks.forEach((task: any) => {
        const lead = leads.find((l: any) => l.id === task.lead_id);
        const dateFormatted = new Date(task.due_date).toLocaleDateString('pt-BR');
        const timeFormatted = new Date(task.due_date).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
        allEntries.push({
          type: 'appointment',
          note: `Compromisso Agendado: ${task.title}${task.description ? ` (${task.description})` : ''} - Marcado para ${dateFormatted} às ${timeFormatted}${task.completed ? ' (Concluído)' : ''}`,
          date: task.created_at,
          leadId: task.lead_id,
          leadType: lead?.lead_type || 'buyer',
          leadTitle: lead?.property?.title || lead?.interest_description || 'Oportunidade',
        });
      });
    }

    return allEntries.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [leads, tasks]);

  const fetchRelatedData = async (currentPerson: Person) => {
    if (currentPerson.person_type === 'PJ') {
      const respIds = currentPerson.responsibles
        ?.map((r: any) => r.person_id)
        .filter((pid): pid is string => !!pid);

      if (respIds && respIds.length > 0) {
        try {
          const { data: reps, error: repsError } = await supabase
            .from('people')
            .select('*')
            .in('id', respIds);
          
          if (repsError) throw repsError;
          setRepsDetails(reps || []);
        } catch (err) {
          console.error('Erro ao buscar representantes:', err);
        }
      } else {
        setRepsDetails([]);
      }
    } else if (currentPerson.person_type === 'PF') {
      try {
        const { data: companies, error: compError } = await supabase
          .from('people')
          .select('*')
          .eq('person_type', 'PJ')
          .contains('responsibles', JSON.stringify([{ person_id: currentPerson.id }]));
        
        if (compError) throw compError;
        setLinkedCompanies(companies || []);
      } catch (err) {
        console.error('Erro ao buscar empresas representadas:', err);
      }
    }
  };

  useEffect(() => {
    setLoading(true);
    setLoadingLeads(true);
    Promise.all([
      PeopleService.getById(id).then(async (loadedPerson) => {
        setPerson(loadedPerson);
        if (loadedPerson) {
          await fetchRelatedData(loadedPerson);
        }
      }),
      PeopleService.getLeadsByPerson(id).then(async (loadedLeads) => {
        setLeads(loadedLeads);
        if (loadedLeads && loadedLeads.length > 0) {
          try {
            const leadIds = loadedLeads.map((l: any) => l.id);
            const { data: loadedTasks, error: tasksError } = await supabase
              .from('tasks')
              .select('*')
              .in('lead_id', leadIds)
              .order('due_date', { ascending: false });

            if (tasksError) throw tasksError;
            setTasks(loadedTasks || []);
          } catch (err) {
            console.error('Erro ao buscar tarefas do contato:', err);
          }
        } else {
          setTasks([]);
        }
      })
    ])
      .catch(console.error)
      .finally(() => {
        setLoading(false);
        setLoadingLeads(false);
      });
  }, [id]);

  useEffect(() => {
    if (!linkSearch.trim()) {
      setLinkSearchResults([]);
      return;
    }
    
    const delayDebounce = setTimeout(() => {
      supabase
        .from('people')
        .select('id, name, document_id, contacts')
        .eq('person_type', 'PF')
        .ilike('name', '%' + linkSearch + '%')
        .limit(5)
        .then(({ data, error }) => {
          if (error) {
            console.error('Erro ao buscar contatos:', error);
          } else {
            setLinkSearchResults(data || []);
          }
        });
    }, 300);
    
    return () => clearTimeout(delayDebounce);
  }, [linkSearch]);

  const handleLinkRepresentative = async () => {
    if (!person || !selectedPersonToLink) return;
    
    setLinking(true);
    try {
      const newResponsible = {
        person_id: selectedPersonToLink.id,
        name: selectedPersonToLink.name,
        role: representativeRole || 'Representante'
      };
      
      const currentResponsibles = person.responsibles || [];
      if (currentResponsibles.some((r: any) => r.person_id === selectedPersonToLink.id)) {
        alert('Este representante já está vinculado.');
        setLinking(false);
        return;
      }
      
      const updatedResponsibles = [...currentResponsibles, newResponsible];
      await PeopleService.update(person.id, { responsibles: updatedResponsibles });
      
      const updatedPerson = { ...person, responsibles: updatedResponsibles };
      setPerson(updatedPerson);
      await fetchRelatedData(updatedPerson);
      
      setShowLinkModal(false);
      setSelectedPersonToLink(null);
      setRepresentativeRole('');
      setLinkSearch('');
      setLinkSearchResults([]);
    } catch (err) {
      console.error('Erro ao vincular representante:', err);
      alert('Erro ao vincular representante.');
    } finally {
      setLinking(false);
    }
  };

  const handleUnlinkRepresentative = async (personId: string) => {
    if (!person) return;
    
    if (!confirm('Tem certeza que deseja desvincular este representante?')) {
      return;
    }
    
    try {
      const currentResponsibles = person.responsibles || [];
      const updatedResponsibles = currentResponsibles.filter((r: any) => r.person_id !== personId);
      
      await PeopleService.update(person.id, { responsibles: updatedResponsibles });
      
      const updatedPerson = { ...person, responsibles: updatedResponsibles };
      setPerson(updatedPerson);
      await fetchRelatedData(updatedPerson);
    } catch (err) {
      console.error('Erro ao desvincular representante:', err);
      alert('Erro ao desvincular representante.');
    }
  };

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
          <div className="h-32 bg-muted rounded-xl" />
          <div className="grid grid-cols-3 gap-8">
            <div className="col-span-1 h-96 bg-muted rounded-xl" />
            <div className="col-span-2 h-96 bg-muted rounded-xl" />
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
        
        {/* Header with Title (Clean) */}
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
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Coluna Esquerda: Resumo */}
          <div className="space-y-8">
            <div className="bg-surface rounded-xl p-8 shadow-sm border border-border text-center">
              <div className="w-24 h-24 bg-muted rounded-xl flex items-center justify-center mx-auto mb-6 shadow-inner relative overflow-hidden">
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
                  <span key={r} className="px-3 py-1 bg-blue-primary/5 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-wider rounded-lg">
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
              <div className="bg-surface rounded-xl p-8 shadow-sm border border-border">
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

            {/* Empresas Representadas (para PF) */}
            {person.person_type === 'PF' && (
              <div className="bg-surface rounded-xl p-8 shadow-sm border border-border">
                <h3 className="font-black text-primary text-sm mb-4 flex items-center gap-2">
                  <Briefcase size={18} /> Empresas Representadas
                </h3>
                {linkedCompanies.length > 0 ? (
                  <div className="space-y-4">
                    {linkedCompanies.map((company) => {
                      const rel = company.responsibles?.find((r: any) => r.person_id === person.id);
                      return (
                        <div key={company.id} className="text-sm border-l-2 border-primary/20 pl-4 py-1 flex items-center justify-between gap-2">
                          <div>
                            <p className="font-bold text-primary">
                              <Link href={"/crmhabita/pessoas/" + company.id} className="hover:underline">
                                {company.fantasy_name || company.name}
                              </Link>
                            </p>
                            {rel?.role && (
                              <p className="text-xs text-muted-foreground font-medium">{rel.role}</p>
                            )}
                          </div>
                          <Link href={"/crmhabita/pessoas/" + company.id} className="text-primary hover:text-primary/80">
                            <ExternalLink size={14} />
                          </Link>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-xs text-muted-foreground/60 italic">Nenhuma empresa representada vinculada.</p>
                )}
              </div>
            )}
          </div>

          {/* Coluna Direita: Conteúdo Principal */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Quick Actions Card */}
            <div className="bg-surface p-6 rounded-xl shadow-card border border-border flex items-center justify-between gap-4">
              <button 
                onClick={() => setIsLeadModalOpen(true)}
                className="flex-1 flex items-center justify-center gap-3 px-6 py-4 bg-blue-primary text-white font-black rounded-2xl hover:bg-blue-primary/90 transition-all shadow-lg shadow-primary/20 uppercase tracking-widest text-xs"
              >
                <Sparkles size={18} /> Criar Oportunidade
              </button>

              <div className="flex items-center gap-3">
                <Link 
                  href={`/crmhabita/pessoas/${id}/editar`}
                  className="p-3 bg-surface border-2 border-border text-primary rounded-2xl hover:border-primary/30 transition-all shadow-sm"
                  title="Editar Pessoa"
                >
                  <Pencil size={20} />
                </Link>
                
                {person.relationship_status === 'inativo' ? (
                  <button 
                    onClick={handleInactivate}
                    className="p-3 bg-green-500 text-white rounded-2xl hover:bg-green-600 transition-all shadow-md"
                    title="Reativar Pessoa"
                  >
                    <CheckCircle2 size={20} />
                  </button>
                ) : (
                  <button 
                    onClick={() => setShowInactivateModal(true)}
                    className="p-3 bg-surface border-2 border-border text-muted-foreground rounded-2xl hover:border-red-200 hover:text-red-600 transition-all shadow-sm"
                    title="Inativar Pessoa"
                  >
                    <Ban size={20} />
                  </button>
                )}

                <button 
                  onClick={() => setShowDeleteModal(true)}
                  className="p-3 bg-surface border-2 border-border text-red-400 rounded-2xl hover:border-red-500 hover:bg-red-500 hover:text-white transition-all shadow-sm"
                  title="Excluir Definitivamente"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            </div>

            {/* Representantes da Empresa (para PJ) */}
            {person.person_type === 'PJ' && (
              <div className="bg-surface rounded-xl p-8 shadow-card border border-border">
                <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
                  <h3 className="font-black text-primary text-lg flex items-center gap-2">
                    <UserPlus size={20} className="text-accent" /> Representantes da Empresa
                  </h3>
                  <button
                    onClick={() => setShowLinkModal(true)}
                    className="px-4 py-2 bg-blue-primary/10 border border-primary/20 text-primary text-xs font-bold rounded-xl hover:bg-blue-primary/20 transition-all flex items-center gap-2"
                  >
                    <UserPlus size={14} /> Vincular Representante
                  </button>
                </div>

                {person.responsibles && person.responsibles.length > 0 ? (
                  <div className="space-y-4">
                    {person.responsibles.map((rep: any) => {
                      const detail = repsDetails.find((d: any) => d.id === rep.person_id);
                      const primaryPhone = detail?.contacts?.find((c: any) => c.type === 'phone' || c.type === 'whatsapp')?.value;
                      const cleanPhone = primaryPhone ? primaryPhone.replace(/\D/g, '') : '';
                      const waLink = cleanPhone ? "https://wa.me/55" + cleanPhone : '';

                      return (
                        <div key={rep.person_id || rep.name} className="p-4 bg-muted/30 border border-border/80 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-primary/20 transition-all">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center shrink-0">
                              <User size={20} className="text-primary" />
                            </div>
                            <div>
                              <p className="text-sm font-bold text-primary">
                                {rep.person_id ? (
                                  <Link href={"/crmhabita/pessoas/" + rep.person_id} className="hover:underline">
                                    {rep.name}
                                  </Link>
                                ) : (
                                  rep.name
                                )}
                              </p>
                              <p className="text-xs text-muted-foreground font-medium">{rep.role}</p>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 self-end sm:self-center">
                            {primaryPhone && (
                              <a
                                href={"tel:" + primaryPhone}
                                className="p-2 bg-surface hover:bg-muted border border-border rounded-xl text-primary transition-all shadow-sm"
                                title={"Ligar para " + rep.name}
                              >
                                <Phone size={14} />
                              </a>
                            )}
                            {primaryPhone && (
                              <a
                                href={waLink || "https://wa.me/55" + cleanPhone}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-2 bg-green-500/10 hover:bg-green-500/20 border border-green-500/30 text-green-600 rounded-xl transition-all shadow-sm"
                                title="Chamar no WhatsApp"
                              >
                                <MessageSquare size={14} />
                              </a>
                            )}
                            {rep.person_id && (
                              <button
                                onClick={() => handleUnlinkRepresentative(rep.person_id)}
                                className="p-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-600 rounded-xl transition-all shadow-sm"
                                title="Desvincular Representante"
                              >
                                <Trash2 size={14} />
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-8 bg-muted/20 rounded-2xl border-2 border-dashed border-border/60">
                    <p className="text-xs font-black text-muted-foreground uppercase tracking-widest">Nenhum representante vinculado</p>
                    <p className="text-[10px] text-muted-foreground/60 mt-1">Vincule pessoas físicas (PF) que respondem por esta empresa.</p>
                  </div>
                )}
              </div>
            )}

            {/* Oportunidades Vinculadas */}
            <div className="bg-surface rounded-xl p-8 shadow-card border border-border">
              <h3 className="font-black text-primary text-lg mb-6 flex items-center gap-2">
                <Briefcase size={20} className="text-accent" /> Oportunidades Vinculadas (CRM)
              </h3>
              
              {loadingLeads ? (
                <div className="flex justify-center py-6">
                  <Loader2 className="animate-spin text-primary" size={24} />
                </div>
              ) : leads && leads.length > 0 ? (
                <div className="space-y-4">
                  {leads.map((l: any) => {
                    const isSeller = l.lead_type === 'seller';
                    const leadTypeLabel = isSeller ? 'Captação' : 'Venda';
                    const leadTypeBg = isSeller ? 'bg-orange-50 text-orange-600 border-orange-200' : 'bg-blue-50 text-blue-600 border-blue-200';
                    
                    const statusLabel = (({
                      lead: 'Novos Leads',
                      contact: 'Contato',
                      presentation: 'Apresentação',
                      visit: 'Visitas',
                      proposal: 'Proposta',
                      sale: 'Fechamento',
                      lost: 'Perdido',
                      prospecting: 'Prospecção',
                      contacted: 'Contatado',
                      visit_scheduled: 'Visita Agendada',
                      visited: 'Visitado',
                      proposal_sent: 'Proposta Enviada',
                      captured: 'Captado',
                    } as Record<string, string>)[l.status] || l.status);

                    return (
                      <div key={l.id} className="p-4 bg-muted/30 border border-border/80 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-primary/20 transition-all">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className={`px-2 py-0.5 border text-[9px] font-black uppercase tracking-widest rounded-md ${leadTypeBg}`}>
                              {leadTypeLabel}
                            </span>
                            <span className="px-2 py-0.5 bg-muted text-muted-foreground border border-border/60 text-[9px] font-black uppercase tracking-widest rounded-md">
                              {statusLabel}
                            </span>
                            {l.value && l.value > 0 && (
                              <span className="text-xs font-bold text-green-600">
                                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(l.value)}
                              </span>
                            )}
                          </div>
                          <p className="text-xs font-bold text-primary">
                            {l.property?.title ? `Interesse: ${l.property.title}` : l.interest_description || 'Interesse não detalhado'}
                          </p>
                          {l.source && (
                            <p className="text-[10px] text-muted-foreground font-medium">
                              Origem: {l.source}
                            </p>
                          )}
                        </div>
                        <Link 
                          href={`/crmhabita/leads/${l.id}`}
                          className="px-4 py-2 bg-surface hover:bg-muted border border-border rounded-xl text-xs font-bold text-primary flex items-center justify-center gap-2 transition-all shadow-sm shrink-0"
                        >
                          Ver Oportunidade <ExternalLink size={12} />
                        </Link>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-8 bg-muted/20 rounded-2xl border-2 border-dashed border-border/60">
                  <p className="text-xs font-black text-muted-foreground uppercase tracking-widest">Nenhuma oportunidade ativa</p>
                  <p className="text-[10px] text-muted-foreground/60 mt-1">Crie uma nova oportunidade/lead para vincular a esta pessoa.</p>
                </div>
              )}
            </div>
            
            {/* Informações Detalhadas */}
            <div className="bg-surface rounded-xl p-8 shadow-sm border border-border">
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
              <div className="bg-surface rounded-xl p-8 shadow-sm border border-border">
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
            <div className="bg-surface rounded-xl p-8 shadow-sm border border-border">
              <h3 className="font-black text-primary text-lg mb-6 flex items-center gap-2">
                <Calendar size={20} /> Histórico de Relacionamento
              </h3>
              
              {compiledHistory.length > 0 ? (
                <div className="space-y-6">
                  {compiledHistory.map((entry, i) => {
                    let icon = <Clock size={16} className="text-muted-foreground" />;
                    let bgColor = 'bg-muted border-border';
                    if (entry.type === 'creation') {
                      icon = <PlusCircle size={16} className="text-green-600" />;
                      bgColor = 'bg-green-50 border-green-200';
                    } else if (entry.type === 'status_change') {
                      icon = <RefreshCw size={16} className="text-blue-600" />;
                      bgColor = 'bg-blue-50 border-blue-200';
                    } else if (entry.type === 'note') {
                      icon = <MessageSquare size={16} className="text-orange-600" />;
                      bgColor = 'bg-orange-50 border-orange-200';
                    } else if (entry.type === 'document' || entry.type === 'upload') {
                      icon = <FileText size={16} className="text-purple-600" />;
                      bgColor = 'bg-purple-50 border-purple-200';
                    } else if (entry.type === 'appointment') {
                      icon = <Calendar size={16} className="text-indigo-600" />;
                      bgColor = 'bg-indigo-50 border-indigo-200';
                    }

                    const leadTypeLabel = entry.leadType === 'seller' ? 'Captação' : 'Venda';
                    const leadTypeBg = entry.leadType === 'seller' ? 'bg-orange-100 text-orange-700' : 'bg-blue-100 text-blue-700';

                    return (
                      <div key={i} className="flex gap-6 relative">
                        {i < compiledHistory.length - 1 && (
                          <div className="absolute left-4 top-8 bottom-[-24px] w-0.5 bg-border" />
                        )}
                        <div className={`w-8 h-8 rounded-full border flex items-center justify-center shrink-0 relative z-10 shadow-sm ${bgColor}`}>
                          {icon}
                        </div>
                        <div className="flex-1 pb-6">
                          <div className="flex justify-between items-start mb-1 flex-wrap gap-2">
                            <p className="font-bold text-primary leading-tight">{entry.note}</p>
                            <p className="text-[9px] font-bold text-muted-foreground/60 uppercase whitespace-nowrap">
                              {new Date(entry.date).toLocaleString('pt-BR')}
                            </p>
                          </div>
                          <div className="flex items-center gap-2 mt-1 flex-wrap">
                            <span className={`px-2 py-0.5 text-[8px] font-black uppercase tracking-widest rounded ${leadTypeBg}`}>
                              {leadTypeLabel}
                            </span>
                            <span className="text-[10px] text-muted-foreground/60 font-medium">
                              {entry.leadTitle}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-10 bg-muted/30 rounded-3xl border border-dashed border-border">
                  <p className="text-sm font-bold text-muted-foreground">Nenhum histórico de relacionamento registrado</p>
                  <p className="text-xs text-muted-foreground/60 mt-1">
                    As interações e movimentações das oportunidades vinculadas a este contato aparecerão aqui.
                  </p>
                </div>
              )}
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

      <LeadFormModal 
        isOpen={isLeadModalOpen}
        onClose={() => setIsLeadModalOpen(false)}
        onSuccess={() => {
          setIsLeadModalOpen(false);
          // Recarregar os leads vinculados
          PeopleService.getLeadsByPerson(id).then(setLeads).catch(console.error);
        }}
        preSelectedPersonId={id}
      />

      {/* Modal para Vincular Representante */}
      {showLinkModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-surface border border-border w-full max-w-md rounded-2xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-border">
              <h3 className="text-lg font-black text-primary flex items-center gap-2">
                <UserPlus size={20} className="text-primary" /> Vincular Representante
              </h3>
              <p className="text-xs text-muted-foreground mt-1">Busque um contato (Pessoa Física) para vincular à empresa.</p>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-3.5 text-muted-foreground" size={16} />
                <input
                  type="text"
                  placeholder="Buscar contato por nome..."
                  value={linkSearch}
                  onChange={(e) => setLinkSearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-3 bg-muted/50 border border-border rounded-xl text-sm font-bold text-primary placeholder-muted-foreground/60 focus:outline-none focus:border-primary/30 transition-all"
                />
              </div>

              {linkSearchResults.length > 0 && (
                <div className="border border-border/80 rounded-xl overflow-hidden divide-y divide-border/60 bg-muted/20">
                  {linkSearchResults.map((pf) => (
                    <button
                      key={pf.id}
                      type="button"
                      onClick={() => setSelectedPersonToLink(pf)}
                      className={`w-full text-left p-3 text-sm font-bold flex justify-between items-center transition-all ${
                        selectedPersonToLink?.id === pf.id ? 'bg-blue-primary/10 text-primary' : 'hover:bg-muted/50 text-muted-foreground hover:text-primary'
                      }`}
                    >
                      <span>{pf.name}</span>
                      {pf.document_id && <span className="text-[10px] text-muted-foreground/60 font-medium">{pf.document_id}</span>}
                    </button>
                  ))}
                </div>
              )}

              {linkSearch.trim() && linkSearchResults.length === 0 && (
                <p className="text-xs text-muted-foreground/60 text-center py-2">Nenhum contato encontrado.</p>
              )}

              {selectedPersonToLink && (
                <div className="space-y-2 pt-2 border-t border-border/60">
                  <p className="text-xs font-black text-muted-foreground uppercase tracking-widest">Contato Selecionado:</p>
                  <div className="p-3 bg-blue-primary/5 border border-primary/20 rounded-xl text-sm font-bold text-primary">
                    {selectedPersonToLink.name}
                  </div>
                  
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Cargo / Função</label>
                    <input
                      type="text"
                      placeholder="Ex: Sócio Diretor, Financeiro, Procurador"
                      value={representativeRole}
                      onChange={(e) => setRepresentativeRole(e.target.value)}
                      className="w-full px-4 py-3 bg-muted/50 border border-border rounded-xl text-sm font-bold text-primary placeholder-muted-foreground/60 focus:outline-none focus:border-primary/30 transition-all"
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="p-6 bg-muted/30 border-t border-border flex justify-end gap-3">
              <button
                type="button"
                onClick={() => {
                  setShowLinkModal(false);
                  setSelectedPersonToLink(null);
                  setRepresentativeRole('');
                  setLinkSearch('');
                  setLinkSearchResults([]);
                }}
                className="px-5 py-3 border border-border hover:bg-muted font-bold text-xs rounded-xl text-primary transition-all uppercase tracking-wider"
              >
                Cancelar
              </button>
              <button
                type="button"
                disabled={linking || !selectedPersonToLink}
                onClick={handleLinkRepresentative}
                className="px-5 py-3 bg-blue-primary text-white font-bold text-xs rounded-xl hover:bg-blue-primary/95 disabled:opacity-50 transition-all flex items-center gap-2 uppercase tracking-wider shadow-md shadow-primary/20"
              >
                {linking && <Loader2 className="animate-spin" size={14} />}
                Vincular
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
