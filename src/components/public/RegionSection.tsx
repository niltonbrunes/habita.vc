import React from 'react';
import Link from 'next/link';
import { ChevronRight, MapPin } from 'lucide-react';

export const RegionSection = () => {
  const regions = [
    { name: 'Setor Bueno', count: 124, slug: 'setor-bueno', city: 'Goiania', image: '/region_bueno.png' },
    { name: 'Setor Marista', count: 85, slug: 'setor-marista', city: 'Goiania', image: '/region_bueno.png' },
    { name: 'Alphaville', count: 42, slug: 'alphaville', city: 'Goiania', image: '/region_alphaville.png' },
    { name: 'Jardim Goiás', count: 67, slug: 'jardim-goias', city: 'Goiania', image: '/region_bueno.png' },
    { name: 'Setor Oeste', count: 53, slug: 'setor-oeste', city: 'Goiania', image: '/region_bueno.png' },
    { name: 'Parque Amazônia', count: 91, slug: 'parque-amazonia', city: 'Goiania', image: '/region_alphaville.png' }
  ];

  return (
    <section className="py-32 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
          <div className="max-w-2xl">
            <h2 className="text-5xl md:text-6xl font-black mb-6 tracking-tight text-primary">
              Explore por <span className="text-accent italic font-serif font-light lowercase tracking-normal">Região</span>
            </h2>
            <p className="text-muted-foreground text-xl font-medium leading-relaxed">
              Encontre o lugar ideal para sua família nos bairros mais valorizados e desejados de Goiânia.
            </p>
          </div>
          <div className="hidden md:flex items-center gap-4 text-primary/40 font-black uppercase tracking-[0.3em] text-[10px]">
            <span className="w-12 h-[2px] bg-accent" />
            Viver em Alta Performance
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {regions.map((region) => (
            <Link 
              key={region.slug} 
              href={`/imoveis/${region.city.toLowerCase()}?bairro=${region.slug}`}
              className="group relative h-[350px] rounded-[3rem] overflow-hidden shadow-premium hover:shadow-luxury transition-all duration-700"
            >
              {/* Background Image */}
              <img 
                src={region.image} 
                alt={region.name}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
              />
              
              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />
              
              {/* Content */}
              <div className="absolute inset-0 p-10 flex flex-col justify-end text-white">
                <div className="flex items-center gap-2 text-accent mb-2">
                  <MapPin size={16} />
                  <span className="text-[10px] font-black uppercase tracking-[0.2em]">{region.city}</span>
                </div>
                <h3 className="text-3xl font-black tracking-tight mb-2 group-hover:translate-x-2 transition-transform duration-500">
                  {region.name}
                </h3>
                <div className="flex items-center justify-between opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-500">
                  <p className="text-sm font-bold text-white/70">
                    {region.count} imóveis exclusivos
                  </p>
                  <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30">
                    <ChevronRight size={20} />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};
