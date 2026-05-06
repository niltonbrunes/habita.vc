import React from 'react';
import { PropertyCard } from './PropertyCard';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

export const PropertyHighlights = () => {
  // Mock data for initial development, will be replaced with real data from service
  const highlights = [
    {
      id: '1',
      title: 'Apartamento de Alto Padrão no Bueno',
      price: 1250000,
      city: 'Goiânia',
      neighborhood: 'Setor Bueno',
      bedrooms: 3,
      bathrooms: 4,
      area: 145,
      type: 'Apartamento',
      slug: 'apartamento-alto-padrao-bueno'
    },
    {
      id: '2',
      title: 'Casa em Condomínio Fechado',
      price: 2800000,
      city: 'Goiânia',
      neighborhood: 'Alphaville Flamboyant',
      bedrooms: 4,
      bathrooms: 6,
      area: 420,
      type: 'Casa',
      slug: 'casa-condominio-alphaville'
    },
    {
      id: '3',
      title: 'Penthouse Exclusiva no Marista',
      price: 4500000,
      city: 'Goiânia',
      neighborhood: 'Setor Marista',
      bedrooms: 5,
      bathrooms: 7,
      area: 310,
      type: 'Apartamento',
      slug: 'penthouse-exclusiva-marista'
    }
  ];

  return (
    <section className="py-24 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
          <div className="max-w-2xl">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">
              Imóveis em <span className="text-accent">Destaque</span>
            </h2>
            <p className="text-muted-foreground text-lg">
              Uma seleção exclusiva das melhores oportunidades de mercado, curadas por nossos especialistas em alta performance.
            </p>
          </div>
          <Link 
            href="/imoveis" 
            className="group flex items-center gap-2 text-primary font-bold hover:text-accent transition-colors pb-1"
          >
            Ver todos os imóveis
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {highlights.map((property) => (
            <PropertyCard key={property.id} {...property} />
          ))}
        </div>
      </div>
    </section>
  );
};
