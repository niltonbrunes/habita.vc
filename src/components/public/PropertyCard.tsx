import React from 'react';
import Link from 'next/link';
import { Bed, Bath, Square, MapPin } from 'lucide-react';

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
      <div className="bg-white rounded-3xl overflow-hidden shadow-premium hover:shadow-luxury transition-all duration-500 flex flex-col h-full border border-transparent hover:border-primary/5">
        <div className="relative aspect-[4/3] overflow-hidden">
          <img 
            src={imageUrl || "/modern_luxury_apartment_exterior_1777989602281.png"} 
            alt={title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          />
          <div className="absolute top-4 left-4 flex gap-2">
            <span className="bg-primary/90 backdrop-blur-md text-white text-[10px] font-bold px-3 py-1.5 rounded-full uppercase tracking-wider">
              {type}
            </span>
          </div>
          <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/60 to-transparent">
            <p className="text-white text-2xl font-bold tracking-tight">
              {formattedPrice}
            </p>
          </div>
        </div>

        <div className="p-6 flex-1 flex flex-col">
          <h3 className="text-lg font-bold text-primary group-hover:text-accent transition-colors line-clamp-1 mb-2">
            {title}
          </h3>
          
          <div className="flex items-center gap-1.5 text-muted-foreground mb-6">
            <MapPin className="w-3.5 h-3.5 text-accent" />
            <span className="text-xs font-medium">{neighborhood}, {city}</span>
          </div>

          <div className="mt-auto grid grid-cols-3 gap-4 border-t border-border pt-4">
            <div className="flex items-center gap-2">
              <Bed className="w-4 h-4 text-primary/40" />
              <span className="text-xs font-bold text-primary/80">{bedrooms} <span className="font-normal text-muted-foreground">qtos</span></span>
            </div>
            <div className="flex items-center gap-2">
              <Bath className="w-4 h-4 text-primary/40" />
              <span className="text-xs font-bold text-primary/80">{bathrooms} <span className="font-normal text-muted-foreground">banh</span></span>
            </div>
            <div className="flex items-center gap-2">
              <Square className="w-4 h-4 text-primary/40" />
              <span className="text-xs font-bold text-primary/80">{area}m²</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};
