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
    <Link href={`/dashboard/leads/${lead.id}`}>
      <motion.div 
        layout
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white p-4 rounded-xl shadow-sm border border-border hover:shadow-md transition-all cursor-grab active:cursor-grabbing group"
      >
        <div className="flex justify-between items-start mb-3">
          <div className="flex items-center gap-1.5">
            {lead.temperature === 'hot' && <Flame size={14} className="text-orange-500 fill-orange-500" />}
            <span className={`text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded ${
              lead.temperature === 'hot' ? 'bg-orange-100 text-orange-600' : 
              lead.temperature === 'warm' ? 'bg-blue-100 text-blue-600' : 'bg-slate-100 text-slate-600'
            }`}>
              {lead.temperature}
            </span>
          </div>
          <button className="text-muted-foreground hover:text-primary opacity-0 group-hover:opacity-100 transition-opacity">
            <MoreVertical size={16} />
          </button>
        </div>

        <h4 className="font-bold text-primary text-sm mb-1">{lead.name}</h4>
        <p className="text-xs text-muted-foreground mb-3 truncate">
          {lead.source || 'Origem não identificada'}
        </p>

        <div className="flex items-center justify-between mt-4 pt-3 border-t border-border/50">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 text-[10px] font-medium text-muted-foreground">
              <Calendar size={12} />
              {getDaysActive(lead.created_at)}d
            </div>
            <div className="flex items-center gap-1 text-[10px] font-medium text-muted-foreground">
              <MessageSquare size={12} />
              {lead.history?.length || 0}
            </div>
          </div>
          
          <div className="flex items-center gap-1.5">
            <div className="w-8 h-1 bg-muted rounded-full overflow-hidden">
              <div className={`h-full rounded-full ${lead.score > 80 ? 'bg-green-500' : 'bg-accent'}`} style={{ width: `${lead.score}%` }} />
            </div>
            <span className="text-[10px] font-bold text-primary">{lead.score}%</span>
          </div>
        </div>
      </motion.div>
    </Link>
  );
};

export const KanbanColumnComponent = ({ column, leads }: { column: KanbanColumn, leads: Lead[] }) => {
  return (
    <div className="flex flex-col w-72 shrink-0 h-full">
      <div className="flex items-center justify-between mb-4 px-2">
        <div className="flex items-center gap-2">
          <span className="text-lg">{column.emoji}</span>
          <h3 className="font-bold text-sm text-primary uppercase tracking-wide">{column.title}</h3>
          <span className="text-xs font-bold bg-muted px-2 py-0.5 rounded-full text-muted-foreground">
            {leads.length}
          </span>
        </div>
      </div>

      <div 
        className="flex-1 space-y-3 p-2 rounded-2xl transition-colors min-h-[200px]"
        style={{ backgroundColor: column.bg + '50' }} // 50 is roughly 30% opacity in hex
      >
        {leads.map(lead => (
          <KanbanCard key={lead.id} lead={lead} />
        ))}
        
        <button className="w-full py-2 border-2 border-dashed border-primary/10 rounded-xl text-xs font-bold text-primary/40 hover:bg-white/50 hover:border-primary/30 transition-all">
          + Adicionar Lead
        </button>
      </div>
    </div>
  );
};
