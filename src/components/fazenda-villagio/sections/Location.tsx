"use client";
import React from "react";
import { Compass, Clock, MapPin } from "lucide-react";

const Location = () => {
  const points = [
    { name: "Flamboyant Shopping", desc: "18 minutos", highlight: true },
    { name: "Villa Cavalcare", desc: "10 minutos", highlight: true },
    { name: "Autódromo de Goiânia", desc: "15 minutos", highlight: false },
    { name: "Aldeia do Vale", desc: "18 minutos", highlight: false },
    { name: "Aeroporto de Goiânia", desc: "20 minutos", highlight: false }
  ];

  return (
    <section id="localizacao" className="py-20 md:py-28 bg-[#F7F4EB] relative">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Map Details */}
          <div className="lg:col-span-5 text-left space-y-6 animate-in fade-in slide-in-from-left duration-700">
            <div className="inline-flex items-center gap-2 text-[#8C4A14] font-semibold text-sm tracking-wider uppercase">
              <Compass size={16} />
              Localização Privilegiada
            </div>
            
            <h2 className="text-3xl md:text-5xl font-bold font-display text-[#162521] leading-tight">
              O Melhor dos Dois Mundos na <span className="italic text-[#8C4A14]">GO-010</span>
            </h2>
            
            <p className="text-[#162521]/80 text-base md:text-lg">
              Desfrute da verdadeira calmaria do campo e da vida equestre ao ar livre, com a rapidez e segurança de acesso direto a Goiânia pela rodovia GO-010 duplicada.
            </p>

            <div className="w-16 h-[2px] bg-[#8C4A14]" />

            {/* Distances List */}
            <div className="space-y-4 pt-4">
              {points.map((pt, i) => (
                <div
                  key={i}
                  className={
                    pt.highlight
                      ? "flex justify-between items-center p-4 rounded-xl border bg-white border-[#8C4A14]/30 shadow-sm"
                      : "flex justify-between items-center p-4 rounded-xl border bg-white/40 border-slate-200"
                  }
                >
                  <span className="flex items-center gap-2 font-medium text-[#162521]">
                    <MapPin size={16} className={pt.highlight ? "text-[#8C4A14]" : "text-slate-400"} />
                    {pt.name}
                  </span>
                  
                  <span className={
                    pt.highlight ? "flex items-center gap-1 font-bold text-[#8C4A14]" : "flex items-center gap-1 font-bold text-slate-600"
                  }>
                    <Clock size={14} />
                    {pt.desc}
                  </span>
                </div>
              ))}
              <p className="text-xs text-slate-500 italic mt-2">
                * Tempos estimados via GO-010 em fluxo regular de tráfego.
              </p>
            </div>
          </div>

          {/* Right Column: Embedded Map */}
          <div className="lg:col-span-7 w-full h-[450px] lg:h-[550px] rounded-3xl overflow-hidden shadow-2xl border border-[#8C4A14]/15 relative group">
            <iframe
              className="absolute inset-0 w-full h-full border-0"
              src="https://maps.google.com/maps?q=Fazenda%20Villagio&t=m&z=12&output=embed&iwloc=near"
              allowFullScreen={true}
              loading="lazy"
              title="Localização Fazenda Villagio"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>

        </div>
      </div>
    </section>
  );
};

export default Location;
