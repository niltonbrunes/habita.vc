import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'HabitaVC CRM',
    short_name: 'HabitaVC',
    description: 'CRM imobiliário para corretores de alta performance. Gerencie leads, imóveis e sua agenda em um só lugar.',
    start_url: '/crmhabita',
    scope: '/',
    display: 'standalone',
    orientation: 'portrait-primary',
    background_color: '#0F172A',
    theme_color: '#2563EB',
    categories: ['business', 'productivity'],
    lang: 'pt-BR',
    icons: [
      {
        src: '/icons/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: '/icons/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/icons/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
    shortcuts: [
      {
        name: 'Meus Leads',
        short_name: 'Leads',
        description: 'Ver pipeline de leads',
        url: '/crmhabita/leads',
        icons: [{ src: '/icons/shortcut-leads.png', sizes: '96x96' }],
      },
      {
        name: 'Agenda',
        short_name: 'Agenda',
        description: 'Ver agenda do dia',
        url: '/crmhabita/agenda',
        icons: [{ src: '/icons/shortcut-agenda.png', sizes: '96x96' }],
      },
    ],
  };
}
