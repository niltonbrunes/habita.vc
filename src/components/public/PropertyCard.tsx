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
      <div className="bg-white rounded-[2.5rem] overflow-hidden shadow-premium hover:shadow-luxury transition-all duration-700 flex flex-col h-full border border-border/40 hover:border-accent/20 relative group">
        
        {/* Image Container */}
        <div className="relative aspect-[4/5] overflow-hidden">
          <img 
            src={imageUrl || "/modern_luxury_apartment_exterior_1777989602281.png"} 
            alt={title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
          />
          
          {/* Overlay Gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />
          
          {/* Badges */}
          <div className="absolute top-6 left-6 flex flex-col gap-2">
            <span className="bg-white/90 backdrop-blur-md text-primary text-[9px] font-black px-4 py-2 rounded-full uppercase tracking-[0.2em] shadow-lg">
              {type}
            </span>
            {price > 2000000 && (
              <span className="bg-accent text-white text-[9px] font-black px-4 py-2 rounded-full uppercase tracking-[0.2em] shadow-lg">
                High-End
              </span>
            )}
          </div>

          {/* Price & Title on Image */}
          <div className="absolute bottom-8 left-8 right-8">
            <p className="text-accent text-sm font-black uppercase tracking-[0.2em] mb-2">Goiânia, GO</p>
            <h3 className="text-white text-2xl font-black leading-tight tracking-tight mb-4 group-hover:text-accent transition-colors duration-500">
              {title}
            </h3>
            <div className="flex items-end justify-between">
              <p className="text-white text-3xl font-black tracking-tighter">
                {formattedPrice}
              </p>
              <div className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center text-white border border-white/20 group-hover:bg-accent group-hover:border-accent transition-all duration-500">
                <ArrowUpRight size={24} />
              </div>
            </div>
          </div>
        </div>

        {/* Footer Info */}
        <div className="p-8 space-y-6">
          <div className="flex items-center justify-between border-b border-border/60 pb-6">
            <div className="flex flex-col items-center gap-1">
              <BedDouble className="w-5 h-5 text-primary/30" />
              <span className="text-[10px] font-black text-primary/60 uppercase tracking-widest">{bedrooms} Qtos</span>
            </div>
            <div className="h-6 w-[1px] bg-border/60" />
            <div className="flex flex-col items-center gap-1">
              <Bath className="w-5 h-5 text-primary/30" />
              <span className="text-[10px] font-black text-primary/60 uppercase tracking-widest">{bathrooms} Suítes</span>
            </div>
            <div className="h-6 w-[1px] bg-border/60" />
            <div className="flex flex-col items-center gap-1">
              <Square className="w-5 h-5 text-primary/30" />
              <span className="text-[10px] font-black text-primary/60 uppercase tracking-widest">{area}m²</span>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                <MapPin className="w-4 h-4 text-accent" />
             </div>
             <div>
                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest leading-none mb-1">Localização</p>
                <p className="text-xs font-bold text-primary">{neighborhood}</p>
             </div>
          </div>
        </div>
      </div>
    </Link>
  );
};
