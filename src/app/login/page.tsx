'use client';

import React, { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Home, Mail, Lock, ArrowRight, Loader2, AlertCircle } from 'lucide-react';
import Link from 'next/link';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-8 md:px-24 py-12 relative overflow-hidden">
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
      <div className="hidden lg:flex w-1/2 bg-primary relative items-center justify-center p-24 overflow-hidden">
        {/* Dynamic Pattern Overlay */}
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '40px 40px' }} />
        
        <div className="relative z-10 text-white max-w-lg">
          <div className="w-16 h-1 bg-accent mb-12 rounded-full" />
          <h2 className="text-5xl font-black mb-8 leading-[1.1] tracking-tighter">
            Acelerando a jornada do corretor de <span className="text-accent">alta performance.</span>
          </h2>
          <p className="text-xl text-white/60 font-medium mb-12">
            "O Habita.vc mudou minha conversão de leads em visitas em 40% nas primeiras duas semanas."
          </p>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-accent/20 border border-accent/30 flex items-center justify-center font-black">
              NB
            </div>
            <div>
              <p className="font-bold">Nilton Brunes</p>
              <p className="text-sm text-white/50">Broker Sênior, Usuário Alpha</p>
            </div>
          </div>
        </div>

        {/* Floating UI Element Simulation */}
        <div className="absolute bottom-20 right-20 bg-white/10 backdrop-blur-xl p-6 rounded-[2rem] border border-white/10 shadow-2xl animate-float max-w-xs">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center text-green-400">
              <TrendingUp size={20} />
            </div>
            <p className="text-sm font-bold text-white">Novo Lead Quente!</p>
          </div>
          <div className="space-y-2">
            <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
              <div className="h-full bg-green-500 w-[85%]" />
            </div>
            <p className="text-[10px] font-bold text-white/50 uppercase tracking-widest">Score de Conversão: 85%</p>
          </div>
        </div>
      </div>
    </div>
  );
}

const TrendingUp = ({ size, className }: any) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>
);
