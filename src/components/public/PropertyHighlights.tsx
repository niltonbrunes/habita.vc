'use client';

import React, { useEffect, useState } from 'react';
import { PropertyCard } from './PropertyCard';
import { ArrowRight, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { PropertiesService } from '@/services/properties.service';
import { Property } from '@/types/database';

export const PropertyHighlights = () => {
  const [highlights, setHighlights] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    PropertiesService.getAllFiltered({}).then(res => {
      setHighlights(res.data?.slice(0, 3) || []);
    }).finally(() => {
      setLoading(false);
    });
  }, []);

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

        {loading ? (
          <div className="flex justify-center py-12">
             <Loader2 className="animate-spin text-primary" size={32} />
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {highlights.map((property) => (
              <PropertyCard 
                key={property.id} 
                id={property.id}
                title={property.title}
                price={property.price}
                city={property.address_city}
                neighborhood={property.address_neighborhood || property.address_city}
                bedrooms={property.rooms || property.metadata?.rooms || 0}
                bathrooms={property.suites || property.metadata?.bathrooms || 0}
                area={property.area_useful || property.metadata?.area || 0}
                type={property.type}
                slug={property.slug || property.id}
                imageUrl={property.main_image || (property.images && property.images[0]) || ''}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
