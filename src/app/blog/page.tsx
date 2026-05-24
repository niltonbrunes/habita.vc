'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  BookOpen, 
  ArrowRight, 
  Calendar, 
  User, 
  TrendingUp, 
  ShieldCheck,
  Search,
  Star,
  Sparkles
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { Navbar } from '@/components/layout/Navbar';

// Redesigned Obsidian Article Card
const ArticleCard = ({ post }: { post: any }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.6 }}
    className="group bg-[#0c0c0c] rounded-[2.5rem] overflow-hidden border border-white/10 hover:border-accent/40 hover:shadow-luxury transition-all duration-700 flex flex-col h-full relative"
  >
    <div className="relative h-64 overflow-hidden">
      <Image src={post.cover_image || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa'} alt={post.title} fill className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" sizes="(max-width: 768px) 100vw, 50vw" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#0c0c0c] via-transparent to-transparent opacity-60" />
      <div className="absolute top-6 left-6">
        <span className="px-4 py-2 bg-[#0c0c0c]/80 backdrop-blur-md border border-white/10 rounded-full text-[10px] font-black uppercase tracking-widest text-accent shadow-sm">
          {post.category}
        </span>
      </div>
    </div>
    
    <div className="p-8 flex-1 flex flex-col">
      <div className="flex items-center gap-4 text-[10px] font-bold text-white/40 uppercase tracking-widest mb-4">
        <span className="flex items-center gap-1.5">
          <Calendar size={12} className="text-accent" />
          {new Date(post.created_at).toLocaleDateString('pt-BR')}
        </span>
        <span className="flex items-center gap-1.5">
          <User size={12} className="text-accent" />
          Admin Habita
        </span>
      </div>
      
      <h3 className="text-xl font-black text-white mb-4 leading-tight group-hover:text-accent transition-colors duration-300">
        {post.title}
      </h3>
      
      <p className="text-sm text-white/60 font-medium leading-relaxed mb-6 line-clamp-3">
        {post.excerpt}
      </p>
      
      <div className="mt-auto pt-6 border-t border-white/10 flex items-center justify-between">
        <Link 
          href={`/blog/${post.slug}`}
          className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-white/80 hover:text-accent group-hover:gap-3 transition-all"
        >
          Ler Artigo Completo
          <ArrowRight size={14} className="text-accent" />
        </Link>
      </div>
    </div>
  </motion.div>
);

