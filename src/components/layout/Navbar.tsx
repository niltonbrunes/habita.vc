import React from 'react';
import Link from 'next/link';
import { Home, LayoutDashboard, Menu, Search } from 'lucide-react';

export const Navbar = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-dark border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-2">
            <div className="bg-white/10 p-1.5 rounded-lg backdrop-blur-md">
              <Home className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight text-white">
              Habita<span className="text-accent">.vc</span>
            </span>
          </div>
          
          <div className="hidden md:flex items-center gap-8">
            <Link href="/" className="text-sm font-medium text-white hover:text-accent transition-colors">Início</Link>
            <Link href="/imoveis" className="text-sm font-medium text-white/70 hover:text-white transition-colors">Imóveis</Link>
            <Link href="/empreendimentos" className="text-sm font-medium text-white/70 hover:text-white transition-colors">Empreendimentos</Link>
            <Link href="/blog" className="text-sm font-medium text-white/70 hover:text-white transition-colors">Blog</Link>
          </div>

          <div className="flex items-center gap-4">
            <button className="p-2 text-white/70 hover:text-white transition-colors">
              <Search className="w-5 h-5" />
            </button>
            <Link 
              href="/crmhabita" 
              className="hidden sm:flex items-center gap-2 bg-white text-black px-4 py-2 rounded-full text-sm font-semibold hover:bg-white/90 transition-all shadow-premium"
            >
              <LayoutDashboard className="w-4 h-4" />
              CRM Habita
            </Link>
            <button className="md:hidden p-2 text-white">
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};
