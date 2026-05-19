'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Navbar } from '@/components/layout/Navbar';
import { motion } from 'framer-motion';
import { 
  Sparkles, 
  Loader2, 
  CheckCircle2, 
  AlertTriangle, 
  ArrowRight,
  BookOpen
} from 'lucide-react';
import Link from 'next/link';

const articles = [
  {
    title: 'O Impacto dos Novos Eixos de Desenvolvimento em Goiânia: Onde Investir Além do Óbvio?',
    slug: 'novos-eixos-desenvolvimento-imobiliario-goiania',
    content: `
      <h2>Além do Eixo Marista-Bueno: O Despertar das Novas Fronteiras de Luxo em Goiânia</h2>
      <p>Durante anos, falar de mercado imobiliário de alto padrão em Goiânia era sinônimo de discutir os setores Marista e Bueno. Embora esses bairros continuem sendo os pilares de liquidez e prestígio da capital, o dinamismo do agronegócio e a atratividade do estado de Goiás criaram <strong>novos eixos de desenvolvimento acelerado</strong>. </p>

      <p>Para o investidor inteligente, a verdadeira rentabilidade reside em identificar as regiões que estão prestes a passar pelo mesmo boom que o Marista viveu há uma década. Neste relatório técnico, analisamos as regiões adjacentes com maior potencial de entrega de lucro.</p>

      <h3>1. O Fenômeno das Orlas e Parques</h3>
      <p>O comportamento do comprador de luxo mudou. A conveniência de estar perto de comércios foi superada pela busca obstinada por <strong>qualidade de vida, natureza e segurança</strong>. Bairros com parques lineares e lagos estão registrando as maiores taxas de valorização por metro quadrado da capital.</p>

      <ul>
          <li><strong>Setor Oeste:</strong> O tradicional bairro de Goiânia vive um processo profundo de revitalização com "Retrofits" e novos residenciais ultra-exclusivos ao redor do Bosque dos Buritis.</li>
          <li><strong>Jardim Goiás:</strong> Impulsionado pelo Parque Flamboyant, o metro quadrado na região do parque já compete diretamente com as áreas mais nobres do Marista.</li>
          <li><strong>Parque Cascavel:</strong> Um vetor de crescimento na região sul com excelente custo-benefício e valorização média anual projetada em 12%.</li>
      </ul>

      <h3>2. A Força dos Condomínios Fechados Horizontais</h3>
      <p>A descentralização das grandes metrópoles também chegou a Goiânia. Famílias de alto poder aquisitivo estão migrando para complexos de condomínios fechados horizontais nas saídas da cidade. Marcas consagradas de urbanismo de luxo criaram verdadeiras microcidades autossustentáveis.</p>

      <p>Esses empreendimentos oferecem:</p>
      <ol>
          <li><strong>Segurança Armada de Ponta:</strong> Controle biométrico, muralhas tecnológicas e monitoramento 24h.</li>
          <li><strong>Clubes Privativos de Lazer:</strong> Quadras de tênis profissionais, lagos de pesca e piscinas com borda infinita.</li>
          <li><strong>Privacidade Absoluta:</strong> Terrenos amplos onde residências monumentais podem ser erguidas longe do barulho urbano.</li>
      </ol>

      <h3>Como Posicionar seu Capital nestas Novas Regiões?</h3>
      <p>Se o seu objetivo é a <strong>especulação imobiliária inteligente</strong>, a regra de ouro é comprar nas primeiras fases de lançamento de um loteamento ou incorporação de condomínio vertical. Lançamentos com projetos icônicos nessas franjas de expansão tendem a performar melhor em termos de ganhos de capital puros do que bairros já saturados.</p>

      <div class="bg-primary/10 p-8 rounded-3xl mt-12 border border-accent/20">
          <h4 class="text-primary font-black mb-2">Acesse Nosso Mapa de Oportunidades</h4>
          <p class="text-sm font-medium mb-4">Mapeamos as 5 principais construtoras com projetos aprovados nestes novos eixos para os próximos 24 meses.</p>
          <a href="/contato" class="text-accent font-black uppercase tracking-widest text-xs hover:gap-2 transition-all flex items-center gap-1">Falar com Consultor e Receber Mapa &rarr;</a>
      </div>
    `,
    excerpt: 'Além dos consagrados Setor Marista e Bueno, Goiânia vive a expansão de novos eixos imobiliários altamente rentáveis. Analisamos os dados de valorização e o potencial dos novos bairros.',
    cover_image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=1000',
    category: 'Análise de Mercado',
    tags: ['Goiânia', 'Jardim Goiás', 'Condomínios Fechados', 'Valorização'],
    seo_title: 'Onde Investir em Goiânia Além do Marista e Bueno | Análise 2026',
    seo_description: 'Mapeamento completo dos bairros com maior potencial de valorização imobiliária em Goiânia. Conheça as novas fronteiras de luxo.',
    published: true
  },
  {
    title: 'Como Avaliar a Liquidez e o Premium de um Empreendimento de Luxo antes de Comprar na Planta',
    slug: 'como-avaliar-liquidez-imovel-luxo-planta',
    content: `
      <h2>A Anatomia de um Imóvel de Luxo na Planta: Como Evitar Armadilhas e Garantir o Premium</h2>
      <p>Comprar um imóvel na planta é uma das formas mais eficientes de alavancar capital no mercado imobiliário. No entanto, no segmento de alto padrão, a diferença entre um projeto de <em>luxo genuíno</em> e um empreendimento comum mascarado de premium pode custar centenas de quaisquer reais em desvalorização futura.</p>

      <p>Neste guia prático, detalhamos os 5 critérios fundamentais que investidores experientes utilizam antes de assinar um contrato de compra na planta.</p>

      <h3>1. O Prestígio do Projetista e Grife Arquitetônica</h3>
      <p>No mercado de altíssimo padrão, a assinatura do projeto arquitetônico e de decoração é um ativo financeiro tangível. Empreendimentos assinados por arquitetos renomados nacional ou internacionalmente tendem a reter melhor o valor ao longo das décadas e possuem liquidez de revenda até 40% superior.</p>

      <h3>2. Relação Área Útil vs. Planta Inteligente</h3>
      <p>Esqueça a quantidade bruta de metros quadrados. O que realmente define o luxo é o <strong>aproveitamento inteligente dos espaços</strong>. Fique atento a:</p>
      <ul>
          <li><strong>Pé-direito Duplo ou Elevado:</strong> Mínimo de 2.80 metros livres nas áreas sociais.</li>
          <li><strong>Integração de Ambientes:</strong> Flexibilidade estrutural para remoção de paredes.</li>
          <li><strong>Suítes Reais:</strong> Banheiros com ventilação natural e closets espaçosos.</li>
      </ul>

      <h3>3. Sustentabilidade e Infraestrutura de Futuro</h3>
      <p>Comprar na planta significa adquirir um produto que será entregue em 3 ou 4 anos e precisará ser moderno por mais 20 anos. Um prédio de luxo em 2026 sem tomadas para carregamento de carros elétricos em todas as vagas ou sistemas de automação de iluminação e ar-condicionado já nasce obsoleto.</p>

      <h3>4. O Histórico e a Saúde Financeira da Construtora</h3>
      <p>O maior risco do mercado imobiliário é o atraso ou a não entrega da obra. Audite o portfólio da construtora. Visite projetos entregues há mais de 5 anos por ela para analisar como as fachadas e áreas comuns envelheceram. A qualidade dos materiais de acabamento utilizados no passado diz tudo sobre o que ela fará no futuro.</p>

      <div class="bg-primary/10 p-8 rounded-3xl mt-12 border border-accent/20">
          <h4 class="text-primary font-black mb-2">Simule Seu Financiamento ou Fluxo de Caixa</h4>
          <p class="text-sm font-medium mb-4">Montamos fluxos de pagamento personalizados e direto com a incorporadora para maximizar sua taxa interna de retorno (TIR).</p>
          <a href="/contato" class="text-accent font-black uppercase tracking-widest text-xs hover:gap-2 transition-all flex items-center gap-1">Falar com Analista de Investimentos &rarr;</a>
      </div>
    `,
    excerpt: 'Investir na planta exige mais do que olhar renders e maquetes. Conheça os 5 critérios cruciais que determinam a velocidade de revenda e o prêmio de valorização do seu apartamento.',
    cover_image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=1000',
    category: 'Guia do Investidor',
    tags: ['Imóvel na Planta', 'Luxo Real', 'Liquidez Imobiliária', 'Guia Técnico'],
    seo_title: 'Como Avaliar Imóveis de Luxo na Planta | Guia de Liquidez 2026',
    seo_description: 'Evite armadilhas na compra de apartamentos de luxo na planta. Conheça as métricas de construtoras, grifes arquitetônicas e acabamento premium.',
    published: true
  }
];

