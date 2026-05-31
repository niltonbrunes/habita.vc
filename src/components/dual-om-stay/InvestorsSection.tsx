"use client";
import { TrendingUp, Users, Clock, BarChart3 } from "lucide-react";
import { AnimatedSection, StaggerContainer, StaggerItem } from "./AnimatedSection";

const benefits = [
  {
    icon: TrendingUp,
    title: "Alta Rentabilidade",
    description: "Unidades compactas em localização premium geram excelente retorno com aluguel tradicional ou por temporada.",
  },
  {
    icon: Users,
    title: "Demanda Constante",
    description: "Jovens profissionais, executivos e estudantes garantem público locatário amplo e recorrente na região.",
  },
  {
    icon: Clock,
    title: "Short & Long Stay",
    description: "Estrutura preparada para locação de curta e longa temporada, maximizando as possibilidades de renda.",
  },
  {
    icon: BarChart3,
    title: "Liquidez Comprovada",
    description: "Empreendimentos similares na região esgotam em poucas horas, demonstrando a força deste mercado.",
  },
];

const scrollToContact = () => {
  document.getElementById("contato")?.scrollIntoView({ behavior: "smooth" });
};

export const InvestorsSection = () => {
  return (
    <section id="investimento" className="section-padding bg-background relative overflow-hidden">
      {/* Subtle decorative element */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />

      <div className="container-narrow relative z-10">
        <AnimatedSection>
          <div className="text-center mb-14">
            <span className="font-body text-xs font-semibold uppercase tracking-[0.2em] text-primary mb-3 block">
              Para Investidores
            </span>
            <h2 className="font-display text-3xl font-bold md:text-4xl lg:text-5xl text-foreground text-balance">
              Invista no endereço <span className="text-gradient-gold">mais valorizado</span>
            </h2>
            <p className="mt-4 font-body text-base text-muted-foreground max-w-2xl mx-auto">
              Goiânia vive uma fase de forte atração para investimentos em imóveis compactos. O Dual O.M Stay entrega um produto alinhado com as principais tendências urbanas globais.
            </p>
          </div>
        </AnimatedSection>

        <StaggerContainer className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {benefits.map((benefit) => (
            <StaggerItem key={benefit.title}>
              <div className="group rounded-sm border border-border bg-card p-6 text-center transition-all duration-300 hover:border-gold hover:shadow-gold/10 hover:shadow-lg h-full flex flex-col">
                <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 transition-all duration-300 group-hover:bg-primary/20 group-hover:shadow-gold">
                  <benefit.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-display text-lg font-semibold text-foreground">{benefit.title}</h3>
                <p className="mt-3 font-body text-sm leading-relaxed text-muted-foreground flex-grow">{benefit.description}</p>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>

        {/* CTA Banner */}
        <AnimatedSection delay={0.2}>
          <div className="mt-16 rounded-sm bg-gradient-gold p-8 md:p-12 text-center">
            <h3 className="font-display text-2xl font-bold text-primary-foreground md:text-3xl">
              Gestão profissional inclusa
            </h3>
            <p className="mt-3 font-body text-sm text-primary-foreground/80 max-w-xl mx-auto leading-relaxed">
              Com gestão profissional das unidades, o empreendimento garante eficiência operacional, padronização de serviços e total praticidade para o investidor.
            </p>
            <button
              onClick={scrollToContact}
              className="mt-6 bg-background px-8 py-3.5 font-body text-sm font-semibold uppercase tracking-wider text-foreground rounded-sm transition-all hover:bg-card"
            >
              Quero saber mais sobre investimento
            </button>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
};
