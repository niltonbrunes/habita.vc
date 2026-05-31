"use client";
const lazerImage = "/bioma-wellness/lazer-bioma.jpg";
const wellnessImage = "/bioma-wellness/wellness-bioma.jpg";
const quartoImage = "/bioma-wellness/quarto-bioma.jpg";
import { useState } from "react";

const gallery = [
  { src: lazerImage, alt: "Área de lazer com piscina climatizada BIOMA Wellness Life", label: "Piscina & Lounge" },
  { src: wellnessImage, alt: "Spa e sala de massagem do complexo wellness BIOMA", label: "Spa & Wellness" },
  { src: quartoImage, alt: "Suíte master decorada do BIOMA Wellness Life", label: "Suíte Master" },
];

const amenities = [
  "Piscina climatizada com ozônio",
  "Complexo Wellness 200m²",
  "Spa com sauna e sala de massagem",
  "Academia de última geração",
  "3 salões de festas integráveis (300m²)",
  "Brinquedoteca",
  "Pet Place",
  "Bicicletário completo",
  "Coworking",
  "Mini Market",
  "Central de entregas",
  "Entrada especial para delivery",
];

const GalleryLeisureSection = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <section id="lazer" className="bg-gradient-section py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-16 text-center">
          <p className="mb-3 font-body text-sm font-semibold uppercase tracking-[0.2em] text-wellness">
            Infraestrutura de Lazer
          </p>
          <h2 className="mb-4 font-display text-4xl font-bold text-foreground md:text-5xl">
            Seu refúgio particular no coração da cidade
          </h2>
        </div>

        {/* Gallery */}
        <div className="mb-16">
          <div className="overflow-hidden rounded-2xl shadow-elevated">
            <img
              src={gallery[activeIndex].src}
              alt={gallery[activeIndex].alt}
              className="h-[400px] w-full object-cover transition-all duration-500 md:h-[500px]"
              loading="lazy"
            />
          </div>
          <div className="mt-4 flex gap-3 overflow-x-auto pb-2">
            {gallery.map((item, i) => (
              <button
                key={i}
                onClick={() => setActiveIndex(i)}
                className={`flex-shrink-0 overflow-hidden rounded-xl transition-all ${
                  i === activeIndex
                    ? "ring-2 ring-primary ring-offset-2"
                    : "opacity-60 hover:opacity-100"
                }`}
              >
                <img
                  src={item.src}
                  alt={item.alt}
                  className="h-20 w-28 object-cover md:h-24 md:w-36"
                  loading="lazy"
                />
                <p className="bg-card px-2 py-1 text-center font-body text-xs font-medium text-foreground">
                  {item.label}
                </p>
              </button>
            ))}
          </div>
        </div>

        {/* Amenities Grid */}
        <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {amenities.map((item, i) => (
            <div
              key={i}
              className="flex items-center gap-3 rounded-lg bg-card px-4 py-3 shadow-card"
            >
              <span className="flex h-2 w-2 flex-shrink-0 rounded-full bg-gradient-wellness" />
              <span className="font-body text-sm text-foreground">{item}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default GalleryLeisureSection;
