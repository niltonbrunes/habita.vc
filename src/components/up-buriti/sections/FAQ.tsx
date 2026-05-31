"use client";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { CTAButton } from "../CTAButton";

const faqs = [
  {
    q: "Onde fica o UP Buriti?",
    a: "O empreendimento está localizado no Jardim Luz, em Aparecida de Goiânia/GO, com fácil acesso a comércios, escolas, hospitais e às principais vias da cidade.",
  },
  {
    q: "Qual o valor da entrada?",
    a: "A condição especial começa com sinal de apenas R$ 1.000,00, seguido por 60 parcelas mensais de R$ 886,67 — valor compatível com o que você já paga de aluguel.",
  },
  {
    q: "ITBI e Registro estão inclusos?",
    a: "Sim. Nesta condição, o ITBI e o Registro são gratuitos — uma economia de milhares de reais que normalmente sai do seu bolso.",
  },
  {
    q: "Quando é a entrega das chaves?",
    a: "A entrega está prevista para dezembro de 2027, dentro do cronograma do empreendimento.",
  },
  {
    q: "Até quando vale essa condição?",
    a: "A condição comercial é válida até 30/04/2026, ou enquanto durarem as unidades disponíveis. O ideal é garantir agora para não perder.",
  },
  {
    q: "Como faço para falar com um consultor?",
    a: "É só clicar em qualquer botão de WhatsApp da página. Em poucos minutos um especialista vai te atender e tirar todas as suas dúvidas — sem compromisso.",
  },
];

export const FAQ = () => {
  return (
    <section id="faq" className="bg-gradient-warm py-20 sm:py-28">
      <div className="container max-w-3xl">
        <div className="text-center animate-fade-up">
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-primary">Dúvidas frequentes</span>
          <h2 className="mt-3 font-display text-3xl font-bold text-foreground text-balance sm:text-4xl md:text-5xl">
            Perguntas que ajudam você a decidir
          </h2>
        </div>

        <Accordion type="single" collapsible className="mt-10 space-y-3">
          {faqs.map((f, i) => (
            <AccordionItem
              key={i}
              value={`item-${i}`}
              className="rounded-2xl border border-border bg-card px-5 shadow-soft data-[state=open]:shadow-elegant"
            >
              <AccordionTrigger className="text-left font-display text-base font-bold text-foreground hover:no-underline sm:text-lg">
                {f.q}
              </AccordionTrigger>
              <AccordionContent className="text-sm leading-relaxed text-muted-foreground sm:text-base">
                {f.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        <div className="mt-10 text-center">
          <CTAButton size="lg" message="Olá! Tenho mais perguntas sobre o UP Buriti.">
            Receber detalhes no WhatsApp
          </CTAButton>
        </div>
      </div>
    </section>
  );
};
