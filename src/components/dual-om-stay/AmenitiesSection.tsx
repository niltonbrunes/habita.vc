"use client";
import { AnimatedSection, StaggerContainer, StaggerItem } from "./AnimatedSection";
const academiaImg = "/dual-om-stay/academia.jpg";
const coworkingImg = "/dual-om-stay/coworking.jpg";
const saunaImg = "/dual-om-stay/sauna.jpg";
const gourmetImg = "/dual-om-stay/gourmet.jpg";
const podcastImg = "/dual-om-stay/podcast.jpg";
const lavanderiaImg = "/dual-om-stay/lavanderia.jpg";
const minimarketImg = "/dual-om-stay/minimarket.jpg";
const lobbyImg = "/dual-om-stay/lobby.jpg";

const amenities = [
  { name: "Academia by Flex Home", image: academiaImg },
  { name: "Coworking", image: coworkingImg },
  { name: "Sauna", image: saunaImg },
  { name: "Espaço Gourmet", image: gourmetImg },
  { name: "Sala de Podcast", image: podcastImg },
  { name: "Lavanderia by OMO", image: lavanderiaImg },
  { name: "Mini Market", image: minimarketImg },
  { name: "Lobby Social", image: lobbyImg },
];

const differentials = [
  "Piscina no rooftop com vista panorâmica",
  "Conceito Double Suítes — integração entre unidades",
  "Rede frigorígena entregue para ar-condicionado",
  "Persianas embutidas nas suítes",
  "Banheiros 100% revestidos",
  "Gestão profissional opcional de locação",
  "Estrutura pensada para short e long stay",
  "Plataforma de personalização e mobília",
];

export const AmenitiesSection = () => {
  return (
    <section id="amenidades" className="section-padding bg-muted/30">
      <div className="container-narrow">
        <AnimatedSection>
          <div className="text-center mb-14">
            <span className="font-body text-xs font-semibold uppercase tracking-[0.2em] text-primary mb-3 block">
              Áreas Comuns & Diferenciais
            </span>
            <h2 className="font-display text-3xl font-bold md:text-4xl lg:text-5xl text-foreground">
              Infraestrutura <span className="text-gradient-gold">completa</span>
            </h2>
            <p className="mt-4 font-body text-base text-muted-foreground max-w-2xl mx-auto">
              Espaços projetados para o lifestyle urbano, com comodidades que atendem tanto moradores quanto o mercado de locação por temporada.
            </p>
          </div>
        </AnimatedSection>

        {/* Amenities Grid */}
        <StaggerContainer className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
          {amenities.map((amenity) => (
            <StaggerItem key={amenity.name}>
              <div className="group relative overflow-hidden rounded-sm aspect-square cursor-pointer">
                <img
                  src={amenity.image}
                  alt={`${amenity.name} do Dual O.M Stay`}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300" />
                <div className="absolute bottom-0 left-0 right-0 p-3 md:p-4">
                  <p className="font-body text-xs md:text-sm font-semibold text-foreground">{amenity.name}</p>
                </div>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>

        {/* Differentials */}
        <AnimatedSection delay={0.2}>
          <div className="mt-16 rounded-sm border border-border bg-card p-8 md:p-12">
            <h3 className="font-display text-2xl font-bold text-foreground mb-8 text-center">
              Diferenciais <span className="text-gradient-gold">exclusivos</span>
            </h3>
            <div className="grid gap-4 sm:grid-cols-2">
              {differentials.map((item) => (
                <div key={item} className="flex items-start gap-3">
                  <span className="mt-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary/10 flex-shrink-0">
                    <svg className="h-3 w-3 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </span>
                  <span className="font-body text-sm text-secondary-foreground">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
};
