'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  BookOpen, 
  ArrowRight, 
  Calendar, 
  User, 
  ChevronRight, 
  TrendingUp, 
  ShieldCheck,
  Search
} from 'lucide-react';
import { createClient } from '@/lib/supabase';

// Componente de Card de Artigo
const ArticleCard = ({ post }: { post: any }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    className="group bg-white rounded-[2.5rem] overflow-hidden border border-border hover:shadow-luxury transition-all duration-500 flex flex-col h-full"
  >
    <div className="relative h-64 overflow-hidden">
      <img 
        src={post.cover_image || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa'} 
        alt={post.title}
        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
      />
      <div className="absolute top-6 left-6">
        <span className="px-4 py-2 bg-white/90 backdrop-blur-md rounded-full text-[10px] font-black uppercase tracking-widest text-primary shadow-sm">
          {post.category}
        </span>
      </div>
    </div>
    
    <div className="p-8 flex-1 flex flex-col">
      <div className="flex items-center gap-4 text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-4">
        <span className="flex items-center gap-1.5">
          <Calendar size={12} className="text-accent" />
          {new Date(post.created_at).toLocaleDateString('pt-BR')}
        </span>
        <span className="flex items-center gap-1.5">
          <User size={12} className="text-accent" />
          Admin Habita
        </span>
      </div>
      
      <h3 className="text-xl font-black text-primary mb-4 leading-tight group-hover:text-accent transition-colors">
        {post.title}
      </h3>
      
      <p className="text-sm text-muted-foreground font-medium leading-relaxed mb-6 line-clamp-3">
        {post.excerpt}
      </p>
      
      <div className="mt-auto pt-6 border-t border-border flex items-center justify-between">
        <Link 
          href={`/conteudos/${post.slug}`}
          className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-primary hover:gap-3 transition-all"
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
  const supabase = createClient();

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

  return (
    <div className="min-h-screen bg-[#fafafa]">
      {/* Hero Section */}
      <section className="bg-primary pt-32 pb-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-accent/10 via-transparent to-transparent opacity-50" />
        <div className="max-w-7xl mx-auto px-8 relative z-10">
          <div className="max-w-3xl">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-10 h-[2px] bg-accent" />
              <span className="text-xs font-black text-accent uppercase tracking-[0.3em]">Knowledge Hub</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-black text-white mb-8 leading-[1.1]">
              Insights e <span className="text-accent">Estratégias</span> do Mercado Imobiliário
            </h1>
            <p className="text-lg text-white/60 font-medium leading-relaxed mb-10 max-w-xl">
              Artigos exclusivos, análises de mercado e guias práticos para investidores e compradores de alto padrão.
            </p>
            
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-3 px-6 py-3 bg-white/5 rounded-2xl border border-white/10 text-white/80 text-sm font-bold">
                <TrendingUp size={18} className="text-accent" />
                Análises de Valorização
              </div>
              <div className="flex items-center gap-3 px-6 py-3 bg-white/5 rounded-2xl border border-white/10 text-white/80 text-sm font-bold">
                <ShieldCheck size={18} className="text-accent" />
                Guias de Segurança Jurídica
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Content Grid */}
      <section className="max-w-7xl mx-auto px-8 -mt-10 pb-32">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-[500px] bg-white rounded-[2.5rem] animate-pulse" />
            ))}
          </div>
        ) : posts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map(post => (
              <ArticleCard key={post.id} post={post} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-[2.5rem] p-20 text-center border border-border">
            <BookOpen size={48} className="text-muted-foreground/20 mx-auto mb-6" />
            <h3 className="text-2xl font-black text-primary mb-2">Novos materiais em breve</h3>
            <p className="text-muted-foreground font-medium">Nossa equipe de marketing está preparando conteúdos exclusivos.</p>
          </div>
        )}
      </section>

      {/* Newsletter / CTA */}
      <section className="bg-white border-t border-border py-24">
        <div className="max-w-4xl mx-auto px-8 text-center">
          <h2 className="text-3xl font-black text-primary mb-6">Receba as oportunidades antes do mercado</h2>
          <p className="text-muted-foreground font-medium mb-10">
            Assine nossa newsletter exclusiva para investidores e receba relatórios de valorização mensalmente.
          </p>
          <div className="flex flex-col md:flex-row gap-4 max-w-lg mx-auto">
            <input 
              type="email" 
              placeholder="Seu melhor e-mail"
              className="flex-1 px-6 py-4 bg-muted/50 border border-transparent rounded-2xl focus:bg-white focus:border-accent/20 outline-none font-bold text-primary transition-all"
            />
            <button className="px-8 py-4 bg-primary text-white rounded-2xl font-black text-sm hover:bg-primary-light transition-all shadow-luxury">
              Assinar Agora
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
