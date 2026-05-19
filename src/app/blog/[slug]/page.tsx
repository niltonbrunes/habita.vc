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
import { supabase } from '@/lib/supabase';
import { LeadsService } from '@/services/leads.service';
import { Navbar } from '@/components/layout/Navbar';

export default function ArticlePage() {
  const { slug } = useParams();
  const [post, setPost] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [leadForm, setLeadForm] = useState({ name: '', email: '', phone: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  
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
    <div className="min-h-screen bg-[#050505] flex items-center justify-center">
      <Loader2 className="animate-spin text-accent" size={40} />
    </div>
  );

  if (!post) return (
    <div className="luxury-mode min-h-screen bg-[#050505] text-white flex flex-col items-center justify-center p-8">
      <h2 className="text-2xl font-black text-white mb-4">Conteúdo não encontrado</h2>
      <Link href="/blog" className="text-accent font-bold flex items-center gap-2 hover:underline">
        <ArrowLeft size={16} /> Voltar para o Blog
      </Link>
    </div>
  );

  return (
    <div className="luxury-mode min-h-screen bg-[#050505] text-white selection:bg-accent/20 pb-32">
      <Navbar />

      {/* Article Header */}
      <header className="pt-40 pb-16 bg-[#0c0c0c] border-b border-white/5 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-accent/5 via-transparent to-transparent opacity-40" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <Link 
            href="/blog" 
            className="group inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-white/40 hover:text-white transition-colors mb-8"
          >
            <ArrowLeft size={14} className="group-hover:-translate-x-1.5 transition-transform text-accent" />
            Voltar para o Blog
          </Link>
          
          <div className="flex items-center gap-3 mb-6">
            <span className="px-4 py-1.5 bg-accent text-white text-[10px] font-black uppercase tracking-widest rounded-full shadow-sm">
              {post.category}
            </span>
            <span className="flex items-center gap-1.5 text-[10px] font-bold text-white/40 uppercase tracking-widest">
              <Clock size={12} className="text-accent" /> 6 min de leitura
            </span>
          </div>

          <h1 className="text-4xl md:text-6xl font-black text-white mb-8 leading-[1.1] tracking-tighter max-w-4xl">
            {post.title}
          </h1>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between py-8 border-y border-white/10 gap-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center font-bold text-white uppercase text-lg backdrop-blur-md">
                HB
              </div>
              <div>
                <p className="text-sm font-black text-white">Admin Habita</p>
                <p className="text-xs text-white/40 font-medium">Especialista em Mercado Imobiliário</p>
              </div>
            </div>
            
            <div className="flex gap-2">
              <button 
                title="Compartilhar"
                className="p-3 rounded-full bg-white/5 border border-white/10 hover:border-accent/40 text-white/60 hover:text-accent transition-all backdrop-blur-md"
              >
                <Share2 size={18} />
              </button>
              <button 
                title="Salvar artigo"
                className="p-3 rounded-full bg-white/5 border border-white/10 hover:border-accent/40 text-white/60 hover:text-accent transition-all backdrop-blur-md"
              >
                <Bookmark size={18} />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 grid grid-cols-1 lg:grid-cols-12 gap-12">
        
        {/* Floating Back Column (Sticky) */}
        <div className="hidden lg:block lg:col-span-1">
          <div className="sticky top-32 flex flex-col items-center">
            <Link 
              href="/blog" 
              className="w-12 h-12 bg-[#0c0c0c] border border-white/10 hover:border-accent/40 hover:text-accent text-white/40 rounded-full flex items-center justify-center transition-all group shadow-lg"
              title="Voltar ao Blog"
            >
              <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>

        {/* Article Body */}
        <article className="lg:col-span-7 space-y-12">
          <img 
            src={post.cover_image} 
            alt={post.title}
            className="w-full aspect-video object-cover rounded-[3rem] shadow-luxury border border-white/5"
          />
          
          <div 
            className="prose prose-invert prose-lg max-w-none prose-headings:font-black prose-headings:text-white prose-p:text-white/70 prose-p:leading-relaxed prose-strong:text-white prose-strong:font-black prose-a:text-accent prose-a:font-bold prose-img:rounded-[2.5rem] prose-hr:border-white/10"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          {/* Social Share Bottom */}
          <div className="mt-16 p-8 lg:p-12 bg-[#0c0c0c] border border-white/10 rounded-[3rem] flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-accent/5 blur-[40px] rounded-full" />
            <div className="relative z-10">
              <p className="text-xl font-black text-white">Gostou deste conteúdo?</p>
              <p className="text-sm text-white/60 font-medium">Compartilhe com quem também busca investir com inteligência.</p>
            </div>
            <div className="flex gap-4 w-full md:w-auto relative z-10">
              <button className="flex-1 md:flex-initial flex items-center justify-center gap-2 px-6 py-4 bg-[#128C7E] text-white rounded-2xl font-bold text-sm hover:scale-105 transition-transform shadow-md">
                <MessageCircle size={18} /> WhatsApp
              </button>
              <button className="flex-1 md:flex-initial flex items-center justify-center gap-2 px-6 py-4 bg-white text-black hover:bg-accent hover:text-white rounded-2xl font-bold text-sm hover:scale-105 transition-all shadow-md">
                <Share2 size={18} /> Copiar Link
              </button>
            </div>
          </div>
        </article>

        {/* Sidebar Capture */}
        <aside className="lg:col-span-4 space-y-8">
          <div className="sticky top-32 space-y-8">
            {/* Capture Card */}
            <div className="p-10 bg-[#0c0c0c] border border-white/10 rounded-[3rem] text-white shadow-luxury relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-accent/15 blur-[60px] rounded-full -mr-10 -mt-10" />
              
              {!submitted ? (
                <>
                  <h4 className="text-2xl font-black mb-4 relative z-10 leading-snug">Receba nosso Guia de Investimento 2026</h4>
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
                      className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder:text-white/30 outline-none focus:border-accent transition-all font-bold text-sm"
                    />
                    <input 
                      required
                      type="email" 
                      placeholder="Seu melhor e-mail"
                      value={leadForm.email}
                      onChange={e => setLeadForm({...leadForm, email: e.target.value})}
                      className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder:text-white/30 outline-none focus:border-accent transition-all font-bold text-sm"
                    />
                    <input 
                      required
                      type="text" 
                      placeholder="WhatsApp"
                      value={leadForm.phone}
                      onChange={e => setLeadForm({...leadForm, phone: e.target.value})}
                      className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder:text-white/30 outline-none focus:border-accent transition-all font-bold text-sm"
                    />
                    <button 
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-4 bg-accent hover:bg-white hover:text-black text-white rounded-2xl font-black text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-2 shadow-luxury"
                    >
                      {isSubmitting ? <Loader2 size={18} className="animate-spin text-white" /> : 'Quero Receber Agora'}
                    </button>
                  </form>
                </>
              ) : (
                <div className="text-center py-10 relative z-10">
                  <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center mx-auto mb-6 shadow-premium animate-bounce">
                    <CheckCircle2 size={32} />
                  </div>
                  <h4 className="text-2xl font-black mb-2">Sucesso!</h4>
                  <p className="text-white/60 font-medium">Em breve você receberá o material no seu e-mail.</p>
                </div>
              )}
            </div>

            {/* Related Topics Card */}
            <div className="p-8 bg-[#0c0c0c] border border-white/10 rounded-[3rem]">
              <h4 className="font-black text-white mb-6">Tópicos Relacionados</h4>
              <div className="flex flex-wrap gap-2 animate-in fade-in duration-1000">
                {['Luxo', 'Goiânia', 'Rentabilidade', 'Setor Bueno', 'Marista', 'Financiamento'].map(tag => (
                  <span 
                    key={tag} 
                    className="px-4 py-2 bg-white/5 border border-white/5 rounded-xl text-[10px] font-bold text-white/50 uppercase tracking-widest cursor-pointer hover:bg-white/10 hover:text-accent hover:border-accent/40 transition-colors"
                  >
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
