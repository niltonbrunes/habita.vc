'use client';

import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { LeadsService } from '@/services/leads.service';
import { StorageService } from '@/services/storage.service';
import { Lead } from '@/types/database';
import { 
  ArrowLeft, 
  User, 
  Phone, 
  Mail, 
  Calendar, 
  FileText, 
  Upload, 
  Loader2, 
  Trash2, 
  Download,
  ExternalLink,
  ShieldCheck,
  RefreshCw,
  MessageCircle,
  Clock,
  Tag,
  PlusCircle,
  MessageSquare
} from 'lucide-react';
import Link from 'next/link';

export default function LeadDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = React.use(params);
  const [lead, setLead] = useState<Lead | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [noteText, setNoteText] = useState('');
  const [savingNote, setSavingNote] = useState(false);

  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!lead || !noteText.trim()) return;

    setSavingNote(true);
    try {
      const historyEntry = {
        type: 'note',
        date: new Date().toISOString(),
        note: noteText.trim(),
      };

      const updatedHistory = [...(lead.history || []), historyEntry];
      await LeadsService.update(lead.id, { history: updatedHistory });
      setLead({ ...lead, history: updatedHistory });
      setNoteText('');
    } catch (err) {
      console.error('Erro ao adicionar nota:', err);
    } finally {
      setSavingNote(false);
    }
  };

  useEffect(() => {
    const fetch = async () => {
      try {
        setLoading(true);
        const data = await LeadsService.getById(resolvedParams.id);
        setLead(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [resolvedParams.id]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || !lead) return;

    setUploading(true);
    try {
      const uploadPromises = Array.from(files).map(file => 
        StorageService.uploadLeadDocument(file, lead.id)
      );
      
      const newDocs = await Promise.all(uploadPromises);
      const updatedDocs = [...(lead.documents || []), ...newDocs];
      
      await LeadsService.update(lead.id, { documents: updatedDocs });
      setLead({ ...lead, documents: updatedDocs });
    } catch (error) {
      console.error('Erro no upload:', error);
    } finally {
      setUploading(false);
    }
  };

  const deleteDocument = async (url: string) => {
    if (!lead) return;
    try {
      const updatedDocs = lead.documents.filter(doc => doc.url !== url);
      await LeadsService.update(lead.id, { documents: updatedDocs });
      setLead({ ...lead, documents: updatedDocs });
    } catch (error) {
      console.error('Erro ao excluir documento:', error);
    }
  };

  if (loading) return (
    <DashboardLayout>
      <div className="h-full flex items-center justify-center">
        <RefreshCw className="animate-spin text-primary" size={32} />
      </div>
    </DashboardLayout>
  );

  if (!lead) return (
    <DashboardLayout>
      <div className="h-full flex flex-col items-center justify-center">
        <p className="text-muted-foreground font-bold">Lead não encontrado.</p>
        <Link href="/crmhabita/leads" className="text-primary font-bold underline mt-4">Voltar para o CRM</Link>
      </div>
    </DashboardLayout>
  );

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto space-y-8 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <Link href="/crmhabita/leads" className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors font-bold text-sm">
          <ArrowLeft size={16} /> Voltar para o CRM
        </Link>

        <div className="grid lg:grid-cols-3 gap-12">
          {/* Main Content: Info & History */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-surface p-10 rounded-xl shadow-card border border-border">
              <div className="flex justify-between items-start mb-8">
                <div className="flex items-center gap-6">
                  <div className="w-20 h-20 bg-blue-primary/5 rounded-3xl flex items-center justify-center text-primary border border-primary/10">
                    <User size={40} />
                  </div>
                  <div>
                    <h1 className="text-3xl font-black text-primary flex flex-wrap items-center gap-3">
                      {lead.name}
                      {lead.person_id && (
                        <Link 
                          href={`/crmhabita/pessoas/${lead.person_id}`}
                          className="inline-flex items-center gap-1 text-[11px] font-black uppercase tracking-widest text-blue-600 hover:text-blue-800 transition-colors bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-xl border border-blue-200"
                          title="Ver Cadastro Completo"
                        >
                          <User size={12} />
                          Pessoa
                          <ExternalLink size={10} />
                        </Link>
                      )}
                    </h1>
                    <div className="flex gap-3 mt-2">
                      <span className="bg-blue-primary text-white text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full">
                        {
                          (
                            {
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
                            } as Record<string, string>
                          )[lead.status] || lead.status
                        }
                      </span>
                      <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full ${
                        lead.temperature === 'hot' ? 'bg-red-100 text-red-600' : 
                        lead.temperature === 'warm' ? 'bg-orange-100 text-orange-600' : 'bg-blue-100 text-blue-600'
                      }`}>
                        {lead.temperature === 'hot' ? 'Fogo' : lead.temperature === 'warm' ? 'Morno' : 'Frio'}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button className="p-3 bg-muted rounded-2xl text-primary hover:bg-blue-primary hover:text-white transition-all shadow-sm">
                    <MessageCircle size={20} />
                  </button>
                  <button className="p-3 bg-muted rounded-2xl text-primary hover:bg-blue-primary hover:text-white transition-all shadow-sm">
                    <Phone size={20} />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 py-8 border-y border-border">
                <div className="space-y-4">
                  <DetailItem icon={<Mail size={16} />} label="E-mail" value={lead.email || 'Não informado'} />
                  <DetailItem icon={<Phone size={16} />} label="WhatsApp" value={lead.phone || 'Não informado'} />
                </div>
                <div className="space-y-4">
                  <DetailItem icon={<Tag size={16} />} label="Origem" value={lead.source || 'Manual'} />
                  <DetailItem icon={<Calendar size={16} />} label="Cadastrado em" value={new Date(lead.created_at).toLocaleDateString()} />
                </div>
              </div>
            </div>

            {/* History Section */}
            <div className="bg-surface p-10 rounded-xl shadow-card border border-border">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                <h3 className="text-xl font-black text-primary flex items-center gap-2">
                  <Clock size={20} className="text-accent" /> Histórico de Interações
                </h3>
              </div>

              {/* Novo formulário para registrar notas manuais */}
              <form onSubmit={handleAddNote} className="mb-8 p-4 bg-muted/20 border border-border/60 rounded-2xl space-y-3">
                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                  📝 Registrar Nova Interação / Anotação
                </p>
                <div className="flex gap-3">
                  <input
                    type="text"
                    required
                    placeholder="Ex: Liguei para o cliente, agendamos visita para quinta..."
                    value={noteText}
                    onChange={e => setNoteText(e.target.value)}
                    className="flex-1 px-4 py-3 bg-surface border border-border rounded-xl focus:border-primary outline-none text-xs font-medium text-primary placeholder:text-muted-foreground/30"
                  />
                  <button
                    type="submit"
                    disabled={savingNote}
                    className="px-5 py-3 bg-blue-primary text-white font-bold text-xs rounded-xl hover:bg-blue-primary-light transition-all shadow-sm shrink-0 flex items-center gap-2"
                  >
                    {savingNote ? <Loader2 className="animate-spin" size={14} /> : 'Registrar'}
                  </button>
                </div>
              </form>

              <div className="space-y-6">
                {lead.history?.map((entry: any, i: number) => {
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
                  }

                  return (
                    <div key={i} className="flex gap-6 relative">
                      {i < lead.history.length - 1 && <div className="absolute left-4 top-8 bottom-[-24px] w-0.5 bg-border" />}
                      <div className={`w-8 h-8 rounded-full border flex items-center justify-center shrink-0 relative z-10 shadow-sm ${bgColor}`}>
                        {icon}
                      </div>
                      <div className="flex-1 pb-6">
                        <div className="flex justify-between items-start mb-1">
                          <p className="font-bold text-primary leading-tight">{entry.note}</p>
                          <p className="text-[9px] font-bold text-muted-foreground/60 uppercase whitespace-nowrap ml-4">
                            {new Date(entry.date).toLocaleString('pt-BR')}
                          </p>
                        </div>
                        <p className="text-[9px] text-muted-foreground/50 font-black uppercase tracking-widest">
                          {entry.type === 'creation' ? 'Criação' 
                           : entry.type === 'status_change' ? 'Alteração de Etapa' 
                           : entry.type === 'note' ? 'Anotações / Visita / Ligação' 
                           : entry.type === 'document' || entry.type === 'upload' ? 'Documento Adicionado' 
                           : entry.type}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Sidebar: Documents */}
          <div className="space-y-8">
            <div className="bg-surface p-8 rounded-xl shadow-card border border-border">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-black text-primary flex items-center gap-2">
                  <FileText size={20} className="text-accent" /> Documentos
                </h3>
                <label className={`p-2 bg-blue-primary text-white rounded-xl cursor-pointer hover:bg-blue-primary-light transition-all shadow-card ${uploading ? 'pointer-events-none opacity-50' : ''}`}>
                  <input type="file" multiple onChange={handleFileUpload} className="hidden" />
                  {uploading ? <Loader2 className="animate-spin" size={18} /> : <Upload size={18} />}
                </label>
              </div>

              <div className="space-y-3">
                {lead.documents && lead.documents.length > 0 ? lead.documents.map((doc: any, i: number) => (
                  <div key={i} className="group p-4 bg-muted/50 rounded-2xl border border-transparent hover:border-primary/10 transition-all flex items-center justify-between">
                    <div className="flex items-center gap-3 overflow-hidden">
                      <div className="p-2 bg-surface rounded-xl text-primary shadow-sm">
                        <FileText size={16} />
                      </div>
                      <div className="overflow-hidden">
                        <p className="text-xs font-bold text-primary truncate">{doc.name}</p>
                        <p className="text-[9px] font-bold text-muted-foreground uppercase">{new Date(doc.created_at).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <a href={doc.url} target="_blank" rel="noopener noreferrer" className="p-2 hover:bg-surface rounded-lg text-muted-foreground hover:text-primary transition-colors">
                        <ExternalLink size={14} />
                      </a>
                      <button onClick={() => deleteDocument(doc.url)} className="p-2 hover:bg-surface rounded-lg text-red-400 hover:text-red-600 transition-colors">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                )) : (
                  <div className="py-12 text-center border-2 border-dashed border-border rounded-3xl">
                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Nenhum documento</p>
                  </div>
                )}
              </div>

              <div className="mt-8 pt-8 border-t border-border bg-muted/20 -mx-8 -mb-8 p-8 rounded-b-[2.5rem]">
                <div className="flex items-start gap-3">
                  <ShieldCheck size={20} className="text-green-500 shrink-0" />
                  <p className="text-[10px] font-medium text-muted-foreground leading-relaxed">
                    Os documentos são armazenados de forma criptografada e o acesso é restrito apenas à sua conta.
                  </p>
                </div>
              </div>
            </div>

            {/* Performance/Lead Scoring Card */}
            <div className="bg-blue-primary text-white p-8 rounded-xl shadow-card relative overflow-hidden group">
              <div className="relative z-10">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-accent mb-2">Lead Score</p>
                <h2 className="text-5xl font-black mb-4">{lead.score}%</h2>
                <div className="w-full h-2 bg-surface/10 rounded-full overflow-hidden mb-6">
                  <div className="h-full bg-accent rounded-full transition-all duration-1000" style={{ width: `${lead.score}%` }} />
                </div>
                <p className="text-sm font-medium text-white/70 leading-relaxed">
                  Este lead possui um alto índice de conversão baseado no seu histórico com perfis similares.
                </p>
              </div>
              <div className="absolute top-[-20%] right-[-20%] w-40 h-40 bg-surface/5 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-1000" />
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

const DetailItem = ({ icon, label, value }: any) => (
  <div className="flex items-center gap-4">
    <div className="p-2.5 bg-muted rounded-xl text-primary/40">
      {icon}
    </div>
    <div>
      <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">{label}</p>
      <p className="text-sm font-bold text-primary">{value}</p>
    </div>
  </div>
);
