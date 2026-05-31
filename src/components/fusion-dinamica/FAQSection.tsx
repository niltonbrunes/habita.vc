"use client";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    q: "Quais são as opções de plantas disponíveis no Fusion Dinâmica Home?",
    a: "O Fusion oferece 5 opções de plantas: apartamentos de 2 quartos (1 suíte) com 58 m² e 66 m², apartamentos de 2 suítes plenas com 76 m², e opções de 3 suítes com 84 m² e 107 m². Todas contam com acabamento premium e rede frigorígena instalada.",
  },
  {
    q: "Qual a previsão de entrega do empreendimento?",
    a: "A previsão de entrega do Fusion Dinâmica Home é dezembro de 2029. Isso permite um planejamento financeiro confortável, com pagamento facilitado durante o período de obra.",
  },
  {
    q: "Onde fica localizado o Fusion Dinâmica Home em Goiânia?",
    a: "O empreendimento está localizado na Rua C-252, Quadra 602, no Setor Nova Suíça, Goiânia-GO. Fica a poucos minutos do Parque Vaca Brava, próximo à Av. T-63 e ao Goiânia Shopping.",
  },
  {
    q: "Quais são os diferenciais de lazer do Fusion Dinâmica Home?",
    a: "São 1.495 m² de lazer incluindo: Fusion Pool (piscina aquecida de 57 m²), o primeiro Pet Club residencial de Goiânia, Recovery Zone com banheira de gelo, academia de 134 m², Pub & Karaokê, Salão de Festas de 140 m², quadra poliesportiva, playground, brinquedoteca e muito mais.",
  },
  {
    q: "Qual o valor dos apartamentos no Fusion Dinâmica Home?",
    a: "Os apartamentos têm valores a partir de R$ 582 mil para as unidades de 58 m². Para receber a tabela completa de preços e condições de pagamento atualizadas, entre em contato com nosso consultor pelo WhatsApp: (62) 99307-6768.",
  },
  {
    q: "O Fusion Dinâmica Home é um bom investimento?",
    a: "Sim! A região Nova Suíça está em plena valorização. Empreendimentos anteriores da Dinâmica Engenharia, como o Muy Bueno e o Ello Vaca Brava, valorizaram mais de 100% até a entrega das chaves. Comprar no lançamento é o momento ideal para maximizar o retorno.",
  },
  {
    q: "Quem é a construtora do Fusion Dinâmica Home?",
    a: "A Dinâmica Incorporadora e Construtora, fundada em 1983, é referência em Goiânia com 198 obras entregues, mais de 30.000 clientes satisfeitos e 1,5 milhão de m² construídos. Possui certificações de qualidade e projetos icônicos como Ello Vaca Brava e Fluence Marista.",
  },
];

const FAQSection = () => {
  return (
    <section id="faq" className="py-20 md:py-28 bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <p className="font-body text-sm uppercase tracking-[0.2em] text-gold mb-3">
              Perguntas Frequentes
            </p>
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-4">
              Tudo sobre o Fusion Dinâmica Home
            </h2>
          </div>

          <Accordion type="single" collapsible className="space-y-3">
            {faqs.map((faq, i) => (
              <AccordionItem
                key={i}
                value={`faq-${i}`}
                className="bg-card rounded-xl px-6 shadow-card border-none"
              >
                <AccordionTrigger className="font-body text-base font-medium text-foreground hover:text-gold py-5 text-left">
                  {faq.q}
                </AccordionTrigger>
                <AccordionContent className="font-body text-sm text-muted-foreground leading-relaxed pb-5">
                  {faq.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
