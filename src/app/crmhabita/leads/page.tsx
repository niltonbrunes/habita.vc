'use client';

import React from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { KanbanColumnComponent } from '@/components/ui/Kanban';
import { KANBAN_COLUMNS } from '@/lib/constants/kanban';
import { CAPTACAO_COLUMNS } from '@/lib/constants/captacao';
import { useLeads } from '@/hooks/useLeads';
import {
  Search, Plus, Download, RefreshCw, AlertCircle, Upload,
  ShoppingBag, Home
} from 'lucide-react';
import { LeadFormModal } from '@/components/leads/LeadFormModal';
import { MoveJustificationModal } from '@/components/leads/MoveJustificationModal';
import { ImportLeadsModal } from '@/components/leads/ImportLeadsModal';
import { CaptacaoFormModal } from '@/components/captacao/CaptacaoFormModal';
import { CaptacaoColumnComponent } from '@/components/captacao/CaptacaoKanban';
import { TaskModal } from '@/components/agenda/TaskModal';
import { CaptacaoHeader } from '@/components/captacao/CaptacaoHeader';
import { LeadsService } from '@/services/leads.service';
import { PropertiesService } from '@/services/properties.service';
import { KanbanHeader } from '@/components/ui/KanbanHeader';
import { useAuth } from '@/context/AuthContext';
import { SellerLeadStatus, Lead } from '@/types/database';

type PipelineTab = 'buyer' | 'seller';

