'use client';

import React from 'react';
import { MoreVertical, Calendar, MessageSquare, Flame, Sparkles, Plus } from 'lucide-react';
import { Lead } from '@/types/database';
import { KanbanColumn } from '@/lib/constants/kanban';
import { motion } from 'framer-motion';
import Link from 'next/link';

const getDaysActive = (dateStr: string) => {
  const diffTime = Math.abs(new Date().getTime() - new Date(dateStr).getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

export const KanbanCard = ({ lead, onDragStart }: { lead: Lead, onDragStart: (e: React.DragEvent, id: string) => void }) => {
  return (
    <motion.div 
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full"
    >
      <div 
        draggable
        onDragStart={(e) => onDragStart(e, lead.id)}
        className="bg-white p-5 rounded-[2rem] shadow-sm border border-border/40 hover:shadow-luxury transition-all cursor-grab active:cursor-grabbing group relative overflow-hidden"
      >
        {/* Quality indicator line */}
        <div className={`absolute top-0 left-0 w-1.5 h-full ${lead.temperature === 'hot' ? 'bg-orange-500' : lead.temperature === 'warm' ? 'bg-blue-500' : 'bg-slate-300'}`} />
        
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-1.5">
            <span className={`text-[9px] font-black uppercase tracking-widest px-2.5 py-1.5 rounded-xl ${
              lead.temperature === 'hot' ? 'bg-orange-500/10 text-orange-600' : 
              lead.temperature === 'warm' ? 'bg-blue-500/10 text-blue-600' : 'bg-slate-100 text-slate-500'
            }`}>
              {lead.temperature === 'hot' ? '🔥 Quente' : lead.temperature === 'warm' ? '💧 Morno' : '❄️ Frio'}
            </span>
          </div>
          <Link href={`/crmhabita/leads/${lead.id}`} className="text-muted-foreground hover:text-primary opacity-0 group-hover:opacity-100 transition-opacity p-1 bg-muted/50 rounded-lg">
            <MoreVertical size={14} />
          </Link>
        </div>

        <Link href={`/crmhabita/leads/${lead.id}`}>
          <h4 className="font-black text-primary text-sm mb-1 leading-tight group-hover:text-accent transition-colors">{lead.name}</h4>
        </Link>
        
        <p className="text-[10px] font-bold text-muted-foreground/60 mb-5 flex items-center gap-1 uppercase tracking-wider">
          <Sparkles size={10} className="text-accent" />
          {lead.source || 'Portal Habita'}
        </p>

        <div className="flex items-center justify-between pt-4 border-t border-border/40">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 text-[10px] font-black text-muted-foreground/40 uppercase">
              <Calendar size={10} />
              {getDaysActive(lead.created_at)}d
            </div>
            <div className="flex items-center gap-1 text-[10px] font-black text-muted-foreground/40 uppercase">
              <MessageSquare size={10} />
              {lead.history?.length || 0}
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="text-[10px] font-black text-primary">{lead.score}%</div>
            <div className="w-10 h-1.5 bg-muted rounded-full overflow-hidden">
              <div className={`h-full rounded-full ${lead.score > 80 ? 'bg-green-500' : 'bg-accent'}`} style={{ width: `${lead.score}%` }} />
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export const KanbanColumnComponent = ({ column, leads, onMoveLead }: { column: KanbanColumn, leads: Lead[], onMoveLead: (id: string, status: string) => void }) => {
  const [isOver, setIsOver] = React.useState(false);

  const handleDragStart = (e: React.DragEvent, id: string) => {
    e.dataTransfer.setData('leadId', id);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setIsOver(true);
  };

  const handleDragLeave = () => {
    setIsOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsOver(false);
    const leadId = e.dataTransfer.getData('leadId');
    if (leadId) {
      onMoveLead(leadId, column.id);
    }
  };

  return (
    <div className="flex flex-col w-80 shrink-0 h-full group/col">
      <div className="flex items-center justify-between mb-5 px-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-2xl flex items-center justify-center text-lg shadow-sm border border-white/50" style={{ backgroundColor: column.bg }}>
            {column.emoji}
          </div>
          <div>
            <h3 className="font-black text-[11px] text-primary uppercase tracking-[0.2em]">{column.title}</h3>
            <p className="text-[9px] font-bold text-muted-foreground/50 uppercase tracking-widest">{leads.length} prospectos</p>
          </div>
        </div>
        <button className="p-1.5 text-muted-foreground/30 hover:text-primary transition-colors">
           <Plus size={16} />
        </button>
      </div>

      <div 
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`flex-1 space-y-4 p-4 rounded-[3rem] transition-all duration-300 border-2 scrollbar-hide overflow-y-auto ${
          isOver ? 'border-accent bg-accent/5 scale-[1.02]' : 'border-transparent bg-muted/20'
        }`}
        style={{ backgroundColor: isOver ? undefined : column.bg + '20' }}
      >
        {leads.length > 0 ? (
          leads.map(lead => (
            <KanbanCard key={lead.id} lead={lead} onDragStart={handleDragStart} />
          ))
        ) : (
          <div className="h-40 flex flex-col items-center justify-center border-2 border-dashed border-border/40 rounded-[2.5rem] opacity-30 gap-2">
             <Plus size={20} />
             <span className="text-[10px] font-black uppercase tracking-widest">Solte aqui</span>
          </div>
        )}
        
        <button className="w-full py-5 border-2 border-dashed border-primary/5 rounded-[2rem] text-[10px] font-black uppercase tracking-widest text-primary/10 hover:bg-white hover:border-accent/30 hover:text-accent transition-all">
          + Novo Lead
        </button>
      </div>
    </div>
  );
};
