"use client";
import { motion } from "framer-motion";
import { TrendingUp, Clock, Shield, Star, Ruler, DollarSign, CalendarCheck, Banknote, Calculator } from "lucide-react";
import { useState } from 'react';
import LeadCaptureModal from './LeadCaptureModal';

const WHATSAPP_URL = "https://wa.me/5562993076768?text=Olá,%20quero%20mais%20informações%20sobre%20o%20Cidade%20do%20Amanhã%20em%20Aparecida%20de%20Goiânia.";

const points = [
  { icon: Clock, text: "Lançamento em fase inicial — os melhores lotes ainda estão disponíveis" },
  { icon: TrendingUp, text: "Potencial de valorização superior a bairros tradicionais da região" },
  { icon: Shield, text: "Infraestrutura completa desde o primeiro dia de obra" },
];

const simuladorData = [
  { icon: Ruler, label: "Terreno", value: "260,70 m²" },
  { icon: DollarSign, label: "Valor do m²", value: "R$ 1.250,00/m²" },
  { icon: Banknote, label: "Entrada", value: "R$ 24.440,64" },
  { icon: CalendarCheck, label: "Mensais (240×)", value: "R$ 879,67" },
  { icon: CalendarCheck, label: "Anuais (20×)", value: "R$ 19.392,19" },
  { icon: Banknote, label: "Única", value: "R$ 54.074,07" },
  { icon: Calculator, label: "Total", value: "R$ 325.875,00" },
];

const DecisionSection = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  return (
    <>
  <section className="py-20 md:py-32 bg-muted/50" id="oportunidade">
    <div className="container mx-auto px-6">
      {/* Argumentos + CTA */}
      <div className="grid lg:grid-cols-2 gap-16 items-center mb-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <span className="inline-block mb-4 text-sm font-body font-semibold uppercase tracking-widest text-warm-gold">
            Oportunidade Imobiliária em Goiás
          </span>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-6">
            Por que investir agora na Cidade do Amanhã?
          </h2>
          <div className="space-y-5 mb-8">
            {points.map((p, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="flex items-start gap-4"
              >
                <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <p.icon className="w-5 h-5 text-primary" />
                </div>
                <p className="text-foreground font-body text-lg">{p.text}</p>
              </motion.div>
            ))}
          </div>
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3 font-body font-semibold text-primary-foreground transition-all hover:scale-105 cta-glow"
          >
            Consultoria personalizada via WhatsApp
          </a>
        </motion.div>

        {/* Simulador */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="grid md:grid-cols-2 gap-6 items-stretch"
        >
          {/* Imagem */}
          <div className="relative rounded-2xl overflow-hidden card-elevated min-h-[280px]">
            <img
              src="/parqville/lote-simulador.jpg"
              alt="Vista aérea de lote no bairro planejado Cidade do Amanhã"
              className="w-full h-full object-cover absolute inset-0"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 to-transparent" />
            <div className="absolute bottom-4 left-4 right-4">
              <p className="font-display text-xl font-bold text-background">260,70 m²</p>
              <p className="text-background/80 font-body text-sm">Lote residencial</p>
            </div>
          </div>

          {/* Tabela do simulador */}
          <div className="bg-card rounded-2xl p-6 md:p-8 card-elevated flex flex-col justify-center">
            <div className="flex items-center gap-2 mb-5">
              <Calculator className="w-5 h-5 text-primary" />
              <h3 className="font-display text-xl font-bold text-foreground">
                Simulador de Investimento
              </h3>
            </div>
            <div className="space-y-4">
              {simuladorData.map((item, i) => (
                <div
                  key={i}
                  className={`flex items-center justify-between gap-3 pb-3 ${
                    i < simuladorData.length - 1 ? "border-b border-border" : ""
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <item.icon className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                    <span className="text-muted-foreground font-body text-sm">{item.label}</span>
                  </div>
                  <span
                    className={`font-body font-semibold text-right ${
                      i === simuladorData.length - 1
                        ? "text-primary text-lg"
                        : "text-foreground"
                    }`}
                  >
                    {item.value}
                  </span>
                </div>
              ))}
            </div>
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 font-body font-semibold text-primary-foreground transition-all hover:scale-105 cta-glow text-sm"
            >
              Simular meu lote via WhatsApp
            </a>
          </div>
        </motion.div>
      </div>

      {/* Depoimento */}
      <motion.article
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, delay: 0.2 }}
        className="bg-card rounded-2xl p-8 md:p-10 card-elevated max-w-3xl mx-auto"
      >
        <div className="flex items-center gap-1 mb-4">
          {[...Array(5)].map((_, i) => (
            <Star key={i} className="w-5 h-5 fill-warm-gold text-warm-gold" />
          ))}
        </div>
        <blockquote className="text-lg md:text-xl font-body text-foreground italic mb-6 leading-relaxed">
          "Quando conheci o projeto, entendi que era a oportunidade que eu esperava. Um bairro planejado com valorização real, não promessa. Já garanti meu lote na fase inicial."
        </blockquote>
        <div>
          <p className="font-display font-semibold text-foreground">Ricardo Mendes</p>
          <p className="text-sm text-muted-foreground font-body">Investidor imobiliário — Goiânia, GO</p>
        </div>
      </motion.article>
    </div>
  </section>
    <LeadCaptureModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
}

export default DecisionSection;



