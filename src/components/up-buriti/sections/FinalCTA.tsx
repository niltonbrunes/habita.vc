"use client";
import { Clock, Flame } from "lucide-react";
import { CTAButton } from "../CTAButton";

export const FinalCTA = () => {
  return (
    <section className="relative isolate overflow-hidden bg-gradient-primary py-20 text-primary-foreground sm:py-28">
      <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-accent/30 blur-3xl" aria-hidden />
      <div className="absolute -bottom-24 -left-16 h-72 w-72 rounded-full bg-background/10 blur-3xl" aria-hidden />

      <div className="container relative max-w-3xl text-center">
        <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-background/15 px-4 py-1.5 text-xs font-bold uppercase tracking-wider backdrop-blur-md">
          <Flame className="h-3.5 w-3.5 text-accent" />
          Últimas unidades disponíveis
        </div>

        <h2 className="font-display text-3xl font-extrabold leading-tight text-balance sm:text-4xl md:text-5xl lg:text-6xl">
          Sua chance real de sair do aluguel é agora.
        </h2>
        <p className="mx-auto mt-5 max-w-xl text-base text-primary-foreground/85 sm:text-lg">
          Garanta a Unidade 103 com R$ 1.000 de entrada, ITBI grátis e parcelas que cabem no seu bolso.
        </p>

        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <CTAButton size="lg" message="Olá! Quero garantir minha unidade no UP Buriti.">
            Garantir minha unidade
          </CTAButton>
        </div>

        <div className="mt-8 inline-flex items-center gap-2 text-sm text-primary-foreground/85">
          <Clock className="h-4 w-4" />
          Condição válida até 30/04/2026
        </div>
      </div>
    </section>
  );
};
