import React from 'react';
import Link from 'next/link';
import { BedDouble, Bath, Square, MapPin, Heart, ChevronLeft, ChevronRight } from 'lucide-react';

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
  condoPrice?: number;
  iptuPrice?: number;
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
  type,
  condoPrice = 450,
  iptuPrice = 120
}: PropertyCardProps) => {
  const formattedPrice = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    maximumFractionDigits: 0
  }).format(price);

  const formattedCondo = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    maximumFractionDigits: 0
  }).format(condoPrice + iptuPrice);

  return (
    <Link href={`/imoveis/${city.toLowerCase()}/${slug}`} className="group block bg-white border border-border/60 rounded-xl overflow-hidden hover:shadow-xl transition-all duration-300">
      <div className="relative">
        {/* Image Carousel Mockup */}
        <div className="relative aspect-[1.4/1] overflow-hidden">
          <img 
            src={imageUrl || "/hero_luxury.png"} 
            alt={title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          />
          
          {/* Badge Anúncio Novo */}
          <div className="absolute top-3 left-3">
            <span className="bg-white text-primary text-[10px] font-bold px-3 py-1 rounded shadow-sm border border-border/20">
              Anúncio novo
            </span>
          </div>

          {/* Heart Button */}
          <button className="absolute top-3 right-3 w-8 h-8 bg-white/20 backdrop-blur-md text-white rounded-full flex items-center justify-center hover:bg-white hover:text-red-500 transition-all">
            <Heart size={18} />
          </button>

          {/* Carousel Dots */}
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className={`w-1.5 h-1.5 rounded-full ${i === 1 ? 'bg-white' : 'bg-white/40'}`} />
            ))}
          </div>
        </div>
      </div>

      <div className="p-4 space-y-2">
        <div className="min-h-[3rem]">
          <h3 className="text-sm font-medium text-primary/70 line-clamp-2 leading-snug">
            {title}
          </h3>
        </div>

        <div className="space-y-0.5">
          <p className="text-xl font-bold text-primary tracking-tight">
            {formattedPrice}
          </p>
          <p className="text-xs text-muted-foreground font-medium">
            {formattedCondo} Condo. + IPTU
          </p>
        </div>

        <div className="flex items-center gap-2 pt-2 text-primary font-bold text-[13px]">
          <span>{area} m²</span>
          <span className="text-muted-foreground/30">•</span>
          <span>{bedrooms} quartos</span>
          <span className="text-muted-foreground/30">•</span>
          <span>{bathrooms} vagas</span>
        </div>

        <div className="pt-1">
          <p className="text-xs text-muted-foreground truncate font-medium">
            {neighborhood}, {city}
          </p>
        </div>
      </div>
    </Link>
  );
};
