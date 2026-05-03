export interface DailyAction {
  id: string;
  type: 'call' | 'visit' | 'proposal' | 'follow_up' | 'prospecting';
  title: string;
  description: string;
  status: 'pending' | 'completed';
  priority: 'low' | 'medium' | 'high';
  time?: string;
  leadId?: string;
}

export const MOCK_DAILY_ACTIONS: DailyAction[] = [
  {
    id: 'a1',
    type: 'call',
    title: 'Ligar para Ricardo Santos',
    description: 'Lead de alto score (85%). Interesse no Vita Residencial.',
    status: 'pending',
    priority: 'high',
    time: '09:30',
    leadId: '1'
  },
  {
    id: 'a2',
    type: 'visit',
    title: 'Visita: Studio Pinheiros',
    description: 'Apresentação da unidade decorada para Maria Oliveira.',
    status: 'completed',
    priority: 'high',
    time: '11:00',
    leadId: '2'
  },
  {
    id: 'a3',
    type: 'follow_up',
    title: 'Follow-up: Proposta Leblon',
    description: 'Verificar se o cliente recebeu a minuta revisada.',
    status: 'pending',
    priority: 'medium',
    time: '14:00',
    leadId: '4'
  },
  {
    id: 'a4',
    type: 'prospecting',
    title: 'Busca de 5 novas indicações',
    description: 'Meta diária baseada no Motor de Ganhos (R$ 15k).',
    status: 'pending',
    priority: 'high'
  },
  {
    id: 'a5',
    type: 'call',
    title: 'Retorno: Bruno Mendes',
    description: 'Tirar dúvidas sobre o financiamento.',
    status: 'pending',
    priority: 'medium',
    time: '16:30'
  }
];
