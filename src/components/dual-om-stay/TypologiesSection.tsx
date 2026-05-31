"use client";
import { useState } from "react";
import { AnimatedSection, StaggerContainer, StaggerItem } from "./AnimatedSection";
const studio20Img = "/dual-om-stay/studio-20m.jpg";
const interior40Img = "/dual-om-stay/interior-40m.jpg";
const planta21Img = "/dual-om-stay/planta-21m.jpeg";
const planta40Img = "/dual-om-stay/planta-40m.jpeg";

const typologies = [
  {
    id: "studio",
    name: "Studio",
    area: "21 m²",
    price: "R$ 298.620",
    image: studio20Img,
    planta: planta21Img,
    features: ["1 quarto integrado", "Banheiro com ventilação", "Varanda balcão", "Cozinha americana"],
    highlight: "Ideal para investimento",
  },
  {
    id: "suite",
    name: "1 Suíte",
    area: "40 m²",
    price: "R$ 490.490",
    image: interior40Img,
    planta: planta40Img,
    features: ["1 suíte", "Lavabo", "Sala e cozinha integradas", "Vaga de garagem"],
    highlight: "Perfeito para morar",
  },
  {
    id: "double",
    name: "Double Suítes",
    area: "61 m²",
    price: "R$ 789.110",
    image: interior40Img,
    planta: null,
    features: ["2 suítes", "Integração entre unidades", "Ampla área social", "Máxima flexibilidade"],
    highlight: "Conceito exclusivo",
  },
];

const scrollToContact = () => {
  document.getElementById("contato")?.scrollIntoView({ behavior: "smooth" });
};

export const TypologiesSection = () => {
  const [activeTab, setActiveTab] = useState("studio");

  return (
    <section id="tipologias" className="section-padding bg-background">
      <div className="container-narrow">
        <AnimatedSection>
          <div className="text-center mb-12">
            <span className="font-body text-xs font-semibold uppercase tracking-[0.2em] text-primary mb-3 block">
              Tipologias
            </span>
            <h2 className="font-display text-3xl font-bold md:text-4xl lg:text-5xl text-foreground">
              Plantas <span className="text-gradient-gold">inteligentes</span>
            </h2>
            <p className="mt-4 font-body text-base text-muted-foreground max-w-2xl mx-auto">
              De studios compactos a double suítes, cada unidade foi projetada para maximizar espaço, conforto e rentabilidade.
            </p>
          </div>
        </AnimatedSection>

        {/* Tabs */}
        <AnimatedSection delay={0.1}>
          <div className="flex justify-center gap-2 mb-10">
            {typologies.map((t) => (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id)}
                className={`px-5 py-2.5 rounded-sm font-body text-sm font-medium transition-all ${
                  activeTab === t.id
                    ? "bg-gradient-gold text-primary-foreground shadow-gold"
                    : "bg-card border border-border text-muted-foreground hover:text-foreground hover:border-gold/50"
                }`}
              >
                {t.name}
              </button>
            ))}
          </div>
        </AnimatedSection>

        {/* Active typology */}
        {typologies
          .filter((t) => t.id === activeTab)
          .map((t) => (
            <div key={t.id} className="grid gap-8 lg:grid-cols-2 items-center">
              {/* Image / Planta */}
              <AnimatedSection>
                <div className="relative overflow-hidden rounded-sm bg-card">
                  <img
                    src={t.planta || t.image}
                    alt={`Planta do ${t.name} de ${t.area} no Dual O.M Stay`}
                    className="w-full h-[350px] lg:h-[420px] object-contain bg-card p-4"
                    loading="lazy"
                  />
                </div>
              </AnimatedSection>

              {/* Details */}
              <AnimatedSection delay={0.15}>
                <div>
                  <span className="inline-block rounded-sm bg-primary/10 border border-gold px-3 py-1 text-xs font-body font-semibold text-primary mb-4">
                    {t.highlight}
                  </span>
                  <h3 className="font-display text-2xl font-bold text-foreground md:text-3xl">
                    {t.name} — {t.area}
                  </h3>
                  <p className="mt-2 font-display text-2xl font-semibold text-gradient-gold">{t.price}</p>

                  <ul className="mt-6 space-y-3">
                    {t.features.map((f) => (
                      <li key={f} className="flex items-center gap-3 font-body text-sm text-secondary-foreground">
                        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/10">
                          <svg className="h-3 w-3 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                        </span>
                        {f}
                      </li>
                    ))}
                  </ul>

                  <button
                    onClick={scrollToContact}
                    className="mt-8 bg-gradient-gold px-8 py-3.5 font-body text-sm font-semibold uppercase tracking-wider text-primary-foreground rounded-sm shadow-gold transition-all hover:brightness-110"
                  >
                    Quero saber valores e condições
                  </button>
                </div>
              </AnimatedSection>
            </div>
          ))}
      </div>
    </section>
  );
};
