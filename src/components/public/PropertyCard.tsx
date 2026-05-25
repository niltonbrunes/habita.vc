"use client";

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { BedDouble, Bath, Square, MapPin, Heart, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';

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
    <Link href={`/imoveis/${city.toLowerCase()}/${slug}`} className="group block">
      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        whileHover={{ y: -5 }}
        className="bg-surface/80 backdrop-blur-xl border border-border/40 rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl hover:shadow-primary/5 transition-all duration-500"
      >
        <div className="relative">
          {/* Image Container */}
          <div className="relative aspect-[4/3] overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/20 z-10" />
            <Image src={imageUrl || "/hero_luxury.png"} alt={title} fill className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-in-out" sizes="(max-width: 768px) 100vw, 50vw" />
            
            {/* Top Badges */}
            <div className="absolute top-4 left-4 z-20 flex gap-2">
              <span className="bg-blue-primary/90 backdrop-blur-md text-primary-foreground text-[11px] uppercase tracking-wider font-semibold px-3 py-1.5 rounded-full shadow-lg">
                Destaque
              </span>
            </div>

            {/* Heart Button */}
            <motion.button 
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="absolute top-4 right-4 z-20 w-9 h-9 bg-surface/20 backdrop-blur-md border border-white/30 text-white rounded-full flex items-center justify-center hover:bg-surface hover:text-red-500 transition-colors shadow-lg"
            >
              <Heart size={18} />
            </motion.button>
          </div>
        </div>

        <div className="p-5 space-y-4">
          <div className="space-y-1">
            <h3 className="text-base font-semibold text-foreground line-clamp-2 leading-tight group-hover:text-primary transition-colors">
              {title}
            </h3>
            <div className="flex items-center text-muted-foreground text-sm font-medium">
              <MapPin size={14} className="mr-1 opacity-70" />
              <span className="truncate">{neighborhood}, {city}</span>
            </div>
          </div>

          <div className="pt-2">
            <p className="text-2xl font-bold text-foreground tracking-tight">
              {formattedPrice}
            </p>
            <p className="text-xs text-muted-foreground font-medium mt-0.5">
              {formattedCondo} Condo. + IPTU
            </p>
          </div>

          {/* Amenities Footer */}
          <div className="flex items-center justify-between pt-4 border-t border-border/40 text-muted-foreground text-sm font-medium">
            <div className="flex items-center gap-1.5">
              <Square size={16} className="text-primary/60" />
              <span>{area} m²</span>
            </div>
            <div className="flex items-center gap-1.5">
              <BedDouble size={16} className="text-primary/60" />
              <span>{bedrooms}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Bath size={16} className="text-primary/60" />
              <span>{bathrooms}</span>
            </div>
          </div>
        </div>
      </motion.div>
    </Link>
  );
};
