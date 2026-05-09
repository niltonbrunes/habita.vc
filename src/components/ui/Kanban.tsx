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

const AVATAR_COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#06b6d4', '#8b5cf6'];
const getAvatarBg = (name: string) => AVATAR_COLORS[name.charCodeAt(0) % AVATAR_COLORS.length];
const getInitials = (name: string) => name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();

export const KanbanCard = ({ lead, onDragStart }: { lead: Lead, onDragStart: (e: React.DragEvent, id: string) => void }) => {
  const formattedValue = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    maximumFractionDigits: 0
  }).format(lead.value || 0);

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
        className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-border/40 hover:shadow-luxury transition-all cursor-grab active:cursor-grabbing group relative overflow-hidden"
      >
        {/* Top Status Bar */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2">
            <div 
              className="w-10 h-10 rounded-full flex items-center justify-center text-[10px] font-black text-white shadow-lg border-2 border-white"
              style={{ backgroundColor: getAvatarBg(lead.name) }}
            >
              {getInitials(lead.name)}
            </div>
            <div>
              <Link href={`/crmhabita/leads/${lead.id}`}>
              <h4 className="font-black text-primary text-sm leading-tight hover:text-accent transition-colors">{lead.name}</h4>
              </Link>
              <div className="flex items-center gap-1.5 mt-0.5">
                <p className="text-[9px] font-bold text-muted-foreground/50 uppercase tracking-widest">{lead.source || 'Portal'}</p>
                {lead.person_id && (
                  <div className="flex items-center gap-1 px-1.5 py-0.5 bg-green-500/10 text-green-600 rounded-md" title="Contato Verificado na Base">
                    <Sparkles size={8} className="fill-green-600" />
                    <span className="text-[7px] font-black uppercase tracking-tighter">Verificado</span>
                  </div>
                )}
              </div>
            </div>
          </div>
          <Link href={`/crmhabita/leads/${lead.id}`} className="p-2 bg-muted/30 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity">
            <MoreVertical size={14} className="text-muted-foreground" />
          </Link>
        </div>

        {/* Financial Info */}
        <div className="mb-6 space-y-4">
          <div className="flex items-end justify-between">
            <p className="text-xl font-black text-green-600 tracking-tighter leading-none">{formattedValue}</p>
            <span className={`text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full ${
              lead.temperature === 'hot' ? 'bg-orange-500/10 text-orange-600' : 
              lead.temperature === 'warm' ? 'bg-blue-500/10 text-blue-600' : 'bg-slate-100 text-slate-500'
            }`}>
              {lead.temperature === 'hot' ? '🔥 Quente' : lead.temperature === 'warm' ? '💧 Morno' : '❄️ Frio'}
            </span>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between items-center text-[9px] font-black uppercase tracking-widest text-muted-foreground/60">
              <span>Conversão</span>
              <span className="text-primary">{lead.probability}%</span>
            </div>
            <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
               <div 
                 className={`h-full rounded-full transition-all duration-1000 ${
                    (lead.probability || 0) > 70 ? 'bg-green-500' : 
                    (lead.probability || 0) > 40 ? 'bg-accent' : 'bg-slate-300'
                 }`}
                 style={{ width: `${lead.probability}%` }}
               />
            </div>
          </div>
        </div>

        {/* Footer Metrics */}
        <div className="flex items-center justify-between pt-5 border-t border-border/30">
          <div className="flex items-center gap-4">
            <div className="flex flex-col">
              <span className="text-[8px] font-black text-muted-foreground/40 uppercase tracking-widest mb-1">Score IA</span>
              <div className="flex items-center gap-1.5">
                <Sparkles size={10} className="text-accent" />
                <span className="text-[10px] font-black text-primary">{lead.score}</span>
              </div>
            </div>
            <div className="w-px h-6 bg-border/40" />
            <div className="flex flex-col">
              <span className="text-[8px] font-black text-muted-foreground/40 uppercase tracking-widest mb-1">Ativo há</span>
              <div className="flex items-center gap-1.5">
                <Calendar size={10} className="text-muted-foreground/40" />
                <span className="text-[10px] font-black text-primary">{getDaysActive(lead.created_at)}d</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export const KanbanColumnComponent = ({ column, leads, onMoveLead }: { column: KanbanColumn, leads: Lead[], onMoveLead: (id: string, status: string) => void }) => {
  const [isOver, setIsOver] = React.useState(false);
  
  const columnTotalValue = leads.reduce((acc, lead) => acc + (lead.value || 0), 0);
  const formattedColumnValue = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    maximumFractionDigits: 0
  }).format(columnTotalValue);

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
    <div className="flex flex-col w-[340px] shrink-0 h-full group/col">
      <div className="flex flex-col mb-8 px-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <div className="w-11 h-11 rounded-2xl flex items-center justify-center text-xl shadow-sm border border-white/50" style={{ backgroundColor: column.bg }}>
              {column.emoji}
            </div>
            <div>
              <h3 className="font-black text-xs text-primary uppercase tracking-[0.2em]">{column.title}</h3>
              <p className="text-[9px] font-bold text-muted-foreground/50 uppercase tracking-widest">{leads.length} leads ativos</p>
            </div>
          </div>
          <button className="w-9 h-9 flex items-center justify-center bg-white border border-border/40 rounded-xl text-muted-foreground/40 hover:text-primary transition-all">
             <Plus size={18} />
          </button>
        </div>
        
        {leads.length > 0 && (
          <div className="px-1">
             <p className="text-lg font-black text-primary/80 tracking-tighter leading-none">{formattedColumnValue}</p>
             <p className="text-[9px] font-bold text-muted-foreground/40 uppercase tracking-[0.1em] mt-1">Volume total na etapa</p>
          </div>
        )}
      </div>

      <div 
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`flex-1 space-y-5 p-4 rounded-[3.5rem] transition-all duration-300 border-2 scrollbar-hide overflow-y-auto ${
          isOver ? 'border-accent bg-accent/5 scale-[1.01]' : 'border-transparent bg-muted/15'
        }`}
        style={{ backgroundColor: isOver ? undefined : column.bg + '15' }}
      >
        {leads.length > 0 ? (
          leads.map(lead => (
            <KanbanCard key={lead.id} lead={lead} onDragStart={handleDragStart} />
          ))
        ) : (
          <div className="h-48 flex flex-col items-center justify-center border-2 border-dashed border-border/30 rounded-[3rem] opacity-30 gap-3">
             <Plus size={24} className="text-muted-foreground" />
             <span className="text-[11px] font-black uppercase tracking-[0.2em]">Mover para cá</span>
          </div>
        )}
        
        <button className="w-full py-6 border-2 border-dashed border-primary/5 rounded-[2.5rem] text-[10px] font-black uppercase tracking-widest text-primary/20 hover:bg-white hover:border-accent/30 hover:text-accent transition-all">
          + Adicionar Oportunidade
        </button>
      </div>
    </div>
  );
};
