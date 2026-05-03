'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  Calendar, 
  User, 
  Share2, 
  Bookmark, 
  ArrowLeft, 
  MessageCircle, 
  CheckCircle2,
  Clock,
  Loader2
} from 'lucide-react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase';
import { LeadsService } from '@/services/leads.service';

export default function ArticlePage() {
  const { slug } = useParams();
  const [post, setPost] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [leadForm, setLeadForm] = useState({ name: '', email: '', phone: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  
  const supabase = createClient();

  useEffect(() => {
    const fetchPost = async () => {
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .eq('slug', slug)
        .single();

      if (!error && data) setPost(data);
      setLoading(false);
    };

    fetchPost();
  }, [slug]);

  const handleLeadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await LeadsService.create({
        ...leadForm,
        source: `Artigo: ${post.title}`,
        status: 'lead',
        temperature: 'warm',
        history: [{ type: 'note', date: new Date().toISOString(), note: 'Interessado via artigo de blog.' }]
      });
      setSubmitted(true);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <Loader2 className="animate-spin text-accent" size={40} />
    </div>
  );

  if (!post) return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8">
      <h2 className="text-2xl font-black text-primary mb-4">Conteúdo não encontrado</h2>
      <Link href="/conteudos" className="text-accent font-bold flex items-center gap-2">
        <ArrowLeft size={16} /> Voltar para o Hub
      </Link>
    </div>
  );

  return (
    <div className="bg-white min-h-screen pb-32">
      {/* Article Header */}
      <header className="pt-32 pb-16 bg-muted/30">
        <div className="max-w-4xl mx-auto px-8">
          <Link href="/conteudos" className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors mb-8">
            <ArrowLeft size={14} /> Voltar para Conteúdos
          </Link>
          
          <div className="flex items-center gap-3 mb-6">
            <span className="px-4 py-1.5 bg-accent text-white text-[10px] font-black uppercase tracking-widest rounded-full">
              {post.category}
            </span>
            <span className="flex items-center gap-1.5 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
              <Clock size={12} /> 6 min de leitura
            </span>
          </div>

          <h1 className="text-4xl md:text-6xl font-black text-primary mb-8 leading-[1.1]">
            {post.title}
          </h1>

          <div className="flex items-center justify-between py-8 border-y border-border">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center font-bold text-white uppercase text-lg">
                HB
              </div>
              <div>
                <p className="text-sm font-black text-primary">Admin Habita</p>
                <p className="text-xs text-muted-foreground font-medium">Especialista em Mercado Imobiliário</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button className="p-3 rounded-full bg-white border border-border hover:bg-muted transition-colors text-muted-foreground">
                <Share2 size={18} />
              </button>
              <button className="p-3 rounded-full bg-white border border-border hover:bg-muted transition-colors text-muted-foreground">
                <Bookmark size={18} />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-8 py-16 grid grid-cols-1 lg:grid-cols-12 gap-16">
        {/* Article Body */}
        <article className="lg:col-span-8">
          <img 
            src={post.cover_image} 
            alt={post.title}
            className="w-full aspect-video object-cover rounded-[3rem] mb-12 shadow-luxury"
          />
          
          <div 
            className="prose prose-lg max-w-none prose-headings:font-black prose-headings:text-primary prose-p:text-muted-foreground prose-p:leading-relaxed prose-strong:text-primary prose-strong:font-black prose-a:text-accent prose-a:font-bold prose-img:rounded-[2rem]"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          {/* Social Share Bottom */}
          <div className="mt-16 p-8 bg-muted/30 rounded-[2.5rem] flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <p className="text-lg font-black text-primary">Gostou deste conteúdo?</p>
              <p className="text-sm text-muted-foreground font-medium">Compartilhe com quem também busca investir com inteligência.</p>
            </div>
            <div className="flex gap-4">
              <button className="flex items-center gap-2 px-6 py-3 bg-[#128C7E] text-white rounded-2xl font-bold text-sm hover:scale-105 transition-transform">
                <MessageCircle size={18} /> WhatsApp
              </button>
              <button className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-2xl font-bold text-sm hover:scale-105 transition-transform">
                <Share2 size={18} /> Copiar Link
              </button>
            </div>
          </div>
        </article>

        {/* Sidebar Capture */}
        <aside className="lg:col-span-4">
          <div className="sticky top-32 space-y-8">
            <div className="p-10 bg-primary rounded-[2.5rem] text-white shadow-luxury relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-accent/20 blur-[60px] rounded-full -mr-10 -mt-10" />
              
              {!submitted ? (
                <>
                  <h4 className="text-2xl font-black mb-4 relative z-10">Receba nosso Guia de Investimento 2026</h4>
                  <p className="text-white/60 text-sm font-medium mb-8 relative z-10 leading-relaxed">
                    Aprofunde seu conhecimento com dados exclusivos sobre o Setor Marista e Bueno.
                  </p>
                  
                  <form onSubmit={handleLeadSubmit} className="space-y-4 relative z-10">
                    <input 
                      required
                      type="text" 
                      placeholder="Nome completo"
                      value={leadForm.name}
                      onChange={e => setLeadForm({...leadForm, name: e.target.value})}
                      className="w-full px-6 py-4 bg-white/10 border border-white/10 rounded-2xl text-white placeholder:text-white/30 outline-none focus:border-accent transition-all font-bold text-sm"
                    />
                    <input 
                      required
                      type="email" 
                      placeholder="Seu melhor e-mail"
                      value={leadForm.email}
                      onChange={e => setLeadForm({...leadForm, email: e.target.value})}
                      className="w-full px-6 py-4 bg-white/10 border border-white/10 rounded-2xl text-white placeholder:text-white/30 outline-none focus:border-accent transition-all font-bold text-sm"
                    />
                    <input 
                      required
                      type="text" 
                      placeholder="WhatsApp"
                      value={leadForm.phone}
                      onChange={e => setLeadForm({...leadForm, phone: e.target.value})}
                      className="w-full px-6 py-4 bg-white/10 border border-white/10 rounded-2xl text-white placeholder:text-white/30 outline-none focus:border-accent transition-all font-bold text-sm"
                    />
                    <button 
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-4 bg-accent text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-accent-light transition-all flex items-center justify-center gap-2"
                    >
                      {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : 'Quero Receber Agora'}
                    </button>
                  </form>
                </>
              ) : (
                <div className="text-center py-10 relative z-10">
                  <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle2 size={32} />
                  </div>
                  <h4 className="text-2xl font-black mb-2">Sucesso!</h4>
                  <p className="text-white/60 font-medium">Em breve você receberá o material no seu e-mail.</p>
                </div>
              )}
            </div>

            <div className="p-8 bg-white border border-border rounded-[2.5rem]">
              <h4 className="font-black text-primary mb-6">Tópicos Relacionados</h4>
              <div className="flex flex-wrap gap-2">
                {['Luxo', 'Goiânia', 'Rentabilidade', 'Setor Bueno', 'Marista', 'Financiamento'].map(tag => (
                  <span key={tag} className="px-4 py-2 bg-muted/50 rounded-xl text-[10px] font-bold text-muted-foreground uppercase tracking-widest cursor-pointer hover:bg-muted transition-colors">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
