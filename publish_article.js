const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://kwnelwicqlogwjseohlt.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt3bmVsd2ljcWxvZ3dqc2VvaGx0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc3OTU2NzcsImV4cCI6MjA5MzM3MTY3N30.n-b2A8ohZ2mv-D2m25-pqsEL409JhZyM6b8t9vkeWKU';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

const articleContent = `
<h2>A Ascensão Irrefreável do Setor Marista: Onde o Luxo Encontra a Rentabilidade</h2>
<p>Se você acompanha o mercado imobiliário brasileiro, sabe que <strong>Goiânia</strong> tem se destacado como uma das capitais com maior potencial de valorização. No centro desse fenômeno, o <strong>Setor Marista</strong> se consolida não apenas como um bairro, mas como uma marca de prestígio e segurança financeira.</p>

<p>Investir em um imóvel de alto padrão nesta região em 2026 não é apenas uma questão de moradia, mas de <strong>preservação e multiplicação de patrimônio</strong>. Neste guia, vamos explorar por que o Marista continua sendo a escolha número 1 dos grandes investidores.</p>

<h3>O Cenário Atual do Mercado em Goiânia</h3>
<p>Goiânia vive um momento único. Com um agronegócio pujante impulsionando a economia do estado, a demanda por apartamentos de luxo cresceu 25% no último ano. O Setor Marista, por ser uma região consolidada e com escassez de novos terrenos, vive um ciclo de valorização orgânica acelerada.</p>

<ul>
    <li><strong>Escassez de Terrenos:</strong> O Marista está quase 100% ocupado, o que torna cada novo lançamento uma joia rara.</li>
    <li><strong>Infraestrutura Premium:</strong> O bairro concentra os melhores colégios, academias de luxo e o polo gastronômico mais sofisticado da capital.</li>
    <li><strong>Segurança Jurídica:</strong> Projetos assinados por incorporadoras de renome garantem tranquilidade ao investidor.</li>
</ul>

<h3>Vale a pena investir no Marista em 2026?</h3>
<p>A resposta curta é: <strong>Sim, e o momento é agora.</strong> Embora o preço do metro quadrado tenha subido, a curva de projeção para os próximos 36 meses indica uma nova alta de até 15% ao ano, impulsionada pela entrega de empreendimentos icônicos que elevarão o padrão da região.</p>

<h4>Para quem é indicado este investimento?</h4>
<p>Este mercado é ideal para:</p>
<ol>
    <li><strong>Investidores de Longo Prazo:</strong> Que buscam proteger o capital da inflação.</li>
    <li><strong>Famílias:</strong> Que não abrem mão de conveniência e querem estar no epicentro da vida social goiana.</li>
    <li><strong>Locação de Curta Temporada:</strong> Apartamentos compactos de luxo no Marista possuem uma das maiores taxas de ocupação via plataformas como Airbnb.</li>
</ol>

<h3>Pontos de Atenção para o Investidor</h3>
<p>Nem todo projeto é igual. Para garantir o máximo de retorno, fique atento a:</p>
<ul>
    <li><strong>Grife Arquitetônica:</strong> Imóveis assinados por arquitetos famosos tendem a valorizar 20% mais rápido.</li>
    <li><strong>Vista e Incidência Solar:</strong> Em Goiânia, o "Sol da Manhã" é um ativo financeiro.</li>
    <li><strong>Tecnologia e Sustentabilidade:</strong> Condomínios com carregamento elétrico e automação são a exigência do futuro.</li>
</ul>

<h3>Conclusão: O Próximo Passo do Seu Patrimônio</h3>
<p>O Setor Marista em Goiânia não é apenas o endereço do momento; é o porto seguro para quem busca aliar qualidade de vida e rentabilidade. Em um cenário econômico volátil, o tijolo de alto padrão continua sendo o ativo mais resiliente.</p>

<p><strong>Quer saber quais são os 3 empreendimentos com maior potencial de entrega de lucro para 2026?</strong> Entre em contato com nossa equipe de especialistas agora mesmo e receba um relatório exclusivo de valorização.</p>

<div class="bg-primary/10 p-8 rounded-3xl mt-12 border border-accent/20">
    <h4 class="text-primary font-black mb-2">Fale com um Especialista</h4>
    <p class="text-sm font-medium mb-4">Temos acesso a unidades exclusivas e condições de pré-lançamento no Marista e Bueno.</p>
    <a href="/contato" class="text-accent font-black uppercase tracking-widest text-xs hover:gap-2 transition-all flex items-center gap-1">Falar pelo WhatsApp agora &rarr;</a>
</div>
`;

async function publish() {
    console.log('🚀 Publicando artigo SEO...');
    
    const { data, error } = await supabase.from('posts').insert([
        {
            title: 'Por que o Setor Marista em Goiânia continua sendo o melhor investimento imobiliário em 2026?',
            slug: 'investimento-imobiliario-setor-marista-goiania',
            content: articleContent,
            excerpt: 'Descubra por que investir em apartamentos de luxo no Setor Marista é a estratégia mais segura para valorização e rentabilidade em 2026. Um guia completo para investidores exigentes.',
            cover_image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&q=80&w=1000',
            category: 'Investimento',
            tags: ['Goiânia', 'Setor Marista', 'Mercado Imobiliário', 'Luxo'],
            seo_title: 'Investimento Imobiliário Setor Marista Goiânia | Guia 2026',
            seo_description: 'Tudo o que você precisa saber sobre o mercado de alto padrão em Goiânia. Análise de valorização e oportunidades no Setor Marista.',
            published: true
        }
    ]);

    if (error) {
        console.log('❌ Erro ao publicar:', error.message);
    } else {
        console.log('✅ Artigo publicado com sucesso no Habita.vc!');
    }
}

publish();
