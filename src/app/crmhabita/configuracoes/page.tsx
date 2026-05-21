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
  Trophy, Target, BarChart3, Save
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
      // Only send fields that are safe to update (avoid id, email, role, and complex objects)
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
      const msg = err?.message || 'Erro desconhecido ao salvar.';
      alert('Erro ao salvar perfil: ' + msg);
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
      alert('Erro ao fazer upload da foto.');
    } finally {
      setUploading(false);
    }
  };

  if (loading) return (
    <DashboardLayout>
      <div className="h-full flex items-center justify-center">
        <Loader2 className="animate-spin text-primary" size={40} />
      </div>
    </DashboardLayout>
  );

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto pb-20">
        <div className="mb-10">
          <h1 className="text-4xl font-black text-primary tracking-tight">Configurações de Perfil</h1>
          <p className="text-muted-foreground font-medium">Gerencie sua identidade profissional e metas no Habita.vc</p>
        </div>

        <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Coluna Esquerda: Avatar e Status */}
          <div className="space-y-8">
            <div className="bg-white rounded-[2.5rem] p-8 shadow-premium border-2 border-border text-center">
              <div className="relative w-32 h-32 mx-auto mb-6 group">
                <div className="w-full h-full bg-muted rounded-[2.5rem] overflow-hidden border-2 border-primary/10 shadow-inner flex items-center justify-center">
                  {profile?.avatar_url ? (
                    <img src={profile.avatar_url} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <User size={48} className="text-primary/20" />
                  )}
                </div>
                <label className="absolute inset-0 flex items-center justify-center bg-black/40 text-white rounded-[2.5rem] opacity-0 group-hover:opacity-100 transition-all cursor-pointer">
                  {uploading ? <Loader2 className="animate-spin" /> : <Camera size={24} />}
                  <input type="file" className="hidden" onChange={handleAvatarUpload} accept="image/*" />
                </label>
              </div>
              
              <h3 className="text-xl font-black text-primary mb-1">{profile?.full_name}</h3>
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-6">{profile?.role}</p>
              
              <div className="flex items-center justify-center gap-2 px-4 py-2 bg-green-50 text-green-600 rounded-xl text-xs font-black uppercase tracking-widest border border-green-100">
                <ShieldCheck size={14} /> Conta Ativa
              </div>
            </div>

            {/* Metas e Performance */}
            <div className="bg-primary rounded-[2.5rem] p-8 text-white shadow-luxury relative overflow-hidden">
               <div className="relative z-10 space-y-6">
                  <h4 className="font-black flex items-center gap-2 opacity-80">
                    <Target size={20} /> Metas Mensais
                  </h4>
                  
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest opacity-60 mb-1">Meta de Ganhos</p>
                    <div className="flex items-end gap-1">
                      <span className="text-2xl font-black">R$ {profile?.earnings_goal_monthly.toLocaleString()}</span>
                    </div>
                  </div>

                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest opacity-60 mb-1">Ticket Médio</p>
                    <p className="text-lg font-bold">R$ {profile?.avg_ticket.toLocaleString()}</p>
                  </div>

                  <div className="pt-4 border-t border-white/10">
                    <button type="button" className="text-xs font-black uppercase tracking-widest flex items-center gap-2 hover:opacity-80 transition-all">
                      <BarChart3 size={16} /> Ver Painel de Metas
                    </button>
                  </div>
               </div>
               <Trophy className="absolute -bottom-4 -right-4 text-white/5" size={140} />
            </div>
          </div>

          {/* Coluna Direita: Formulários */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Dados Profissionais */}
            <div className="bg-white rounded-[2.5rem] p-8 md:p-10 shadow-premium border-2 border-border">
              <h3 className="text-2xl font-black text-primary mb-8 flex items-center gap-3">
                <Briefcase size={24} className="text-accent" /> Perfil Profissional
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-black text-primary uppercase tracking-widest ml-1">Nome Completo</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                    <input 
                      type="text" 
                      value={profile?.full_name} 
                      onChange={e => setProfile(p => p ? {...p, full_name: e.target.value} : null)}
                      className="w-full pl-12 pr-4 py-4 bg-muted/30 border-2 border-transparent focus:border-primary/20 focus:bg-white rounded-2xl font-bold transition-all outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-black text-primary uppercase tracking-widest ml-1">E-mail de Acesso</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                    <input 
                      type="email" 
                      value={profile?.email} 
                      disabled
                      className="w-full pl-12 pr-4 py-4 bg-muted/50 border-2 border-transparent rounded-2xl font-bold text-muted-foreground cursor-not-allowed outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-black text-primary uppercase tracking-widest ml-1">WhatsApp Profissional</label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                    <input 
                      type="text" 
                      value={profile?.whatsapp || ''} 
                      onChange={e => setProfile(p => p ? {...p, whatsapp: e.target.value} : null)}
                      placeholder="(00) 0 0000-0000"
                      className="w-full pl-12 pr-4 py-4 bg-muted/30 border-2 border-transparent focus:border-primary/20 focus:bg-white rounded-2xl font-bold transition-all outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-black text-primary uppercase tracking-widest ml-1">CRECI / Registro</label>
                  <div className="relative">
                    <FileText className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                    <input 
                      type="text" 
                      value={profile?.creci || ''} 
                      onChange={e => setProfile(p => p ? {...p, creci: e.target.value} : null)}
                      placeholder="Ex: 00000-F"
                      className="w-full pl-12 pr-4 py-4 bg-muted/30 border-2 border-transparent focus:border-primary/20 focus:bg-white rounded-2xl font-bold transition-all outline-none"
                    />
                  </div>
                </div>
              </div>
              
              <div className="mt-8 space-y-2">
                <label className="text-xs font-black text-primary uppercase tracking-widest ml-1">Sua Bio (Aparecerá no seu site)</label>
                <textarea 
                  rows={4}
                  value={profile?.bio || ''}
                  onChange={e => setProfile(p => p ? {...p, bio: e.target.value} : null)}
                  placeholder="Conte um pouco sobre sua experiência no mercado imobiliário..."
                  className="w-full p-6 bg-muted/30 border-2 border-transparent focus:border-primary/20 focus:bg-white rounded-[2rem] font-medium leading-relaxed transition-all outline-none"
                />
              </div>
            </div>

            {/* Presença Digital */}
            <div className="bg-white rounded-[2.5rem] p-8 md:p-10 shadow-premium border-2 border-border">
               <h3 className="text-2xl font-black text-primary mb-8 flex items-center gap-3">
                <Globe size={24} className="text-accent" /> Presença Digital
              </h3>

              <div className="space-y-4">
                <label className="text-xs font-black text-primary uppercase tracking-widest ml-1">Link da sua Vitrine de Imóveis</label>
                <div className="flex items-center">
                  <div className="px-6 py-4 bg-muted font-bold text-muted-foreground rounded-l-2xl border-2 border-r-0 border-transparent">
                    habita.vc/
                  </div>
                  <input 
                    type="text" 
                    value={profile?.slug || ''} 
                    onChange={e => setProfile(p => p ? {...p, slug: e.target.value.toLowerCase().replace(/\s+/g, '-')} : null)}
                    placeholder="seu-nome"
                    className="flex-1 px-6 py-4 bg-muted/30 border-2 border-transparent focus:border-primary/20 focus:bg-white rounded-r-2xl font-black text-primary transition-all outline-none"
                  />
                </div>
                <p className="text-[10px] font-medium text-muted-foreground px-1">Este link é por onde seus clientes verão seus imóveis exclusivos.</p>
              </div>
            </div>

            {/* Botão de Ação */}
            <div className="flex items-center justify-end gap-4">
               {saved && (
                 <span className="flex items-center gap-2 text-green-600 font-bold animate-in fade-in slide-in-from-right">
                    <CheckCircle2 size={20} /> Perfil atualizado!
                 </span>
               )}
               <button
                type="submit"
                disabled={saving}
                className="px-10 py-5 bg-primary text-white font-black rounded-2xl hover:bg-primary-light transition-all shadow-luxury flex items-center gap-2 disabled:opacity-50"
               >
                 {saving ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
                 Salvar Alterações Profissionais
               </button>
            </div>

          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}

const Briefcase = (props: any) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="14" x="2" y="7" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>
);
