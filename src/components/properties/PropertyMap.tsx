"use client";

import React from 'react';
import dynamic from 'next/dynamic';
import { Property } from '@/types/database';
import 'leaflet/dist/leaflet.css';

const MapComponent = ({ properties, hoveredPropertyId, setHoveredPropertyId }: { properties: Property[], hoveredPropertyId?: string | null, setHoveredPropertyId?: (id: string | null) => void }) => {
  const { MapContainer, TileLayer, Marker, Popup } = require('react-leaflet');
  const L = require('leaflet');
  
  const parseCoord = (coord: any) => {
    if (!coord) return NaN;
    return Number(String(coord).replace(',', '.'));
  };

  const getFallbackCoords = (id: string) => {
    const hash = id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const lat = -16.75 + ((hash % 150) / 1000);
    const lng = -49.35 + (((hash * 7) % 150) / 1000);
    return [lat, lng];
  };

  const center = [-16.686891, -49.264794];

  // Helper to create custom price pill icon
  const createPriceIcon = (prop: Property) => {
    const validPrice = Number(prop.price) || 0;
    const formattedPrice = validPrice > 0 ? (validPrice / 1000).toLocaleString('pt-BR', { maximumFractionDigits: 0 }) + 'k' : 'Consulte';
    const displayHtml = validPrice > 0 ? `R$ ${formattedPrice}` : formattedPrice;
    
    return L.divIcon({
      className: `custom-leaflet-marker property-marker-${prop.id}`,
      html: `
        <div class="price-pill-inner" style="
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
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        ">
          ${displayHtml}
        </div>
      `,
      iconSize: null,
      iconAnchor: [30, 15], 
      popupAnchor: [0, -15]
    });
  };

  return (
    <div style={{ height: '100%', width: '100%', position: 'relative' }}>
      {/* CSS Injetado para animação e sincronia instantânea do hover sem re-renderizar o mapa inteiro */}
      <style>{`
        .property-marker-${hoveredPropertyId} {
          z-index: 9999 !important;
        }
        .property-marker-${hoveredPropertyId} > .price-pill-inner {
          background-color: #1e40af !important;
          color: white !important;
          transform: scale(1.15) !important;
          border-color: #1e40af !important;
          box-shadow: 0 20px 25px -5px rgba(30, 64, 175, 0.4) !important;
        }
        .custom-leaflet-marker:hover {
          z-index: 9999 !important;
        }
        .custom-leaflet-marker:hover > .price-pill-inner {
          background-color: #1e40af !important;
          color: white !important;
          transform: scale(1.15) !important;
          border-color: #1e40af !important;
          box-shadow: 0 20px 25px -5px rgba(30, 64, 175, 0.4) !important;
        }
      `}</style>

      <MapContainer center={center} zoom={12} style={{ height: '100%', width: '100%' }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        />
        {properties.map((prop) => {
          const imgSrc = prop.main_image || (prop.images && prop.images[0]) || "/hero_luxury.png";
          const validPrice = Number(prop.price) || 0;
          let lat = parseCoord(prop.latitude);
          let lng = parseCoord(prop.longitude);
          
          if (isNaN(lat) || isNaN(lng) || lat === 0 || lng === 0) {
            const fallback = getFallbackCoords(prop.id);
            lat = fallback[0];
            lng = fallback[1];
          }

          return (
            <Marker 
              key={prop.id} 
              position={[lat, lng]}
              icon={createPriceIcon(prop)}
              eventHandlers={{
                mouseover: () => setHoveredPropertyId && setHoveredPropertyId(prop.id),
                mouseout: () => setHoveredPropertyId && setHoveredPropertyId(null),
              }}
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
    </div>
  );
};

export const PropertyMap = dynamic(() => Promise.resolve(MapComponent), { 
  ssr: false,
  loading: () => <div className="w-full h-full flex items-center justify-center bg-muted/10"><p className="text-muted-foreground font-black uppercase tracking-widest text-xs animate-pulse">Iniciando mapa interativo...</p></div>
});
