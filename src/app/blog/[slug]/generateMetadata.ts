import type { Metadata } from 'next';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;

  const { data: article } = await supabase
    .from('blog_articles')
    .select('title, excerpt, cover_image, author_name, published_at')
    .eq('slug', slug)
    .single();

  if (!article) {
    return {
      title: 'Artigo não encontrado',
      description: 'Este artigo não está disponível.',
    };
  }

  const canonicalUrl = `https://habita.vc/blog/${slug}`;
  const image = article.cover_image || '/og-default.png';

  return {
    title: article.title,
    description: article.excerpt || `Leia o artigo "${article.title}" no Blog Habita.vc.`,
    authors: article.author_name ? [{ name: article.author_name }] : undefined,
    alternates: { canonical: canonicalUrl },
    openGraph: {
      type: 'article',
      locale: 'pt_BR',
      url: canonicalUrl,
      siteName: 'Habita.vc',
      title: article.title,
      description: article.excerpt || '',
      publishedTime: article.published_at,
      authors: article.author_name ? [article.author_name] : undefined,
      images: [{ url: image, width: 1200, height: 630, alt: article.title }],
    },
    twitter: {
      card: 'summary_large_image',
      site: '@habitavc',
      title: article.title,
      description: article.excerpt || '',
      images: [image],
    },
  };
}
