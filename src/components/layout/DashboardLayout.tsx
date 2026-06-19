'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { InstallPrompt } from '@/components/pwa/InstallPrompt';
import {
  LayoutDashboard, Users, Home, TrendingUp, Target,
  Settings, LogOut, Bell, Calendar, Briefcase,
  Sparkles, Globe, Menu, ShoppingBag, Trophy, Building2
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useNotifications } from '@/context/NotificationContext';
import { useState, useEffect } from 'react';

interface DashboardLayoutProps {
  children: React.ReactNode;
  actions?: React.ReactNode;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children, actions }) => {
  const { profile, signOut, isRole } = useAuth();
  const { notifications, unreadCount, markAsRead } = useNotifications();
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  const initials = profile?.full_name?.split(' ').map((n: string) => n[0]).slice(0, 2).join('') || 'HB';
  const firstName = profile?.full_name?.split(' ')[0] || 'Corretor';
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Bom dia' : hour < 18 ? 'Boa tarde' : 'Boa noite';

  return (
    <div className="flex h-screen bg-bg font-sans overflow-hidden">

      {isMobileMenuOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setIsMobileMenuOpen(false)} />
      )}

      {/* SIDEBAR */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 flex flex-col items-center
        w-[60px] bg-heading py-4 gap-0.5 flex-shrink-0 transition-transform duration-300
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:static lg:translate-x-0
      `}>
        <div className="w-[34px] h-[34px] rounded-[9px] bg-blue-primary flex items-center justify-center mb-2 flex-shrink-0">
          <Home className="w-[17px] h-[17px] text-white" />
        </div>
        {/* Close button — mobile only */}
        <button
          onClick={() => setIsMobileMenuOpen(false)}
          className="lg:hidden w-[34px] h-[34px] rounded-[9px] flex items-center justify-center text-white/50 hover:text-white hover:bg-surface/10 transition-all mb-3"
          title="Fechar menu"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>

        <NavIcon icon={<LayoutDashboard size={17} />} href="/crmhabita"             label="Dashboard"    active={pathname === '/crmhabita'} />
        <NavIcon icon={<Target size={17} />}           href="/crmhabita/leads"       label="Leads"        active={pathname.startsWith('/crmhabita/leads')} />
        <NavIcon icon={<Trophy size={17} />}           href="/crmhabita/ranking"     label="Ranking"      active={pathname === '/crmhabita/ranking'} />
        <NavIcon icon={<Home size={17} />}             href="/crmhabita/imoveis"     label="Imóveis"      active={pathname.startsWith('/crmhabita/imoveis')} />
        <NavIcon icon={<Building2 size={17} />}         href="/crmhabita/empreendimentos" label="Empreendimentos" active={pathname.startsWith('/crmhabita/empreendimentos')} />
        <NavIcon icon={<Calendar size={17} />}         href="/crmhabita/agenda"      label="Agenda"       active={pathname === '/crmhabita/agenda'} />
        <NavIcon icon={<Users size={17} />}            href="/crmhabita/pessoas"     label="Contatos"     active={pathname.startsWith('/crmhabita/pessoas')} />
        <NavIcon icon={<Sparkles size={17} />}         href="/crmhabita/prospeccao"  label="IA"           active={pathname.startsWith('/crmhabita/prospeccao')} />
        <NavIcon icon={<Globe size={17} />}            href="/crmhabita/publicacao"  label="Publicação"   active={pathname === '/crmhabita/publicacao'} />
        <NavIcon icon={<TrendingUp size={17} />}       href="/crmhabita/vendas"      label="Vendas"       active={pathname.startsWith('/crmhabita/vendas')} />
        <NavIcon icon={<ShoppingBag size={17} />}      href="/crmhabita/comissoes"   label="Comissões"    active={pathname.startsWith('/crmhabita/comissoes')} />
        <NavIcon icon={<Target size={17} />}           href="/crmhabita/metas"       label="BI & Metas"   active={pathname.startsWith('/crmhabita/metas')} />
        {isRole(['admin', 'manager', 'director']) && (
          <NavIcon icon={<Briefcase size={17} />}      href="/crmhabita/equipe"      label="Equipe"       active={pathname.startsWith('/crmhabita/equipe')} />
        )}

        <div className="w-[28px] h-[1px] bg-surface/10 my-2" />
        <NavIcon icon={<Settings size={17} />}         href="/crmhabita/configuracoes" label="Configurações" active={pathname.startsWith('/crmhabita/configuracoes')} />

        <div className="mt-auto">
          <button
            title="Sair"
            onClick={() => signOut()}
            className="w-[32px] h-[32px] rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-[11px] font-bold border-2 border-white/15 hover:opacity-80 transition-opacity"
          >
            {initials}
          </button>
        </div>
      </aside>

      {/* MAIN */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">

        {/* TOPBAR */}
        <header className="h-[58px] bg-surface border-b border-border px-5 flex items-center justify-between flex-shrink-0 gap-4">
          <div className="flex items-center gap-3">
            <button className="lg:hidden text-subtle hover:text-heading p-1 -ml-1 rounded-lg hover:bg-muted/50 transition-colors" onClick={() => setIsMobileMenuOpen(true)}>
              <Menu size={22} />
            </button>
            <div>
              <h1 className="text-[15px] font-bold text-heading leading-tight">
                {greeting}, {firstName} 👋
              </h1>
              <p className="text-[11px] text-muted font-medium">
                {isRole(['director', 'manager']) ? 'Painel de Gestão' : 'Seu painel de performance'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 flex-shrink-0">
            {actions}
            <div className="relative">
              <button
                onClick={() => setIsNotifOpen(!isNotifOpen)}
                className="w-[32px] h-[32px] rounded-[8px] border border-border bg-surface flex items-center justify-center text-subtle hover:bg-bg transition-colors relative"
              >
                <Bell size={15} />
                {unreadCount > 0 && (
                  <span className="absolute top-[7px] right-[7px] w-[6px] h-[6px] bg-orange-primary rounded-full border border-white" />
                )}
              </button>
              {isNotifOpen && (
                <div className="absolute top-full right-0 mt-2 w-72 bg-surface rounded-xl shadow-xl border border-border overflow-hidden z-50">
                  <div className="px-4 py-3 border-b border-border">
                    <p className="text-[11px] font-bold uppercase tracking-widest text-muted">Notificações</p>
                  </div>
                  <div className="max-h-72 overflow-y-auto">
                    {notifications.length > 0 ? notifications.map(n => (
                      <div key={n.id} onClick={() => markAsRead(n.id)}
                        className="px-4 py-3 border-b border-border-light hover:bg-bg cursor-pointer transition-colors">
                        <p className="text-[12px] font-semibold text-heading">{n.title}</p>
                        <p className="text-[11px] text-muted mt-0.5">{n.message}</p>
                      </div>
                    )) : (
                      <div className="px-4 py-6 text-center">
                        <p className="text-[12px] text-muted">Tudo em dia por aqui.</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* CONTENT */}
        <div className="flex-1 overflow-y-auto">
          {children}
        </div>
      </div>
    <InstallPrompt />
    </div>
  );
};

const NavIcon = ({ icon, href, label, active }: { icon: React.ReactNode; href: string; label: string; active: boolean }) => (
  <Link href={href} title={label}
    className={`w-[38px] h-[38px] rounded-[9px] flex items-center justify-center transition-all duration-150 ${
      active ? 'bg-blue-primary text-white' : 'text-white/40 hover:text-white/80 hover:bg-surface/5'
    }`}
  >
    {icon}
  </Link>
);
