"use client";
import { useState } from "react";
import { ChevronDown } from "lucide-react";

const faqs = [
  {
    q: "Quais são as tipologias disponíveis no BIOMA Wellness Life?",
    a: "O empreendimento oferece apartamentos de 2 quartos com 1 suíte (63m²), 2 suítes plenas (74 a 88m²) e 3 suítes plenas (112 a 122m²), com 1 a 4 vagas de garagem.",
  },
  {
    q: "Onde fica localizado o BIOMA Wellness Life?",
    a: "Na Rua Mário Bitar, 224-268, Setor Marista, Goiânia - GO. Próximo ao Shopping Bougainville, Hospital Órion e ao Promenade V3rso by Emiliano.",
  },
  {
    q: "Qual a previsão de entrega?",
    a: "A previsão de entrega é para 2030. O empreendimento está em fase de lançamento com condições especiais de pagamento.",
  },
  {
    q: "O que é o conceito wellness do empreendimento?",
    a: "O conceito wellness integra arquitetura e bem-estar em todos os espaços. Inclui complexo wellness com mais de 200m², spa, sauna, sala de massagem, academia e áreas de descompressão, além de fachada biofílica com jardim vertical.",
  },
  {
    q: "Quais são os diferenciais sustentáveis?",
    a: "Fachada biofílica, irrigação automatizada, medição individualizada de água e energia, vaga para carro elétrico, lâmpadas de baixo consumo e sanitários com descarga de duplo acionamento.",
  },
  {
    q: "O empreendimento tem lojas no térreo?",
    a: "Sim, o BIOMA Wellness possui embasamento comercial com lojas de conveniência e serviços premium, elevando a praticidade e a valorização do imóvel.",
  },
  {
    q: "Quem é a construtora?",
    a: "O BIOMA Wellness Life é um empreendimento da WV Maldi Construtora, com projeto arquitetônico da Norden^ Arquitetura, paisagismo por Gui Mesquita e interiores por Entretempos Arquitetura.",
  },
];

const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section id="faq" className="bg-earth-cream py-20 md:py-28">
      <div className="mx-auto max-w-3xl px-6">
        <div className="mb-12 text-center">
          <p className="mb-3 font-body text-sm font-semibold uppercase tracking-[0.2em] text-wellness">
            Perguntas Frequentes
          </p>
          <h2 className="font-display text-4xl font-bold text-foreground md:text-5xl">
            Tire suas dúvidas
          </h2>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <div
              key={i}
              className="overflow-hidden rounded-xl bg-card shadow-card"
            >
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
                aria-expanded={openIndex === i}
              >
                <span className="font-body text-base font-medium text-foreground">
                  {faq.q}
                </span>
                <ChevronDown
                  className={`h-5 w-5 flex-shrink-0 text-muted-foreground transition-transform ${
                    openIndex === i ? "rotate-180" : ""
                  }`}
                />
              </button>
              {openIndex === i && (
                <div className="border-t border-border px-6 pb-5 pt-4">
                  <p className="font-body text-sm leading-relaxed text-muted-foreground">
                    {faq.a}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
