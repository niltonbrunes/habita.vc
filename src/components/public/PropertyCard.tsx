import React from 'react';
import Link from 'next/link';
import { BedDouble, Bath, Square, MapPin, ArrowUpRight } from 'lucide-react';

interface PropertyCardProps {
  id: string;
  title: string;
  price: number;
  city: string;
  neighborhood: string;
  bedrooms: number;
  bathrooms: number;
  area: number;
  imageUrl?: string;
  slug: string;
  type: string;
}

export const PropertyCard = ({
  id,
  title,
  price,
  city,
  neighborhood,
  bedrooms,
  bathrooms,
  area,
  imageUrl,
  slug,
  type
}: PropertyCardProps) => {
  const formattedPrice = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    maximumFractionDigits: 0
  }).format(price);

  return (
    <Link href={`/imoveis/${city.toLowerCase()}/${slug}`} className="group block h-full">
      <div className="bg-white rounded-[2.5rem] overflow-hidden shadow-premium hover:shadow-luxury transition-all duration-500 flex flex-col h-full border border-border/40 group relative">
        
        {/* Image Section */}
        <div className="relative aspect-[4/3] overflow-hidden">
          <img 
            src={imageUrl || "/hero_luxury.png"} 
            alt={title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          />
          
          {/* Status Badges */}
          <div className="absolute top-5 left-5 flex flex-wrap gap-2">
            <span className="bg-accent text-white text-[9px] font-black px-4 py-2 rounded-full uppercase tracking-[0.2em] shadow-xl">
              Novo
            </span>
            <span className="bg-white/90 backdrop-blur-md text-primary text-[9px] font-black px-4 py-2 rounded-full uppercase tracking-[0.2em] shadow-lg">
              {type}
            </span>
          </div>
          
          <div className="absolute bottom-5 left-5">
             <div className="bg-white/90 backdrop-blur-md px-4 py-2 rounded-xl flex items-center gap-2 shadow-lg">
                <MapPin size={12} className="text-accent" />
                <span className="text-[10px] font-black text-primary uppercase tracking-widest">{neighborhood}</span>
             </div>
          </div>
        </div>

        {/* Content Section - Portal Style */}
        <div className="p-8 flex flex-col flex-1 space-y-6">
          <div className="space-y-2">
            <p className="text-3xl font-serif italic text-primary tracking-tighter">
              {formattedPrice}
            </p>
            <h3 className="text-lg font-black text-primary leading-tight line-clamp-2 group-hover:text-accent transition-colors">
              {title}
            </h3>
          </div>

          <div className="flex items-center justify-between py-6 border-y border-border/50">
            <div className="flex flex-col items-center gap-1">
              <span className="text-lg font-black text-primary">{bedrooms}</span>
              <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">Quartos</span>
            </div>
            <div className="w-px h-8 bg-border/50" />
            <div className="flex flex-col items-center gap-1">
              <span className="text-lg font-black text-primary">{bathrooms}</span>
              <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">Suítes</span>
            </div>
            <div className="w-px h-8 bg-border/50" />
            <div className="flex flex-col items-center gap-1">
              <span className="text-lg font-black text-primary">{area}m²</span>
              <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">Área</span>
            </div>
          </div>

          <div className="pt-2 flex items-center justify-between text-muted-foreground group-hover:text-primary transition-colors">
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">Ver detalhes</span>
            <ArrowUpRight size={20} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
          </div>
        </div>
      </div>
    </Link>
  );
};
