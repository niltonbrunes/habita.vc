import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const getOpenAI = () => {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey || apiKey === 'dummy_key_for_build') return null;
  return new OpenAI({ apiKey });
};

export interface ProspeccaoRequest {
  property: {
    title: string;
    type: string;
    pattern: string;
    price: number;
    price_rent?: number;
    area_total: number;
    area_useful: number;
    rooms: number;
    suites: number;
    bathrooms: number;
    parking_spaces: number;
    address_neighborhood?: string;
    address_city: string;
    address_state: string;
    transaction_type: string;
    accepts_financing?: boolean;
    accepts_exchange?: boolean;
  };
  leads: Array<{
    id: string;
    name: string;
    temperature: string;
    status: string;
    interest_description?: string;
    value?: number;
    score: number;
  }>;
}

export interface ProspeccaoResponse {
  persona: {
    title: string;
    description: string;
    ageRange: string;
    income: string;
    interests: string[];
  };
  strategy: string[];
  whatsappCopy: string;
  emailSubject: string;
  compatibleLeadIds: string[];
  marketInsight: string;
}

const PATTERN_LABELS: Record<string, string> = {
  economic: 'Economico / Popular',
  standard: 'Padrao Medio',
  high_standard: 'Alto Padrao',
  high_end: 'Luxo / Alto de Luxo',
};

const TRANSACTION_LABELS: Record<string, string> = {
  sale: 'Venda',
  rent: 'Locacao',
  both: 'Venda e Locacao',
};

export async function POST(req: Request) {
  try {
    const body: ProspeccaoRequest = await req.json();
    const { property, leads } = body;

    const openai = getOpenAI();
    if (!openai) {
      return NextResponse.json(
        {
          error: 'OPENAI_API_KEY nao configurada',
          message: 'Configure a variavel OPENAI_API_KEY no arquivo .env.local e reinicie o servidor.',
        },
        { status: 503 }
      );
    }

    const priceFormatted = new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      maximumFractionDigits: 0,
    }).format(property.price);

    const patternLabel = PATTERN_LABELS[property.pattern] || property.pattern;
    const transactionLabel = TRANSACTION_LABELS[property.transaction_type] || property.transaction_type;

    const leadsContext =
      leads.length > 0
        ? leads
            .slice(0, 20)
            .map(
              (l) =>
                `- ID: ${l.id} | Nome: ${l.name} | Temperatura: ${l.temperature} | Score: ${l.score} | Status: ${l.status} | Interesse: ${l.interest_description || 'Nao informado'} | Budget: ${l.value ? `R$ ${l.value.toLocaleString('pt-BR')}` : 'Nao informado'}`
            )
            .join('\n')
        : 'Nenhum lead cadastrado no CRM ainda.';

    const userPrompt = `
Analise o seguinte imovel disponivel para ${transactionLabel} no mercado de Goiania-GO e gere uma estrategia completa de prospeccao:

DADOS DO IMOVEL:
- Titulo: ${property.title}
- Tipo: ${property.type}
- Padrao: ${patternLabel}
- Modalidade: ${transactionLabel}
- Preco: ${priceFormatted}${property.price_rent ? ` | Aluguel: R$ ${property.price_rent.toLocaleString('pt-BR')}` : ''}
- Area Total: ${property.area_total} m2 | Area Util: ${property.area_useful} m2
- Quartos: ${property.rooms} | Suites: ${property.suites} | Banheiros: ${property.bathrooms} | Vagas: ${property.parking_spaces}
- Bairro: ${property.address_neighborhood || 'Nao informado'}
- Cidade: ${property.address_city} - ${property.address_state}
- Aceita Financiamento: ${property.accepts_financing ? 'Sim' : 'Nao'}
- Aceita Permuta: ${property.accepts_exchange ? 'Sim' : 'Nao'}

LEADS ATIVOS NO CRM (para encontrar compativeis):
${leadsContext}

Retorne APENAS um objeto JSON valido com exatamente esta estrutura:
{
  "persona": {
    "title": "Nome curto e impactante da persona",
    "description": "Descricao detalhada em 2-3 frases do perfil socieconomico e motivacao de compra para ESTE imovel especifico no bairro ${property.address_neighborhood || property.address_city}",
    "ageRange": "Faixa etaria provavel (ex: 30-45 anos)",
    "income": "Renda familiar aproximada (ex: R$ 15.000 - R$ 25.000/mes)",
    "interests": ["4 a 6 interesses especificos desta persona"]
  },
  "strategy": ["4 estrategias especificas e praticas que mencionem o bairro e tipo real"],
  "whatsappCopy": "Mensagem de WhatsApp natural e persuasiva de 2-3 frases que mencione o imovel real, o bairro e um diferencial concreto",
  "emailSubject": "Assunto de e-mail criativo e objetivo para este imovel",
  "compatibleLeadIds": ["IDs dos leads do CRM mais compativeis com este imovel, maximo 5"],
  "marketInsight": "Uma frase de insight sobre o mercado imobiliario neste bairro em Goiania, util para o corretor"
}
`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: `Voce e um especialista senior em marketing e prospeccao imobiliaria, com profundo conhecimento do mercado de Goiania-GO.
Sua funcao e gerar analises de prospeccao precisas, contextualizadas e acionaveis baseadas nos dados reais do imovel.
Considere o bairro, tipo, padrao e preco para criar analises realmente personalizadas — nunca genericas.
Para leads compativeis, considere o budget declarado, interesses e temperatura do lead.
Responda APENAS com um objeto JSON valido, sem texto adicional.`,
        },
        {
          role: 'user',
          content: userPrompt,
        },
      ],
      temperature: 0.75,
      response_format: { type: 'json_object' },
    });

    const rawContent = completion.choices[0].message.content || '{}';
    const analysis: ProspeccaoResponse = JSON.parse(rawContent);

    return NextResponse.json(analysis, { status: 200 });
  } catch (error: any) {
    console.error('[AI Prospeccao] Erro:', error);

    if (error?.status === 401) {
      return NextResponse.json(
        { error: 'OPENAI_API_KEY invalida', message: 'A chave da OpenAI e invalida ou expirou.' },
        { status: 401 }
      );
    }

    if (error?.status === 429) {
      return NextResponse.json(
        { error: 'Limite atingido', message: 'A conta OpenAI atingiu seu limite. Verifique seu saldo.' },
        { status: 429 }
      );
    }

    return NextResponse.json(
      { error: 'Erro interno', message: 'Nao foi possivel completar a analise. Tente novamente.' },
      { status: 500 }
    );
  }
}
