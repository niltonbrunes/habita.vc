'use client';

import React from 'react';
import { MoreVertical, Calendar, MessageSquare, Flame } from 'lucide-react';
import { Lead } from '@/types/database';
import { KanbanColumn } from '@/lib/constants/kanban';
import { motion } from 'framer-motion';
import Link from 'next/link';

const getDaysActive = (dateStr: string) => {
  const diffTime = Math.abs(new Date().getTime() - new Date(dateStr).getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

export const KanbanCard = ({ lead }: { lead: Lead }) => {
  return (
    <Link href={`/crmhabita/leads/${lead.id}`}>
      <motion.div 
        layout
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white p-5 rounded-[1.5rem] shadow-sm border border-border/60 hover:shadow-luxury transition-all cursor-grab active:cursor-grabbing group relative overflow-hidden"
      >
        {/* Quality indicator line */}
        <div className={`absolute top-0 left-0 w-1 h-full ${lead.temperature === 'hot' ? 'bg-orange-500' : lead.temperature === 'warm' ? 'bg-blue-500' : 'bg-slate-300'}`} />
        
        <div className="flex justify-between items-start mb-3">
          <div className="flex items-center gap-1.5">
            <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded-lg ${
              lead.temperature === 'hot' ? 'bg-orange-500/10 text-orange-600' : 
              lead.temperature === 'warm' ? 'bg-blue-500/10 text-blue-600' : 'bg-slate-100 text-slate-500'
            }`}>
              {lead.temperature === 'hot' ? '🔥 Quente' : lead.temperature === 'warm' ? '💧 Morno' : '❄️ Frio'}
            </span>
          </div>
          <button className="text-muted-foreground hover:text-primary opacity-0 group-hover:opacity-100 transition-opacity p-1">
            <MoreVertical size={14} />
          </button>
        </div>

        <h4 className="font-black text-primary text-sm mb-1 leading-tight group-hover:text-accent transition-colors">{lead.name}</h4>
        <p className="text-[10px] font-bold text-muted-foreground/60 mb-4 flex items-center gap-1 uppercase tracking-wider">
          <Sparkles size={10} className="text-accent" />
          {lead.source || 'Portal Habita'}
        </p>

        <div className="flex items-center justify-between pt-3 border-t border-border/40">
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
      </motion.div>
    </Link>
  );
};

export const KanbanColumnComponent = ({ column, leads }: { column: KanbanColumn, leads: Lead[] }) => {
  return (
    <div className="flex flex-col w-80 shrink-0 h-full group/col">
      <div className="flex items-center justify-between mb-5 px-3">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center text-lg shadow-sm border border-white/50" style={{ backgroundColor: column.bg }}>
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
        className="flex-1 space-y-4 p-3 rounded-[2.5rem] transition-all duration-500 border border-transparent group-hover/col:border-border/40 bg-muted/20 scrollbar-hide overflow-y-auto"
        style={{ backgroundColor: column.bg + '40' }}
      >
        {leads.length > 0 ? (
          leads.map(lead => (
            <KanbanCard key={lead.id} lead={lead} />
          ))
        ) : (
          <div className="h-32 flex items-center justify-center border-2 border-dashed border-border/40 rounded-[2rem] opacity-40">
             <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Vazio</span>
          </div>
        )}
        
        <button className="w-full py-4 border-2 border-dashed border-primary/5 rounded-[1.5rem] text-[10px] font-black uppercase tracking-widest text-primary/20 hover:bg-white hover:border-accent/30 hover:text-accent transition-all">
          + Novo Lead em {column.title}
        </button>
      </div>
    </div>
  );
};
