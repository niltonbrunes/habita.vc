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

export default function LeadsPage() {
  const { leadsByStatus, loading, error, refresh } = useLeads();
  const [isLeadModalOpen, setIsLeadModalOpen] = React.useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = React.useState(false);
  const [search, setSearch] = React.useState('');

  const filteredLeadsByStatus = React.useMemo(() => {
    if (!search.trim()) return leadsByStatus;
    const q = search.toLowerCase();
    return Object.fromEntries(
      Object.entries(leadsByStatus).map(([status, leads]) => [
        status,
        leads.filter(l =>
          (l.name ?? '').toLowerCase().includes(q) ||
          (l.email ?? '').toLowerCase().includes(q) ||
          (l.phone ?? '').includes(q)
        )
      ])
    );
  }, [leadsByStatus, search]);

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

  return (
    <DashboardLayout>
      <div className="h-full flex flex-col space-y-6">
        {/* Actions Bar */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:w-80">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
              <input 
                type="text" 
                placeholder="Buscar lead..." 
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-white rounded-2xl border border-border focus:border-primary/20 transition-all outline-none text-sm font-medium"
              />
            </div>
            <button className="p-3 bg-white border border-border rounded-2xl text-muted-foreground hover:text-primary hover:bg-muted/50 transition-all">
              <Filter size={20} />
            </button>
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto">
            <button 
              onClick={handleExport}
              className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-3 bg-white border border-border rounded-2xl text-sm font-bold text-muted-foreground hover:text-primary transition-all"
            >
              <Download size={18} /> Exportar
            </button>
            <button 
              onClick={() => setIsImportModalOpen(true)}
              className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-3 bg-white border border-border rounded-2xl text-sm font-bold text-muted-foreground hover:text-primary transition-all"
            >
              <Upload size={18} /> Importar
            </button>
            <button 
              onClick={() => setIsLeadModalOpen(true)}
              className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-primary text-white rounded-2xl text-sm font-black hover:bg-primary-light transition-all shadow-premium"
            >
              <Plus size={20} /> Novo Lead
            </button>
          </div>
        </div>

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
          <div className="bg-red-50 border border-red-100 p-6 rounded-[2rem] flex items-center gap-4 text-red-600 mb-8 animate-in fade-in duration-500">
            <AlertCircle size={24} />
            <div>
              <p className="font-bold text-sm">Erro ao carregar leads</p>
              <p className="text-xs opacity-80">Não foi possível conectar ao banco de dados ou a tabela não existe.</p>
            </div>
          </div>
        )}

        {/* Kanban Board Container */}
        <div className="flex-1 overflow-x-auto pb-6 scrollbar-thin scrollbar-thumb-primary/10 relative min-h-[600px]">
          {loading && (
            <div className="absolute inset-0 bg-white/50 backdrop-blur-[1px] z-20 flex items-center justify-center">
              <RefreshCw className="animate-spin text-primary" size={32} />
            </div>
          )}

          <div className="mb-4 flex items-center gap-2">
             <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
               Total: {Object.values(filteredLeadsByStatus).flat().length} leads encontrados
             </span>
          </div>
          
          <div className="flex gap-6 min-h-full min-w-max">
            {KANBAN_COLUMNS.map(column => (
              <KanbanColumnComponent 
                key={column.id} 
                column={column} 
                leads={filteredLeadsByStatus[column.id] || []} 
              />
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
