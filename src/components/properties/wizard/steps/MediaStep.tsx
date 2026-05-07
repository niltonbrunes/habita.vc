'use client';
import React from 'react';
import { ImageUploader, ImageItem } from '../ImageUploader';
import { Info } from 'lucide-react';

interface Props {
  images: ImageItem[];
  onChange: (images: ImageItem[]) => void;
}

export function MediaStep({ images, onChange }: Props) {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-black text-primary mb-1">Fotos do Imóvel</h2>
        <p className="text-muted-foreground text-sm">Adicione as fotos. A primeira ou a marcada como capa será a foto principal.</p>
      </div>

      <div className="flex items-start gap-3 p-4 bg-blue-50 border border-blue-100 rounded-2xl">
        <Info size={18} className="text-blue-500 shrink-0 mt-0.5" />
        <div className="text-sm text-blue-700">
          <strong>Dica:</strong> Fotos serão comprimidas automaticamente antes do upload para economizar espaço.
          Arraste para reordenar. A foto marcada com <strong>⭐ Capa</strong> aparecerá como imagem principal no portal.
        </div>
      </div>

      <ImageUploader images={images} onChange={onChange} maxFiles={30} />
    </div>
  );
}
