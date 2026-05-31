"use client";
import { motion } from "framer-motion";
const fachadaImg = "/dual-om-stay/fachada.jpg";

const scrollToContact = () => {
  document.getElementById("contato")?.scrollIntoView({ behavior: "smooth" });
};

export const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-end overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src={fachadaImg}
          alt="Fachada do empreendimento Dual O.M Stay no Setor Marista, Goiânia"
          className="h-full w-full object-cover"
          loading="eager"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-background/20" />
        <div className="absolute inset-0 bg-gradient-to-r from-background/60 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 w-full section-padding pb-12 md:pb-20">
        <div className="container-narrow">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mb-4"
          >
            <span className="inline-block rounded-sm bg-primary/10 border border-gold px-4 py-1.5 text-xs font-body font-semibold uppercase tracking-[0.2em] text-primary">
              Lançamento · Setor Marista
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="font-display text-4xl font-bold leading-[1.1] tracking-tight md:text-6xl lg:text-7xl max-w-3xl text-balance"
          >
            Dual O.M Stay
            <span className="block text-gradient-gold mt-2">Setor Marista, Goiânia</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.7 }}
            className="mt-6 max-w-xl font-body text-lg leading-relaxed text-secondary-foreground/80 md:text-xl"
          >
            Moradia inteligente e investimento seguro no endereço mais desejado de Goiânia. Studios e apartamentos de 21 a 61&nbsp;m².
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.9 }}
            className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center"
          >
            <button
              onClick={scrollToContact}
              className="bg-gradient-gold px-8 py-4 font-body text-sm font-semibold uppercase tracking-wider text-primary-foreground rounded-sm shadow-gold transition-all hover:brightness-110 hover:shadow-lg"
            >
              Receba Tabela de Preços e Disponibilidade
            </button>
            <a
              href="https://wa.me/5562993076768?text=Olá, gostaria de saber mais sobre o Dual O.M Stay."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 border border-gold rounded-sm px-8 py-4 font-body text-sm font-semibold uppercase tracking-wider text-primary transition-all hover:bg-primary/10"
            >
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
              Falar com Especialista
            </a>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 1.2 }}
            className="mt-5 font-body text-xs text-muted-foreground tracking-wide"
          >
            Atendimento personalizado · Informações oficiais · Sem compromisso
          </motion.p>
        </div>
      </div>
    </section>
  );
};
