"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, X, Dumbbell, Waves, TreePine, PartyPopper, Dog, Baby, Trophy } from "lucide-react";












const gallery = [
  { src: clubeExterno, alt: "Clube externo Parqville Cerejeira", label: "Clube Social" },
  { src: piscina, alt: "Piscina com deck Parqville Cerejeira", label: "Piscina" },
  { src: salaoFestas, alt: "Salão de festas Parqville Cerejeira", label: "Salão de Festas" },
  { src: academia, alt: "Academia completa Parqville Cerejeira", label: "Academia" },
  { src: quadras, alt: "Quadras poliesportivas Parqville Cerejeira", label: "Quadras" },
  { src: beachTennis, alt: "Quadra de beach tennis Parqville Cerejeira", label: "Beach Tennis" },
  { src: quadraAreia, alt: "Quadras de areia Parqville Cerejeira", label: "Quadras de Areia" },
  { src: praca, alt: "Praça central com cerejeiras Parqville Cerejeira", label: "Praça Central" },
  { src: petPlace, alt: "Pet place Parqville Cerejeira", label: "Pet Place" },
  { src: playground, alt: "Playground infantil Parqville Cerejeira", label: "Playground" },
];

const highlights = [
  { icon: Waves, label: "Piscina adulto e infantil" },
  { icon: Dumbbell, label: "Academia completa" },
  { icon: Trophy, label: "Quadras poliesportivas" },
  { icon: PartyPopper, label: "Salão de festas" },
  { icon: Dog, label: "Pet place" },
  { icon: Baby, label: "Playground" },
  { icon: TreePine, label: "Praças e jardins" },
];

const ParqvilleSection = () => {
  const [lightbox, setLightbox] = useState<number | null>(null);

  const navigate = (dir: 1 | -1) => {
    if (lightbox === null) return;
    setLightbox((lightbox + dir + gallery.length) % gallery.length);
  };

  return (
    <section className="py-20 md:py-32 bg-muted" id="parqville">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center mb-6"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary font-body text-sm font-semibold mb-4">
            Parqville Cerejeira
          </span>
          <h2 className="font-display text-3xl md:text-5xl font-bold text-foreground mb-4">
            Lazer Completo no Seu Bairro
          </h2>
          <p className="max-w-2xl mx-auto text-muted-foreground text-lg font-body">
            O Parqville Cerejeira oferece uma infraestrutura de lazer e convivência incomparável — piscina, academia, quadras, salão de festas, pet place e muito mais, tudo integrado à natureza do Cidade do Amanhã.
          </p>
        </motion.div>

        {/* Highlights */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex flex-wrap justify-center gap-3 mb-12"
        >
          {highlights.map((h) => (
            <div key={h.label} className="flex items-center gap-2 px-4 py-2 rounded-full bg-background card-elevated text-sm font-body text-foreground">
              <h.icon className="w-4 h-4 text-primary" />
              {h.label}
            </div>
          ))}
        </motion.div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
          {gallery.map((img, i) => (
            <motion.button
              key={img.label}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              onClick={() => setLightbox(i)}
              className={`group relative overflow-hidden rounded-xl cursor-pointer ${
                i === 0 ? "col-span-2 row-span-2" : ""
              }`}
            >
              <img
                src={img.src}
                alt={img.alt}
                loading="lazy"
                className="w-full h-full object-cover aspect-[4/3] group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/30 transition-colors duration-300 flex items-end">
                <span className="px-3 py-2 text-background font-body text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  {img.label}
                </span>
              </div>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-foreground/90 flex items-center justify-center p-4"
            onClick={() => setLightbox(null)}
          >
            <button onClick={() => setLightbox(null)} className="absolute top-4 right-4 text-background/80 hover:text-background">
              <X className="w-8 h-8" />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); navigate(-1); }}
              className="absolute left-4 text-background/80 hover:text-background"
            >
              <ChevronLeft className="w-10 h-10" />
            </button>
            <motion.img
              key={lightbox}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              src={gallery[lightbox].src}
              alt={gallery[lightbox].alt}
              className="max-w-full max-h-[85vh] rounded-xl object-contain"
              onClick={(e) => e.stopPropagation()}
            />
            <button
              onClick={(e) => { e.stopPropagation(); navigate(1); }}
              className="absolute right-4 text-background/80 hover:text-background"
            >
              <ChevronRight className="w-10 h-10" />
            </button>
            <p className="absolute bottom-6 text-background/70 font-body text-sm">
              {gallery[lightbox].label} — {lightbox + 1}/{gallery.length}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default ParqvilleSection;


