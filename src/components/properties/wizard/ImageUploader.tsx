'use client';
import React, { useCallback, useRef, useState } from 'react';
import { Upload, X, GripVertical, Star, Loader2 } from 'lucide-react';

export interface ImageItem {
  id: string;
  url: string;      // preview (blob URL or remote URL)
  file?: File;      // present only for new local files
  isCover: boolean;
  uploading?: boolean;
}

interface Props {
  images: ImageItem[];
  onChange: (images: ImageItem[]) => void;
  maxFiles?: number;
}

export function ImageUploader({ images, onChange, maxFiles = 30 }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const dragItem = useRef<number | null>(null);

  const addFiles = useCallback((files: FileList | null) => {
    if (!files) return;
    const allowed = Array.from(files).filter(f => f.type.startsWith('image/')).slice(0, maxFiles - images.length);
    const newItems: ImageItem[] = allowed.map(f => ({
      id: `${Date.now()}-${Math.random()}`,
      url: URL.createObjectURL(f),
      file: f,
      isCover: false,
    }));
    const updated = [...images, ...newItems];
    // Auto-set cover if none
    if (!updated.some(i => i.isCover) && updated.length > 0) {
      updated[0].isCover = true;
    }
    onChange(updated);
  }, [images, onChange, maxFiles]);

  const remove = (id: string) => {
    const updated = images.filter(i => i.id !== id);
    if (!updated.some(i => i.isCover) && updated.length > 0) updated[0].isCover = true;
    onChange(updated);
  };

  const setCover = (id: string) => {
    onChange(images.map(i => ({ ...i, isCover: i.id === id })));
  };

  const onDragStart = (i: number) => { dragItem.current = i; };
  const onDragEnter = (i: number) => setDragOverIndex(i);
  const onDragEnd = () => {
    if (dragItem.current === null || dragOverIndex === null || dragItem.current === dragOverIndex) {
      dragItem.current = null; setDragOverIndex(null); return;
    }
    const newList = [...images];
    const [moved] = newList.splice(dragItem.current, 1);
    newList.splice(dragOverIndex, 0, moved);
    dragItem.current = null; setDragOverIndex(null);
    onChange(newList);
  };

  return (
    <div className="space-y-4">
      {/* Drop Zone */}
      <div
        className={`relative border-2 border-dashed rounded-xl p-10 flex flex-col items-center justify-center gap-4 transition-all cursor-pointer ${
          dragging ? 'border-primary bg-blue-primary/5 scale-[1.01]' : 'border-border bg-muted/30 hover:border-primary/40'
        }`}
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => { e.preventDefault(); setDragging(false); addFiles(e.dataTransfer.files); }}
      >
        <Upload className="text-primary/30" size={40} />
        <div className="text-center">
          <p className="font-black text-primary">Arraste as fotos aqui</p>
          <p className="text-sm text-muted-foreground mt-1">ou clique para selecionar — máx. {maxFiles} fotos</p>
          <p className="text-xs text-muted-foreground/60 mt-1">Compressão automática antes do upload</p>
        </div>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={e => addFiles(e.target.files)}
        />
      </div>

      {/* Grid Preview */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {images.map((img, i) => (
            <div
              key={img.id}
              draggable
              onDragStart={() => onDragStart(i)}
              onDragEnter={() => onDragEnter(i)}
              onDragEnd={onDragEnd}
              className={`relative aspect-[4/3] rounded-2xl overflow-hidden border-2 transition-all cursor-grab group ${
                img.isCover ? 'border-accent' : 'border-border'
              } ${dragOverIndex === i ? 'scale-105 opacity-70' : ''}`}
            >
              <img src={img.url} alt="" className="w-full h-full object-cover" />

              {/* Uploading overlay */}
              {img.uploading && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <Loader2 className="text-white animate-spin" size={24} />
                </div>
              )}

              {/* Cover badge */}
              {img.isCover && (
                <div className="absolute top-2 left-2 bg-accent text-white text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded-full flex items-center gap-1">
                  <Star size={10} /> Capa
                </div>
              )}

              {/* Actions on hover */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                {!img.isCover && (
                  <button
                    onClick={(e) => { e.stopPropagation(); setCover(img.id); }}
                    className="p-2 bg-accent text-white rounded-xl text-xs font-black"
                    title="Definir como capa"
                  >
                    <Star size={14} />
                  </button>
                )}
                <button
                  onClick={(e) => { e.stopPropagation(); remove(img.id); }}
                  className="p-2 bg-red-500 text-white rounded-xl"
                  title="Remover"
                >
                  <X size={14} />
                </button>
                <div className="p-2 bg-surface/20 text-white rounded-xl cursor-grab" title="Reordenar">
                  <GripVertical size={14} />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {images.length > 0 && (
        <p className="text-xs text-muted-foreground text-center">
          {images.length} foto{images.length !== 1 ? 's' : ''} — Arraste para reordenar · Clique na ⭐ para definir a capa
        </p>
      )}
    </div>
  );
}
