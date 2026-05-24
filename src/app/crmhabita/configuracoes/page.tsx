'use client';
import React, { useEffect, useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useAuth } from '@/context/AuthContext';
import { ProfilesService } from '@/services/profiles.service';
import { StorageService } from '@/services/storage.service';
import { Profile } from '@/types/database';
import { 
  User, Mail, Phone, ShieldCheck, Globe, 
  FileText, Camera, Loader2, CheckCircle2,
  Trophy, Target, BarChart3, Save, Briefcase
} from 'lucide-react';

export default function SettingsPage() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (user) {
      ProfilesService.getById(user.id)
        .then(setProfile)
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [user]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !profile) return;
    setSaving(true);
    try {
      const updatableFields: Record<string, any> = {
        full_name: profile.full_name,
        whatsapp: profile.whatsapp || null,
        phone: profile.phone || null,
        creci: profile.creci || null,
        bio: profile.bio || null,
        slug: profile.slug || null,
        avatar_url: profile.avatar_url || null,
        earnings_goal_monthly: profile.earnings_goal_monthly || 0,
        avg_ticket: profile.avg_ticket || 0,
        avg_commission_percent: profile.avg_commission_percent || 0,
        focus: profile.focus || 'hybrid',
        high_end_mode: profile.high_end_mode || false,
      };
      await ProfilesService.update(user.id, updatableFields);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err: any) {
      console.error('Erro ao salvar perfil:', err);
      alert('Erro ao salvar perfil: ' + (err?.message || 'Erro desconhecido ao salvar.'));
    } finally {
      setSaving(false);
    }
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;
    setUploading(true);
    try {
      const url = await StorageService.uploadAvatar(file, user.id);
      setProfile(prev => prev ? { ...prev, avatar_url: url } : null);
      await ProfilesService.update(user.id, { avatar_url: url });
    } catch (err) {
      console.error(err);
      alert('Erro ao fazer upload da foto. Detalhes: ' + (err as any)?.message);
    } finally {
      setUploading(false);
    }
  };

  if (loading) return (
    <DashboardLayout>
      <div className="h-full flex items-center justify-center">
        <Loader2 className="animate-spin text-blue-primary" size={40} />
      </div>
    </DashboardLayout>
  );

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto p-6 space-y-6">
        
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-heading">Configurações de Perfil</h1>
          <p className="text-[13px] text-muted mt-1">Gerencie sua identidade profissional e metas no Habita.vc</p>
        </div>

        <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Coluna Esquerda: Avatar e Metas */}
          <div className="space-y-6">
            
            {/* Avatar Card */}
            <div className="bg-surface border border-border rounded-xl p-6 text-center shadow-card">
              <div className="relative w-28 h-28 mx-auto mb-5 group">
                <div className="w-full h-full rounded-full overflow-hidden bg-bg border-4 border-surface shadow-sm">
                  {profile?.avatar_url ? (
                    <img src={profile.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-blue-soft text-blue-primary text-3xl font-bold">
                      {profile?.full_name?.charAt(0) || 'U'}
                    </div>
                  )}
                </div>
                <label className="absolute inset-0 flex items-center justify-center bg-black/50 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                  {uploading ? <Loader2 className="animate-spin" size={24} /> : <Camera size={24} />}
                  <input type="file" accept="image/*" className="hidden" onChange={handleAvatarUpload} disabled={uploading} />
                </label>
              </div>
              <h2 className="text-lg font-bold text-heading">{profile?.full_name}</h2>
              <p className="text-[11px] font-bold text-muted uppercase tracking-wider mt-1">{profile?.role}</p>
              
              <div className="mt-4 flex items-center justify-center gap-1.5 text-[11px] font-bold text-green-primary bg-green-soft py-1.5 px-3 rounded-md w-max mx-auto">
                <ShieldCheck size={14} /> Conta Ativa
              </div>
            </div>

            {/* Metas Card */}
            <div className="bg-surface border border-border rounded-xl p-6 shadow-card">
              <div className="flex items-center gap-2 mb-5 pb-3 border-b border-border-light">
                <Target size={18} className="text-blue-primary" />
                <h3 className="text-[13px] font-bold text-heading">Metas Mensais</h3>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-muted mb-1.5">Meta de Ganhos</label>
                  <div className="relative flex items-center">
                    <span className="absolute left-3 text-subtle font-semibold text-[13px]">R$</span>
                    <input 
                      type="number"
                      value={profile?.earnings_goal_monthly || 0}
                      onChange={e => setProfile(p => p ? {...p, earnings_goal_monthly: Number(e.target.value)} : null)}
                      className="w-full pl-9 pr-3 py-2 text-[13px] font-semibold text-heading bg-bg border border-border focus:border-blue-primary focus:ring-1 focus:ring-blue-primary rounded-lg outline-none transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-muted mb-1.5">Ticket Médio (Est.)</label>
                  <div className="relative flex items-center">
                    <span className="absolute left-3 text-subtle font-semibold text-[13px]">R$</span>
                    <input 
                      type="number"
                      value={profile?.avg_ticket || 0}
                      onChange={e => setProfile(p => p ? {...p, avg_ticket: Number(e.target.value)} : null)}
                      className="w-full pl-9 pr-3 py-2 text-[13px] font-semibold text-heading bg-bg border border-border focus:border-blue-primary focus:ring-1 focus:ring-blue-primary rounded-lg outline-none transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-muted mb-1.5">Comissão Média</label>
                  <div className="relative flex items-center">
                    <input 
                      type="number"
                      step="0.01"
                      value={profile?.avg_commission_percent || 0}
                      onChange={e => setProfile(p => p ? {...p, avg_commission_percent: Number(e.target.value)} : null)}
                      className="w-full pl-3 pr-8 py-2 text-[13px] font-semibold text-heading bg-bg border border-border focus:border-blue-primary focus:ring-1 focus:ring-blue-primary rounded-lg outline-none transition-all"
                    />
                    <span className="absolute right-3 text-subtle font-semibold text-[13px]">%</span>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* Coluna Direita: Formulários */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Perfil Profissional Card */}
            <div className="bg-surface border border-border rounded-xl shadow-card overflow-hidden">
              <div className="px-6 py-4 border-b border-border-light flex items-center gap-2">
                <Briefcase size={18} className="text-blue-primary" />
                <h3 className="text-[14px] font-bold text-heading">Perfil Profissional</h3>
              </div>

              <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-muted mb-1.5">Nome Completo</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" size={16} />
                    <input 
                      type="text" 
                      value={profile?.full_name} 
                      onChange={e => setProfile(p => p ? {...p, full_name: e.target.value} : null)}
                      className="w-full pl-9 pr-3 py-2.5 text-[13px] font-semibold text-heading bg-bg border border-border focus:border-blue-primary focus:ring-1 focus:ring-blue-primary rounded-lg outline-none transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-muted mb-1.5">E-mail de Acesso</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" size={16} />
                    <input 
                      type="email" 
                      value={profile?.email} 
                      disabled
                      className="w-full pl-9 pr-3 py-2.5 text-[13px] font-semibold text-subtle bg-bg border border-border rounded-lg outline-none cursor-not-allowed opacity-70"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-muted mb-1.5">WhatsApp Profissional</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" size={16} />
                    <input 
                      type="text" 
                      value={profile?.whatsapp || ''} 
                      onChange={e => setProfile(p => p ? {...p, whatsapp: e.target.value} : null)}
                      placeholder="(00) 0 0000-0000"
                      className="w-full pl-9 pr-3 py-2.5 text-[13px] font-semibold text-heading bg-bg border border-border focus:border-blue-primary focus:ring-1 focus:ring-blue-primary rounded-lg outline-none transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-muted mb-1.5">CRECI / Registro</label>
                  <div className="relative">
                    <FileText className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" size={16} />
                    <input 
                      type="text" 
                      value={profile?.creci || ''} 
                      onChange={e => setProfile(p => p ? {...p, creci: e.target.value} : null)}
                      placeholder="Ex: 00000-F"
                      className="w-full pl-9 pr-3 py-2.5 text-[13px] font-semibold text-heading bg-bg border border-border focus:border-blue-primary focus:ring-1 focus:ring-blue-primary rounded-lg outline-none transition-all"
                    />
                  </div>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-muted mb-1.5">Sua Bio (Aparecerá no site)</label>
                  <textarea 
                    rows={4}
                    value={profile?.bio || ''}
                    onChange={e => setProfile(p => p ? {...p, bio: e.target.value} : null)}
                    placeholder="Conte um pouco sobre sua experiência..."
                    className="w-full p-3 text-[13px] text-body bg-bg border border-border focus:border-blue-primary focus:ring-1 focus:ring-blue-primary rounded-lg outline-none transition-all resize-none"
                  />
                </div>
              </div>
            </div>

            {/* Presença Digital Card */}
            <div className="bg-surface border border-border rounded-xl shadow-card overflow-hidden">
              <div className="px-6 py-4 border-b border-border-light flex items-center gap-2">
                <Globe size={18} className="text-blue-primary" />
                <h3 className="text-[14px] font-bold text-heading">Presença Digital</h3>
              </div>

              <div className="p-6">
                <label className="block text-[11px] font-bold uppercase tracking-wider text-muted mb-1.5">Link da sua Vitrine</label>
                <div className="flex">
                  <div className="px-4 py-2.5 bg-bg text-[13px] font-semibold text-subtle border border-r-0 border-border rounded-l-lg">
                    habita.vc/
                  </div>
                  <input 
                    type="text" 
                    value={profile?.slug || ''} 
                    onChange={e => setProfile(p => p ? {...p, slug: e.target.value.toLowerCase().replace(/s+/g, '-')} : null)}
                    placeholder="seu-nome"
                    className="flex-1 px-3 py-2.5 text-[13px] font-semibold text-heading bg-surface border border-border focus:border-blue-primary focus:ring-1 focus:ring-blue-primary rounded-r-lg outline-none transition-all"
                  />
                </div>
                <p className="text-[11px] text-subtle mt-2">Este link é por onde seus clientes verão seus imóveis exclusivos.</p>
              </div>
            </div>

            {/* Botão de Ação */}
            <div className="flex items-center justify-end gap-4 pt-4">
               {saved && (
                 <span className="flex items-center gap-1.5 text-[13px] text-green-primary font-bold">
                    <CheckCircle2 size={16} /> Perfil atualizado!
                 </span>
               )}
               <button
                type="submit"
                disabled={saving}
                className="px-6 py-2.5 bg-blue-primary text-white text-[13px] font-semibold rounded-lg hover:bg-blue-hover transition-colors shadow-sm flex items-center gap-2 disabled:opacity-50"
               >
                 {saving ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />}
                 Salvar Alterações
               </button>
            </div>

          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}
