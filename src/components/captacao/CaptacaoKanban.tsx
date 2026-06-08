'use client';

import React from 'react';
import { Lead, SellerLeadStatus } from '@/types/database';
import { CaptacaoColumn } from '@/lib/constants/captacao';
import { motion } from 'framer-motion';
import { Plus, Trash2, MapPin, Home, DollarSign, Ruler, CheckCircle2, Phone, Calendar, MessageCircle } from 'lucide-react';

const AVATAR_COLORS = ['#10b981', '#06b6d4', '#8b5cf6', '#f59e0b', '#ef4444', '#6366f1'];
const getAvatarBg = (name: string) => AVATAR_COLORS[name.charCodeAt(0) % AVATAR_COLORS.length];
const getInitials = (name: string) =>
  name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();

const fmt = (val: number) =>
  new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    maximumFractionDigits: 0,
  }).format(val);

export const CaptacaoCard = ({
  lead,
  onDragStart,
  onDeleteLead,
  onScheduleLead,
}: {
  lead: Lead;
  onDragStart: (e: React.DragEvent, id: string) => void;
  onDeleteLead: (id: string) => void;
  onScheduleLead?: (lead: Lead) => void;
}) => {
  const displayName = lead.person?.name || lead.name;
  const askingPrice = lead.seller_asking_price || lead.value || 0;
  
  const phone = lead.phone || lead.person?.contacts?.find((c: any) => c.type === 'phone' || c.type === 'whatsapp' || c.type === 'cel')?.value;
  const cleanPhone = phone ? phone.replace(/\D/g, '') : '';
  const whatsappUrl = cleanPhone 
    ? `https://wa.me/${cleanPhone.startsWith('55') ? cleanPhone : '55' + cleanPhone}`
    : '#';

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="w-full"
    >
      <div
        draggable
        onDragStart={e => onDragStart(e, lead.id)}
        className="bg-surface p-3 rounded-xl shadow-sm hover:shadow-card transition-all duration-300 cursor-grab active:cursor-grabbing group relative border border-border-light hover:border-emerald-400/30 flex flex-col gap-2"
      >
        {/* Nome + avatar */}
        <div className="flex justify-between items-start gap-1">
          <div className="flex items-center gap-2 min-w-0">
            <div
              className="w-6 h-6 rounded-md flex items-center justify-center text-[8px] font-black text-white flex-shrink-0"
              style={{ backgroundColor: getAvatarBg(displayName) }}
            >
              {getInitials(displayName)}
            </div>
            <h4 className="font-bold text-heading text-[11px] leading-tight truncate">{displayName}</h4>
          </div>
          <button
            onClick={e => {
              e.stopPropagation();
              if (window.confirm('Excluir este lead de captação?')) onDeleteLead(lead.id);
            }}
            className="text-muted/40 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100 flex-shrink-0"
          >
            <Trash2 size={12} />
          </button>
        </div>

        {/* Tipo + endereço */}
        {(lead.seller_property_type || lead.seller_property_address) && (
          <div className="space-y-0.5">
            {lead.seller_property_type && (
              <div className="flex items-center gap-1.5 text-[10px] font-bold text-muted-foreground">
                <Home size={10} className="text-emerald-500 flex-shrink-0" />
                <span className="truncate">{lead.seller_property_type}</span>
                {lead.seller_property_area ? (
                  <span className="text-muted-foreground/50">• {lead.seller_property_area}m²</span>
                ) : null}
              </div>
            )}
            {lead.seller_property_address && (
              <div className="flex items-center gap-1.5 text-[10px] font-medium text-muted-foreground/70">
                <MapPin size={10} className="text-muted-foreground/40 flex-shrink-0" />
                <span className="truncate">{lead.seller_property_address}</span>
              </div>
            )}
          </div>
        )}

        {/* Preço esperado */}
        <div className="flex items-center justify-between pt-1 border-t border-border/30">
          <div className="flex items-center gap-1">
            <DollarSign size={10} className="text-emerald-500" />
            <span className="text-[11px] font-black text-primary">{fmt(askingPrice)}</span>
          </div>
          
          <div className="flex items-center gap-1">
            {phone && (
              <>
                <a
                  href={`tel:${cleanPhone}`}
                  onClick={(e) => e.stopPropagation()}
                  title={`Ligar para ${displayName}`}
                  className="p-1 rounded-full bg-muted/20 hover:bg-blue-primary/10 hover:text-blue-primary text-muted-foreground/60 transition-all cursor-pointer flex items-center justify-center"
                >
                  <Phone size={9} />
                </a>
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  title="Chamar no WhatsApp"
                  className="p-1 rounded-full bg-muted/20 hover:bg-emerald-500/10 hover:text-emerald-600 text-muted-foreground/60 transition-all cursor-pointer flex items-center justify-center"
                >
                  <MessageCircle size={9} />
                </a>
              </>
            )}
            
            <button
              onClick={(e) => {
                e.stopPropagation();
                onScheduleLead?.(lead);
              }}
              title="Agendar Compromisso"
              className="p-1 rounded-full bg-muted/20 hover:bg-accent/10 hover:text-accent text-muted-foreground/60 transition-all cursor-pointer flex items-center justify-center"
            >
              <Calendar size={9} />
            </button>

            {lead.status === 'captured' && (
              <span className="text-[8px] font-black text-emerald-600 bg-emerald-50 px-1 rounded-full border border-emerald-100 uppercase tracking-wider ml-1">
                Captado
              </span>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export const CaptacaoColumnComponent = ({
  column,
  leads,
  onMoveLead,
  onAddLead,
  onDeleteLead,
  onScheduleLead,
}: {
  column: CaptacaoColumn;
  leads: Lead[];
  onMoveLead: (id: string, status: SellerLeadStatus) => void;
  onAddLead: () => void;
  onDeleteLead: (id: string) => void;
  onScheduleLead?: (lead: Lead) => void;
}) => {
  const [isOver, setIsOver] = React.useState(false);

  const columnVgv = leads.reduce((acc, l) => acc + (l.seller_asking_price || l.value || 0), 0);

  return (
    <div className="flex flex-col w-[260px] shrink-0 h-full group/col pb-10">
      <div className="flex flex-col mb-4 px-2">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div
              className="w-8 h-8 rounded-xl flex items-center justify-center text-lg shadow-card border-2 border-white"
              style={{ backgroundColor: column.bg }}
            >
              {column.emoji}
            </div>
            <div>
              <h3 className="font-black text-sm text-primary uppercase tracking-[0.25em]">{column.title}</h3>
              <p className="text-[8px] font-bold text-muted-foreground/30 uppercase tracking-widest">
                {leads.length} {leads.length === 1 ? 'proprietário' : 'proprietários'}
              </p>
            </div>
          </div>
          <button
            onClick={onAddLead}
            className="w-6 h-6 flex items-center justify-center bg-surface shadow-card rounded-2xl text-muted-foreground/40 hover:text-emerald-500 hover:scale-110 transition-all"
          >
            <Plus size={12} />
          </button>
        </div>

        {leads.length > 0 && (
          <div className="px-2">
            <p className="text-xl font-bold text-heading/80 tracking-tighter leading-none">
              {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(columnVgv)}
            </p>
            <p className="text-[10px] font-black text-muted-foreground/30 uppercase tracking-[0.2em] mt-2">
              VGV na etapa
            </p>
          </div>
        )}
      </div>

      <div
        onDragOver={e => { e.preventDefault(); setIsOver(true); }}
        onDragLeave={() => setIsOver(false)}
        onDrop={e => {
          e.preventDefault();
          setIsOver(false);
          const leadId = e.dataTransfer.getData('leadId');
          if (leadId) onMoveLead(leadId, column.id);
        }}
        className={`flex-1 space-y-3 p-3 rounded-2xl transition-all duration-500 border-2 scrollbar-hide overflow-y-auto ${
          isOver
            ? 'border-emerald-400 bg-emerald-50 scale-[1.02]'
            : 'border-transparent bg-muted/10'
        }`}
        style={{ backgroundColor: isOver ? undefined : column.bg + '08' }}
      >
        {leads.length > 0 ? (
          leads.map(lead => (
            <CaptacaoCard
              key={lead.id}
              lead={lead}
              onDragStart={(e, id) => {
                e.dataTransfer.setData('leadId', id);
                e.dataTransfer.effectAllowed = 'move';
              }}
              onDeleteLead={onDeleteLead}
              onScheduleLead={onScheduleLead}
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
          className="w-full py-8 border-2 border-dashed border-emerald-500/5 rounded-xl text-[11px] font-black uppercase tracking-widest text-emerald-500/20 hover:bg-surface hover:border-emerald-400/20 hover:text-emerald-500 transition-all duration-300"
        >
          + Novo Proprietário
        </button>
      </div>
    </div>
  );
};
