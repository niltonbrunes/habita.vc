import React from 'react';
import { Metadata } from 'next';
import { Navbar } from "@/components/layout/Navbar";
import { Hero } from "@/components/layout/Hero";
import { PropertyHighlights } from "@/components/public/PropertyHighlights";
import { RegionSection } from "@/components/public/RegionSection";
import Link from "next/link";
import { ArrowRight, Star, Building2, TrendingUp, Home as HomeIcon, CheckCircle2 } from "lucide-react";

export const metadata: Metadata = {
  title: "Habita.vc | Imóveis de Luxo e Lançamentos em Goiânia",
  description: "A maior vitrine de imóveis de alto padrão e lançamentos imobiliários. Consultoria especializada em performance e investimentos imobiliários.",
  keywords: ["imóveis goiânia", "apartamento de luxo", "lançamentos imobiliários", "setor bueno", "setor marista", "alphaville"],
  openGraph: {
    title: "Habita.vc | Performance Imobiliária Inteligente",
    description: "Encontre seu novo lar ou investimento com a curadoria exclusiva da Habita.vc.",
    images: ["/modern_luxury_apartment_exterior_1777989602281.png"]
  }
};

export default function Home() {
  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-accent/20">
      <Navbar />
      
      <main>
        <h1 className="sr-only">Habita.vc - Portal Imobiliário Premium em Goiânia</h1>
        
        {/* 1. HERO COM BUSCA DOMINANTE */}
        <Hero />

        {/* 2. IMÓVEIS EM DESTAQUE (Grid Visual Moderno) */}
        <PropertyHighlights />
        
        {/* 3. LANÇAMENTOS (Seção de Novidades) */}
        <section className="py-24 bg-[#0a0a0a] border-y border-white/10">
           <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
                <div className="max-w-2xl">
                  <h2 className="text-5xl md:text-6xl font-black mb-6 tracking-tighter text-white leading-none">
                    Lançamentos <br />
                    <span className="text-accent italic font-serif font-light lowercase tracking-normal">Imperdíveis</span>
                  </h2>
                  <p className="text-white/60 text-xl font-medium leading-relaxed">
                    As maiores oportunidades de investimento e moradia que acabaram de chegar ao mercado.
                  </p>
                </div>
                <button className="px-10 py-4 bg-transparent border-2 border-white/20 text-white rounded-full font-black text-xs uppercase tracking-widest hover:bg-white hover:text-black transition-all shadow-sm">
                  Explorar Lançamentos
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[1,2,3,4].map(i => (
                  <div key={i} className="group relative aspect-[4/5] rounded-[2.5rem] overflow-hidden shadow-premium">
                    <img src={`/katedral_hero_1778094352027.png`} alt="Launch" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                    <div className="absolute inset-0 bg-gradient-to-t from-primary via-transparent opacity-80" />
                    <div className="absolute inset-0 p-8 flex flex-col justify-end text-white">
                      <span className="text-[9px] font-black uppercase tracking-[0.3em] text-accent mb-2">Exclusivo Habita.vc</span>
                      <h3 className="text-2xl font-black leading-tight mb-4">Lançamento Marista Premium</h3>
                      <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/20 group-hover:bg-accent transition-colors">
                        <ArrowRight size={20} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
           </div>
        </section>

        {/* 4. BAIRROS MAIS BUSCADOS (Navegação Geográfica) */}
        <RegionSection />

        {/* 5. OPORTUNIDADES DO DIA (Layout Rápido) */}
        <section className="py-24 bg-[#050505]">
           <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="bg-[#0a0a0a] border border-white/10 rounded-[4rem] p-12 md:p-24 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-1/2 h-full bg-accent/10 -z-0 rounded-l-full blur-3xl" />
                <div className="relative z-10 grid lg:grid-cols-2 gap-20 items-center">
                  <div className="space-y-8">
                    <h2 className="text-5xl md:text-7xl font-black text-white leading-none tracking-tighter">
                      Oportunidade <br />
                      <span className="text-accent italic font-serif font-light lowercase tracking-normal">do Dia.</span>
                    </h2>
                    <p className="text-xl text-white/60 font-medium leading-relaxed">
                      Uma curadoria única de imóveis com valor abaixo de mercado, selecionada por nossa inteligência de dados.
                    </p>
                    <button className="bg-accent hover:bg-white hover:text-primary text-white px-12 py-5 rounded-full font-black text-sm uppercase tracking-widest transition-all shadow-xl">
                      Ver Oportunidade
                    </button>
                  </div>
                  <div className="hidden lg:block relative group">
                    <div className="absolute -inset-4 bg-white/5 rounded-[3.5rem] blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                    <img src="/hero_luxury.png" alt="Oportunidade" className="relative rounded-[3rem] shadow-2xl border-4 border-white/10" />
                  </div>
                </div>
              </div>
           </div>
        </section>

        {/* 6. CORRETORES VERIFICADOS (Credibilidade) */}
        <section className="py-24 bg-[#0a0a0a] border-t border-white/10">
           <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <div className="max-w-2xl mx-auto mb-16 space-y-4">
                <h2 className="text-4xl font-black text-white tracking-tighter">Corretores Verificados</h2>
                <p className="text-white/60 font-medium">Os melhores especialistas do mercado imobiliário prontos para te atender.</p>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8">
                {[1,2,3,4,5,6].map(i => (
                  <div key={i} className="flex flex-col items-center space-y-4 group">
                    <div className="relative">
                      <div className="absolute inset-0 bg-accent rounded-full scale-110 blur-md opacity-0 group-hover:opacity-20 transition-opacity" />
                      <img src={`https://i.pravatar.cc/150?u=${i+40}`} alt="Broker" className="w-24 h-24 rounded-full border-4 border-white shadow-lg relative z-10" />
                      <div className="absolute bottom-0 right-0 w-8 h-8 bg-blue-500 rounded-full border-4 border-white flex items-center justify-center text-white z-20">
                         <CheckCircle2 size={12} fill="currentColor" />
                      </div>
                    </div>
                    <div>
                      <p className="font-black text-white leading-none">Consultor {i}</p>
                      <p className="text-[9px] font-bold text-white/40 uppercase tracking-widest mt-1">Especialista Marista</p>
                    </div>
                  </div>
                ))}
              </div>
           </div>
        </section>

        {/* 7. CTA PARA IMOBILIÁRIAS (Growth) */}
        <section className="py-32 bg-[#0a0a0a] text-center relative overflow-hidden">
           <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-accent/20 via-transparent to-transparent opacity-40" />
           <div className="max-w-4xl mx-auto px-4 relative z-10 space-y-10">
              <h2 className="text-5xl md:text-7xl font-black text-white tracking-tighter leading-none">
                É Corretor ou <br />
                <span className="text-accent italic font-serif font-light lowercase tracking-normal">Imobiliária?</span>
              </h2>
              <p className="text-xl text-white/60 font-medium">
                Anuncie seus imóveis no portal que mais cresce em Goiânia e conecte-se com clientes qualificados.
              </p>
              <div className="flex flex-col md:flex-row gap-4 justify-center">
                <button className="bg-white text-primary px-12 py-5 rounded-full font-black text-sm uppercase tracking-widest hover:bg-accent hover:text-white transition-all">
                  Anunciar Imóveis
                </button>
                <button className="bg-transparent border-2 border-white/20 text-white px-12 py-5 rounded-full font-black text-sm uppercase tracking-widest hover:bg-white/10 transition-all">
                  Conhecer o CRM
                </button>
              </div>
           </div>
        </section>
      </main>

      <footer className="bg-[#050505] py-24 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-20 mb-20">
            <div className="col-span-1 md:col-span-2 space-y-8">
              <span className="text-4xl font-black text-white tracking-tighter">Habita<span className="text-accent">.vc</span></span>
              <p className="text-white/60 max-w-sm font-medium leading-relaxed text-lg">
                O marketplace imobiliário inteligente de Goiânia. Encontre casas, apartamentos e oportunidades únicas.
              </p>
            </div>
            <div>
              <h4 className="font-black text-white/80 mb-8 uppercase tracking-[0.2em] text-[10px]">Portal</h4>
              <ul className="space-y-5 text-white/60 text-sm font-bold">
                <li><Link href="/imoveis" className="hover:text-accent transition-colors">Buscar Imóveis</Link></li>
                <li><Link href="/empreendimentos" className="hover:text-accent transition-colors">Lançamentos</Link></li>
                <li><Link href="/blog" className="hover:text-accent transition-colors">Blog Imobiliário</Link></li>
                <li><Link href="/login" className="hover:text-accent transition-colors">Entrar / Cadastrar</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-black text-white/80 mb-8 uppercase tracking-[0.2em] text-[10px]">Cidades</h4>
              <ul className="space-y-5 text-white/60 text-sm font-bold">
                <li className="hover:text-accent transition-colors cursor-pointer">Goiânia</li>
                <li>Aparecida de Goiânia</li>
                <li>Anápolis</li>
                <li>Senador Canedo</li>
              </ul>
            </div>
          </div>
          <div className="pt-10 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em]">© 2026 Habita.vc • O Portal Imobiliário de Goiânia</p>
            <div className="flex gap-8">
               {['Instagram', 'LinkedIn', 'YouTube'].map(social => (
                 <span key={social} className="text-[10px] font-black text-white/40 uppercase tracking-widest cursor-pointer hover:text-accent transition-colors">{social}</span>
               ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

const BenefitItem = ({ icon, title, desc }: any) => (
  <div className="flex flex-col gap-6 p-2 group">
    <div className="w-16 h-16 bg-accent/10 rounded-[1.5rem] flex items-center justify-center text-accent group-hover:bg-accent group-hover:text-white transition-all duration-500">
      {React.cloneElement(icon as React.ReactElement<any>, { size: 28 })}
    </div>
    <div>
      <h4 className="font-black text-primary text-2xl mb-2 tracking-tight">{title}</h4>
      <p className="text-muted-foreground font-medium leading-relaxed">{desc}</p>
    </div>
  </div>
);

const StatBox = ({ value, label }: any) => (
  <div className="bg-white p-8 rounded-[2.5rem] shadow-premium border border-border text-center">
    <p className="text-4xl font-black text-primary mb-2">{value}</p>
    <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">{label}</p>
  </div>
);
