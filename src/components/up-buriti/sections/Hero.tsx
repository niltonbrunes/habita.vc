"use client";
import { MapPin, Sparkles } from "lucide-react";
import { CTAButton } from "../CTAButton";
const heroImg = "/up-buriti/hero-building.jpg";

export const Hero = () => {
  return (
    <section
      id="inicio"
      className="relative isolate min-h-[100svh] w-full overflow-hidden"
    >
      <img
        src={heroImg}
        alt="Piscina e fachada moderna do UP Buriti, no Jardim Luz, Aparecida de Goiânia"
        className="absolute inset-0 -z-10 h-full w-full object-cover object-center"
        width={1536}
        height={1281}
        fetchPriority="high"
      />
      {/* Scrim mais forte embaixo (mobile) e à esquerda (desktop) para garantir leitura do texto */}
      <div
        className="absolute inset-0 -z-10 bg-gradient-to-t from-foreground/85 via-foreground/55 to-foreground/30 sm:bg-gradient-to-r sm:from-foreground/85 sm:via-foreground/55 sm:to-foreground/10"
        aria-hidden
      />

      <div className="container relative flex min-h-[100svh] flex-col justify-end pb-16 pt-28 sm:justify-center sm:pb-24">
        <div className="max-w-2xl animate-fade-up">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-medium text-white backdrop-blur-md sm:text-sm">
            <Sparkles className="h-3.5 w-3.5 text-accent" />
            Lançamento exclusivo • Vagas limitadas
          </div>

          <h1 className="font-display text-4xl font-extrabold leading-tight text-white text-balance sm:text-5xl md:text-6xl lg:text-7xl">
            Saia do aluguel com{" "}
            <span className="text-accent drop-shadow-[0_2px_8px_rgba(0,0,0,0.35)]">
              R$ 1.000 de entrada
            </span>
          </h1>

          <p className="mt-5 max-w-xl text-base leading-relaxed text-white/85 text-balance sm:text-lg md:text-xl">
            Apartamento moderno e funcional no <strong className="text-white">Jardim Luz, Aparecida de Goiânia</strong>. Parcelas que cabem no aluguel e <strong className="text-white">ITBI + Registro grátis</strong>.
          </p>

          <div className="mt-3 inline-flex items-center gap-1.5 text-sm text-white/80">
            <MapPin className="h-4 w-4" />
            Jardim Luz • Aparecida de Goiânia / GO
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            <CTAButton size="lg" message="Olá! Quero falar com um especialista sobre o UP Buriti.">
              Falar com especialista no WhatsApp
            </CTAButton>
            <a
              href="#condicao"
              className="inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-semibold text-white/90 underline-offset-4 hover:underline"
            >
              Ver condição completa ↓
            </a>
          </div>

          <div className="mt-10 grid max-w-lg grid-cols-3 gap-3">
            {[
              { k: "R$ 1.000", v: "Entrada" },
              { k: "52,2m²", v: "Nascente" },
              { k: "Dez/2027", v: "Entrega" },
            ].map((s) => (
              <div
                key={s.v}
                className="rounded-2xl border border-white/15 bg-white/5 px-3 py-3 text-center backdrop-blur-md"
              >
                <div className="font-display text-base font-bold text-white sm:text-lg">{s.k}</div>
                <div className="text-[11px] uppercase tracking-wide text-white/70 sm:text-xs">{s.v}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
