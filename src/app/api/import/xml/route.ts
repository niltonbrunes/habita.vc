import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';
import { JSDOM } from 'jsdom';

export async function POST(req: Request) {
  try {
    const { xmlUrl, userId } = await req.json();

    if (!xmlUrl || !userId) {
      return NextResponse.json({ error: 'Parâmetros ausentes' }, { status: 400 });
    }

    // Usar variáveis de ambiente para o Supabase (Service Role para bypass CORS/RLS se necessário)
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const response = await fetch(xmlUrl);
    const xmlText = await response.text();
    
    const dom = new JSDOM(xmlText, { contentType: 'text/xml' });
    const xmlDoc = dom.window.document;
    const imoveis = xmlDoc.getElementsByTagName('imovel');
    
    const stats = {
      total: imoveis.length,
      imported: 0,
      skipped: 0,
      errors: 0
    };

    for (let i = 0; i < imoveis.length; i++) {
      try {
        const item = imoveis[i];
        const reference = getTagValue(item, 'referencia');
        
        // Verificar se já existe
        const { data: existing } = await supabase
          .from('properties')
          .select('id')
          .eq('reference', reference)
          .maybeSingle();

        if (existing) {
          stats.skipped++;
          continue;
        }

        const images = getImages(item);
        const features = getFeatures(item);

        const property = {
          registered_by_id: userId,
          reference: reference,
          title: getTagValue(item, 'titulo'),
          description: getTagValue(item, 'descritivo'),
          type: getTagValue(item, 'tipo'),
          transaction_type: getTagValue(item, 'transacao') === 'V' ? 'sale' : 'rent',
          price: parseFloat(getTagValue(item, 'valor')) || 0,
          price_iptu: parseFloat(getTagValue(item, 'valor_iptu')) || 0,
          price_condo: parseFloat(getTagValue(item, 'valor_condominio')) || 0,
          area_total: parseFloat(getTagValue(item, 'area_total')) || 0,
          area_useful: parseFloat(getTagValue(item, 'area_util')) || 0,
          rooms: parseInt(getTagValue(item, 'quartos')) || 0,
          suites: parseInt(getTagValue(item, 'suites')) || 0,
          bathrooms: parseInt(getTagValue(item, 'banheiro')) || 0,
          parking_spaces: parseInt(getTagValue(item, 'garagem')) || 0,
          address_street: getTagValue(item, 'endereco'),
          address_neighborhood: getTagValue(item, 'bairro'),
          address_city: getTagValue(item, 'cidade'),
          address_state: getTagValue(item, 'estado'),
          address_zip_code: getTagValue(item, 'cep'),
          latitude: getTagValue(item, 'latitude'),
          longitude: getTagValue(item, 'longitude'),
          video_url: getTagValue(item, 'video'),
          images: images,
          main_image: images[0] || '',
          metadata: { 
            features,
            commission_estimated_percent: 6
          },
          status: 'available',
          pattern: 'medium',
          is_highlight: getTagValue(item, 'destaque') === '1'
        };

        const { error: insertError } = await supabase
          .from('properties')
          .insert([property]);

        if (insertError) throw insertError;
        stats.imported++;
      } catch (err) {
        console.error('Erro no imóvel:', err);
        stats.errors++;
      }
    }

    return NextResponse.json(stats);
  } catch (error: any) {
    console.error('Erro na API de importação:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

function getTagValue(parent: Element, tagName: string): string {
  const element = parent.getElementsByTagName(tagName)[0];
  return element ? element.textContent || '' : '';
}

function getImages(parent: Element): string[] {
  const fotos = parent.getElementsByTagName('foto');
  const urls: string[] = [];
  for (let i = 0; i < fotos.length; i++) {
    const urlTag = fotos[i].getElementsByTagName('url')[0];
    if (urlTag && urlTag.textContent) {
      urls.push(urlTag.textContent);
    }
  }
  return urls;
}

function getFeatures(parent: Element): string[] {
  const features: string[] = [];
  const common = parent.getElementsByTagName('area_comum')[0];
  const private_area = parent.getElementsByTagName('area_privativa')[0];
  
  const extractItems = (node: Element) => {
    if (!node) return;
    const items = node.getElementsByTagName('item');
    for (let i = 0; i < items.length; i++) {
      if (items[i].textContent) features.push(items[i].textContent);
    }
  };

  if (common) extractItems(common);
  if (private_area) extractItems(private_area);
  
  return Array.from(new Set(features));
}
