"use client";
const heroImage = "/bioma-wellness/hero-bioma.jpg";
import { MessageCircle, ChevronDown } from "lucide-react";

const WHATSAPP_URL = "https://wa.me/5562993076768?text=Ol%C3%A1!%20Gostaria%20de%20saber%20mais%20sobre%20o%20BIOMA%20Wellness%20Life!";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <img
        src={heroImage}
        alt="Fachada do BIOMA Wellness Life com jardim vertical no Setor Marista em Goiânia"
        className="absolute inset-0 h-full w-full object-cover"
        loading="eager"
      />
      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-hero" />

      {/* Content */}
      <div className="relative z-10 mx-auto max-w-4xl px-6 text-center">
        <p className="mb-4 font-body text-sm font-medium uppercase tracking-[0.3em] text-earth-sand animate-fade-in">
          Setor Marista · Goiânia
        </p>
        <h1 className="mb-6 font-display text-5xl font-bold leading-tight text-primary-foreground md:text-7xl lg:text-8xl animate-fade-up">
          Viva o equilíbrio entre natureza e sofisticação
        </h1>
        <p className="mx-auto mb-10 max-w-2xl font-body text-lg leading-relaxed text-earth-sand/90 md:text-xl animate-fade-up" style={{ animationDelay: '0.2s' }}>
          BIOMA Wellness Life — Apartamentos de 63 a 122 m² com conceito wellness, 
          fachada biofílica e lazer completo no coração do Marista.
        </p>
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center animate-fade-up" style={{ animationDelay: '0.4s' }}>
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 rounded-full bg-[#25D366] px-8 py-4 font-body text-base font-semibold text-primary-foreground shadow-cta transition-all hover:scale-105 hover:brightness-110"
          >
            <MessageCircle className="h-5 w-5" fill="currentColor" />
            Falar com Consultor no WhatsApp
          </a>
          <a
            href="#sobre"
            className="inline-flex items-center gap-2 rounded-full border border-primary-foreground/30 px-6 py-3 font-body text-sm font-medium text-primary-foreground/80 transition-all hover:bg-primary-foreground/10"
          >
            Conheça o Projeto
            <ChevronDown className="h-4 w-4" />
          </a>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <ChevronDown className="h-6 w-6 text-primary-foreground/50" />
      </div>
    </section>
  );
};

export default HeroSection;
