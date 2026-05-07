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
    <div className="min-h-screen bg-white selection:bg-accent/20">
      <Navbar />
      
      <main>
        <h1 className="sr-only">Habita.vc - Portal Imobiliário de Alta Performance em Goiânia</h1>
        
        <Hero />

        {/* Benefits Section - Modern Minimalist */}
        <section className="bg-white py-24 border-b border-border/40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
              <BenefitItem 
                icon={<Star className="text-accent" />}
                title="Curadoria"
                desc="Apenas os melhores imóveis e lançamentos do mercado de Goiânia."
              />
              <BenefitItem 
                icon={<TrendingUp className="text-accent" />}
                title="Inteligência"
                desc="Dados reais e análise de mercado para decisões de investimento precisas."
              />
              <BenefitItem 
                icon={<Building2 className="text-accent" />}
                title="Performance"
                desc="Consultores especialistas em negociações de alto valor e complexidade."
              />
            </div>
          </div>
        </section>

        <PropertyHighlights />
        
        <RegionSection />

        {/* Owners Section - High Contrast Luxury */}
        <section className="py-32 bg-[#0a0a0a] relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20" />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="bg-white/5 backdrop-blur-2xl rounded-[4rem] p-10 md:p-20 border border-white/10 shadow-2xl">
              <div className="grid lg:grid-cols-2 gap-20 items-center">
                <div className="space-y-10">
                  <div className="inline-flex items-center gap-3 px-5 py-2 bg-accent text-white rounded-full text-[10px] font-black uppercase tracking-[0.3em]">
                    Exclusive Service
                  </div>
                  <h2 className="text-5xl md:text-7xl font-black text-white leading-[0.9] tracking-tighter">
                    Venda seu imóvel <br />
                    com <span className="text-accent">Inteligência.</span>
                  </h2>
                  <p className="text-xl text-white/60 font-medium leading-relaxed max-w-lg">
                    Anuncie na maior vitrine de luxo de Goiânia e tenha seu imóvel trabalhado por especialistas em alta performance.
                  </p>
                  <ul className="space-y-6">
                    {['Anúncio Premium na vitrine Habita.vc', 'Match inteligente com compradores qualificados', 'Gestão completa da jornada de venda'].map((benefit, i) => (
                      <li key={i} className="flex items-center gap-4 text-white font-bold text-lg">
                        <div className="w-6 h-6 rounded-full bg-accent/20 flex items-center justify-center border border-accent/40">
                          <CheckCircle2 className="text-accent" size={14} />
                        </div>
                        {benefit}
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="bg-white p-10 rounded-[3rem] shadow-2xl">
                  <h3 className="text-2xl font-black text-primary mb-8">Cadastro de Imóvel</h3>
                  <form className="space-y-5">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">Seu Nome</label>
                      <input type="text" placeholder="Como podemos te chamar?" className="w-full px-6 py-4 rounded-2xl bg-muted/30 border border-transparent focus:bg-white focus:border-accent/20 outline-none transition-all font-bold text-primary" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">WhatsApp</label>
                      <input type="text" placeholder="55 62 99999-9999" className="w-full px-6 py-4 rounded-2xl bg-muted/30 border border-transparent focus:bg-white focus:border-accent/20 outline-none transition-all font-bold text-primary" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">Tipo do Imóvel</label>
                      <select className="w-full px-6 py-4 rounded-2xl bg-muted/30 border border-transparent focus:bg-white focus:border-accent/20 outline-none transition-all font-bold text-primary appearance-none">
                        <option>Apartamento</option>
                        <option>Casa em Condomínio</option>
                        <option>Lançamento</option>
                        <option>Comercial</option>
                      </select>
                    </div>
                    <button type="button" className="w-full mt-6 bg-primary hover:bg-primary-light text-white py-5 rounded-[1.5rem] font-black text-lg transition-all shadow-xl flex justify-center items-center gap-3 active:scale-[0.98]">
                      Enviar para Curadoria <ArrowRight size={20} />
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-32 bg-white text-center">
          <div className="max-w-4xl mx-auto px-4">
            <h2 className="text-5xl md:text-7xl font-black text-primary mb-8 tracking-tighter">
              Ainda não encontrou <br />o seu <span className="text-accent italic font-serif font-light lowercase tracking-normal">lugar?</span>
            </h2>
            <p className="text-xl text-muted-foreground mb-12 font-medium">
              Nossa equipe de concierge imobiliário está pronta para fazer uma busca personalizada no mercado off-market para você.
            </p>
            <button className="bg-primary hover:bg-primary-light text-white px-16 py-6 rounded-[2rem] font-black text-xl transition-all shadow-luxury hover:-translate-y-1">
              Falar com Concierge
            </button>
          </div>
        </section>
      </main>

      <footer className="bg-[#f8fafc] py-24 border-t border-border/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-20 mb-20">
            <div className="col-span-1 md:col-span-2 space-y-8">
              <span className="text-4xl font-black text-primary tracking-tighter">Habita<span className="text-accent">.vc</span></span>
              <p className="text-muted-foreground max-w-sm font-medium leading-relaxed text-lg">
                A inteligência de mercado que Goiânia precisava para conectar pessoas extraordinárias a lugares únicos.
              </p>
            </div>
            <div>
              <h4 className="font-black text-primary mb-8 uppercase tracking-[0.2em] text-[10px]">Navegação</h4>
              <ul className="space-y-5 text-muted-foreground text-sm font-bold">
                <li><Link href="/imoveis" className="hover:text-accent transition-colors">Imóveis</Link></li>
                <li><Link href="/empreendimentos" className="hover:text-accent transition-colors">Lançamentos</Link></li>
                <li><Link href="/blog" className="hover:text-accent transition-colors">Conteúdos</Link></li>
                <li><Link href="/crmhabita" className="hover:text-accent transition-colors">Área Interna</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-black text-primary mb-8 uppercase tracking-[0.2em] text-[10px]">Contato</h4>
              <ul className="space-y-5 text-muted-foreground text-sm font-bold">
                <li className="flex flex-col">
                  <span className="text-[9px] uppercase tracking-widest opacity-50 mb-1">E-mail</span>
                  contato@habita.vc
                </li>
                <li className="flex flex-col">
                  <span className="text-[9px] uppercase tracking-widest opacity-50 mb-1">WhatsApp</span>
                  (62) 99999-9999
                </li>
                <li className="flex flex-col">
                  <span className="text-[9px] uppercase tracking-widest opacity-50 mb-1">Local</span>
                  Goiânia, GO - Brasil
                </li>
              </ul>
            </div>
          </div>
          <div className="pt-10 border-t border-border/60 flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-[10px] font-black text-primary/30 uppercase tracking-[0.3em]">© 2026 Habita.vc • All Rights Reserved</p>
            <div className="flex gap-8">
               {['Instagram', 'LinkedIn', 'YouTube'].map(social => (
                 <span key={social} className="text-[10px] font-black text-primary/40 uppercase tracking-widest cursor-pointer hover:text-accent transition-colors">{social}</span>
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
      {React.cloneElement(icon as React.ReactElement, { size: 28 })}
    </div>
    <div>
      <h4 className="font-black text-primary text-2xl mb-2 tracking-tight">{title}</h4>
      <p className="text-muted-foreground font-medium leading-relaxed">{desc}</p>
    </div>
  </div>
);      </div>
      </footer>
    </div>
  );
}

const BenefitItem = ({ icon, title, desc }: any) => (
  <div className="flex items-start gap-4 p-6 hover:bg-muted/50 rounded-3xl transition-all">
    <div className="bg-accent/10 p-3 rounded-2xl">
      {icon}
    </div>
    <div>
      <h4 className="font-black text-primary text-lg mb-1">{title}</h4>
      <p className="text-sm text-muted-foreground font-medium">{desc}</p>
    </div>
  </div>
);

const StatBox = ({ value, label }: any) => (
  <div className="bg-white p-8 rounded-[2.5rem] shadow-premium border border-border text-center">
    <p className="text-4xl font-black text-primary mb-2">{value}</p>
    <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">{label}</p>
  </div>
);
