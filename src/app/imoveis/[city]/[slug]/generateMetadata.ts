import type { Metadata } from 'next';
import { PropertiesService } from '@/services/properties.service';

type Props = {
  params: Promise<{ city: string; slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { city, slug } = await params;

  let property: any = null;
  try {
    property = await PropertiesService.getBySlug(city, slug);
  } catch {
    // property not found
  }

  if (!property) {
    return {
      title: 'Imóvel não encontrado',
      description: 'Este imóvel não está disponível ou foi removido.',
    };
  }

  const formattedPrice = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    maximumFractionDigits: 0,
  }).format(property.price || 0);

  const title = `${property.title} — ${formattedPrice}`;
  const description = `${property.type || 'Imóvel'} em ${property.neighborhood || ''}, ${property.address_city || city}. ${property.area_total ? property.area_total + 'm² · ' : ''}${property.bedrooms ? property.bedrooms + ' quartos · ' : ''}${property.bathrooms ? property.bathrooms + ' banheiros. ' : ''}Confira na Habita.vc.`;

  const image =
    property.main_image ||
    (property.images && property.images[0]) ||
    '/og-default.png';

  const canonicalUrl = `https://habita.vc/imoveis/${city}/${slug}`;

  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      type: 'website',
      locale: 'pt_BR',
      url: canonicalUrl,
      siteName: 'Habita.vc',
      title,
      description,
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: property.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      site: '@habitavc',
      title,
      description,
      images: [image],
    },
  };
}
