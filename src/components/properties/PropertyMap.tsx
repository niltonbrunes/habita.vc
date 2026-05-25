"use client";

import React, { useEffect, useMemo } from 'react';
import dynamic from 'next/dynamic';
import { Property } from '@/types/database';
import 'leaflet/dist/leaflet.css';

const MapComponent = ({ properties }: { properties: Property[] }) => {
  const { MapContainer, TileLayer, Marker, Popup } = require('react-leaflet');
  const L = require('leaflet');
  
  // Filter properties with valid coordinates
  const validProperties = properties.filter(p => p.latitude && p.longitude && !isNaN(Number(p.latitude)) && !isNaN(Number(p.longitude)));

  // Center on Goiania as default
  const center = validProperties.length > 0 
    ? [Number(validProperties[0].latitude), Number(validProperties[0].longitude)] 
    : [-16.686891, -49.264794];

  // Helper to create custom price pill icon
  const createPriceIcon = (price: number) => {
    const validPrice = Number(price) || 0;
    const formattedPrice = validPrice > 0 ? (validPrice / 1000).toLocaleString('pt-BR', { maximumFractionDigits: 0 }) + 'k' : 'Consulte';
    const displayHtml = validPrice > 0 ? `R$ ${formattedPrice}` : formattedPrice;
    
    return L.divIcon({
      className: 'custom-leaflet-marker',
      html: `
        <div style="
          background-color: white; 
          color: #0f172a; 
          font-weight: 900; 
          font-size: 11px; 
          padding: 6px 10px; 
          border-radius: 9999px; 
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.2); 
          border: 1px solid #cbd5e1; 
          text-align: center; 
          min-width: max-content;
          cursor: pointer;
        " onmouseover="this.style.backgroundColor='#1e40af'; this.style.color='white'; this.style.transform='scale(1.05)';" onmouseout="this.style.backgroundColor='white'; this.style.color='#0f172a'; this.style.transform='scale(1)';">
          ${displayHtml}
        </div>
      `,
      iconSize: null, // Let CSS define size
      iconAnchor: [30, 15], // Approximate center of the pill
      popupAnchor: [0, -15]
    });
  };

  return (
    <MapContainer center={center} zoom={13} style={{ height: '100%', width: '100%' }}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
      />
      {validProperties.map((prop) => {
        const imgSrc = prop.main_image || (prop.images && prop.images[0]) || "/hero_luxury.png";
        const validPrice = Number(prop.price) || 0;

        return (
          <Marker 
            key={prop.id} 
            position={[Number(prop.latitude), Number(prop.longitude)]}
            icon={createPriceIcon(prop.price)}
          >
            <Popup className="property-map-popup">
              <div className="flex flex-col gap-2 min-w-[200px] max-w-[250px]">
                <img src={imgSrc} alt={prop.title || 'Imóvel'} className="w-full h-32 object-cover rounded-lg mb-1" />
                <div>
                  <p className="font-black text-sm text-slate-900 leading-tight mb-1">{prop.title || 'Imóvel sem título'}</p>
                  <p className="font-bold text-xs text-slate-500 mb-2">{prop.address_neighborhood || prop.address_city || 'Endereço não informado'}</p>
                  <p className="text-lg font-black text-blue-800">
                    {validPrice > 0 
                      ? new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(validPrice)
                      : 'Valor sob consulta'}
                  </p>
                </div>
              </div>
            </Popup>
          </Marker>
        );
      })}
    </MapContainer>
  );
};

export const PropertyMap = dynamic(() => Promise.resolve(MapComponent), { 
  ssr: false,
  loading: () => <div className="w-full h-full flex items-center justify-center bg-muted/10"><p className="text-muted-foreground font-black uppercase tracking-widest text-xs animate-pulse">Iniciando mapa interativo...</p></div>
});
