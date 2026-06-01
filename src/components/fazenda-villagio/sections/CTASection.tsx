"use client";
import React from "react";
import { LeadCaptureWrapper } from "@/components/crmhabita/LeadCaptureWrapper";
import { Info, MessageCircle, Calendar } from "lucide-react";

const CTASection = () => {
  const ctas = [
    {
      icon: Info,
      label: "Quero receber informações",
      message: "Olá! Gostaria de receber materiais e informações sobre os lotes da Fazenda Villagio.",
      variant: "primary" as const
    },
    {
      icon: MessageCircle,
      label: "Falar com especialista",
      message: "Olá! Gostaria de falar com um corretor curador especialista para tirar dúvidas sobre a Fazenda Villagio.",
      variant: "secondary" as const
    },
    {
      icon: Calendar,
      label: "Agendar uma Apresentação",
      message: "Olá! Gostaria de agendar uma apresentação detalhada da maquete ou visita aos lotes do Fazenda Villagio.",
      variant: "secondary" as const
    }
  ];

  return (
    <section className="relative overflow-hidden bg-gradient-equestrian py-20 md:py-28 text-white text-center">
      {/* Decorative Blur Spheres */}
      <div className="absolute -right-20 -top-20 h-96 w-96 rounded-full bg-[#8C4A14]/15 blur-3xl -z-10" />
      <div className="absolute -bottom-10 -left-10 h-80 w-80 rounded-full bg-[#D4AF37]/10 blur-3xl -z-10" />

      <div className="relative z-10 mx-auto max-w-5xl px-6">
        <h2 className="mb-6 font-display text-4xl md:text-5.5xl font-bold text-[#F7F4EB] leading-tight">
          Assuma as rédeas do seu próximo grande refúgio
        </h2>
        <p className="mx-auto mb-12 max-w-2xl text-[#F7F4EB]/80 text-base md:text-lg font-light leading-relaxed">
          Condições exclusivas de tabela zero e prioridade na escolha de quadras e lotes. Fale hoje mesmo com um curador oficial e receba a documentação do projeto.
        </p>

        {/* Buttons Grid */}
        <div className="flex flex-col gap-4 sm:flex-row sm:justify-center items-center">
          {ctas.map((cta, i) => (
            <LeadCaptureWrapper
              key={i}
              source="Footer CTA Fazenda Villagio"
              whatsappMsg={cta.message}
              whatsappNumber="556283058000"
            >
              <span
                className={
                  cta.variant === "primary"
                    ? "inline-flex items-center justify-center gap-2 rounded-full px-8 py-4 font-semibold text-sm transition-all hover:scale-105 active:scale-95 cursor-pointer shadow-md bg-[#8C4A14] hover:bg-[#723a10] text-[#F7F4EB]"
                    : "inline-flex items-center justify-center gap-2 rounded-full px-8 py-4 font-semibold text-sm transition-all hover:scale-105 active:scale-95 cursor-pointer shadow-md border-2 border-white/20 hover:border-white/50 text-[#F7F4EB] bg-white/5 hover:bg-white/10"
                }
              >
                <cta.icon className="h-4.5 w-4.5 text-[#D4AF37]" />
                {cta.label}
              </span>
            </LeadCaptureWrapper>
          ))}
        </div>

        <p className="mt-12 text-[#F7F4EB]/60 text-sm font-medium">
          Curadores Oficiais: Thiago Wendel e Frederico Brunes • Atendimento WhatsApp: (62) 8305-8000
        </p>
      </div>
    </section>
  );
};

export default CTASection;
