const { createClient } = require('@supabase/supabase-js');

// Using the keys from seed_developments.js which seem correct for this workspace
const supabaseUrl = 'https://kwnelwicqlogwjseohlt.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInZiI6Imt3bmVsd2ljcWxvZ3dqc2VvaGx0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc3OTU2NzcsImV4cCI6MjA5MzM3MTY3N30.n-b2A8ohZ2mv-D2m25-pqsEL409JhZyM6b8t9vkeWKU';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function generateData() {
  console.log('🚀 Iniciando Seeder Avançado (Staging)...');
  
  const userEmail = 'niltonbrunes@gmail.com';
  const { data: userData } = await supabase.from('profiles').select('id').eq('email', userEmail).maybeSingle();
  const userId = userData?.id;

  if (!userId) {
    console.log('❌ Usuário principal não encontrado.');
    return;
  }

  console.log('📦 Inserindo 20 Leads de Teste...');
  const leads = Array.from({ length: 20 }).map((_, i) => ({
    name: `Lead Teste ${i+1}`,
    email: `lead${i+1}@staging.com`,
    phone: `6299999${i.toString().padStart(4, '0')}`,
    status: ['lead', 'contact', 'visit', 'proposal', 'won', 'lost'][Math.floor(Math.random() * 6)],
    score: Math.floor(Math.random() * 100),
    temperature: ['cold', 'warm', 'hot'][Math.floor(Math.random() * 3)],
    assigned_to_id: userId
  }));
  
  await supabase.from('leads').insert(leads);

  console.log('🏗️ Criando Incorporadora e Empreendimento Staging...');
  const { data: dev } = await supabase.from('developers').insert([
    { name: 'Staging Construtora S/A', pattern: 'high_end' }
  ]).select().single();

  if (dev) {
    const { data: development } = await supabase.from('developments').insert([
      {
        developer_id: dev.id,
        name: 'Residencial Advanced Staging',
        tagline: 'O futuro do morar, agora.',
        description: 'Empreendimento teste focado em alto padrão.',
        location_address: 'Av. Paulista, 1000',
        location_city: 'São Paulo',
        commercial_stage: 'launch',
        features: ['Academia de Alta Performance', 'Piscina de Borda Infinita', 'Spa'],
        gallery: ['https://images.unsplash.com/photo-1600596542815-ffad4c1539a9']
      }
    ]).select().single();

    if (development) {
      console.log('🏢 Criando 10 Imóveis no Empreendimento...');
      const properties = Array.from({ length: 10 }).map((_, i) => ({
        development_id: development.id,
        title: `Apartamento Premium - Unidade ${101 + i}`,
        description: 'Unidade de luxo no coração da cidade.',
        reference: `STG-${i+1}`,
        type: 'Apartamento',
        price: 850000 + (i * 50000),
        area_total: 120 + (i * 10),
        area_useful: 100 + (i * 5),
        status: 'available',
        pattern: 'high_end',
        address_city: 'São Paulo',
        address_state: 'SP',
        is_unit_of_development: true
      }));
      await supabase.from('properties').insert(properties);
    }
  }

  console.log('✅ Seeder Avançado Finalizado com Sucesso!');
}

generateData();
