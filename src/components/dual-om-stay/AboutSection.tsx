"use client";
import { MapPin, Building2, ShieldCheck, TrendingUp } from "lucide-react";
import { AnimatedSection, StaggerContainer, StaggerItem } from "./AnimatedSection";
const lobbyImg = "/dual-om-stay/lobby.jpg";

const features = [
  {
    icon: MapPin,
    title: "Localização Premium",
    description: "Área das Mansões do Setor Marista, próximo à Ricardo Paranhos e ao Parque Areião.",
  },
  {
    icon: Building2,
    title: "Design Moderno",
    description: "Arquitetura contemporânea com acabamentos de alto padrão e plantas inteligentes.",
  },
  {
    icon: ShieldCheck,
    title: "Segurança",
    description: "Pulmão de segurança, guarda-entregas e infraestrutura completa de monitoramento.",
  },
  {
    icon: TrendingUp,
    title: "Alta Valorização",
    description: "Região com forte demanda por locação e crescimento constante do m² no Marista.",
  },
];

export const AboutSection = () => {
  return (
    <section id="sobre" className="section-padding bg-background">
      <div className="container-narrow">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
          {/* Text */}
          <div>
            <AnimatedSection>
              <span className="font-body text-xs font-semibold uppercase tracking-[0.2em] text-primary mb-3 block">
                O Empreendimento
              </span>
              <h2 className="font-display text-3xl font-bold md:text-4xl lg:text-5xl text-foreground text-balance">
                Um novo conceito de <span className="text-gradient-gold">morar e investir</span>
              </h2>
            </AnimatedSection>

            <AnimatedSection delay={0.15}>
              <p className="mt-6 font-body text-base leading-relaxed text-muted-foreground md:text-lg">
                O Dual O.M Stay nasce para atender uma nova forma de habitar as grandes cidades: unidades inteligentes, compactas e altamente rentáveis, posicionadas em uma das regiões mais valorizadas de Goiânia.
              </p>
              <p className="mt-4 font-body text-base leading-relaxed text-muted-foreground md:text-lg">
                Com studios de 21&nbsp;m² e 40&nbsp;m², além da possibilidade de Double Suítes de 61&nbsp;m², o projeto conecta o desejo de morar à decisão de investir — ideal para moradia, locação por temporada ou investimento de alta liquidez.
              </p>
            </AnimatedSection>
          </div>

          {/* Image */}
          <AnimatedSection delay={0.2}>
            <div className="relative overflow-hidden rounded-sm">
              <img
                src={lobbyImg}
                alt="Lobby elegante do Dual O.M Stay com design contemporâneo"
                className="w-full h-[400px] lg:h-[500px] object-cover"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/40 to-transparent" />
            </div>
          </AnimatedSection>
        </div>

        {/* Feature Grid */}
        <StaggerContainer className="mt-16 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => (
            <StaggerItem key={feature.title}>
              <div className="group rounded-sm border border-border bg-card p-6 transition-all duration-300 hover:border-gold hover:shadow-gold/10 hover:shadow-lg">
                <feature.icon className="mb-4 h-8 w-8 text-primary transition-transform duration-300 group-hover:scale-110" />
                <h3 className="font-display text-lg font-semibold text-foreground">{feature.title}</h3>
                <p className="mt-2 font-body text-sm leading-relaxed text-muted-foreground">{feature.description}</p>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
};
