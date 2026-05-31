"use client";
const poolImg = "/fusion-dinamica/pool-area.jpg";
const fitnessImg = "/fusion-dinamica/fitness.jpg";
const gourmetImg = "/fusion-dinamica/gourmet.jpg";
const playgroundImg = "/fusion-dinamica/playground.jpg";
import { useState } from "react";

const amenities = [
  { img: poolImg, title: "Fusion Pool", desc: "Piscina aquecida com 57 m² e Piscina Kids", alt: "Piscina Fusion Pool do Fusion Dinâmica Home em Goiânia" },
  { img: fitnessImg, title: "Academia 134 m²", desc: "Equipamentos profissionais com vista panorâmica", alt: "Academia do Fusion Dinâmica Home em Goiânia" },
  { img: gourmetImg, title: "Espaço Gourmet", desc: "Churrasqueira & Varanda Gourmet para momentos especiais", alt: "Espaço gourmet do Fusion Dinâmica Home em Goiânia" },
  { img: playgroundImg, title: "Playground & Brinquedoteca", desc: "Espaços seguros e divertidos para toda a família", alt: "Playground do Fusion Dinâmica Home em Goiânia" },
];

const moreAmenities = [
  "Salão de Festas (140 m²)", "Pub & Karaokê", "Recovery Zone com banheira de gelo",
  "Sauna integrada à piscina", "Quadra Poliesportiva", "Lounge & Games (76 m²)",
  "Pet Club com Pet Park e Pet Care", "Pit Fire", "Paisagismo 360°",
  "Bicicletário e Bike Wash", "Espaço Delivery", "Minimercado",
];

const AmenitiesSection = () => {
  const [showAll, setShowAll] = useState(false);

  return (
    <section id="lazer" className="py-20 md:py-28 bg-muted">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <p className="font-body text-sm uppercase tracking-[0.2em] text-gold mb-3">
            Área de Lazer
          </p>
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-4">
            1.495 m² dedicados ao seu bem-estar
          </h2>
          <p className="font-body text-muted-foreground max-w-2xl mx-auto">
            O lazer ocupa um pavimento inteiro, com espaços inovadores pensados para toda a família.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-12">
          {amenities.map((a) => (
            <div key={a.title} className="group rounded-2xl overflow-hidden shadow-card hover:shadow-elevated transition-all duration-300">
              <div className="relative overflow-hidden aspect-[4/3]">
                <img
                  src={a.img}
                  alt={a.alt}
                  loading="lazy"
                  width={800}
                  height={600}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/70 to-transparent" />
                <div className="absolute bottom-0 left-0 p-6">
                  <h3 className="font-heading text-xl font-bold text-primary-foreground mb-1">{a.title}</h3>
                  <p className="font-body text-sm text-primary-foreground/80">{a.desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-card rounded-2xl p-8 shadow-card">
          <h3 className="font-heading text-xl font-semibold text-foreground mb-6 text-center">
            + Espaços que você vai adorar
          </h3>
          <div className={`grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 ${!showAll ? "max-h-32 overflow-hidden md:max-h-none" : ""}`}>
            {moreAmenities.map((item) => (
              <div key={item} className="flex items-center gap-2 font-body text-sm text-muted-foreground">
                <div className="w-2 h-2 rounded-full bg-gold shrink-0" />
                {item}
              </div>
            ))}
          </div>
          <button
            onClick={() => setShowAll(!showAll)}
            className="mt-4 text-gold font-body text-sm font-medium md:hidden"
          >
            {showAll ? "Ver menos" : "Ver todos →"}
          </button>
        </div>
      </div>
    </section>
  );
};

export default AmenitiesSection;