export default function ConteudosPage() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .eq('published', true)
        .order('created_at', { ascending: false });

      if (!error && data) setPosts(data);
      setLoading(false);
    };

    fetchPosts();
  }, []);

  const featuredPost = posts[0];
  const remainingPosts = posts.slice(1);

  return (
    <div className="luxury-mode min-h-screen bg-[#050505] text-white selection:bg-accent/20">
      <Navbar />

      {/* Hero Section */}
      <section className="pt-40 pb-20 relative overflow-hidden bg-[#050505] border-b border-white/5">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-accent/10 via-transparent to-transparent opacity-50" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Back to Home CTA */}
          <div className="mb-10">
            <Link 
              href="/" 
              className="group inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em] text-white/40 hover:text-white transition-colors"
            >
              <ArrowRight size={14} className="rotate-180 group-hover:-translate-x-1.5 transition-transform text-accent" />
              Voltar para o Início
            </Link>
          </div>

          <div className="max-w-3xl">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-10 h-[2px] bg-accent" />
              <span className="text-xs font-black text-accent uppercase tracking-[0.3em]">Knowledge Hub</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-black text-white mb-8 leading-[1.1] tracking-tighter">
              Insights e <span className="text-accent italic font-serif font-light lowercase tracking-normal">Estratégias</span> do Mercado Imobiliário
            </h1>
            <p className="text-xl text-white/60 font-medium leading-relaxed mb-10 max-w-xl">
              Artigos exclusivos, análises profundas de dados e guias práticos para investidores e compradores de alto padrão.
            </p>
            
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-3 px-6 py-3 bg-white/5 rounded-2xl border border-white/10 text-white/80 text-sm font-bold backdrop-blur-md">
                <TrendingUp size={18} className="text-accent" />
                Análises de Valorização
              </div>
              <div className="flex items-center gap-3 px-6 py-3 bg-white/5 rounded-2xl border border-white/10 text-white/80 text-sm font-bold backdrop-blur-md">
                <ShieldCheck size={18} className="text-accent" />
                Guias de Segurança Jurídica
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Content Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12 pb-32 relative z-20">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-[500px] bg-[#0c0c0c] border border-white/10 rounded-[2.5rem] animate-pulse" />
            ))}
          </div>
        ) : posts.length > 0 ? (
          <div className="space-y-16">
            {/* Featured Horizontal Card */}
            {featuredPost && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="group grid lg:grid-cols-12 bg-[#0c0c0c] border border-white/10 rounded-[3rem] overflow-hidden hover:border-accent/40 hover:shadow-luxury transition-all duration-700 relative"
              >
                <div className="lg:col-span-7 relative h-72 lg:h-[480px] overflow-hidden">
                  <Image src={featuredPost.cover_image || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa'} alt={featuredPost.title} fill className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[1200ms]" sizes="(max-width: 768px) 100vw, 50vw" />
                  <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-[#0c0c0c] via-transparent to-transparent opacity-90 lg:opacity-60" />
                  <div className="absolute top-8 left-8">
                    <span className="px-5 py-2.5 bg-[#0c0c0c]/90 border border-white/10 backdrop-blur-md rounded-full text-[10px] font-black uppercase tracking-widest text-accent flex items-center gap-1.5 shadow-lg">
                      <Sparkles size={12} /> Destaque da Semana
                    </span>
                  </div>
                </div>

                <div className="lg:col-span-5 p-8 lg:p-14 flex flex-col justify-center">
                  <div className="flex items-center gap-4 text-[10px] font-bold text-white/40 uppercase tracking-widest mb-6">
                    <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-lg text-accent">
                      {featuredPost.category}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Calendar size={12} className="text-accent" />
                      {new Date(featuredPost.created_at).toLocaleDateString('pt-BR')}
                    </span>
                  </div>

                  <h2 className="text-3xl lg:text-4xl font-black text-white mb-6 leading-tight group-hover:text-accent transition-colors duration-300">
                    {featuredPost.title}
                  </h2>

                  <p className="text-base text-white/60 font-medium leading-relaxed mb-8 line-clamp-4">
                    {featuredPost.excerpt}
                  </p>

                  <div className="pt-6 border-t border-white/10">
                    <Link 
                      href={`/blog/${featuredPost.slug}`}
                      className="inline-flex items-center gap-3 bg-white text-black hover:bg-accent hover:text-white px-8 py-4 rounded-full text-xs font-black uppercase tracking-widest transition-all shadow-premium"
                    >
                      Ler Artigo Destaque
                      <ArrowRight size={14} />
                    </Link>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Remaining Grid */}
            {remainingPosts.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {remainingPosts.map(post => (
                  <ArticleCard key={post.id} post={post} />
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="bg-[#0c0c0c] border border-white/10 rounded-[3rem] p-24 text-center">
            <BookOpen size={64} className="text-white/10 mx-auto mb-6" />
            <h3 className="text-3xl font-black text-white mb-3">Novos materiais em breve</h3>
            <p className="text-white/60 font-medium max-w-md mx-auto">Nossa equipe de especialistas está preparando relatórios e conteúdos exclusivos sobre performance imobiliária.</p>
          </div>
        )}
      </section>

      {/* Newsletter / CTA */}
      <section className="bg-[#0c0c0c] border-t border-white/15 py-24 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-accent/5 via-transparent to-transparent opacity-40" />
        
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h2 className="text-4xl font-black text-white mb-6 tracking-tighter">Receba as oportunidades antes do mercado</h2>
          <p className="text-lg text-white/60 font-medium mb-10 max-w-2xl mx-auto">
            Assine nossa newsletter exclusiva para investidores de alto padrão e receba mensalmente nossos relatórios de valorização imobiliária em Goiânia.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto">
            <input 
              type="email" 
              placeholder="Seu melhor e-mail"
              className="flex-1 px-6 py-4 bg-white/5 border border-white/10 rounded-2xl focus:bg-white/10 focus:border-accent/40 outline-none font-bold text-white placeholder:text-white/30 transition-all text-sm"
            />
            <button className="px-10 py-4 bg-accent hover:bg-white hover:text-black text-white rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-luxury">
              Assinar Agora
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
