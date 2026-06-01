"use client";
import React from "react";

const Gallery = () => {
  const images = [
    {
      url: "https://fazendavillagiocondominio.com.br/wp-content/uploads/2026/05/FV-4-TRINCA-CONCEITO_01.webp",
      title: "Liberdade Equestre",
      subtitle: "Centro hípico e trilhas na mata"
    },
    {
      url: "https://fazendavillagiocondominio.com.br/wp-content/uploads/2026/05/FV-4-TRINCA-CONCEITO_02.webp",
      title: "Conceito Internacional",
      subtitle: "Inspirado no estilo de vida rústico-chic do Texas"
    },
    {
      url: "https://fazendavillagiocondominio.com.br/wp-content/uploads/2026/05/FV-4-TRINCA-CONCEITO_03.webp",
      title: "Clube do Lago",
      subtitle: "Espelho d'água de 40.000m² e praia artificial"
    }
  ];

  return (
    <section className="py-20 md:py-28 bg-[#1E352F] text-white overflow-hidden relative">
      <div className="absolute top-0 right-0 w-80 h-80 bg-[#8C4A14]/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#D4AF37]/5 rounded-full blur-3xl" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto space-y-4 mb-16">
          <p className="text-[#D4AF37] font-bold text-sm tracking-wider uppercase">Galeria de Conceito</p>
          <h2 className="text-3xl md:text-5xl font-bold font-display text-white">
            A Trinca Conceitual do Projeto
          </h2>
          <p className="text-[#F7F4EB]/80 text-base md:text-lg">
            Um vislumbre do estilo de vida refinado, onde a elegância campestre e a calmaria da água se encontram.
          </p>
          <div className="w-16 h-[2px] bg-[#D4AF37] mx-auto mt-6" />
        </div>

        {/* Grid Images */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {images.map((img, i) => (
            <div
              key={i}
              className="group bg-[#25362F]/40 border border-white/10 rounded-3xl overflow-hidden shadow-2xl relative aspect-[4/5] flex items-end p-6 hover:border-[#D4AF37]/50 transition-all hover:scale-[1.02]"
            >
              {/* Background Image */}
              <img
                src={img.url}
                alt={img.title}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                loading="lazy"
              />
              {/* Overlay Gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent transition-opacity group-hover:from-black/90" />
              
              {/* Text info */}
              <div className="relative z-10 text-left space-y-1 transform transition-transform duration-300 group-hover:translate-y-[-5px]">
                <span className="text-[#D4AF37] text-xs font-semibold uppercase tracking-wider">
                  {img.subtitle}
                </span>
                <h4 className="text-xl font-bold font-display text-white">
                  {img.title}
                </h4>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Gallery;
