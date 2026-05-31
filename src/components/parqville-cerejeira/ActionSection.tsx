"use client";
import { motion } from "framer-motion";
import { ArrowRight } from 'lucide-react';
import { useState } from 'react';
import LeadCaptureModal from './LeadCaptureModal';

const WHATSAPP_URL = "https://wa.me/5562993076768?text=Olá,%20quero%20mais%20informações%20sobre%20o%20Cidade%20do%20Amanhã%20em%20Aparecida%20de%20Goiânia.";

const ActionSection = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  return (
    <>
  <section className="py-20 md:py-32 bg-foreground relative overflow-hidden" id="contato">
    <div className="absolute inset-0 opacity-10">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-primary blur-[120px]" />
    </div>
    <div className="relative z-10 container mx-auto px-6 text-center">
      <motion.h2
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
        className="font-display text-3xl md:text-5xl font-bold text-background mb-6"
      >
        Garanta sua oportunidade antes da próxima valorização.
      </motion.h2>
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="max-w-xl mx-auto text-background/70 text-lg font-body mb-10"
      >
        Atendimento exclusivo. Receba informações privilegiadas sobre lotes, valores e condições especiais da fase de lançamento.
      </motion.p>
      <motion.button
        onClick={() => setIsModalOpen(true)}
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="inline-flex items-center gap-3 rounded-full bg-primary px-10 py-5 text-xl font-body font-bold text-primary-foreground cta-glow transition-all hover:scale-105"
      >
        👉 Falar agora no WhatsApp
        <ArrowRight className="w-5 h-5" />
      </motion.button>
    </div>
  </section>
    <LeadCaptureModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
}

export default ActionSection;



