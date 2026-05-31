"use client";
const interiorImg = "/fusion-dinamica/interior.jpg";
import CTAButton from "./CTAButton";

const AboutSection = () => {
  return (
    <section id="sobre" className="py-20 md:py-28 bg-background">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-12 lg:gap-20 items-center">
          <div>
            <p className="font-body text-sm uppercase tracking-[0.2em] text-gold mb-3">
              Sobre o Empreendimento
            </p>
            <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6 leading-tight">
              O encontro entre <span className="text-gradient-gold">ser e estar</span>
            </h2>
            <p className="font-body text-muted-foreground leading-relaxed mb-4">
              O Fusion Dinâmica Home é mais do que um empreendimento — é um novo conceito de viver em Goiânia.
              Projetado pela renomada Dinâmica Engenharia, com mais de 40 anos de mercado e 198 obras entregues,
              cada detalhe foi pensado para oferecer praticidade, conforto e sofisticação.
            </p>
            <p className="font-body text-muted-foreground leading-relaxed mb-4">
              Com plantas inteligentes de 58 a 107 m², torre única com 176 unidades e 25 andares,
              o Fusion entrega o equilíbrio perfeito entre infraestrutura completa e qualidade de vida.
            </p>
            <p className="font-body text-muted-foreground leading-relaxed mb-8">
              Varanda com ponto para churrasqueira a gás, rede frigorígena instalada e acabamento premium —
              tudo para que você chegue em casa e encontre exatamente o que precisa.
            </p>
            <CTAButton
              text="Quero mais informações"
              message="Olá! Quero saber mais sobre o Fusion Dinâmica Home."
              variant="primary"
            />
          </div>

          <div className="relative">
            <img
              src={interiorImg}
              alt="Interior sofisticado do apartamento Fusion Dinâmica Home em Goiânia"
              loading="lazy"
              width={800}
              height={600}
              className="rounded-2xl shadow-elevated w-full object-cover"
            />
            <div className="absolute -bottom-6 -left-6 bg-card rounded-xl p-6 shadow-elevated hidden lg:block">
              <p className="font-heading text-3xl font-bold text-gold">176</p>
              <p className="font-body text-sm text-muted-foreground">Unidades exclusivas</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
