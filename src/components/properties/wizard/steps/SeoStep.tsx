'use client';
import React, { useEffect } from 'react';
import { WizardFormData } from '../PropertyWizard';
import { Search, Globe, RefreshCw } from 'lucide-react';

interface Props {
  data: WizardFormData;
  onChange: (patch: Partial<WizardFormData>) => void;
}

function slugify(text: string): string {
  return text
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 80);
}

export function SeoStep({ data, onChange }: Props) {
  // Auto-generate slug from title + city on first render or when title changes
  useEffect(() => {
    if (data.title && !data.slug) {
      const city = data.address_city ? `-${slugify(data.address_city)}` : '';
      onChange({ slug: slugify(data.title) + city });
    }
  }, []);

  const autoSlug = () => {
    const city = data.address_city ? `-${slugify(data.address_city)}` : '';
    onChange({ slug: slugify(data.title) + city });
  };

  const autoTitle = data.title
    ? `${data.title} | ${data.address_neighborhood || data.address_city || 'Goiânia'} | Habita.vc`
    : '';

  const autoDescription = [
    data.type, data.rooms ? `${data.rooms} quartos` : null,
    data.area_useful ? `${data.area_useful}m²` : null,
    data.address_neighborhood, data.address_city
  ].filter(Boolean).join(' · ');

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-bold text-heading mb-1">SEO e Publicação</h2>
        <p className="text-muted-foreground text-sm">Configure a URL amigável e as meta tags para ranqueamento no Google.</p>
      </div>

      {/* Slug */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-xs font-black text-muted-foreground uppercase tracking-widest">URL Amigável (Slug) *</label>
          <button type="button" onClick={autoSlug}
            className="flex items-center gap-1.5 text-xs font-bold text-primary hover:text-accent transition-colors">
            <RefreshCw size={12} /> Gerar automaticamente
          </button>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 px-4 py-4 bg-muted/50 rounded-2xl border-2 border-border text-muted-foreground font-bold text-sm shrink-0">
            /imoveis/{data.address_city ? slugify(data.address_city) + '/' : ''}
          </div>
          <input type="text"
            value={data.slug || ''}
            onChange={e => onChange({ slug: slugify(e.target.value) })}
            placeholder="nome-do-imovel"
            className="flex-1 px-5 py-4 bg-surface border-2 border-border rounded-2xl focus:border-primary outline-none font-bold text-primary placeholder:text-muted-foreground/40 transition-all"
          />
        </div>
        <p className="text-xs text-muted-foreground">
          URL final: <span className="font-bold text-primary">habita.vc/imoveis/{data.address_city ? slugify(data.address_city) + '/' : ''}{data.slug}</span>
        </p>
      </div>

      {/* Meta Title */}
      <div className="space-y-2">
        <label className="text-xs font-black text-muted-foreground uppercase tracking-widest">Meta Title</label>
        <input type="text"
          value={data.meta_title || autoTitle}
          onChange={e => onChange({ meta_title: e.target.value })}
          placeholder={autoTitle}
          maxLength={70}
          className="w-full px-5 py-4 bg-surface border-2 border-border rounded-2xl focus:border-primary outline-none font-bold text-primary placeholder:text-muted-foreground/40 transition-all"
        />
        <p className="text-xs text-muted-foreground">{(data.meta_title || autoTitle).length}/70 — Ideal entre 50-60 caracteres</p>
      </div>

      {/* Meta Description */}
      <div className="space-y-2">
        <label className="text-xs font-black text-muted-foreground uppercase tracking-widest">Meta Description</label>
        <textarea
          value={data.meta_description || autoDescription}
          onChange={e => onChange({ meta_description: e.target.value })}
          placeholder={autoDescription}
          rows={3}
          maxLength={160}
          className="w-full px-5 py-4 bg-surface border-2 border-border rounded-2xl focus:border-primary outline-none font-medium text-primary placeholder:text-muted-foreground/40 transition-all resize-none"
        />
        <p className="text-xs text-muted-foreground">{(data.meta_description || autoDescription).length}/160 — Ideal entre 120-160 caracteres</p>
      </div>

      {/* Google SERP Preview */}
      <div className="space-y-3">
        <label className="text-xs font-black text-muted-foreground uppercase tracking-widest flex items-center gap-2">
          <Search size={14} /> Preview — Como aparecerá no Google
        </label>
        <div className="p-6 border-2 border-border rounded-xl bg-surface space-y-1.5">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Globe size={12} />
            habita.vc › imoveis › {data.address_city ? slugify(data.address_city) : '...'} › {data.slug || '...'}
          </div>
          <p className="text-[#1a0dab] text-lg font-bold leading-snug hover:underline cursor-pointer line-clamp-1">
            {data.meta_title || autoTitle || 'Título do imóvel | Bairro | Habita.vc'}
          </p>
          <p className="text-sm text-[#4d5156] leading-relaxed line-clamp-2">
            {data.meta_description || autoDescription || 'Descrição do imóvel gerada automaticamente com base nas características cadastradas...'}
          </p>
        </div>
      </div>
    </div>
  );
}
