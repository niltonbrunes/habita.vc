import { SellerLeadStatus } from '@/types/database';

export interface CaptacaoColumn {
  id: SellerLeadStatus;
  title: string;
  emoji: string;
  color: string;
  bg: string;
}

export const CAPTACAO_COLUMNS: CaptacaoColumn[] = [
  {
    id: 'prospecting',
    title: 'Prospecção',
    emoji: '🔍',
    color: '#6366f1',
    bg: '#eef2ff',
  },
  {
    id: 'contacted',
    title: 'Contatado',
    emoji: '📞',
    color: '#f59e0b',
    bg: '#fef3c7',
  },
  {
    id: 'visit_scheduled',
    title: 'Visita Agendada',
    emoji: '📅',
    color: '#06b6d4',
    bg: '#cffafe',
  },
  {
    id: 'visited',
    title: 'Visitado',
    emoji: '🏠',
    color: '#8b5cf6',
    bg: '#ede9fe',
  },
  {
    id: 'proposal_sent',
    title: 'Proposta Enviada',
    emoji: '📋',
    color: '#f97316',
    bg: '#ffedd5',
  },
  {
    id: 'captured',
    title: 'Captado!',
    emoji: '🎉',
    color: '#10b981',
    bg: '#d1fae5',
  },
  {
    id: 'lost',
    title: 'Perdido',
    emoji: '💔',
    color: '#94a3b8',
    bg: '#f1f5f9',
  },
];

/** Label de exibição para cada status do pipeline de captação */
export const CAPTACAO_STATUS_LABELS: Record<SellerLeadStatus, string> = {
  prospecting: 'Prospecção',
  contacted: 'Contatado',
  visit_scheduled: 'Visita Agendada',
  visited: 'Visitado',
  proposal_sent: 'Proposta Enviada',
  captured: 'Captado',
  lost: 'Perdido',
};

export const SELLER_MOTIVATIONS = [
  'Mudança de cidade',
  'Necessidade financeira',
  'Herança / Inventário',
  'Divórcio / Separação',
  'Upgrade de imóvel',
  'Desinvestimento',
  'Outro',
] as const;

export const PROPERTY_TYPES = [
  'Apartamento',
  'Casa',
  'Casa de Condomínio',
  'Terreno',
  'Cobertura',
  'Studio / Kitnet',
  'Sala Comercial',
  'Loja',
  'Galpão',
  'Sítio / Chácara',
  'Outro',
] as const;
