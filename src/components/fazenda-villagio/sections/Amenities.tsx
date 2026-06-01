"use client";
import React from "react";
import { Shield, Waves, MapPin, Leaf } from "lucide-react";

const Amenities = () => {
  const diffs = [
    {
      icon: Shield,
      title: "Centro Hípico de Padrão Mundial",
      desc: "Uma infraestrutura equestre profissional de altíssimo nível para prática de esportes hípicos, picadeiro, baias de luxo e passeios guiados a cavalo na mata nativa preservada.",
      color: "bg-[#1E352F] text-[#F7F4EB]"
    },
    {
      icon: Waves,
      title: "Clube Privativo Exclusivo",
      desc: "Lago magnífico com 40.000m² de espelho d'água, piscinas com borda infinita, praia artificial de areia cristalina, quadras de esporte e esportes náuticos não motorizados como stand-up e caiaque.",
      color: "bg-[#8C4A14] text-[#F7F4EB]"
    },
    {
      icon: MapPin,
      title: "Urbanismo Inteligente",
      desc: "571 lotes amplos de 600 a 1400m². Projeto exclusivo com 85% dos lotes sem vizinhos nos fundos (fazendo divisa direta com belíssimas rotas de pomares de frutas do cerrado).",
      color: "bg-[#1E352F] text-[#F7F4EB]"
    },
    {
      icon: Leaf,
      title: "Autêntico Lifestyle Hípico",
      desc: "Ruas projetadas para compartilhamento seguro entre pedestres e cavalos. Trilhas sombreadas integradas diretamente aos fundos dos lotes, permitindo acesso equestre completo.",
      color: "bg-[#8C4A14] text-[#F7F4EB]"
    }
  ];

  return (
    <section id="diferenciais" className="py-20 md:py-28 bg-gradient-champagne relative">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Title */}
        <div className="text-center max-w-2xl mx-auto space-y-4">
          <p className="text-[#8C4A14] font-bold text-sm tracking-wider uppercase">Diferenciais e Lazer</p>
          <h2 className="text-3xl md:text-5xl font-bold font-display text-[#162521]">
            A Grandeza de um Projeto Hípico Sem Precedentes
          </h2>
          <p className="text-[#162521]/80 text-base md:text-lg">
            Muito além de um condomínio de lazer, uma obra-prima de infraestrutura rurubana assinada pela BrDU Urbanismo e JFG Incorporadora.
          </p>
          <div className="w-16 h-[2px] bg-[#8C4A14] mx-auto mt-6" />
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-16">
          {diffs.map((diff, index) => (
            <div
              key={index}
              className="bg-white rounded-3xl p-8 border border-[#8C4A14]/15 hover:border-[#8C4A14]/40 hover:shadow-2xl hover:scale-[1.01] transition-all flex flex-col md:flex-row gap-6 items-start shadow-sm"
            >
              {/* Icon Container */}
              <div className={
                index % 2 === 0
                  ? "p-4 rounded-2xl flex-shrink-0 flex items-center justify-center bg-[#1E352F] text-[#F7F4EB]"
                  : "p-4 rounded-2xl flex-shrink-0 flex items-center justify-center bg-[#8C4A14] text-[#F7F4EB]"
              }>
                <diff.icon size={28} />
              </div>
              
              {/* Text */}
              <div className="text-left space-y-2">
                <h3 className="text-xl font-bold text-[#162521] font-display">
                  {diff.title}
                </h3>
                <p className="text-[#162521]/80 leading-relaxed text-sm md:text-base">
                  {diff.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Amenities;
