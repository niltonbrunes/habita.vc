import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing supabase credentials");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  try {
    // Check if developer "Sim Inc" exists, if not create
    let { data: dev } = await supabase.from('developers').select('id').ilike('name', 'Sim Inc').maybeSingle();
    
    if (!dev) {
      const { data: newDev, error: errDev } = await supabase.from('developers').insert({
        name: 'Sim Inc',
        pattern: 'high_end'
      }).select('id').single();
      if (errDev) throw errDev;
      dev = newDev;
    }

    // Insert Development
    const katedralData = {
      developer_id: dev.id,
      name: 'Katedral Sky Rooftop',
      tagline: 'Um novo jeito de morar e viver no centro de Goiânia.',
      description: 'O Katedral Sky Rooftop é o empreendimento perfeito para quem busca um estilo de vida exclusivo, moderno e prático no Setor Sul de Goiânia. Com uma infraestrutura completa e um rooftop panorâmico de tirar o fôlego, você terá tudo o que precisa a poucos passos de distância.',
      image_url: '/modern_luxury_apartment_exterior_1777989602281.png', // Fallback to existing or new one
      gallery: [
        '/modern_luxury_apartment_exterior_1777989602281.png'
      ],
      features: [
        'Rooftop com vista panorâmica',
        'Piscina com borda infinita',
        'Academia equipada',
        'Espaço Gourmet',
        'Plantas inteligentes',
        'Localização Premium'
      ],
      location_address: 'Rua 132, Quadra F/29, Lote 14, Setor Sul',
      location_city: 'Goiânia',
      price_starting_at: 450000,
      commercial_stage: 'ready',
      slug: 'katedral-sky-rooftop'
    };

    // Upsert by slug
    const { data: existing } = await supabase.from('developments').select('id').eq('slug', 'katedral-sky-rooftop').maybeSingle();
    
    if (existing) {
      const { error } = await supabase.from('developments').update(katedralData).eq('id', existing.id);
      if (error) throw error;
      console.log('Successfully updated Katedral Sky Rooftop!');
    } else {
      const { error } = await supabase.from('developments').insert([katedralData]);
      if (error) throw error;
      console.log('Successfully inserted Katedral Sky Rooftop!');
    }
    
  } catch (err) {
    console.error('Error:', err);
  }
}

run();
