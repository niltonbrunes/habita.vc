import React from 'react';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

export const RegionSection = () => {
  const regions = [
    { name: 'Setor Bueno', count: 124, slug: 'setor-bueno', city: 'Goiania' },
    { name: 'Setor Marista', count: 85, slug: 'setor-marista', city: 'Goiania' },
    { name: 'Alphaville', count: 42, slug: 'alphaville', city: 'Goiania' },
    { name: 'Jardim Goiás', count: 67, slug: 'jardim-goias', city: 'Goiania' },
    { name: 'Setor Oeste', count: 53, slug: 'setor-oeste', city: 'Goiania' },
    { name: 'Parque Amazônia', count: 91, slug: 'parque-amazonia', city: 'Goiania' }
  ];

  return (
    <section className="py-24 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">Explore por <span className="text-accent">Região</span></h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            Encontre o lugar ideal para sua família nos bairros mais valorizados e desejados da cidade.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {regions.map((region) => (
            <Link 
              key={region.slug} 
              href={`/imoveis/${region.city.toLowerCase()}?bairro=${region.slug}`}
              className="group bg-white p-8 rounded-2xl shadow-premium hover:shadow-luxury border border-border hover:border-primary/20 transition-all flex items-center justify-between"
            >
              <div>
                <h3 className="text-xl font-bold text-primary group-hover:text-accent transition-colors">
                  {region.name}
                </h3>
                <p className="text-sm text-muted-foreground font-medium">
                  {region.count} imóveis disponíveis
                </p>
              </div>
              <div className="w-10 h-10 rounded-full bg-primary/5 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all">
                <ChevronRight className="w-5 h-5" />
              </div>
            </Link>
          ))}
        </div>
        
        {/* SEO Content Section */}
        <div className="mt-20 prose prose-lg max-w-4xl mx-auto text-center">
          <p className="text-muted-foreground leading-relaxed italic">
            "Habita.vc é a referência em consultoria imobiliária de luxo em Goiânia. 
            Nossa plataforma utiliza inteligência de mercado para conectar você a 
            apartamentos de alto padrão, casas em condomínios exclusivos e os melhores 
            lançamentos das maiores construtoras do país."
          </p>
        </div>
      </div>
    </section>
  );
};
