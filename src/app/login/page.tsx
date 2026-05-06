'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Home, Mail, Lock, ArrowRight, Loader2, AlertCircle, TrendingUp, Handshake } from 'lucide-react';
import Link from 'next/link';
import { PropertiesService } from '@/services/properties.service';
import { Property } from '@/types/database';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [recentProperties, setRecentProperties] = useState<Property[]>([]);

  useEffect(() => {
    PropertiesService.getAllFiltered({}).then(res => {
      setRecentProperties(res.data?.slice(0, 8) || []);
    }).catch(err => console.error(err));
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-white">
      {/* Left Side - Form */}
      <div className="w-full lg:w-[40%] flex flex-col justify-center px-8 md:px-20 py-12 relative overflow-hidden">
        {/* Subtle Background Elements */}
        <div className="absolute top-0 left-0 w-64 h-64 bg-primary/5 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl" />
        
        <div className="max-w-md w-full mx-auto relative">
          <Link href="/" className="flex items-center gap-2 mb-12 group">
            <div className="bg-primary p-1.5 rounded-lg group-hover:rotate-12 transition-transform">
              <Home className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-black tracking-tight text-primary">Habita<span className="text-accent">.vc</span></span>
          </Link>

          <div className="mb-10">
            <h1 className="text-4xl font-black text-primary mb-3">Bem-vindo de volta</h1>
            <p className="text-muted-foreground font-medium">Acesse sua inteligência imobiliária e acelere suas vendas.</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3 text-red-600 text-sm font-bold animate-shake">
              <AlertCircle size={18} />
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-black text-muted-foreground uppercase tracking-widest ml-1">E-mail</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-12 pr-4 py-4 bg-muted/50 border border-transparent rounded-2xl focus:bg-white focus:border-primary/20 focus:ring-4 focus:ring-primary/5 transition-all outline-none font-bold text-primary placeholder:text-muted-foreground/40"
                  placeholder="seu@email.com"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center ml-1">
                <label className="text-xs font-black text-muted-foreground uppercase tracking-widest">Senha</label>
                <Link href="/forgot-password" title="Esqueci minha senha" className="text-xs font-bold text-accent hover:underline">Esqueci a senha</Link>
              </div>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-12 pr-4 py-4 bg-muted/50 border border-transparent rounded-2xl focus:bg-white focus:border-primary/20 focus:ring-4 focus:ring-primary/5 transition-all outline-none font-bold text-primary placeholder:text-muted-foreground/40"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-white py-5 rounded-[1.5rem] font-black text-lg flex items-center justify-center gap-3 hover:bg-primary-light transition-all shadow-premium disabled:opacity-50 disabled:cursor-not-allowed group"
            >
              {loading ? <Loader2 className="animate-spin" size={24} /> : (
                <>
                  Entrar no Dashboard
                  <ArrowRight size={24} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <p className="mt-10 text-center text-sm font-bold text-muted-foreground">
            Ainda não tem conta?{' '}
            <Link href="/register" className="text-accent hover:underline">Criar conta agora</Link>
          </p>
        </div>

        <div className="mt-20 pt-8 border-t border-border flex justify-between items-center text-[10px] font-black text-muted-foreground uppercase tracking-widest">
          <span>Habita.vc © 2026</span>
          <div className="flex gap-4">
            <Link href="/privacy" className="hover:text-primary">Privacidade</Link>
            <Link href="/terms" className="hover:text-primary">Termos</Link>
          </div>
        </div>
      </div>

      {/* Right Side - Visual/Quote */}
      <div className="hidden lg:flex w-[60%] bg-muted/20 relative items-center justify-center p-12 overflow-hidden border-l border-border">
        
        <div className="relative z-10 w-full max-w-4xl">
          <div className="mb-10 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-black uppercase tracking-widest mb-4">
              <Handshake size={16} /> Parceria 50/50
            </div>
            <h2 className="text-4xl font-black text-primary mb-4 leading-[1.1] tracking-tighter">
              Acesso a centenas de <span className="text-accent">captações exclusivas</span>
            </h2>
            <p className="text-lg text-muted-foreground font-medium">
              Entre para a rede Habita.vc e faça parcerias seguras. Nossas captações mais recentes:
            </p>
          </div>

          <div className="grid grid-cols-4 gap-4">
            {recentProperties.map(property => (
              <div key={property.id} className="bg-white rounded-2xl shadow-sm border border-border overflow-hidden group hover:border-primary/20 transition-all">
                <div className="aspect-[4/3] bg-muted relative overflow-hidden">
                  {(property.main_image || (property.images && property.images.length > 0)) ? (
                    <img src={property.main_image || property.images[0]} alt={property.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-muted">
                      <Home className="text-muted-foreground/30" size={32} />
                    </div>
                  )}
                  <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-md text-white px-2 py-1 rounded text-[10px] font-black uppercase tracking-widest">
                    {property.pattern}
                  </div>
                </div>
                <div className="p-3">
                  <p className="text-xs font-black text-primary line-clamp-1">{property.title}</p>
                  <p className="text-[10px] font-bold text-muted-foreground mt-1">R$ {(property.price / 1000000).toFixed(1)}M</p>
                </div>
              </div>
            ))}
            {/* If less than 8, show skeletons or empty slots to fill the grid */}
            {recentProperties.length < 8 && Array.from({ length: 8 - recentProperties.length }).map((_, i) => (
              <div key={`empty-${i}`} className="bg-muted/50 rounded-2xl border border-dashed border-border aspect-[4/3] flex items-center justify-center">
                <span className="text-[10px] font-bold text-muted-foreground/50 uppercase tracking-widest">Disponível</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

