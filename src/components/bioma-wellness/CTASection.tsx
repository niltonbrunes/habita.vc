"use client";
import { MessageCircle, CalendarDays, Info } from "lucide-react";
import { LeadCaptureWrapper } from "@/components/crmhabita/LeadCaptureWrapper";

const ctas = [
  {
    icon: Info,
    label: "Quero receber informações",
    message: "Olá! Quero receber informações sobre o BIOMA Wellness Life!",
    variant: "primary" as const,
  },
  {
    icon: MessageCircle,
    label: "Falar com especialista",
    message: "Olá! Gostaria de falar com um especialista sobre o BIOMA Wellness Life!",
    variant: "secondary" as const,
  },
  {
    icon: CalendarDays,
    label: "Agendar apresentação",
    message: "Olá! Gostaria de agendar uma apresentação do BIOMA Wellness Life!",
    variant: "secondary" as const,
  },
];

const CTASection = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-wellness py-20 md:py-28">
      {/* Decorative */}
      <div className="absolute -right-20 -top-20 h-80 w-80 rounded-full bg-primary-foreground/5" />
      <div className="absolute -bottom-10 -left-10 h-60 w-60 rounded-full bg-primary-foreground/5" />

      <div className="relative z-10 mx-auto max-w-4xl px-6 text-center">
        <h2 className="mb-4 font-display text-4xl font-bold text-primary-foreground md:text-5xl">
          Seu novo lar wellness espera por você
        </h2>
        <p className="mx-auto mb-10 max-w-2xl font-body text-lg text-primary-foreground/80">
          Condições especiais de lançamento. Fale agora com nosso consultor{" "}
          Frederico Brunes e garanta as melhores unidades.
        </p>

        <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
          {ctas.map((cta, i) => (
            <LeadCaptureWrapper
              key={i}
              source="Landing Page Bioma Wellness"
              whatsappMsg={cta.message}
            >
              <span
                className={`inline-flex items-center justify-center gap-2 rounded-full px-7 py-4 font-body text-base font-semibold transition-all hover:scale-105 ${
                  cta.variant === "primary"
                    ? "bg-primary-foreground text-primary shadow-elevated"
                    : "border-2 border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10"
                }`}
              >
                <cta.icon className="h-5 w-5" />
                {cta.label}
              </span>
            </LeadCaptureWrapper>
          ))}
        </div>

        <p className="mt-8 font-body text-sm text-primary-foreground/60">
          Consultor: Frederico Brunes · WhatsApp: (62) 99307-6768
        </p>
      </div>
    </section>
  );
};

export default CTASection;
