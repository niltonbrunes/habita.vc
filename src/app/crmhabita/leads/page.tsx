'use client';

import React from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { KanbanColumnComponent } from '@/components/ui/Kanban';
import { KANBAN_COLUMNS } from '@/lib/constants/kanban';
import { useLeads } from '@/hooks/useLeads';
import { Search, Filter, Plus, Download, RefreshCw, Upload, AlertCircle } from 'lucide-react';
import { LeadFormModal } from '@/components/leads/LeadFormModal';
import { ImportLeadsModal } from '@/components/leads/ImportLeadsModal';
import { LeadsService } from '@/services/leads.service';

import { KanbanHeader } from '@/components/ui/KanbanHeader';
import { useAuth } from '@/context/AuthContext';

export default function LeadsPage() {
  const { leadsByStatus, leads, loading, error, refresh } = useLeads();
  const { profile, isRole } = useAuth();
  const [isLeadModalOpen, setIsLeadModalOpen] = React.useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = React.useState(false);
  const [search, setSearch] = React.useState('');

  // 1. Role-based Visibility Filtering
  const visibleLeads = React.useMemo(() => {
    if (!profile) return [];
    if (isRole(['admin', 'manager', 'director'])) return leads;
    // Brokers see only their assigned leads
    return leads.filter(l => l.assigned_to_id === profile.id);
  }, [leads, profile, isRole]);

  // 2. Search & Search Filtering
  const filteredLeads = React.useMemo(() => {
    if (!search.trim()) return visibleLeads;
    const q = search.toLowerCase();
    return visibleLeads.filter(l =>
      (l.name ?? '').toLowerCase().includes(q) ||
      (l.email ?? '').toLowerCase().includes(q) ||
      (l.phone ?? '').includes(q)
    );
  }, [visibleLeads, search]);

  // 3. Group by Status for Kanban
  const groupedLeads = React.useMemo(() => {
    return filteredLeads.reduce((acc, lead) => {
      if (!acc[lead.status]) acc[lead.status] = [];
      acc[lead.status].push(lead);
      return acc;
    }, {} as Record<string, typeof leads>);
  }, [filteredLeads]);

  const handleExport = async () => {
    try {
      const data = await LeadsService.exportToCSV();
      const csvContent = "data:text/csv;charset=utf-8," 
        + "Nome,Email,Telefone,Status,Origem\n"
        + data.map((e: any) => `${e.name},${e.email || ''},${e.phone || ''},${e.status},${e.source || ''}`).join("\n");
      
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", `habita_leads_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
    } catch (err) {
      console.error('Erro no export:', err);
    }
  };

  const handleMoveLead = async (id: string, newStatus: string) => {
    try {
      await LeadsService.update(id, { status: newStatus as any });
      refresh();
    } catch (err) {
      console.error('Erro ao mover lead:', err);
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

  return (
    <DashboardLayout>
      <div className="h-[calc(100vh-58px)] flex flex-col p-6 lg:p-8">
        {/* Page Header Area */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
          <div>
            <h1 className="text-2xl font-bold text-heading tracking-tighter mb-2">Gestão de Leads</h1>
            <p className="text-muted-foreground font-medium">Pipeline de vendas e conversão em tempo real.</p>
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
            <button 
              onClick={() => setIsLeadModalOpen(true)}
              className="flex-1 md:flex-none px-8 py-4 bg-blue-primary text-white rounded-2xl text-sm font-black hover:bg-blue-primary-light transition-all shadow-card flex items-center gap-2"
            >
              <Plus size={20} /> Novo Lead
            </button>
          </div>
        </div>

        {/* Financial Header & Search */}
        <KanbanHeader 
          leads={visibleLeads} 
          search={search} 
          onSearchChange={setSearch} 
        />

        {/* Modals */}
        <LeadFormModal 
          isOpen={isLeadModalOpen} 
          onClose={() => setIsLeadModalOpen(false)} 
          onSuccess={refresh} 
        />
        <ImportLeadsModal 
          isOpen={isImportModalOpen} 
          onClose={() => setIsImportModalOpen(false)} 
          onSuccess={refresh} 
        />

        {error && (
          <div className="bg-red-50 border border-red-100 p-6 rounded-xl flex items-center gap-4 text-red-600 mb-8 animate-in fade-in duration-500">
            <AlertCircle size={24} />
            <div>
              <p className="font-bold text-sm">Erro ao carregar leads</p>
              <p className="text-xs opacity-80">NÃ£o foi possÃ­vel conectar ao banco de dados ou a tabela nÃ£o existe.</p>
            </div>
          </div>
        )}

        {/* Kanban Board Container */}
        <div className="flex-1 overflow-x-auto pb-10 scrollbar-thin scrollbar-thumb-primary/10 relative min-h-[600px] -mx-8 px-8">
          {loading && (
            <div className="absolute inset-0 bg-surface/50 backdrop-blur-[1px] z-20 flex items-center justify-center">
              <RefreshCw className="animate-spin text-primary" size={32} />
            </div>
          )}
          
          <div className="flex gap-8 min-h-full min-w-max pb-4">
            {KANBAN_COLUMNS.map(column => (
              <KanbanColumnComponent 
                key={column.id} 
                column={column} 
                leads={groupedLeads[column.id] || []} 
                onMoveLead={handleMoveLead}
                onAddLead={() => setIsLeadModalOpen(true)}
                onDeleteLead={handleDeleteLead}
              />
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}


