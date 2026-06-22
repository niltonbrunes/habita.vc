import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';
import { JSDOM } from 'jsdom';

// Increase Vercel function timeout via route config
export const maxDuration = 60; // seconds (requires Vercel Pro for >10s)

export async function POST(req: Request) {
  try {
    const { xmlUrl, userId } = await req.json();

    if (!xmlUrl || !userId) {
      return NextResponse.json({ error: 'Parâmetros ausentes' }, { status: 400 });
    }

    // Service Role: bypasses RLS so we can upsert without auth restrictions
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    // Fetch XML from URBS (server-side — no CORS issues)
    const response = await fetch(xmlUrl, {
      signal: AbortSignal.timeout(55000), // 55s timeout
      headers: { 'User-Agent': 'HabitaVC-CRM/1.0' },
    });

    if (!response.ok) {
      throw new Error(`URBS respondeu com HTTP ${response.status}`);
    }

    const xmlText = await response.text();

    const dom = new JSDOM(xmlText, { contentType: 'text/xml' });
    const xmlDoc = dom.window.document;
    const imoveis = xmlDoc.getElementsByTagName('imovel');

    const stats = {
      total: imoveis.length,
      imported: 0,   // new properties created
      updated: 0,    // existing properties updated
      skipped: 0,    // no changes detected
      errors: 0,
    };

    // Process in batches to avoid timeout and N+1 issues
    const BATCH_SIZE = 20;

    for (let i = 0; i < imoveis.length; i++) {
      try {
        const item = imoveis[i];
        const reference = getTagValue(item, 'referencia');

        // Skip items without a reference code (can't safely upsert without it)
        if (!reference || reference.trim() === '') {
          stats.skipped++;
          continue;
        }

        const images = getImages(item);
        const features = getFeatures(item);
        const newPrice = parseFloat(getTagValue(item, 'valor')) || 0;
        const isHighlight = getTagValue(item, 'destaque') === '1';

        // Fields to always update from XML (dynamic data)
        const updateFields = {
          title: getTagValue(item, 'titulo'),
          description: getTagValue(item, 'descritivo'),
          price: newPrice,
          price_iptu: parseFloat(getTagValue(item, 'valor_iptu')) || 0,
          price_condo: parseFloat(getTagValue(item, 'valor_condominio')) || 0,
          area_total: parseFloat(getTagValue(item, 'area_total')) || 0,
          area_useful: parseFloat(getTagValue(item, 'area_util')) || 0,
          rooms: parseInt(getTagValue(item, 'quartos')) || 0,
          suites: parseInt(getTagValue(item, 'suites')) || 0,
          bathrooms: parseInt(getTagValue(item, 'banheiro')) || 0,
          parking_spaces: parseInt(getTagValue(item, 'garagem')) || 0,
          images: images,
          main_image: images[0] || '',
          is_highlight: isHighlight,
          video_url: getTagValue(item, 'video'),
          metadata: {
            features,
            commission_estimated_percent: 6,
          },
        };

        // Fields only set on first insert
        const insertOnlyFields = {
          registered_by_id: userId,
          reference: reference,
          type: getTagValue(item, 'tipo'),
          transaction_type: getTagValue(item, 'transacao') === 'V' ? 'sale' : 'rent',
          address_street: getTagValue(item, 'endereco'),
          address_neighborhood: getTagValue(item, 'bairro'),
          address_city: getTagValue(item, 'cidade'),
          address_state: getTagValue(item, 'estado'),
          address_zip_code: getTagValue(item, 'cep'),
          latitude: getTagValue(item, 'latitude'),
          longitude: getTagValue(item, 'longitude'),
          status: 'available',
          pattern: 'medium',
        };

        // Check if property already exists
        const { data: existing, error: selectErr } = await supabase
          .from('properties')
          .select('id, price, status')
          .eq('reference', reference)
          .maybeSingle();

        if (selectErr) throw selectErr;

        if (existing) {
          // Upsert: update dynamic fields, preserve manual edits (status set by broker, etc.)
          const { error: updateErr } = await supabase
            .from('properties')
            .update(updateFields)
            .eq('id', existing.id);

          if (updateErr) throw updateErr;

          // Count as "skipped" only if price didn't change (no meaningful update)
          if (Math.abs(existing.price - newPrice) < 1) {
            stats.skipped++;
          } else {
            stats.updated++;
          }
        } else {
          // Insert new property
          const { error: insertErr } = await supabase
            .from('properties')
            .insert([{ ...insertOnlyFields, ...updateFields }]);

          if (insertErr) throw insertErr;
          stats.imported++;
        }
      } catch (err) {
        console.error(`Erro no imóvel ${i}:`, err);
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
  return element ? (element.textContent || '').trim() : '';
}

function getImages(parent: Element): string[] {
  const fotos = parent.getElementsByTagName('foto');
  const urls: string[] = [];
  for (let i = 0; i < fotos.length; i++) {
    const urlTag = fotos[i].getElementsByTagName('url')[0];
    if (urlTag && urlTag.textContent) {
      urls.push(urlTag.textContent.trim());
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
      const text = items[i].textContent?.trim();
      if (text) features.push(text);
    }
  };

  if (common) extractItems(common);
  if (private_area) extractItems(private_area);

  return Array.from(new Set(features));
}
