const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://kwnelwicqlogwjseohlt.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInZiI6Imt3bmVsd2ljcWxvZ3dqc2VvaGx0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc3OTU2NzcsImV4cCI6MjA5MzM3MTY3N30.n-b2A8ohZ2mv-D2m25-pqsEL409JhZyM6b8t9vkeWKU';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function seed() {
  console.log('🏗️ Semeando Empreendimentos e Unidades...');

  // 1. Criar Incorporadora
  const { data: dev } = await supabase.from('developers').insert([
    { name: 'Cinq Desenvolvimento Imobiliário', pattern: 'high_end' }
  ]).select().single();

  if (!dev) return console.log('❌ Falha ao criar incorporadora');

  // 2. Criar Empreendimento
  const { data: development } = await supabase.from('developments').insert([
    {
      developer_id: dev.id,
      name: 'ParqVille Cerejeira',
      tagline: 'Onde o bem-estar encontra a exclusividade',
      description: 'Um condomínio horizontal planejado para oferecer segurança, lazer completo e contato com a natureza.',
      location_address: 'Av. das Cerejeiras, Setor Industrial',
      location_city: 'Aparecida de Goiânia',
      commercial_stage: 'construction',
      features: ['Piscina Semi-olímpica', 'Segurança 24h', 'Pista de Caminhada', 'Quadra de Tênis', 'Espaço Gourmet'],
      gallery: [
        'https://images.unsplash.com/photo-1580587767513-393f339257e1',
        'https://images.unsplash.com/photo-1584622650111-993a426fbf0a'
      ]
    }
  ]).select().single();

  if (!development) return console.log('❌ Falha ao criar empreendimento');

  // 3. Criar Unidade (Lote)
  const { error: propError } = await supabase.from('properties').insert([
    {
      development_id: development.id,
      title: 'Lote Residencial - Quadra A Lote 12',
      description: 'Lote plano em localização privilegiada dentro do condomínio, próximo à portaria e área de lazer.',
      reference: 'PV-C001',
      type: 'Terreno / Lote',
      price: 285000,
      area_total: 242,
      area_useful: 242,
      status: 'available',
      pattern: 'high_end',
      address_city: 'Aparecida de Goiânia',
      address_state: 'GO',
      is_unit_of_development: true
    }
  ]);

  if (propError) {
    console.log('❌ Erro ao criar unidade:', propError.message);
  } else {
    console.log('✅ ParqVille Cerejeira e Lote de Exemplo criados com sucesso!');
  }
}

seed();
