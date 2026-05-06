'use client';

import React from 'react';
// Layout de alto padrão Habita.vc - Atualizado para SaaS
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Users, 
  Home, 
  TrendingUp, 
  Target, 
  Settings, 
  LogOut,
  Bell,
  Crown,
  Calendar,
  Briefcase,
  Sparkles,
  Layers,
  Trophy,
  Globe
} from 'lucide-react';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

import { useTheme } from '@/context/ThemeContext';
import { useAuth } from '@/context/AuthContext';
import { useNotifications } from '@/context/NotificationContext';
import { useState } from 'react';

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const { isLuxury, toggleLuxury } = useTheme();
  const { profile, signOut, isRole } = useAuth();
  const { notifications, unreadCount, markAsRead } = useNotifications();
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const pathname = usePathname();

  return (
    <div className={`flex h-screen ${isLuxury ? 'bg-black' : 'bg-muted/30'}`}>
      {/* Sidebar - code below omitted for brevity but preserved */}
      <aside className={`w-64 flex flex-col shadow-xl z-20 transition-colors duration-500 ${isLuxury ? 'bg-black border-r border-white/10' : 'bg-primary'}`}>
        <div className="p-6 flex items-center gap-2">
          <div className="bg-white p-1 rounded-lg">
            <Home className="w-6 h-6 text-primary" />
          </div>
          <span className="text-xl font-bold tracking-tight text-white">Habita<span className="text-accent">.vc</span></span>
        </div>

        <nav className="flex-1 px-4 py-4 space-y-2">
          <SidebarItem icon={<LayoutDashboard size={20} />} label="Dashboard" href="/crmhabita" active={pathname === '/crmhabita'} />
          <SidebarItem icon={<Trophy size={20} />} label="Performance" href="/crmhabita/ranking" active={pathname === '/crmhabita/ranking'} />
          <SidebarItem icon={<Layers size={20} />} label="Empreendimentos" href="/crmhabita/empreendimentos" active={pathname.startsWith('/crmhabita/empreendimentos')} />
          <SidebarItem icon={<Calendar size={20} />} label="Agenda" href="/crmhabita/agenda" active={pathname === '/crmhabita/agenda'} />
          <SidebarItem icon={<Users size={20} />} label="Leads (CRM)" href="/crmhabita/leads" active={pathname === '/crmhabita/leads'} />
          <SidebarItem icon={<Sparkles size={20} />} label="Prospecção IA" href="/crmhabita/prospeccao" active={pathname.startsWith('/crmhabita/prospeccao')} />
          <SidebarItem icon={<Home size={20} />} label="Meus Imóveis" href="/crmhabita/imoveis" active={pathname.startsWith('/crmhabita/imoveis')} />
          <SidebarItem icon={<Globe size={20} />} label="Publicação Portal" href="/crmhabita/publicacao" active={pathname === '/crmhabita/publicacao'} />
          <SidebarItem icon={<TrendingUp size={20} />} label="Comissões" href="/crmhabita/comissoes" active={pathname.startsWith('/crmhabita/comissoes')} />
          <SidebarItem icon={<Target size={20} />} label="BI & Metas" href="/crmhabita/metas" active={pathname.startsWith('/crmhabita/metas')} />
          <SidebarItem icon={<Briefcase size={20} />} label="Equipe" href="/crmhabita/equipe" active={pathname.startsWith('/crmhabita/equipe')} />
          <SidebarItem icon={<Settings size={20} />} label="Configurações" href="/crmhabita/settings" active={pathname.startsWith('/crmhabita/settings')} />
        </nav>

        <div className="p-4 border-t border-white/10">
          <div className="flex items-center gap-3 p-3 bg-white/5 rounded-xl">
            <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center font-bold text-white uppercase">
              {profile?.full_name?.substring(0, 2) || 'HB'}
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="text-sm font-bold truncate text-white">{profile?.full_name || 'Carregando...'}</p>
              <p className="text-[10px] text-white/50 uppercase tracking-widest truncate">{profile?.role || 'Corretor'}</p>
            </div>
            <LogOut 
              size={16} 
              className="text-white/50 cursor-pointer hover:text-white transition-colors" 
              onClick={() => signOut()}
            />
          </div>
        </div>
      </aside>

      <main className="flex-1 flex flex-col overflow-hidden">
        <header className={`h-16 border-b flex items-center justify-between px-8 z-50 transition-colors duration-500 ${isLuxury ? 'bg-black/80 backdrop-blur-md border-white/10' : 'bg-white border-border'}`}>
          <div className="flex items-center gap-4">
            <h2 className={`text-lg font-bold ${isLuxury ? 'text-white' : 'text-primary'}`}>
              {isRole(['director', 'manager']) ? 'Painel de Gestão' : 'Dashboard Corretor'}
            </h2>
          </div>
          
          <div className="flex items-center gap-6">
            <div 
              onClick={toggleLuxury}
              className={`
                flex items-center gap-2 px-3 py-1.5 rounded-full cursor-pointer transition-all border group
                ${isLuxury 
                  ? 'bg-accent text-white border-accent shadow-[0_0_15px_rgba(217,119,6,0.4)]' 
                  : 'bg-luxury-gold/10 text-luxury-gold border-luxury-gold/20 hover:bg-luxury-gold/20'}
              `}
            >
              <Crown size={16} className={`group-hover:scale-110 transition-transform ${isLuxury ? 'fill-white' : ''}`} />
              <span className="text-xs font-bold uppercase tracking-wider">Modo Alto Padrão</span>
            </div>
            
            <div className="relative">
              <Bell 
                size={20} 
                onClick={() => setIsNotifOpen(!isNotifOpen)}
                className={`cursor-pointer transition-colors ${isNotifOpen ? 'text-accent' : 'text-muted-foreground hover:text-primary'}`} 
              />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-accent text-[9px] font-black text-primary rounded-full flex items-center justify-center border-2 border-white">
                  {unreadCount}
                </span>
              )}

              {isNotifOpen && (
                <div className="absolute top-full right-0 mt-4 w-80 bg-white rounded-3xl shadow-luxury border border-border overflow-hidden animate-in fade-in zoom-in duration-300">
                  <div className="p-5 border-b border-border bg-muted/10">
                    <p className="text-[10px] font-black uppercase tracking-widest text-primary">Notificações Recentes</p>
                  </div>
                  <div className="max-h-80 overflow-y-auto">
                    {notifications.length > 0 ? notifications.map(n => (
                      <div 
                        key={n.id} 
                        onClick={() => markAsRead(n.id)}
                        className={`p-5 border-b border-border hover:bg-muted/30 transition-colors cursor-pointer ${!n.read ? 'bg-primary/5' : ''}`}
                      >
                        <p className="font-bold text-xs text-primary mb-1">{n.title}</p>
                        <p className="text-xs text-muted-foreground font-medium">{n.message}</p>
                        <p className="text-[9px] text-muted-foreground/40 mt-2 font-bold">{new Date(n.created_at).toLocaleTimeString()}</p>
                      </div>
                    )) : (
                      <div className="p-8 text-center">
                        <p className="text-xs text-muted-foreground">Tudo limpo por aqui.</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Scrollable Area */}
        <div className="flex-1 overflow-y-auto p-8">
          {children}
        </div>
      </main>
    </div>
  );
};

const SidebarItem = ({ icon, label, href, active = false }: { icon: React.ReactNode, label: string, href: string, active?: boolean }) => (
  <Link 
    href={href} 
    className={`
      flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all
      ${active 
        ? 'bg-accent text-white shadow-lg' 
        : 'text-white/70 hover:bg-white/10 hover:text-white'}
    `}
  >
    {icon}
    {label}
  </Link>
);
