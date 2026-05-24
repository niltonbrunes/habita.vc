'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard, Users, Home, TrendingUp, Target,
  Settings, LogOut, Bell, Calendar, Briefcase,
  Sparkles, Globe, Menu, ShoppingBag, Trophy
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useNotifications } from '@/context/NotificationContext';
import { useState } from 'react';

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

  const initials = profile?.full_name?.split(' ').map((n: string) => n[0]).slice(0, 2).join('') || 'HB';
  const firstName = profile?.full_name?.split(' ')[0] || 'Corretor';
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Bom dia' : hour < 18 ? 'Boa tarde' : 'Boa noite';

  return (
    <div className="flex h-screen bg-[#F8FAFC] font-sans overflow-hidden">

      {isMobileMenuOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setIsMobileMenuOpen(false)} />
      )}

      {/* SIDEBAR */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 flex flex-col items-center
        w-[60px] bg-[#0F172A] py-4 gap-0.5 flex-shrink-0 transition-transform duration-300
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:static lg:translate-x-0
      `}>
        <div className="w-[34px] h-[34px] rounded-[9px] bg-blue-600 flex items-center justify-center mb-5 flex-shrink-0">
          <Home className="w-[17px] h-[17px] text-white" />
        </div>

        <NavIcon icon={<LayoutDashboard size={17} />} href="/crmhabita"             label="Dashboard"    active={pathname === '/crmhabita'} />
        <NavIcon icon={<Target size={17} />}           href="/crmhabita/leads"       label="Leads"        active={pathname.startsWith('/crmhabita/leads')} />
        <NavIcon icon={<Trophy size={17} />}           href="/crmhabita/ranking"     label="Ranking"      active={pathname === '/crmhabita/ranking'} />
        <NavIcon icon={<Home size={17} />}             href="/crmhabita/imoveis"     label="Imóveis"      active={pathname.startsWith('/crmhabita/imoveis')} />
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

        <div className="w-[28px] h-[1px] bg-white/10 my-2" />
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
        <header className="h-[58px] bg-white border-b border-[#E2E8F0] px-5 flex items-center justify-between flex-shrink-0 gap-4">
          <div className="flex items-center gap-3">
            <button className="lg:hidden text-slate-500 hover:text-slate-800" onClick={() => setIsMobileMenuOpen(true)}>
              <Menu size={20} />
            </button>
            <div>
              <h1 className="text-[15px] font-bold text-slate-900 leading-tight">
                {greeting}, {firstName} 👋
              </h1>
              <p className="text-[11px] text-slate-400 font-medium">
                {isRole(['director', 'manager']) ? 'Painel de Gestão' : 'Seu painel de performance'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 flex-shrink-0">
            {actions}
            <div className="relative">
              <button
                onClick={() => setIsNotifOpen(!isNotifOpen)}
                className="w-[32px] h-[32px] rounded-[8px] border border-[#E2E8F0] bg-white flex items-center justify-center text-slate-500 hover:bg-slate-50 transition-colors relative"
              >
                <Bell size={15} />
                {unreadCount > 0 && (
                  <span className="absolute top-[7px] right-[7px] w-[6px] h-[6px] bg-orange-500 rounded-full border border-white" />
                )}
              </button>
              {isNotifOpen && (
                <div className="absolute top-full right-0 mt-2 w-72 bg-white rounded-xl shadow-xl border border-[#E2E8F0] overflow-hidden z-50">
                  <div className="px-4 py-3 border-b border-[#E2E8F0]">
                    <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400">Notificações</p>
                  </div>
                  <div className="max-h-72 overflow-y-auto">
                    {notifications.length > 0 ? notifications.map(n => (
                      <div key={n.id} onClick={() => markAsRead(n.id)}
                        className="px-4 py-3 border-b border-[#F1F5F9] hover:bg-slate-50 cursor-pointer transition-colors">
                        <p className="text-[12px] font-semibold text-slate-800">{n.title}</p>
                        <p className="text-[11px] text-slate-400 mt-0.5">{n.message}</p>
                      </div>
                    )) : (
                      <div className="px-4 py-6 text-center">
                        <p className="text-[12px] text-slate-400">Tudo em dia por aqui.</p>
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
    </div>
  );
};

const NavIcon = ({ icon, href, label, active }: { icon: React.ReactNode; href: string; label: string; active: boolean }) => (
  <Link href={href} title={label}
    className={`w-[38px] h-[38px] rounded-[9px] flex items-center justify-center transition-all duration-150 ${
      active ? 'bg-blue-600 text-white' : 'text-white/40 hover:text-white/80 hover:bg-white/5'
    }`}
  >
    {icon}
  </Link>
);
