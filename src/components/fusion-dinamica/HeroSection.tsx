"use client";
const heroImg = "/fusion-dinamica/hero-building.jpg";
import CTAButton from "./CTAButton";
import { MapPin, Maximize, BedDouble } from "lucide-react";

const HeroSection = () => {
  return (
    <header className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <img
        src={heroImg}
        alt="Fachada do Fusion Dinâmica Home - Empreendimento moderno em Goiânia"
        className="absolute inset-0 w-full h-full object-cover"
        width={1920}
        height={1080}
      />
      <div className="absolute inset-0 bg-gradient-hero" />

      <div className="relative z-10 container mx-auto px-4 text-center">
        <div className="max-w-3xl mx-auto animate-fade-in-up">
          <p className="font-body text-sm uppercase tracking-[0.3em] text-gold-light mb-4">
            Lançamento · Nova Suíça · Goiânia
          </p>

          <h1 className="font-heading text-4xl md:text-6xl lg:text-7xl font-bold text-primary-foreground leading-tight mb-6">
            Fusion Dinâmica Home
          </h1>

          <p className="font-body text-lg md:text-xl text-primary-foreground/80 mb-4 max-w-2xl mx-auto">
            O encontro perfeito entre modernidade, conforto e uma vida mais dinâmica.
            Seu novo endereço no coração de Goiânia.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-6 mb-10 text-primary-foreground/90 font-body text-sm">
            <span className="flex items-center gap-2">
              <BedDouble className="h-4 w-4 text-gold-light" />
              2 Quartos ou 3 Suítes
            </span>
            <span className="flex items-center gap-2">
              <Maximize className="h-4 w-4 text-gold-light" />
              58 a 107 m²
            </span>
            <span className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-gold-light" />
              Rua C-252, Nova Suíça
            </span>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <CTAButton
              text="Falar com especialista no WhatsApp"
              message="Olá! Gostaria de saber mais sobre o Fusion Dinâmica Home."
              variant="whatsapp"
            />
            <CTAButton
              text="Receber tabela de preços"
              message="Olá! Gostaria de receber a tabela de preços do Fusion Dinâmica Home."
              variant="outline"
              className="border-primary-foreground/40 text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground"
            />
          </div>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 rounded-full border-2 border-primary-foreground/40 flex justify-center pt-2">
          <div className="w-1 h-3 rounded-full bg-primary-foreground/60" />
        </div>
      </div>
    </header>
  );
};

export default HeroSection;
