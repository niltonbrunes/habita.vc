"use client";
import React, { useState } from "react";
import { HelpCircle, ChevronDown, ChevronUp } from "lucide-react";

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs = [
    {
      q: "O que é o conceito 'Rurubano' do Fazenda Villagio?",
      a: "É o termo perfeito para representar o melhor de dois mundos: a tranquilidade, privacidade e lazer hípico completo de uma fazenda de alto padrão, associados à proximidade e conveniência da cidade (Goiânia), estando a apenas 18 minutos do Shopping Flamboyant."
    },
    {
      q: "Quais são as dimensões dos lotes e valor do m²?",
      a: "O Fazenda Villagio é composto por 571 lotes com tamanhos variando de 600 a 1.400 m². O projeto foi inteligentemente desenhado para que 85% dos lotes tenham uma média de 685 m² e façam fundo para as rotas dos pomares de frutas, eliminando a presença de vizinhos de muro traseiro. O valor estimado de pré-reserva é em torno de R$ 670/m²."
    },
    {
      q: "Como funcionará a estrutura do Centro Equestre?",
      a: "O condomínio contará com uma estrutura de hípica de padrão internacional completa, contendo picadeiro, baias de luxo, área de adestramento e caminhos projetados com mata nativa fechada para cavalgadas e treinos com segurança para você e seus animais."
    },
    {
      q: "Quais são as atrações de lazer no Clube Privativo?",
      a: "Os moradores terão acesso a um clube privativo de luxo completo, que inclui um lago com 40.000m² de espelho d'água para canoagem e stand-up, complexo de piscinas com borda infinita, praia artificial de areia, restaurante de alta gastronomia, quadras de tênis/beach tennis e salão de eventos premium."
    },
    {
      q: "Quem são as empresas responsáveis pelo Fazenda Villagio?",
      a: "O projeto é desenvolvido em parceria pela BrDU Urbanismo (reconhecida por grandes projetos imobiliários e urbanismo inteligente em Goiás) e a JFG Incorporadora, garantindo a solidez, entrega no prazo e o padrão de acabamento excepcional do condomínio."
    }
  ];

  return (
    <section id="faq" className="py-20 md:py-28 bg-gradient-champagne relative">
      <div className="max-w-4xl mx-auto px-6">
        
        {/* Section Header */}
        <div className="text-center space-y-4 mb-16">
          <p className="text-[#8C4A14] font-bold text-sm tracking-wider uppercase flex items-center justify-center gap-2">
            <HelpCircle size={16} />
            Perguntas Frequentes
          </p>
          <h2 className="text-3xl md:text-5xl font-bold font-display text-[#162521]">
            Dúvidas Frequentes
          </h2>
          <div className="w-16 h-[2px] bg-[#8C4A14] mx-auto mt-6" />
        </div>

        {/* FAQ Accordion */}
        <div className="space-y-4">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={index}
                className="bg-white rounded-2xl border border-[#8C4A14]/15 overflow-hidden transition-all shadow-sm"
              >
                {/* Header Toggle */}
                <button
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="w-full px-6 py-5 md:py-6 flex justify-between items-center text-left hover:bg-slate-50 transition-colors"
                >
                  <span className="font-bold text-[#162521] text-base md:text-lg font-display">
                    {faq.q}
                  </span>
                  <span className="text-[#8C4A14] p-1.5 rounded-full bg-[#8C4A14]/5">
                    {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                  </span>
                </button>

                {/* Body Content */}
                {isOpen && (
                  <div className="px-6 pb-6 pt-2 border-t border-slate-100 text-[#162521]/80 leading-relaxed text-sm md:text-base animate-in fade-in duration-300">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FAQ;
