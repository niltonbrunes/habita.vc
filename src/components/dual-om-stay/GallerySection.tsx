"use client";
import { AnimatedSection } from "./AnimatedSection";
const fachadaNoiteImg = "/dual-om-stay/fachada-noite.jpg";
const academiaImg = "/dual-om-stay/academia.jpg";
const coworkingImg = "/dual-om-stay/coworking.jpg";
const gourmetImg = "/dual-om-stay/gourmet.jpg";
const interior40Img = "/dual-om-stay/interior-40m.jpg";
const saunaImg = "/dual-om-stay/sauna.jpg";

const images = [
  { src: fachadaNoiteImg, alt: "Fachada noturna do Dual O.M Stay" },
  { src: interior40Img, alt: "Interior do apartamento de 40m² no Dual O.M Stay" },
  { src: academiaImg, alt: "Academia do Dual O.M Stay" },
  { src: coworkingImg, alt: "Coworking do Dual O.M Stay" },
  { src: gourmetImg, alt: "Espaço Gourmet do Dual O.M Stay" },
  { src: saunaImg, alt: "Sauna do Dual O.M Stay" },
];

export const GallerySection = () => {
  return (
    <section className="section-padding bg-background">
      <div className="container-narrow">
        <AnimatedSection>
          <div className="text-center mb-12">
            <span className="font-body text-xs font-semibold uppercase tracking-[0.2em] text-primary mb-3 block">
              Galeria
            </span>
            <h2 className="font-display text-3xl font-bold md:text-4xl text-foreground">
              Conheça o <span className="text-gradient-gold">Dual O.M Stay</span>
            </h2>
          </div>
        </AnimatedSection>

        <AnimatedSection delay={0.1}>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4">
            {images.map((img, idx) => (
              <div
                key={idx}
                className={`relative overflow-hidden rounded-sm group ${
                  idx === 0 ? "col-span-2 row-span-2 aspect-[4/3]" : "aspect-square"
                }`}
              >
                <img
                  src={img.src}
                  alt={img.alt}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-background/0 group-hover:bg-background/20 transition-colors duration-300" />
              </div>
            ))}
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
};
