import { supabase } from '@/lib/supabase';
import { MetadataRoute } from 'next';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  try {
    const { data } = await supabase
      .from('properties')
      .select('slug, address_city, updated_at')
      .eq('status', 'available')
      .not('slug', 'is', null)
      .not('address_city', 'is', null);

    const propertyUrls = (data || []).map((p: any) => ({
      url: `https://habita.vc/imoveis/${p.address_city.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/\s+/g, '-')}/${p.slug}`,
      lastModified: new Date(p.updated_at || Date.now()),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }));

    return [
      { url: 'https://habita.vc', lastModified: new Date(), changeFrequency: 'daily', priority: 1.0 },
      { url: 'https://habita.vc/imoveis', lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
      { url: 'https://habita.vc/empreendimentos', lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
      { url: 'https://habita.vc/blog', lastModified: new Date(), changeFrequency: 'weekly', priority: 0.6 },
      ...propertyUrls,
    ];
  } catch {
    return [{ url: 'https://habita.vc', lastModified: new Date() }];
  }
}
