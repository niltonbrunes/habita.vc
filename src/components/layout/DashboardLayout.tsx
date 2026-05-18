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
  Globe,
  Menu,
  X
} from 'lucide-react';

interface DashboardLayoutProps {
  children: React.ReactNode;
  actions?: React.ReactNode;
}

import { useTheme } from '@/context/ThemeContext';
import { useAuth } from '@/context/AuthContext';
import { useNotifications } from '@/context/NotificationContext';
import { useState } from 'react';

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children, actions }) => {
  const { isLuxury, toggleLuxury } = useTheme();
  const { profile, signOut, isRole } = useAuth();
  const { notifications, unreadCount, markAsRead } = useNotifications();
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  return (
    <div className={`flex h-screen bg-background font-sans transition-colors duration-500 ${isLuxury ? 'luxury-mode' : ''}`}>
      {/* Mobile Backdrop */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-40 lg:hidden backdrop-blur-sm transition-opacity"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-60 flex flex-col shadow-[20px_0_40px_-15px_rgba(0,0,0,0.05)] transition-transform duration-300
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:static lg:translate-x-0 lg:flex
        bg-card border-r border-border
      `}>
        <div className="p-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-accent p-2 rounded-xl shadow-lg shadow-accent/20">
              <Home className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-black tracking-tighter text-primary">Habita<span className="text-accent">.vc</span></span>
          </div>
          <button className="lg:hidden text-muted-foreground hover:text-primary" onClick={() => setIsMobileMenuOpen(false)}>
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 px-4 py-2 space-y-1 overflow-y-auto scrollbar-hide">
          <SidebarItem icon={<LayoutDashboard size={18} />} label="Dashboard" href="/crmhabita" active={pathname === '/crmhabita'} />
          <SidebarItem icon={<Target size={18} />} label="Gestão de Leads" href="/crmhabita/leads" active={pathname.startsWith('/crmhabita/leads')} />
          <SidebarItem icon={<Trophy size={18} />} label="Performance" href="/crmhabita/ranking" active={pathname === '/crmhabita/ranking'} />
          <SidebarItem icon={<Layers size={18} />} label="Empreendimentos" href="/crmhabita/empreendimentos" active={pathname.startsWith('/crmhabita/empreendimentos')} />
          <SidebarItem icon={<Calendar size={18} />} label="Agenda" href="/crmhabita/agenda" active={pathname === '/crmhabita/agenda'} />
          <SidebarItem icon={<Users size={18} />} label="Contatos" href="/crmhabita/pessoas" active={pathname.startsWith('/crmhabita/pessoas')} />
          <SidebarItem icon={<Sparkles size={18} />} label="Prospecção IA" href="/crmhabita/prospeccao" active={pathname.startsWith('/crmhabita/prospeccao')} />
          <SidebarItem icon={<Home size={18} />} label="Meus Imóveis" href="/crmhabita/imoveis" active={pathname.startsWith('/crmhabita/imoveis')} />
          <SidebarItem icon={<Globe size={18} />} label="Publicação" href="/crmhabita/publicacao" active={pathname === '/crmhabita/publicacao'} />
          <SidebarItem icon={<TrendingUp size={18} />} label="Comissões" href="/crmhabita/comissoes" active={pathname.startsWith('/crmhabita/comissoes')} />
          <SidebarItem icon={<Target size={18} />} label="BI & Metas" href="/crmhabita/metas" active={pathname.startsWith('/crmhabita/metas')} />
          {isRole(['admin', 'manager', 'director']) && (
            <SidebarItem icon={<Briefcase size={18} />} label="Equipe" href="/crmhabita/equipe" active={pathname.startsWith('/crmhabita/equipe')} />
          )}
          <SidebarItem icon={<Settings size={18} />} label="Meu Perfil" href="/crmhabita/configuracoes" active={pathname.startsWith('/crmhabita/configuracoes')} />
        </nav>

        <div className="p-6">
          <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-2xl border border-border group hover:bg-muted transition-all cursor-pointer">
            <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center font-black text-white shadow-lg">
              {profile?.full_name?.substring(0, 2) || 'HB'}
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="text-xs font-black truncate text-primary">{profile?.full_name || 'Carregando...'}</p>
              <p className="text-[9px] text-muted-foreground font-bold uppercase tracking-widest truncate">{profile?.role || 'Corretor'}</p>
            </div>
            <LogOut 
              size={14} 
              className="text-muted-foreground cursor-pointer hover:text-red-500 transition-colors" 
              onClick={() => signOut()}
            />
          </div>
        </div>
      </aside>

      <main className="flex-1 flex flex-col overflow-hidden w-full relative">
        <header className="h-16 border-b border-border flex items-center justify-between px-4 lg:px-8 z-30 transition-colors duration-500 bg-card/80 backdrop-blur-md">
          <div className="flex items-center gap-3 lg:gap-4 flex-1">
            <button 
              className="lg:hidden p-1 -ml-1 text-primary hover:text-accent"
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <Menu size={24} />
            </button>
            <h2 className="text-sm md:text-lg font-bold truncate text-primary">
              {isRole(['director', 'manager']) ? 'Painel Gestão' : 'Dashboard Corretor'}
            </h2>
            {actions && (
              <div className="hidden md:flex items-center gap-2 ml-4 px-4 border-l border-border/50 h-8">
                {actions}
              </div>
            )}
          </div>
          
          <div className="flex items-center gap-6">
            <div 
              onClick={toggleLuxury}
              className={`
                hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full cursor-pointer transition-all border group
                ${isLuxury 
                  ? 'bg-accent text-white border-accent shadow-[0_0_15px_rgba(217,119,6,0.4)]' 
                  : 'bg-luxury-gold/10 text-luxury-gold border-luxury-gold/20 hover:bg-luxury-gold/20'}
              `}
            >
              <Crown size={16} className={`group-hover:scale-110 transition-transform ${isLuxury ? 'fill-white' : ''}`} />
              <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider">Modo Premium</span>
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
        <div className="flex-1 overflow-y-auto p-4 lg:p-8">
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
        : 'text-muted-foreground hover:bg-muted hover:text-primary'}
    `}
  >
    {icon}
    {label}
  </Link>
);
