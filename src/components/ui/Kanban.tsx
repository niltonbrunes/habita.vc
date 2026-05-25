'use client';

import React from 'react';
import { MoreVertical, Calendar, MessageSquare, Flame, Sparkles, Plus, Building, MapPin, Trash2, Phone, Mail, MessageCircle } from 'lucide-react';
import { Lead } from '@/types/database';
import { KanbanColumn } from '@/lib/constants/kanban';
import { motion } from 'framer-motion';
import Link from 'next/link';

const getDaysActive = (dateStr: string) => {
  const diffTime = Math.abs(new Date().getTime() - new Date(dateStr).getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

const AVATAR_COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#06b6d4', '#8b5cf6'];
const getAvatarBg = (name: string) => AVATAR_COLORS[name.charCodeAt(0) % AVATAR_COLORS.length];
const getInitials = (name: string) => name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();

export const KanbanCard = ({ lead, onDragStart, onDeleteLead }: { lead: Lead, onDragStart: (e: React.DragEvent, id: string) => void, onDeleteLead: (id: string) => void }) => {
  const displayName = lead.person?.name || lead.name;
  
  const formattedValue = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    maximumFractionDigits: 0
  }).format(lead.value || 0);

  return (
    <motion.div 
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="w-full"
    >
      <div 
        draggable
        onDragStart={(e) => onDragStart(e, lead.id)}
        className="bg-surface p-2.5 rounded-[10px] shadow-sm hover:shadow-card transition-all duration-300 cursor-grab active:cursor-grabbing group relative border border-border-light hover:border-accent/30 flex flex-col gap-2"
      >
        <div className="flex justify-between items-start gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <div 
              className="w-6 h-6 rounded-md flex items-center justify-center text-[9px] font-black text-white flex-shrink-0"
              style={{ backgroundColor: getAvatarBg(displayName) }}
            >
              {getInitials(displayName)}
            </div>
            <Link href={lead.person_id ? `/crmhabita/pessoas/${lead.person_id}` : `/crmhabita/leads/${lead.id}`} className="min-w-0">
              <h4 className="font-bold text-heading text-[12px] leading-tight hover:text-accent transition-colors truncate">{displayName}</h4>
            </Link>
          </div>
          
          <button 
            onClick={(e) => {
              e.stopPropagation();
              if (window.confirm('Excluir esta oportunidade?')) onDeleteLead(lead.id);
            }}
            className="text-muted/40 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100 flex-shrink-0"
          >
            <Trash2 size={12} />
          </button>
        </div>

        <div className="flex items-center justify-between mt-1">
          <p className="text-[12px] font-black text-primary">{formattedValue}</p>
          <div className="flex items-center gap-1">
             <Sparkles size={10} className="text-accent" />
             <span className="text-[10px] font-bold text-muted">{lead.score} pts</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export const KanbanColumnComponent = ({ column, leads, onMoveLead, onAddLead, onDeleteLead }: { column: KanbanColumn, leads: Lead[], onMoveLead: (id: string, status: string) => void, onAddLead: () => void, onDeleteLead: (id: string) => void }) => {
  const [isOver, setIsOver] = React.useState(false);
  
  const columnTotalValue = leads.reduce((acc, lead) => acc + (lead.value || 0), 0);
  const formattedColumnValue = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    maximumFractionDigits: 0
  }).format(columnTotalValue);

  return (
    <div className="flex flex-col w-[320px] shrink-0 h-full group/col pb-10">
      <div className="flex flex-col mb-4 px-2">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center text-lg shadow-card border-2 border-white" style={{ backgroundColor: column.bg }}>
              {column.emoji}
            </div>
            <div>
              <h3 className="font-black text-sm text-primary uppercase tracking-[0.25em]">{column.title}</h3>
              <p className="text-[10px] font-bold text-muted-foreground/30 uppercase tracking-widest">{leads.length} leads</p>
            </div>
          </div>
          <button 
            onClick={onAddLead}
            className="w-6 h-6 flex items-center justify-center bg-surface shadow-card rounded-2xl text-muted-foreground/40 hover:text-primary hover:scale-110 transition-all"
          >
             <Plus size={12} />
          </button>
        </div>
        
        {leads.length > 0 && (
          <div className="px-2">
             <p className="text-xl font-bold text-heading/80 tracking-tighter leading-none">{formattedColumnValue}</p>
             <p className="text-[10px] font-black text-muted-foreground/30 uppercase tracking-[0.2em] mt-2">Volume na etapa</p>
          </div>
        )}
      </div>

      <div 
        onDragOver={(e) => { e.preventDefault(); setIsOver(true); }}
        onDragLeave={() => setIsOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setIsOver(false);
          const leadId = e.dataTransfer.getData('leadId');
          if (leadId) onMoveLead(leadId, column.id);
        }}
        className={`flex-1 space-y-3 p-3 rounded-2xl transition-all duration-500 border-2 scrollbar-hide overflow-y-auto ${
          isOver ? 'border-accent bg-accent/5 scale-[1.02]' : 'border-transparent bg-muted/10'
        }`}
        style={{ backgroundColor: isOver ? undefined : column.bg + '08' }}
      >
        {leads.length > 0 ? (
          leads.map(lead => (
            <KanbanCard 
              key={lead.id} 
              lead={lead} 
              onDragStart={(e, id) => {
                e.dataTransfer.setData('leadId', id);
                e.dataTransfer.effectAllowed = 'move';
              }} 
              onDeleteLead={onDeleteLead} 
            />
          ))
        ) : (
          <div className="h-64 flex flex-col items-center justify-center border-2 border-dashed border-border/10 rounded-[3.5rem] opacity-20 gap-4">
             <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center">
                <Plus size={32} className="text-muted-foreground" />
             </div>
             <span className="text-[12px] font-black uppercase tracking-[0.3em]">Arrastar para cá</span>
          </div>
        )}
        
        <button 
          onClick={onAddLead}
          className="w-full py-8 border-2 border-dashed border-primary/5 rounded-xl text-[11px] font-black uppercase tracking-widest text-primary/10 hover:bg-surface hover:border-accent/20 hover:text-accent transition-all duration-300"
        >
          + Nova Oportunidade
        </button>
      </div>
    </div>
  );
};
