'use client';

import React, { useState } from 'react';
import {
  X, User, Phone, Mail, Tag, ShieldCheck, Loader2,
  MapPin, Home, DollarSign, Ruler, BedDouble, Heart
} from 'lucide-react';
import { LeadsService } from '@/services/leads.service';
import { PeopleService } from '@/services/people.service';
import { useAuth } from '@/context/AuthContext';
import { SELLER_MOTIVATIONS, PROPERTY_TYPES } from '@/lib/constants/captacao';

interface CaptacaoFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const INPUT_CLASS =
  'block w-full pl-10 pr-4 py-3 bg-muted/50 border border-transparent rounded-2xl focus:bg-surface focus:border-primary/20 transition-all outline-none font-bold text-primary placeholder:text-muted-foreground/30';
const LABEL_CLASS =
  'text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1';

export const CaptacaoFormModal = ({ isOpen, onClose, onSuccess }: CaptacaoFormModalProps) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    // Contato do proprietário
    name: '',
    phone: '',
    email: '',
    source: 'Manual',
    temperature: 'warm' as 'cold' | 'warm' | 'hot',
    score: 50,
    // Dados do imóvel
    seller_property_address: '',
    seller_property_type: '',
    seller_asking_price: 0,
    seller_motivation: '',
    seller_property_area: 0,
    seller_rooms: 0,
  });

  if (!isOpen) return null;

  const set = (field: string, value: any) =>
    setFormData(prev => ({ ...prev, [field]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    try {
      // 1. Unificar com base de Pessoas
      let personId: string | undefined;
      const existing = await PeopleService.findByContact(formData.email || formData.phone);
      if (existing) {
        personId = existing.id;
      } else {
        const newPerson = await PeopleService.create({
          name: formData.name,
          person_type: 'PF',
          roles: ['lead'],
          relationship_status: 'novo',
          contacts: [
            ...(formData.email ? [{ id: crypto.randomUUID(), type: 'email', value: formData.email, is_primary: true }] : []),
            ...(formData.phone ? [{ id: crypto.randomUUID(), type: 'whatsapp', value: formData.phone, is_primary: !formData.email }] : []),
          ],
          assigned_to_id: user.id,
          commercial_info: {
            lead_source: formData.source,
            notes: 'Criado via pipeline de captação.',
          },
        } as any);
        personId = newPerson.id;
      }

      // 2. Criar lead vendedor
      await LeadsService.createSeller({
        assigned_to_id: user.id,
        person_id: personId,
        name: formData.name,
        phone: formData.phone || undefined,
        email: formData.email || undefined,
        source: formData.source,
        temperature: formData.temperature,
        score: formData.score,
        value: formData.seller_asking_price || 0,
        seller_property_address: formData.seller_property_address,
        seller_property_type: formData.seller_property_type,
        seller_asking_price: formData.seller_asking_price || 0,
        seller_motivation: formData.seller_motivation,
        seller_property_area: formData.seller_property_area || 0,
        seller_rooms: formData.seller_rooms || 0,
        history: [],
        documents: [],
      });

      onSuccess();
      onClose();
      setFormData({
        name: '', phone: '', email: '', source: 'Manual', temperature: 'warm', score: 50,
        seller_property_address: '', seller_property_type: '', seller_asking_price: 0,
        seller_motivation: '', seller_property_area: 0, seller_rooms: 0,
      });
    } catch (err) {
      console.error('Erro ao criar lead de captação:', err);
      alert('Erro ao salvar. Verifique os dados e tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-surface rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-border/30">
        {/* Header */}
        <div className="relative p-8 pb-0">
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center shadow-lg">
                <Home className="text-white" size={22} />
              </div>
              <div>
                <h2 className="text-xl font-black text-heading tracking-tight">Novo Lead de Captação</h2>
                <p className="text-xs font-bold text-muted-foreground mt-0.5">
                  Proprietário que deseja vender um imóvel
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-muted-foreground hover:text-primary transition-colors p-2 rounded-xl hover:bg-muted"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-8">
          {/* ─── Seção: Proprietário ─── */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <User size={14} className="text-emerald-500" />
              <span className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">
                Dados do Proprietário
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2 md:col-span-2">
                <label className={LABEL_CLASS}>Nome completo *</label>
                <div className="relative group">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                  <input
                    required
                    type="text"
                    value={formData.name}
                    onChange={e => set('name', e.target.value)}
                    className={INPUT_CLASS}
                    placeholder="Nome do proprietário"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className={LABEL_CLASS}>WhatsApp *</label>
                <div className="relative group">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                  <input
                    required
                    type="text"
                    value={formData.phone}
                    onChange={e => set('phone', e.target.value)}
                    className={INPUT_CLASS}
                    placeholder="(62) 99999-9999"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className={LABEL_CLASS}>E-mail</label>
                <div className="relative group">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                  <input
                    type="email"
                    value={formData.email}
                    onChange={e => set('email', e.target.value)}
                    className={INPUT_CLASS}
                    placeholder="email@exemplo.com"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className={LABEL_CLASS}>Origem</label>
                <div className="relative group">
                  <Tag className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                  <select
                    value={formData.source}
                    onChange={e => set('source', e.target.value)}
                    className={INPUT_CLASS}
                  >
                    <option value="Manual">Manual</option>
                    <option value="Indicação">Indicação</option>
                    <option value="Base de clientes">Base de clientes</option>
                    <option value="Network">Network</option>
                    <option value="Portais">Portais</option>
                    <option value="Redes sociais">Redes sociais</option>
                    <option value="Ligação ativa">Ligação ativa</option>
                    <option value="Ponto avançado">Ponto avançado</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className={LABEL_CLASS}>Temperatura</label>
                <div className="flex gap-2">
                  {(['cold', 'warm', 'hot'] as const).map(temp => (
                    <button
                      key={temp}
                      type="button"
                      onClick={() => set('temperature', temp)}
                      className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border ${
                        formData.temperature === temp
                          ? 'bg-emerald-500 text-white border-emerald-500 shadow-md scale-[1.02]'
                          : 'bg-muted/50 text-muted-foreground border-transparent hover:border-border'
                      }`}
                    >
                      {temp === 'cold' ? '❄️ Frio' : temp === 'warm' ? '🌤 Morno' : '🔥 Quente'}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="w-full h-px bg-border/40" />

          {/* ─── Seção: Imóvel ─── */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Home size={14} className="text-emerald-500" />
              <span className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">
                Dados do Imóvel
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2 md:col-span-2">
                <label className={LABEL_CLASS}>Endereço do imóvel</label>
                <div className="relative group">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                  <input
                    type="text"
                    value={formData.seller_property_address}
                    onChange={e => set('seller_property_address', e.target.value)}
                    className={INPUT_CLASS}
                    placeholder="Ex: Rua das Flores, Setor Bueno, Goiânia"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className={LABEL_CLASS}>Tipo do imóvel</label>
                <div className="relative group">
                  <Home className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                  <select
                    value={formData.seller_property_type}
                    onChange={e => set('seller_property_type', e.target.value)}
                    className={INPUT_CLASS}
                  >
                    <option value="">Selecionar tipo...</option>
                    {PROPERTY_TYPES.map(t => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className={LABEL_CLASS}>Motivação da venda</label>
                <div className="relative group">
                  <Heart className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                  <select
                    value={formData.seller_motivation}
                    onChange={e => set('seller_motivation', e.target.value)}
                    className={INPUT_CLASS}
                  >
                    <option value="">Selecionar motivação...</option>
                    {SELLER_MOTIVATIONS.map(m => (
                      <option key={m} value={m}>{m}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className={LABEL_CLASS}>Preço esperado (R$)</label>
                <div className="relative group">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                  <input
                    type="number"
                    min="0"
                    value={formData.seller_asking_price || ''}
                    onChange={e => set('seller_asking_price', Number(e.target.value))}
                    className={INPUT_CLASS}
                    placeholder="Ex: 650000"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className={LABEL_CLASS}>Área (m²)</label>
                <div className="relative group">
                  <Ruler className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                  <input
                    type="number"
                    min="0"
                    value={formData.seller_property_area || ''}
                    onChange={e => set('seller_property_area', Number(e.target.value))}
                    className={INPUT_CLASS}
                    placeholder="Ex: 120"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className={LABEL_CLASS}>Quartos</label>
                <div className="relative group">
                  <BedDouble className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                  <input
                    type="number"
                    min="0"
                    value={formData.seller_rooms || ''}
                    onChange={e => set('seller_rooms', Number(e.target.value))}
                    className={INPUT_CLASS}
                    placeholder="Ex: 3"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="pt-2 border-t border-border flex items-center justify-between">
            <div className="flex items-center gap-2 text-emerald-600">
              <ShieldCheck size={18} />
              <span className="text-[10px] font-black uppercase tracking-widest">Dados Seguros</span>
            </div>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-3 rounded-2xl font-bold text-sm text-muted-foreground hover:bg-muted transition-all"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={loading}
                className="bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-3 rounded-2xl font-black text-sm transition-all shadow-lg flex items-center gap-2"
              >
                {loading ? (
                  <Loader2 className="animate-spin" size={18} />
                ) : (
                  <>
                    <Home size={16} />
                    Iniciar Captação
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
