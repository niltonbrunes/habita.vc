import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';
import { JSDOM } from 'jsdom';

// Increase Vercel function timeout via route config
export const maxDuration = 60; // seconds

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
      suspended: 0,  // absent properties suspended
      errors: 0,
    };

    // Helper functions inside POST scope
    const getTagValue = (parent: Element, tagName: string): string => {
      const element = parent.getElementsByTagName(tagName)[0];
      return element ? (element.textContent || '').trim() : '';
    };

    const getImages = (parent: Element): string[] => {
      const fotos = parent.getElementsByTagName('foto');
      const urls: string[] = [];
      for (let i = 0; i < fotos.length; i++) {
        const urlTag = fotos[i].getElementsByTagName('url')[0];
        if (urlTag && urlTag.textContent) {
          urls.push(urlTag.textContent.trim());
        }
      }
      return urls;
    };

    const getFeatures = (parent: Element): string[] => {
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
    };

    // Collect all XML references in a Set
    const xmlReferences = new Set<string>();
    for (let i = 0; i < imoveis.length; i++) {
      const ref = getTagValue(imoveis[i], 'referencia');
      if (ref && ref.trim() !== '') {
        xmlReferences.add(ref.trim());
      }
    }

    // 1. Fetch all existing properties references in a single query
    const { data: existingProperties, error: selectErr } = await supabase
      .from('properties')
      .select('id, reference, price, status, images');

    if (selectErr) throw selectErr;

    const existingMap = new Map();
    (existingProperties || []).forEach(p => {
      if (p.reference) {
        existingMap.set(p.reference, p);
      }
    });

    const updateTasks: (() => Promise<void>)[] = [];
    const newPropsList: any[] = [];

    // Batch runner helper
    const runInBatches = async (tasks: (() => Promise<void>)[], batchSize: number) => {
      for (let i = 0; i < tasks.length; i += batchSize) {
        const batch = tasks.slice(i, i + batchSize).map(t => t());
        await Promise.all(batch);
      }
    };

    for (let i = 0; i < imoveis.length; i++) {
      const item = imoveis[i];
      const reference = getTagValue(item, 'referencia');

      // Skip items without a reference code
      if (!reference || reference.trim() === '') {
        stats.skipped++;
        continue;
      }

      const images = getImages(item);
      const features = getFeatures(item);
      const newPrice = parseFloat(getTagValue(item, 'valor')) || 0;
      const isHighlight = getTagValue(item, 'destaque') === '1';

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

      const existing = existingMap.get(reference);

      if (existing) {
        // Compare price, images and status
        const priceChanged = Math.abs(existing.price - newPrice) >= 1;
        const imagesChanged = JSON.stringify(existing.images || []) !== JSON.stringify(images);
        const statusChanged = existing.status !== 'available';

        if (!priceChanged && !imagesChanged && !statusChanged) {
          stats.skipped++;
        } else {
          updateTasks.push(async () => {
            try {
              const fieldsToUpdate = {
                ...updateFields,
                ...(statusChanged ? { status: 'available' } : {})
              };
              const { error: updateErr } = await supabase
                .from('properties')
                .update(fieldsToUpdate)
                .eq('id', existing.id);

              if (updateErr) throw updateErr;
              stats.updated++;
            } catch (err) {
              console.error(`Erro ao atualizar Ref ${reference}:`, err);
              stats.errors++;
            }
          });
        }
      } else {
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

        newPropsList.push({ ...insertOnlyFields, ...updateFields });
      }
    }

    // Execute updates in parallel batches of 20
    if (updateTasks.length > 0) {
      await runInBatches(updateTasks, 20);
    }

    // Execute inserts in a single bulk operation
    if (newPropsList.length > 0) {
      try {
        const { error: insertErr } = await supabase
          .from('properties')
          .insert(newPropsList);

        if (insertErr) throw insertErr;
        stats.imported += newPropsList.length;
      } catch (err) {
        console.error('Erro ao realizar bulk insert de novos imóveis:', err);
        stats.errors += newPropsList.length;
      }
    }

    // 2. Identify and suspend database properties not present in the XML
    const idsToSuspend: string[] = [];
    (existingProperties || []).forEach(p => {
      if (p.reference && !xmlReferences.has(p.reference) && p.status !== 'suspended') {
        idsToSuspend.push(p.id);
      }
    });

    if (idsToSuspend.length > 0) {
      try {
        console.log(`Suspending ${idsToSuspend.length} properties absent from XML...`);
        const { error: suspendErr } = await supabase
          .from('properties')
          .update({ status: 'suspended' })
          .in('id', idsToSuspend);

        if (suspendErr) throw suspendErr;
        stats.suspended = idsToSuspend.length;
      } catch (err) {
        console.error('Erro ao suspender imóveis ausentes:', err);
        stats.errors += idsToSuspend.length;
      }
    }

    return NextResponse.json(stats);
  } catch (error: any) {
    console.error('Erro na API de importação:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
