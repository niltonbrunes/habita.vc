"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import LeadCaptureModal from "./LeadCaptureModal";

const HeroSection = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <img
        src="/parqville/hero-bg.jpg"
        alt="Vista a\u00e9rea do bairro planejado Cidade do Amanh\u00e3 em Aparecida de Goi\u00e2nia"
        className="absolute inset-0 w-full h-full object-cover"
        loading="eager"
      />
      <div className="absolute inset-0 hero-overlay" />
      <div className="relative z-10 container mx-auto px-6 text-center">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-4 text-sm font-body font-medium uppercase tracking-[0.3em] text-glow-green"
        >
          Novo Urbanismo em Goi\u00e1s
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="font-display text-4xl md:text-6xl lg:text-7xl font-bold leading-tight text-primary-foreground mb-6"
        >
          Cidade do Amanh\u00e3
          <span className="block text-2xl md:text-3xl lg:text-4xl font-medium mt-2 text-glow-green">
            Aparecida de Goi\u00e2nia
          </span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="max-w-2xl mx-auto text-lg md:text-xl text-primary-foreground/80 font-body mb-10"
        >
          O primeiro bairro planejado que integra natureza, caminhabilidade e inova\u00e7\u00e3o urbana. Uma nova centralidade que redefine o futuro de Aparecida de Goi\u00e2nia.
        </motion.p>
        <motion.button
          onClick={() => setIsModalOpen(true)}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="inline-flex items-center gap-3 rounded-full bg-primary px-8 py-4 text-lg font-body font-semibold text-primary-foreground cta-glow transition-all hover:scale-105"
        >
          Quero saber mais pelo WhatsApp
        </motion.button>
      </div>
      <LeadCaptureModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </section>
  );
};

export default HeroSection;

