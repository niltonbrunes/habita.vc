const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://kwnelwicqlogwjseohlt.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt3bmVsd2ljcWxvZ3dqc2VvaGx0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc3OTU2NzcsImV4cCI6MjA5MzM3MTY3N30.n-b2A8ohZ2mv-D2m25-pqsEL409JhZyM6b8t9vkeWKU';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

const article1Content = `
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
`;

const article2Content = `
<h2>A Anatomia de um Imóvel de Luxo na Planta: Como Evitar Armadilhas e Garantir o Premium</h2>
<p>Comprar um imóvel na planta é uma das formas mais eficientes de alavancar capital no mercado imobiliário. No entanto, no segmento de alto padrão, a diferença entre um projeto de <em>luxo genuíno</em> e um empreendimento comum mascarado de premium pode custar centenas de milhares de reais em desvalorização futura.</p>

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

<h3>Resumo dos Critérios de Escolha</h3>
<table className="w-full border-collapse border border-white/10 mt-6 text-sm">
    <thead>
        <tr className="bg-white/5">
            <th className="p-3 border border-white/10 text-left">Fator</th>
            <th className="p-3 border border-white/10 text-left">Exigência Mínima</th>
            <th className="p-3 border border-white/10 text-left">Diferencial Premium</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td className="p-3 border border-white/10 font-bold">Pé-Direito</td>
            <td className="p-3 border border-white/10">2.70m livres</td>
            <td className="p-3 border border-white/10 text-accent">Pé-direito duplo na sala</td>
        </tr>
        <tr className="bg-white/5">
            <td className="p-3 border border-white/10 font-bold">Acabamento</td>
            <td className="p-3 border border-white/10">Porcelanato comum</td>
            <td className="p-3 border border-white/10 text-accent">Mármore importado ou pedras naturais</td>
        </tr>
        <tr>
            <td className="p-3 border border-white/10 font-bold">Garagem</td>
            <td className="p-3 border border-white/10">2 vagas</td>
            <td className="p-3 border border-white/10 text-accent">3 a 4 vagas livres + tomada veicular</td>
        </tr>
    </tbody>
</table>

<div class="bg-primary/10 p-8 rounded-3xl mt-12 border border-accent/20">
    <h4 class="text-primary font-black mb-2">Simule Seu Financiamento ou Fluxo de Caixa</h4>
    <p class="text-sm font-medium mb-4">Montamos fluxos de pagamento personalizados e direto com a incorporadora para maximizar sua taxa interna de retorno (TIR).</p>
    <a href="/contato" class="text-accent font-black uppercase tracking-widest text-xs hover:gap-2 transition-all flex items-center gap-1">Falar com Analista de Investimentos &rarr;</a>
</div>
`;

async function publishArticles() {
    console.log('🚀 Publicando novos artigos sobre o mercado imobiliário...');
    
    const articles = [
        {
            title: 'O Impacto dos Novos Eixos de Desenvolvimento em Goiânia: Onde Investir Além do Óbvio?',
            slug: 'novos-eixos-desenvolvimento-imobiliario-goiania',
            content: article1Content,
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
            content: article2Content,
            excerpt: 'Investir na planta exige mais do que olhar renders e maquetes. Conheça os 5 critérios cruciais que determinam a velocidade de revenda e o prêmio de valorização do seu apartamento.',
            cover_image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=1000',
            category: 'Guia do Investidor',
            tags: ['Imóvel na Planta', 'Luxo Real', 'Liquidez Imobiliária', 'Guia Técnico'],
            seo_title: 'Como Avaliar Imóveis de Luxo na Planta | Guia de Liquidez 2026',
            seo_description: 'Evite armadilhas na compra de apartamentos de luxo na planta. Conheça as métricas de construtoras, grifes arquitetônicas e acabamento premium.',
            published: true
        }
    ];

    const { data, error } = await supabase.from('posts').insert(articles);

    if (error) {
        console.log('❌ Erro ao publicar artigos:', error.message);
    } else {
        console.log('✅ 2 Artigos de altíssimo padrão publicados com sucesso no Habita.vc!');
    }
}

publishArticles();
