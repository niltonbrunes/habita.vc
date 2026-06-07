import { supabase } from '@/lib/supabase';

export interface CaptacaoKPIs {
  totalCaptados: number;
  emAndamento: number;
  valorTotal: number;
  ticketMedio: number;
  velocidadeMedia: number; // dias médios até captar
  taxaConversao: number;   // % de prospectados que viraram captados
}

export interface CaptacaoFunnelStage {
  status: string;
  label: string;
  count: number;
  color: string;
}

export interface CaptacaoBairro {
  bairro: string;
  captados: number;
  emAndamento: number;
  valorTotal: number;
  demanda: number; // buyer leads interessados no mesmo bairro
}

export interface CaptacaoTipologia {
  tipo: string;
  captados: number;
  valorTotal: number;
  ticketMedio: number;
  percentual: number;
}

export interface CaptacaoAnalyticsData {
  kpis: CaptacaoKPIs;
  funnel: CaptacaoFunnelStage[];
  bairros: CaptacaoBairro[];
  tipologias: CaptacaoTipologia[];
}

const FUNNEL_STAGES: CaptacaoFunnelStage[] = [
  { status: 'prospecting',    label: 'Prospecção',      count: 0, color: '#6366f1' },
  { status: 'contacted',      label: 'Contatado',       count: 0, color: '#f59e0b' },
  { status: 'visit_scheduled',label: 'Visita Agendada', count: 0, color: '#06b6d4' },
  { status: 'visited',        label: 'Visitado',        count: 0, color: '#8b5cf6' },
  { status: 'proposal_sent',  label: 'Proposta Enviada',count: 0, color: '#f97316' },
  { status: 'captured',       label: 'Captado',         count: 0, color: '#10b981' },
  { status: 'lost',           label: 'Perdido',         count: 0, color: '#94a3b8' },
];

function extractBairro(address: string): string {
  if (!address) return 'Não informado';
  const parts = address.split(',');
  const bairro = parts[1]?.trim();
  return bairro || parts[0]?.trim() || 'Não informado';
}

export class CaptacaoAnalyticsService {
  static async getData(userId: string, role?: string): Promise<CaptacaoAnalyticsData> {
    // ── Scope por papel ──────────────────────────────────────
    let sellerQuery = supabase
      .from('leads')
      .select('id, status, seller_property_address, seller_property_type, seller_asking_price, seller_property_area, created_at')
      .eq('lead_type', 'seller');

    let buyerQuery = supabase
      .from('leads')
      .select('interest_description, source')
      .or('lead_type.eq.buyer,lead_type.is.null');

    if (role === 'manager') {
      const { data: team } = await supabase
        .from('profiles')
        .select('id')
        .eq('manager_id', userId);
      const teamIds = [(team || []).map((t: any) => t.id), userId].flat();
      sellerQuery = sellerQuery.in('assigned_to_id', teamIds);
      buyerQuery  = buyerQuery.in('assigned_to_id', teamIds);
    } else if (role !== 'admin' && role !== 'director') {
      sellerQuery = sellerQuery.eq('assigned_to_id', userId);
      buyerQuery  = buyerQuery.eq('assigned_to_id', userId);
    }

    const [{ data: sellerLeads }, { data: buyerLeads }] = await Promise.all([
      sellerQuery,
      buyerQuery,
    ]);

    const leads = sellerLeads || [];
    const buyers = buyerLeads || [];

    // ── Funil ────────────────────────────────────────────────
    const funnel: CaptacaoFunnelStage[] = FUNNEL_STAGES.map(stage => ({
      ...stage,
      count: leads.filter((l: any) => l.status === stage.status).length,
    }));

    // ── KPIs ─────────────────────────────────────────────────
    const captados = leads.filter((l: any) => l.status === 'captured');
    const emAndamento = leads.filter((l: any) =>
      !['captured', 'lost'].includes(l.status)
    ).length;

    const valorTotal = captados.reduce(
      (acc: number, l: any) => acc + Number(l.seller_asking_price || 0), 0
    );
    const ticketMedio = captados.length > 0 ? valorTotal / captados.length : 0;

    // Velocidade: dias entre created_at e captura (aproximação pelo created_at dos captados no estágio final)
    // Dado que não temos um campo captured_at, usamos a diferença entre o primeiro prospectado e hoje
    const now = new Date();
    const velocidades = leads
      .filter((l: any) => l.status === 'captured' && l.created_at)
      .map((l: any) => {
        const criado = new Date(l.created_at);
        return Math.round((now.getTime() - criado.getTime()) / (1000 * 60 * 60 * 24));
      });
    const velocidadeMedia = velocidades.length > 0
      ? Math.round(velocidades.reduce((a: number, b: number) => a + b, 0) / velocidades.length)
      : 0;

    const totalProspectados = leads.length;
    const taxaConversao = totalProspectados > 0
      ? Math.round((captados.length / totalProspectados) * 100)
      : 0;

    const kpis: CaptacaoKPIs = {
      totalCaptados: captados.length,
      emAndamento,
      valorTotal,
      ticketMedio,
      velocidadeMedia,
      taxaConversao,
    };

    // ── Por Bairro ───────────────────────────────────────────
    const bairroMap: Record<string, CaptacaoBairro> = {};
    leads.forEach((l: any) => {
      const bairro = extractBairro(l.seller_property_address || '');
      if (!bairroMap[bairro]) {
        bairroMap[bairro] = { bairro, captados: 0, emAndamento: 0, valorTotal: 0, demanda: 0 };
      }
      if (l.status === 'captured') {
        bairroMap[bairro].captados++;
        bairroMap[bairro].valorTotal += Number(l.seller_asking_price || 0);
      } else if (!['lost'].includes(l.status)) {
        bairroMap[bairro].emAndamento++;
      }
    });

    // Cruza com demanda de compradores (interest_description contém bairro/região)
    buyers.forEach((b: any) => {
      if (!b.interest_description) return;
      const desc = b.interest_description.toLowerCase();
      Object.keys(bairroMap).forEach(bairro => {
        if (bairro !== 'Não informado' && desc.includes(bairro.toLowerCase())) {
          bairroMap[bairro].demanda++;
        }
      });
    });

    const bairros = Object.values(bairroMap)
      .filter(b => b.captados > 0 || b.emAndamento > 0)
      .sort((a, b) => (b.captados + b.emAndamento) - (a.captados + a.emAndamento))
      .slice(0, 8);

    // ── Por Tipologia ────────────────────────────────────────
    const tipoMap: Record<string, { count: number; valorTotal: number }> = {};
    captados.forEach((l: any) => {
      const tipo = l.seller_property_type || 'Outro';
      if (!tipoMap[tipo]) tipoMap[tipo] = { count: 0, valorTotal: 0 };
      tipoMap[tipo].count++;
      tipoMap[tipo].valorTotal += Number(l.seller_asking_price || 0);
    });

    const totalCaptadosCount = captados.length || 1;
    const tipologias: CaptacaoTipologia[] = Object.entries(tipoMap)
      .map(([tipo, { count, valorTotal }]) => ({
        tipo,
        captados: count,
        valorTotal,
        ticketMedio: count > 0 ? valorTotal / count : 0,
        percentual: Math.round((count / totalCaptadosCount) * 100),
      }))
      .sort((a, b) => b.captados - a.captados);

    return { kpis, funnel, bairros, tipologias };
  }
}
