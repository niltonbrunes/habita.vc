"use client";
import { AnimatedSection } from "./AnimatedSection";
const fachadaAereaImg = "/dual-om-stay/fachada-aerea.jpg";

const locationHighlights = [
  "Restaurantes de alta gastronomia e cafeterias",
  "Academias premium e centros de bem-estar",
  "Parque Areião e Alameda Ricardo Paranhos",
  "Shoppings, hospitais e centros médicos",
  "Proximidade com os principais eixos viários",
  "Forte presença empresarial e comercial",
];

export const LocationSection = () => {
  return (
    <section id="localizacao" className="section-padding bg-muted/30">
      <div className="container-narrow">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
          {/* Image */}
          <AnimatedSection>
            <div className="relative overflow-hidden rounded-sm">
              <img
                src={fachadaAereaImg}
                alt="Vista aérea do Dual O.M Stay no Setor Marista, Goiânia"
                className="w-full h-[400px] lg:h-[500px] object-cover"
                loading="lazy"
              />
              <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-background to-transparent">
                <p className="font-body text-sm text-primary font-semibold flex items-center gap-2">
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Rua 1130, Setor Marista · Goiânia, GO
                </p>
              </div>
            </div>
          </AnimatedSection>

          {/* Text */}
          <div>
            <AnimatedSection>
              <span className="font-body text-xs font-semibold uppercase tracking-[0.2em] text-primary mb-3 block">
                Localização
              </span>
              <h2 className="font-display text-3xl font-bold md:text-4xl text-foreground text-balance">
                O bairro mais <span className="text-gradient-gold">desejado</span> de Goiânia
              </h2>
            </AnimatedSection>

            <AnimatedSection delay={0.15}>
              <p className="mt-6 font-body text-base leading-relaxed text-muted-foreground md:text-lg">
                O Setor Marista é referência em qualidade de vida, gastronomia e infraestrutura urbana. A região das Mansões preserva uma ocupação pouco verticalizada e reúne os melhores endereços da cidade.
              </p>
              <p className="mt-4 font-body text-base leading-relaxed text-muted-foreground md:text-lg">
                Para investidores, a demanda constante por moradia na região garante alta liquidez e excelente potencial de rentabilidade com locação de curta ou longa temporada.
              </p>
            </AnimatedSection>

            <AnimatedSection delay={0.25}>
              <ul className="mt-8 space-y-3">
                {locationHighlights.map((item) => (
                  <li key={item} className="flex items-start gap-3 font-body text-sm text-secondary-foreground">
                    <span className="mt-1 h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </AnimatedSection>
          </div>
        </div>
      </div>
    </section>
  );
};
