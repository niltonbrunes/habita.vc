import React from 'react';
import { LeadStatus } from '@/types/database';

export interface LeadCardData {
  id: string;
  name: string;
  property?: string;
  value?: string;
  temperature: 'cold' | 'warm' | 'hot';
  score: number;
  daysActive: number;
}

export interface KanbanColumn {
  id: LeadStatus;
  title: string;
  emoji: string;
  color: string;
  bg: string;
}

export const KANBAN_COLUMNS: KanbanColumn[] = [
  { id: 'lead', title: 'Novos Leads', emoji: '🎯', color: '#6366f1', bg: '#eef2ff' },
  { id: 'contact', title: 'Contato', emoji: '📞', color: '#f59e0b', bg: '#fef3c7' },
  { id: 'presentation', title: 'Apresentação', emoji: '🖼️', color: '#06b6d4', bg: '#cffafe' },
  { id: 'visit', title: 'Visitas', emoji: '🏠', color: '#8b5cf6', bg: '#ede9fe' },
  { id: 'proposal', title: 'Proposta', emoji: '📋', color: '#10b981', bg: '#d1fae5' },
  { id: 'sale', title: 'Fechamento', emoji: '🏆', color: '#16a34a', bg: '#dcfce7' },
  { id: 'lost', title: 'Perdido', emoji: '❌', color: '#94a3b8', bg: '#f1f5f9' },
];

export const MOCK_LEADS: Record<LeadStatus, LeadCardData[]> = {
  lead: [
    { id: '1', name: 'Ricardo Santos', property: 'Vita Residencial', value: 'R$ 1.8M', temperature: 'hot', score: 85, daysActive: 2 },
    { id: '2', name: 'Maria Oliveira', property: 'Studio Pinheiros', value: 'R$ 450k', temperature: 'warm', score: 45, daysActive: 1 },
  ],
  contact: [
    { id: '3', name: 'Joo Silva', property: 'Terreno Fazenda', value: 'R$ 2.2M', temperature: 'warm', score: 60, daysActive: 5 },
  ],
  presentation: [],
  visit: [
    { id: '4', name: 'Amanda Lima', property: 'Cobertura Leblon', value: 'R$ 12M', temperature: 'hot', score: 92, daysActive: 12 },
  ],
  proposal: [],
  sale: [],
  lost: [],
};
