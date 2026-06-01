"use client";
import React from "react";
import { Quote, Sparkles } from "lucide-react";

const Manifesto = () => {
  return (
    <section id="manifesto" className="py-20 md:py-28 bg-[#F7F4EB] relative overflow-hidden">
      {/* Decorative ornaments */}
      <div className="absolute top-10 left-10 w-48 h-48 rounded-full bg-[#8C4A14]/5 blur-3xl" />
      <div className="absolute bottom-10 right-10 w-72 h-72 rounded-full bg-[#1E352F]/5 blur-3xl" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center max-w-3xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 text-[#8C4A14] font-semibold text-sm tracking-wider uppercase">
            <Sparkles size={16} />
            Manifesto Conceito
          </div>
          
          <h2 className="text-3xl md:text-4.5xl font-bold font-display text-[#162521] leading-tight">
            Entre a cidade e a fazenda, <br className="hidden sm:inline" />
            <span className="italic text-[#8C4A14] font-medium font-serif">escolha ficar.</span>
          </h2>
          
          <div className="w-16 h-[2px] bg-[#8C4A14] mx-auto mt-6" />
        </div>

        {/* Dynamic Grid: Copy and Video */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mt-16 items-center">
          {/* Left Block: The Copy */}
          <div className="lg:col-span-5 space-y-6 text-[#162521]/90 text-left text-base md:text-lg leading-relaxed">
            <div className="relative">
              <Quote className="absolute -left-6 -top-4 text-[#8C4A14]/10 h-16 w-16 -z-10" />
              <p className="font-semibold text-[#1E352F] text-xl">
                Inspiração internacional. Alto padrão BrDU.
              </p>
            </div>
            
            <p>
              O <strong>Fazenda Villagio</strong> não é apenas um condomínio horizontal. É um <strong>estado de espírito</strong>, um refúgio elegante onde a essência da liberdade hípica encontra a sofisticação da arquitetura e do urbanismo contemporâneo.
            </p>
            
            <p>
              Aqui, você e sua família viverão o autêntico <strong>lifestyle texano</strong>. Ruas arborizadas, caminhos pensados para pedestres e cavalos dentro da mata fechada preservada, garantindo total liberdade e segurança.
            </p>
            
            <p className="border-l-4 border-[#8C4A14] pl-4 italic text-[#8C4A14] font-medium">
              Rurubano: a liberdade definitiva do destino rural, combinada com a conveniência de estar a 18 minutos do Flamboyant Shopping.
            </p>
          </div>

          {/* Right Block: Styled Video Card */}
          <div className="lg:col-span-7 w-full">
            <div className="bg-[#1E352F] rounded-3xl p-3 shadow-2xl relative group overflow-hidden border border-[#8C4A14]/25">
              <div className="relative aspect-video rounded-2xl overflow-hidden bg-slate-900 shadow-inner">
                <iframe
                  className="absolute inset-0 w-full h-full object-cover"
                  src="https://www.youtube.com/embed/qUtKznk4bCA?autoplay=0&mute=0&controls=1"
                  title="Fazenda Villagio Vídeo de Conceito"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Manifesto;
