import React from 'react';
import { Metadata } from 'next';
import { Navbar } from "@/components/layout/Navbar";
import { Hero } from "@/components/layout/Hero";
import { PropertyHighlights } from "@/components/public/PropertyHighlights";
import { RegionSection } from "@/components/public/RegionSection";
import Link from "next/link";
import { ArrowRight, Star, Building2, TrendingUp } from "lucide-react";

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
    <div className="min-h-screen bg-background selection:bg-primary/10">
      <div className="bg-red-600 text-white text-center py-2 font-bold text-xs uppercase tracking-[0.3em]">
        DEBUG: Habita.vc V2 - Nova Home Ativa
      </div>
      <Navbar />
      
      <main>
        <h1 className="sr-only">Habita.vc - Portal Imobiliário de Alta Performance em Goiânia</h1>
        
        <Hero />

        <section className="bg-white border-y border-border py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <BenefitItem 
                icon={<Star className="text-accent" />}
                title="Curadoria Exclusiva"
                desc="Apenas os melhores imóveis e lançamentos do mercado."
              />
              <BenefitItem 
                icon={<TrendingUp className="text-accent" />}
                title="Inteligência Comercial"
                desc="Dados reais para decisões de investimento precisas."
              />
              <BenefitItem 
                icon={<Building2 className="text-accent" />}
                title="Suporte Especializado"
                desc="Consultores de alta performance em cada etapa."
              />
            </div>
          </div>
        </section>

        <PropertyHighlights />
        
        <RegionSection />

        <section className="py-24 bg-muted/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div className="space-y-6">
                <h2 className="text-4xl font-black text-primary leading-tight">
                  Especialistas em Imóveis de <br />
                  <span className="text-accent">Alto Padrão em Goiânia</span>
                </h2>
                <div className="space-y-4 text-lg text-muted-foreground font-medium leading-relaxed">
                  <p>
                    A <strong>Habita.vc</strong> nasceu para redefinir a experiência de compra e venda de imóveis. Atuamos com foco total em performance e transparência, trazendo para você as melhores oportunidades nos bairros mais desejados como <strong>Setor Bueno, Setor Marista, Jardim Goiás</strong> e os condomínios <strong>Alphaville</strong>.
                  </p>
                </div>
                <div className="flex flex-wrap gap-4 pt-4">
                  <Link href="/imoveis" className="bg-primary text-white px-8 py-4 rounded-2xl font-bold flex items-center gap-2 hover:bg-primary-dark transition-all">
                    Ver Catálogo Completo <ArrowRight size={20} />
                  </Link>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-6">
                  <StatBox value="+500" label="Imóveis Ativos" />
                  <StatBox value="R$ 2B+" label="VGV Sob Gestão" />
                </div>
                <div className="space-y-6 pt-12">
                  <StatBox value="+10" label="Incorporadoras Parceiras" />
                  <StatBox value="4.9/5" label="Avaliação Média" />
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-24 bg-primary relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-96 h-96 bg-accent rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl" />
          </div>
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
            <h2 className="text-3xl md:text-5xl font-black text-white mb-6">
              Busca Personalizada
            </h2>
            <p className="text-white/70 text-lg mb-10 max-w-2xl mx-auto font-medium">
              Não encontrou o imóvel ideal? Nossa equipe de concierge faz uma busca ativa no mercado para encontrar exatamente o que você deseja.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-6">
              <button className="bg-accent hover:bg-accent-light text-white px-12 py-5 rounded-2xl font-black text-lg transition-all shadow-xl hover:-translate-y-1">
                Falar com Consultor
              </button>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-white py-20 border-t border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-12 mb-16">
            <div className="col-span-1 md:col-span-2 space-y-6">
              <span className="text-3xl font-black text-primary">Habita<span className="text-accent">.vc</span></span>
              <p className="text-muted-foreground max-w-sm font-medium leading-relaxed">
                A plataforma definitiva para quem busca inteligência e exclusividade no mercado imobiliário de alta performance.
              </p>
            </div>
            <div>
              <h4 className="font-black text-primary mb-6 uppercase tracking-widest text-xs">Plataforma</h4>
              <ul className="space-y-4 text-muted-foreground text-sm font-bold">
                <li><Link href="/imoveis" className="hover:text-accent transition-colors">Catálogo de Imóveis</Link></li>
                <li><Link href="/empreendimentos" className="hover:text-accent transition-colors">Novos Lançamentos</Link></li>
                <li><Link href="/crmhabita" className="hover:text-accent transition-colors">Área do Corretor</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-black text-primary mb-6 uppercase tracking-widest text-xs">Atendimento</h4>
              <ul className="space-y-4 text-muted-foreground text-sm font-bold">
                <li>contato@habita.vc</li>
                <li>(62) 99999-9999</li>
                <li>Goiânia - GO</li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-border text-center text-xs font-bold text-muted-foreground uppercase tracking-widest">
            <p>© 2026 Habita.vc • Inteligência Imobiliária de Alta Performance</p>
          </div>
        </div>
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
