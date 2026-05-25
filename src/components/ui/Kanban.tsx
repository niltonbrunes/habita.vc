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
        className="bg-surface p-4 rounded-xl shadow-card hover:shadow-card transition-all duration-300 cursor-grab active:cursor-grabbing group relative border border-transparent hover:border-accent/10"
      >
        {/* Top Header */}
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-4">
            <div 
              className="w-10 h-10 rounded-lg flex items-center justify-center text-xs font-black text-white shadow-lg border-2 border-white"
              style={{ backgroundColor: getAvatarBg(displayName) }}
            >
              {getInitials(displayName)}
            </div>
            <div className="min-w-0">
              <Link href={lead.person_id ? `/crmhabita/pessoas/${lead.person_id}` : `/crmhabita/leads/${lead.id}`}>
                <h4 className="font-black text-primary text-[13px] leading-tight hover:text-accent transition-colors truncate pr-2">{displayName}</h4>
              </Link>
              <div className="flex items-center gap-2 mt-1">
                <p className="text-[10px] font-black text-muted-foreground/40 uppercase tracking-widest">{lead.source || 'Portal'}</p>
                {lead.person_id && (
                  <span className="flex items-center gap-1 text-[7px] font-black uppercase text-green-600 bg-green-50 px-2 py-0.5 rounded-md">
                    <Sparkles size={8} /> Verificado
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Quick Contact Actions */}
        <div className="flex items-center gap-3 mb-4">
          {lead.phone && (
            <a 
              href={`https://wa.me/55${lead.phone.replace(/\D/g, '')}`}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="w-11 h-11 bg-green-50 text-green-600 rounded-2xl flex items-center justify-center hover:bg-green-600 hover:text-white transition-all shadow-sm group/btn"
              title="WhatsApp"
            >
              <MessageCircle size={20} className="group-hover:scale-110 transition-transform" />
            </a>
          )}
          {lead.phone && (
            <a 
              href={`tel:${lead.phone.replace(/\D/g, '')}`}
              onClick={(e) => e.stopPropagation()}
              className="w-11 h-11 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center hover:bg-blue-600 hover:text-white transition-all shadow-sm"
              title="Ligar"
            >
              <Phone size={20} />
            </a>
          )}
          {lead.email && (
            <a 
              href={`mailto:${lead.email}`}
              onClick={(e) => e.stopPropagation()}
              className="w-11 h-11 bg-blue-soft text-blue-primary rounded-2xl flex items-center justify-center hover:bg-blue-primary hover:text-white transition-all shadow-sm"
              title="E-mail"
            >
              <Mail size={20} />
            </a>
          )}
        </div>

        {/* Property Interest */}
        {(lead.property || lead.interest_description) && (
          <div className="mb-4 p-5 bg-muted/30 rounded-xl border border-border/10">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-surface rounded-xl shadow-sm shrink-0">
                {lead.property ? <Building size={14} className="text-primary" /> : <MapPin size={14} className="text-accent" />}
              </div>
              <div className="min-w-0">
                <p className="text-[8px] font-black text-muted-foreground/40 uppercase tracking-widest mb-0.5">Interesse</p>
                <p className="text-[11px] font-black text-primary truncate leading-tight">
                  {lead.property?.title || lead.interest_description}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Value & Score */}
        <div className="flex items-end justify-between pt-6 border-t border-border/30">
          <div>
            <span className="text-[10px] font-black text-muted-foreground/40 uppercase tracking-[0.15em] mb-1 block">Valor Previsto</span>
            <p className="text-xl font-black text-primary tracking-tighter">{formattedValue}</p>
          </div>
          <div className="text-right">
            <div className="flex items-center gap-2 mb-1 justify-end">
              <Sparkles size={12} className="text-accent" />
              <span className="text-[10px] font-black text-primary">{lead.score} Score</span>
            </div>
            <div className="w-16 h-1.5 bg-muted rounded-full overflow-hidden">
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
        
        {/* Floating Delete Button */}
        <button 
          onClick={() => {
            if (window.confirm('Excluir esta oportunidade? O contato da pessoa continuará salvo.')) {
              onDeleteLead(lead.id);
            }
          }}
          className="absolute top-4 right-4 p-2 text-muted-foreground/20 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
        >
          <Trash2 size={14} />
        </button>
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
    <div className="flex flex-col w-[380px] shrink-0 h-full group/col pb-10">
      <div className="flex flex-col mb-10 px-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-5">
            <div className="w-14 h-14 rounded-[1.5rem] flex items-center justify-center text-2xl shadow-card border-2 border-white" style={{ backgroundColor: column.bg }}>
              {column.emoji}
            </div>
            <div>
              <h3 className="font-black text-sm text-primary uppercase tracking-[0.25em]">{column.title}</h3>
              <p className="text-[10px] font-bold text-muted-foreground/30 uppercase tracking-widest">{leads.length} leads</p>
            </div>
          </div>
          <button 
            onClick={onAddLead}
            className="w-11 h-11 flex items-center justify-center bg-surface shadow-card rounded-2xl text-muted-foreground/40 hover:text-primary hover:scale-110 transition-all"
          >
             <Plus size={20} />
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
        className={`flex-1 space-y-6 p-6 rounded-[4rem] transition-all duration-500 border-2 scrollbar-hide overflow-y-auto ${
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
