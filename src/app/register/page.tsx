'use client';

import React, { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Home, Mail, Lock, User, ArrowRight, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

export default function RegisterPage() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        }
      }
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      setSuccess(true);
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/30 px-4">
        <div className="max-w-md w-full bg-white p-12 rounded-[3rem] shadow-luxury border border-border text-center">
          <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-8">
            <CheckCircle2 size={48} className="text-green-500" />
          </div>
          <h2 className="text-3xl font-black text-primary mb-4">Verifique seu e-mail</h2>
          <p className="text-muted-foreground font-medium mb-10 leading-relaxed">
            Enviamos um link de confirmação para <span className="text-primary font-bold">{email}</span>. 
            Acesse seu e-mail para ativar sua conta.
          </p>
          <Link href="/login" className="inline-block bg-primary text-white px-10 py-4 rounded-2xl font-black text-lg hover:bg-primary-light transition-all shadow-premium">
            Voltar para o Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-white">
      {/* Left Side - Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-8 md:px-24 py-12 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-64 h-64 bg-accent/5 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl" />
        
        <div className="max-w-md w-full mx-auto relative">
          <Link href="/" className="flex items-center gap-2 mb-12 group">
            <div className="bg-primary p-1.5 rounded-lg group-hover:rotate-12 transition-transform">
              <Home className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-black tracking-tight text-primary">Habita<span className="text-accent">.vc</span></span>
          </Link>

          <div className="mb-10">
            <h1 className="text-4xl font-black text-primary mb-3">Sua nova era começa aqui</h1>
            <p className="text-muted-foreground font-medium text-lg">Crie sua conta e entre para a elite do mercado imobiliário.</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3 text-red-600 text-sm font-bold">
              <AlertCircle size={18} />
              {error}
            </div>
          )}

          <form onSubmit={handleRegister} className="space-y-5">
            <div className="space-y-2">
              <label className="text-xs font-black text-muted-foreground uppercase tracking-widest ml-1">Nome Completo</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                </div>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="block w-full pl-12 pr-4 py-4 bg-muted/50 border border-transparent rounded-2xl focus:bg-white focus:border-primary/20 transition-all outline-none font-bold text-primary placeholder:text-muted-foreground/40"
                  placeholder="Como quer ser chamado?"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black text-muted-foreground uppercase tracking-widest ml-1">E-mail Profissional</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-12 pr-4 py-4 bg-muted/50 border border-transparent rounded-2xl focus:bg-white focus:border-primary/20 transition-all outline-none font-bold text-primary placeholder:text-muted-foreground/40"
                  placeholder="seu@email.com"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black text-muted-foreground uppercase tracking-widest ml-1">Escolha uma Senha Forte</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-12 pr-4 py-4 bg-muted/50 border border-transparent rounded-2xl focus:bg-white focus:border-primary/20 transition-all outline-none font-bold text-primary placeholder:text-muted-foreground/40"
                  placeholder="Mínimo 6 caracteres"
                  required
                />
              </div>
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary text-white py-5 rounded-[1.5rem] font-black text-lg flex items-center justify-center gap-3 hover:bg-primary-light transition-all shadow-premium disabled:opacity-50 disabled:cursor-not-allowed group"
              >
                {loading ? <Loader2 className="animate-spin" size={24} /> : (
                  <>
                    Criar Conta Grátis
                    <ArrowRight size={24} className="group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </div>
          </form>

          <p className="mt-8 text-center text-sm font-bold text-muted-foreground leading-relaxed">
            Ao se cadastrar, você concorda com nossos{' '}
            <Link href="/terms" className="text-primary hover:underline">Termos de Uso</Link> e{' '}
            <Link href="/privacy" className="text-primary hover:underline">Privacidade</Link>.
          </p>

          <p className="mt-8 text-center text-sm font-bold text-muted-foreground">
            Já possui uma conta?{' '}
            <Link href="/login" className="text-accent hover:underline font-black uppercase tracking-widest text-xs">Acessar Agora</Link>
          </p>
        </div>
      </div>

      {/* Right Side - Features/Social Proof */}
      <div className="hidden lg:flex w-1/2 bg-muted/30 relative items-center justify-center p-24">
        <div className="relative z-10 max-w-lg">
          <div className="space-y-12">
            <FeatureItem 
              title="Inteligência de Metas"
              description="Defina quanto quer ganhar e nós calculamos exatamente quantos leads você precisa hoje."
            />
            <FeatureItem 
              title="CRM de Alta Conversão"
              description="Um Kanban desenhado para que nenhum lead esfrie e nenhuma proposta seja esquecida."
            />
            <FeatureItem 
              title="Modo Alto Padrão"
              description="Uma interface dedicada para quem trabalha com curadoria de luxo e imóveis exclusivos."
            />
          </div>

          <div className="mt-20 p-8 bg-white rounded-[2.5rem] shadow-luxury border border-border">
            <div className="flex items-center gap-4 mb-6">
              <div className="flex -space-x-4">
                {[1,2,3,4].map(i => (
                  <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-muted flex items-center justify-center font-bold text-[10px] text-primary/40">
                    +
                  </div>
                ))}
              </div>
              <p className="text-sm font-bold text-primary">+1.200 corretores já estão acelerando.</p>
            </div>
            <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
              <div className="h-full bg-accent w-[92%]" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const FeatureItem = ({ title, description }: any) => (
  <div className="flex gap-6">
    <div className="shrink-0 w-12 h-12 bg-white rounded-2xl shadow-premium border border-border flex items-center justify-center text-primary">
      <CheckCircle2 size={24} />
    </div>
    <div>
      <h3 className="text-xl font-black text-primary mb-2">{title}</h3>
      <p className="text-muted-foreground font-medium leading-relaxed">{description}</p>
    </div>
  </div>
);