export default function SeedBlogPage() {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState<'idle' | 'publishing' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.user) {
        setUser(session.user);
        const { data: prof } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .maybeSingle();
        setProfile(prof);
      }
      setLoading(false);
    };

    checkUser();
  }, []);

  const handlePublish = async () => {
    if (profile?.role !== 'admin') return;
    
    setStatus('publishing');
    setErrorMessage('');

    try {
      // Deletar artigos antigos com o mesmo slug para evitar duplicatas
      const slugs = articles.map(a => a.slug);
      await supabase.from('posts').delete().in('slug', slugs);

      // Inserir os novos artigos usando a credencial do admin logado
      const { error } = await supabase.from('posts').insert(articles);

      if (error) throw error;
      setStatus('success');
    } catch (err: any) {
      console.error(err);
      setStatus('error');
      setErrorMessage(err.message || 'Erro inesperado.');
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center">
      <Loader2 className="animate-spin text-accent" size={40} />
    </div>
  );

  return (
    <div className="luxury-mode min-h-screen bg-[#050505] text-white selection:bg-accent/20">
      <Navbar />

      <main className="pt-40 pb-20 max-w-4xl mx-auto px-4 w-full flex flex-col items-center justify-center min-h-[70vh]">
        <div className="bg-[#0c0c0c] border border-white/10 rounded-[3rem] p-12 w-full text-center relative overflow-hidden shadow-luxury">
          <div className="absolute top-0 right-0 w-32 h-32 bg-accent/15 blur-[60px] rounded-full -mr-10 -mt-10" />

          <div className="w-16 h-16 bg-accent/10 border border-accent/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <Sparkles size={28} className="text-accent" />
          </div>

          <h1 className="text-4xl font-black mb-4 tracking-tighter">
            Gerador de Conteúdo do Blog
          </h1>
          <p className="text-white/60 font-medium max-w-lg mx-auto mb-10">
            Ferramenta administrativa para injetar os 2 artigos de altíssimo padrão sobre mercado imobiliário no banco de dados.
          </p>

          {!user ? (
            <div className="p-8 bg-red-500/10 border border-red-500/20 rounded-2xl mb-8 flex flex-col items-center">
              <AlertTriangle className="text-red-500 mb-2 animate-bounce" size={32} />
              <p className="text-red-400 font-bold mb-4">Área Restrita: Login Necessário</p>
              <p className="text-white/60 text-sm mb-6">Você precisa estar logado como administrador (Nilton Brunes) para publicar os artigos.</p>
              <Link 
                href="/login" 
                className="px-8 py-3 bg-accent hover:bg-white hover:text-black text-white rounded-full font-black text-xs uppercase tracking-widest transition-all"
              >
                Ir para o Login &rarr;
              </Link>
            </div>
          ) : profile?.role !== 'admin' ? (
            <div className="p-8 bg-amber-500/10 border border-amber-500/20 rounded-2xl mb-8 flex flex-col items-center">
              <AlertTriangle className="text-amber-500 mb-2" size={32} />
              <p className="text-amber-400 font-bold mb-2">Permissão Insuficiente</p>
              <p className="text-white/60 text-sm mb-4">Olá, {profile?.full_name || user.email}. Somente administradores do portal podem usar esta ferramenta.</p>
            </div>
          ) : (
            <div className="space-y-8">
              <div className="p-6 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-between">
                <div className="text-left">
                  <p className="text-sm font-black text-white">{profile.full_name}</p>
                  <p className="text-xs text-white/40 font-medium">Conta de Administrador Ativa</p>
                </div>
                <span className="px-3 py-1 bg-accent/20 border border-accent/30 text-accent text-[10px] font-black uppercase tracking-widest rounded-full">
                  Admin Autorizado
                </span>
              </div>

              {status === 'idle' && (
                <button
                  onClick={handlePublish}
                  className="px-10 py-5 bg-accent hover:bg-white hover:text-black text-white rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-luxury w-full"
                >
                  Publicar 2 Artigos Agora
                </button>
              )}

              {status === 'publishing' && (
                <div className="py-4 flex items-center justify-center gap-3 text-white/60 font-bold">
                  <Loader2 className="animate-spin text-accent" size={24} />
                  Processando publicação direta no Supabase...
                </div>
              )}

              {status === 'success' && (
                <div className="p-8 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl text-center">
                  <CheckCircle2 size={48} className="text-emerald-500 mx-auto mb-4 animate-bounce" />
                  <h3 className="text-xl font-black text-emerald-400 mb-2">Artigos Publicados!</h3>
                  <p className="text-white/60 text-sm mb-6">Os 2 artigos de alto padrão sobre eixos imobiliários e liquidez já estão disponíveis na listagem do blog.</p>
                  <Link 
                    href="/blog" 
                    className="inline-flex items-center gap-2 text-accent font-black uppercase tracking-widest text-xs hover:gap-3 transition-all"
                  >
                    Ir para o Blog e Visualizar <ArrowRight size={14} />
                  </Link>
                </div>
              )}

              {status === 'error' && (
                <div className="p-8 bg-red-500/10 border border-red-500/20 rounded-2xl">
                  <AlertTriangle className="text-red-500 mx-auto mb-3" size={36} />
                  <p className="text-red-400 font-bold mb-2">Erro ao Publicar</p>
                  <p className="text-white/60 text-sm mb-4">{errorMessage}</p>
                  <button
                    onClick={handlePublish}
                    className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl font-bold text-xs uppercase tracking-widest transition-all"
                  >
                    Tentar Novamente
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