export default function LeadsPage() {
  const { leads, loading, error, refresh } = useLeads();
  const { profile, isRole } = useAuth();

  // ── Tab state ──────────────────────────────────────────────────────
  const [activeTab, setActiveTab] = React.useState<PipelineTab>('buyer');
  const [isBuyerModalOpen, setIsBuyerModalOpen] = React.useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = React.useState(false);
  const [isCaptacaoModalOpen, setIsCaptacaoModalOpen] = React.useState(false);
  const [isTaskModalOpen, setIsTaskModalOpen] = React.useState(false);
  const [selectedLeadForTask, setSelectedLeadForTask] = React.useState<{ id: string, name: string } | null>(null);

  const handleScheduleLead = (lead: Lead) => {
    setSelectedLeadForTask({
      id: lead.id,
      name: lead.person?.name || lead.name
    });
    setIsTaskModalOpen(true);
  };
  const [search, setSearch] = React.useState('');
  const [pendingMove, setPendingMove] = React.useState<{
    id: string;
    newStatus: string;
    fromStatus: string;
    leadName: string;
    type: 'buyer' | 'seller';
  } | null>(null);

  // ── Role-based filter ──────────────────────────────────────────────
  const visibleLeads = React.useMemo(() => {
    if (!profile) return [];
    if (isRole(['admin', 'manager', 'director'])) return leads;
    return leads.filter((l: Lead) => l.assigned_to_id === profile.id);
  }, [leads, profile, isRole]);

  // ── Split buyer / seller ───────────────────────────────────────────
  const buyerLeads = React.useMemo(
    () => visibleLeads.filter((l: Lead) => !l.lead_type || l.lead_type === 'buyer'),
    [visibleLeads],
  );
  const sellerLeads = React.useMemo(
    () => visibleLeads.filter((l: Lead) => l.lead_type === 'seller'),
    [visibleLeads],
  );

  // ── Search filter ──────────────────────────────────────────────────
  const filteredBuyers = React.useMemo(() => {
    if (!search.trim()) return buyerLeads;
    const q = search.toLowerCase();
    return buyerLeads.filter(
      (l: Lead) =>
        (l.name ?? '').toLowerCase().includes(q) ||
        (l.email ?? '').toLowerCase().includes(q) ||
        (l.phone ?? '').includes(q),
    );
  }, [buyerLeads, search]);

  const filteredSellers = React.useMemo(() => {
    if (!search.trim()) return sellerLeads;
    const q = search.toLowerCase();
    return sellerLeads.filter(
      (l: Lead) =>
        (l.name ?? '').toLowerCase().includes(q) ||
        (l.seller_property_address ?? '').toLowerCase().includes(q) ||
        (l.seller_property_type ?? '').toLowerCase().includes(q) ||
        (l.phone ?? '').includes(q),
    );
  }, [sellerLeads, search]);

  // ── Group by status for kanban ─────────────────────────────────────
  const groupedBuyers = React.useMemo(
    () =>
      filteredBuyers.reduce(
        (acc: Record<string, Lead[]>, lead: Lead) => {
          if (!acc[lead.status]) acc[lead.status] = [];
          acc[lead.status].push(lead);
          return acc;
        },
        {} as Record<string, Lead[]>,
      ),
    [filteredBuyers],
  );

  const groupedSellers = React.useMemo(
    () =>
      filteredSellers.reduce(
        (acc: Record<string, Lead[]>, lead: Lead) => {
          if (!acc[lead.status]) acc[lead.status] = [];
          acc[lead.status].push(lead);
          return acc;
        },
        {} as Record<string, Lead[]>,
      ),
    [filteredSellers],
  );

  // ── Handlers ───────────────────────────────────────────────────────
  const handleExport = async () => {
    try {
      const data = await LeadsService.exportToCSV();
      const csvContent =
        'data:text/csv;charset=utf-8,' +
        'Nome,Email,Telefone,Status,Tipo,Origem\n' +
        data
          .map(
            (e: any) =>
              `${e.name},${e.email || ''},${e.phone || ''},${e.status},${e.lead_type || 'buyer'},${e.source || ''}`,
          )
          .join('\n');

      const link = document.createElement('a');
      link.setAttribute('href', encodeURI(csvContent));
      link.setAttribute('download', `habita_leads_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error('Erro no export:', err);
    }
  };

  const handleMoveBuyer = async (id: string, newStatus: string) => {
    const current = leads.find((l: Lead) => l.id === id);
    if (!current) return;
    setPendingMove({
      id,
      newStatus,
      fromStatus: current.status,
      leadName: current.name || 'Lead',
      type: 'buyer'
    });
  };

  const handleMoveSeller = async (id: string, newStatus: SellerLeadStatus) => {
    const current = leads.find((l: Lead) => l.id === id);
    if (!current) return;
    setPendingMove({
      id,
      newStatus,
      fromStatus: current.status,
      leadName: current.name || 'Lead',
      type: 'seller'
    });
  };

  const executeMove = async (justificationNote?: string) => {
    if (!pendingMove) return;
    const { id, newStatus, fromStatus, type } = pendingMove;
    
    try {
      const current = leads.find((l: Lead) => l.id === id);
      if (!current) return;

      const labels = type === 'buyer' 
        ? {
            lead: 'Novos Leads',
            contact: 'Contato',
            presentation: 'Apresentação',
            visit: 'Visitas',
            proposal: 'Proposta',
            sale: 'Fechamento',
            lost: 'Perdido',
          }
        : {
            prospecting: 'Prospecção',
            contacted: 'Contatado',
            visit_scheduled: 'Visita Agendada',
            visited: 'Visitado',
            proposal_sent: 'Proposta Enviada',
            captured: 'Captado',
            lost: 'Perdido',
          };

      const fromLabel = labels[fromStatus as keyof typeof labels] || fromStatus;
      const toLabel = labels[newStatus as keyof typeof labels] || newStatus;

      const noteText = justificationNote 
        ? `Movido de "${fromLabel}" para "${toLabel}". Justificativa: ${justificationNote}`
        : `Movido de "${fromLabel}" para "${toLabel}"`;

      const historyEntry = {
        type: 'status_change',
        from: fromStatus,
        to: newStatus,
        date: new Date().toISOString(),
        note: noteText,
      };

      await LeadsService.update(id, {
        status: newStatus as any,
        history: [...(current.history || []), historyEntry]
      });

      // ⚡ Conversão automática: Captado ➔ Imóvel Suspenso ⚡
      if (type === 'seller' && newStatus === 'captured' && profile) {
        try {
          const property = await PropertiesService.createFromSellerLead(current, profile.id);
          console.log('✔ Imóvel criado automaticamente (suspenso):', property.id);
          window.dispatchEvent(
            new CustomEvent('habita:property-created', { detail: { propertyId: property.id } }),
          );
        } catch (propErr) {
          console.error('Erro ao criar imóvel automaticamente:', propErr);
        }
      }

      refresh();
    } catch (err) {
      console.error(`Erro ao mover lead ${type}:`, err);
    } finally {
      setPendingMove(null);
    }
  };

  const handleDeleteLead = async (id: string) => {
    try {
      await LeadsService.delete(id);
      refresh();
    } catch (err) {
      console.error('Erro ao excluir lead:', err);
      alert('Erro ao excluir oportunidade.');
    }
  };

  // ── Notification for property auto-creation ──────────────────────
  const [capturedNotice, setCapturedNotice] = React.useState<string | null>(null);
  React.useEffect(() => {
    const handler = (e: any) => {
      setCapturedNotice(e.detail.propertyId);
      setTimeout(() => setCapturedNotice(null), 6000);
    };
    window.addEventListener('habita:property-created', handler);
    return () => window.removeEventListener('habita:property-created', handler);
  }, []);

  // ── Tab counts ────────────────────────────────────────────────────
  const buyerCount = buyerLeads.length;
  const sellerCount = sellerLeads.length;

  return (
    <DashboardLayout>
      <div className="h-[calc(100vh-58px)] flex flex-col p-6 lg:p-8">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-heading tracking-tighter mb-1">Gestão de Leads</h1>
            <p className="text-muted-foreground font-medium text-sm">
              Pipeline de vendas e captação de imóveis em tempo real.
            </p>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <button
              onClick={handleExport}
              className="flex-1 md:flex-none p-4 bg-surface border border-border/40 rounded-2xl text-muted-foreground hover:text-primary transition-all shadow-sm"
              title="Exportar CSV"
            >
              <Download size={20} />
            </button>
            <button
              onClick={() => setIsImportModalOpen(true)}
              className="flex-1 md:flex-none px-6 py-4 bg-surface border border-border/40 rounded-2xl text-sm font-black text-muted-foreground hover:text-primary transition-all shadow-sm flex items-center gap-2"
            >
              <Upload size={18} /> Importar
            </button>
            {activeTab === 'buyer' ? (
              <button
                onClick={() => setIsBuyerModalOpen(true)}
                className="flex-1 md:flex-none px-8 py-4 bg-blue-primary text-white rounded-2xl text-sm font-black hover:bg-blue-primary-light transition-all shadow-card flex items-center gap-2"
              >
                <Plus size={20} /> Novo Lead
              </button>
            ) : (
              <button
                onClick={() => setIsCaptacaoModalOpen(true)}
                className="flex-1 md:flex-none px-8 py-4 bg-emerald-500 hover:bg-emerald-600 text-white rounded-2xl text-sm font-black transition-all shadow-card flex items-center gap-2"
              >
                <Home size={20} /> Nova Captação
              </button>
            )}
          </div>
        </div>

        {/* ── Pipeline Tabs ── */}
        <div className="flex items-center gap-2 mb-8 bg-muted/20 p-1.5 rounded-2xl w-fit border border-border/30">
          <TabButton
            active={activeTab === 'buyer'}
            onClick={() => { setActiveTab('buyer'); setSearch(''); }}
            icon={<ShoppingBag size={16} />}
            label="Compradores"
            count={buyerCount}
            activeColor="bg-blue-primary"
          />
          <TabButton
            active={activeTab === 'seller'}
            onClick={() => { setActiveTab('seller'); setSearch(''); }}
            icon={<Home size={16} />}
            label="Captação"
            count={sellerCount}
            activeColor="bg-emerald-500"
          />
        </div>

        {/* ── Auto-capture notification ── */}
        {capturedNotice && (
          <div className="mb-4 flex items-center gap-3 bg-emerald-50 border border-emerald-200 text-emerald-700 px-5 py-3 rounded-xl text-sm font-bold animate-in slide-in-from-top-2 duration-300">
            <span className="text-lg">🎉</span>
            <span>
              Imóvel criado automaticamente com status <strong>Suspenso</strong> — aguardando fotos e descrição comercial para publicação.
            </span>
            <a
              href="/crmhabita/imoveis"
              className="ml-auto text-xs font-black underline hover:no-underline flex-shrink-0"
            >
              Ver Imóveis →
            </a>
          </div>
        )}

        {/* ── Error ── */}
        {error && (
          <div className="bg-red-50 border border-red-100 p-6 rounded-xl flex items-center gap-4 text-red-600 mb-8 animate-in fade-in duration-500">
            <AlertCircle size={24} />
            <div>
              <p className="font-bold text-sm">Erro ao carregar leads</p>
              <p className="text-xs opacity-80">Não foi possível conectar ao banco de dados.</p>
            </div>
          </div>
        )}

        {/* ── Headers ── */}
        {activeTab === 'buyer' ? (
          <KanbanHeader leads={buyerLeads} search={search} onSearchChange={setSearch} />
        ) : (
          <CaptacaoHeader leads={sellerLeads} search={search} onSearchChange={setSearch} />
        )}

        {/* ── Kanban Board ── */}
        <div className="flex-1 overflow-x-auto pb-10 scrollbar-thin scrollbar-thumb-primary/10 relative min-h-[600px] -mx-8 px-8">
          {loading && (
            <div className="absolute inset-0 bg-surface/50 backdrop-blur-[1px] z-20 flex items-center justify-center">
              <RefreshCw className="animate-spin text-primary" size={32} />
            </div>
          )}

          {activeTab === 'buyer' ? (
            <div className="flex gap-8 min-h-full min-w-max pb-4">
              {KANBAN_COLUMNS.map(column => (
                <KanbanColumnComponent
                  key={column.id}
                  column={column}
                  leads={groupedBuyers[column.id] || []}
                  onMoveLead={handleMoveBuyer}
                  onAddLead={() => setIsBuyerModalOpen(true)}
                  onDeleteLead={handleDeleteLead}
                  onScheduleLead={handleScheduleLead}
                />
              ))}
            </div>
          ) : (
            <div className="flex gap-8 min-h-full min-w-max pb-4">
              {CAPTACAO_COLUMNS.map(column => (
                <CaptacaoColumnComponent
                  key={column.id}
                  column={column}
                  leads={groupedSellers[column.id] || []}
                  onMoveLead={handleMoveSeller}
                  onAddLead={() => setIsCaptacaoModalOpen(true)}
                  onDeleteLead={handleDeleteLead}
                  onScheduleLead={handleScheduleLead}
                />
              ))}
            </div>
          )}
        </div>

        {/* ── Modals ── */}
        <TaskModal
          isOpen={isTaskModalOpen}
          onClose={() => {
            setIsTaskModalOpen(false);
            setSelectedLeadForTask(null);
          }}
          onSuccess={refresh}
          leadId={selectedLeadForTask?.id}
          leadName={selectedLeadForTask?.name}
        />
        <LeadFormModal
          isOpen={isBuyerModalOpen}
          onClose={() => setIsBuyerModalOpen(false)}
          onSuccess={refresh}
        />
        <ImportLeadsModal
          isOpen={isImportModalOpen}
          onClose={() => setIsImportModalOpen(false)}
          onSuccess={refresh}
        />
        <CaptacaoFormModal
          isOpen={isCaptacaoModalOpen}
          onClose={() => setIsCaptacaoModalOpen(false)}
          onSuccess={refresh}
        />
        <MoveJustificationModal
          isOpen={!!pendingMove}
          onClose={() => setPendingMove(null)}
          onConfirm={(note) => executeMove(note)}
          onSkip={() => executeMove()}
          leadName={pendingMove?.leadName || ''}
          fromStatus={pendingMove?.fromStatus || ''}
          toStatus={pendingMove?.newStatus || ''}
          leadType={pendingMove?.type || 'buyer'}
        />
      </div>
    </DashboardLayout>
  );
}

/* ── Tab Button ──────────────────────────────────────────────────── */
const TabButton = ({
  active, onClick, icon, label, count, activeColor,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
  count: number;
  activeColor: string;
}) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-black transition-all duration-200 ${
      active
        ? `${activeColor} text-white shadow-md`
        : 'text-muted-foreground hover:text-primary hover:bg-surface'
    }`}
  >
    {icon}
    {label}
    <span
      className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
        active ? 'bg-white/20 text-white' : 'bg-muted text-muted-foreground'
      }`}
    >
      {count}
    </span>
  </button>
);
