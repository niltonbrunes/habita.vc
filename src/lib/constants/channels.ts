export const LEAD_CHANNELS = [
  { id: 'indicacao', name: 'Indicação' },
  { id: 'base_clientes', name: 'Base de Clientes' },
  { id: 'network', name: 'Network' },
  { id: 'portais', name: 'Portais' },
  { id: 'redes_sociais', name: 'Redes Sociais' },
  { id: 'ligacao_ativa', name: 'Ligação Ativa' },
  { id: 'ponto_avancado', name: 'Ponto Avançado' },
  { id: 'ia_prospeccao', name: 'IA Prospecção' },
  { id: 'manual', name: 'Manual' },
  { id: 'plantao', name: 'Plantão' },
  { id: 'acao_vendas', name: 'Ação de Vendas' },
  { id: 'outros', name: 'Outros' }
] as const;

export const CHANNEL_MAP = LEAD_CHANNELS.reduce((acc, curr) => {
  acc[curr.id] = curr.name;
  return acc;
}, {} as Record<string, string>);
