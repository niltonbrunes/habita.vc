"use client";

import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { Property } from '@/types/database';
import 'leaflet/dist/leaflet.css';

// Leaflet markers don't load correctly in React sometimes without this
const fixLeafletIcon = () => {
  const L = require('leaflet');
  delete L.Icon.Default.prototype._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  });
};

const MapComponent = ({ properties }: { properties: Property[] }) => {
  const { MapContainer, TileLayer, Marker, Popup } = require('react-leaflet');
  
  useEffect(() => {
    fixLeafletIcon();
  }, []);

  // Filter properties with valid coordinates
  const validProperties = properties.filter(p => p.latitude && p.longitude && !isNaN(Number(p.latitude)) && !isNaN(Number(p.longitude)));

  // Center on Goiania as default
  const center: [number, number] = validProperties.length > 0 
    ? [Number(validProperties[0].latitude), Number(validProperties[0].longitude)] 
    : [-16.686891, -49.264794];

  return (
    <MapContainer center={center} zoom={12} style={{ height: '100%', width: '100%' }}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {validProperties.map((prop) => (
        <Marker key={prop.id} position={[Number(prop.latitude), Number(prop.longitude)]}>
          <Popup>
            <div className="text-xs font-bold text-primary">
              <p className="mb-1">{prop.title}</p>
              <p className="text-muted-foreground">{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(prop.price)}</p>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

// Disable SSR for Map since it relies on window object
export const PropertyMap = dynamic(() => Promise.resolve(MapComponent), { 
  ssr: false,
  loading: () => <div className="w-full h-full flex items-center justify-center bg-muted/20"><p className="text-muted-foreground font-bold">Carregando mapa...</p></div>
});
