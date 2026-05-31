"use client";
const interiorImage = "/bioma-wellness/interior-bioma.jpg";
import { Leaf, Building2, Shield, Sparkles, MapPin, Heart } from "lucide-react";

const benefits = [
  { icon: Leaf, title: "Conceito Wellness", desc: "Arquitetura pensada para cuidar do corpo, mente e bem-estar" },
  { icon: Building2, title: "Fachada Biofílica", desc: "Jardim vertical integrado à fachada, conectando natureza e design" },
  { icon: Shield, title: "Segurança Completa", desc: "Pulmões de segurança, controle eletrônico e guarita blindada" },
  { icon: Sparkles, title: "Alto Padrão", desc: "Porcelanato 90×90, fechadura eletrônica e ar-condicionado" },
  { icon: MapPin, title: "Localização Premium", desc: "Rua Mário Bitar, Setor Marista — próximo ao Shopping Bougainville" },
  { icon: Heart, title: "Complexo Wellness 200m²", desc: "Spa, sauna, sala de massagem e áreas de descompressão" },
];

const AboutSection = () => {
  return (
    <section id="sobre" className="bg-gradient-section py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-6">
        {/* Section Header */}
        <div className="mb-16 text-center">
          <p className="mb-3 font-body text-sm font-semibold uppercase tracking-[0.2em] text-wellness">
            Sobre o Empreendimento
          </p>
          <h2 className="mb-6 font-display text-4xl font-bold text-foreground md:text-5xl lg:text-6xl">
            Sofisticado por natureza.<br />Contemporâneo por essência.
          </h2>
          <p className="mx-auto max-w-3xl font-body text-lg leading-relaxed text-muted-foreground">
            O BIOMA Wellness Life é um empreendimento concebido com o wellness como fundamento do morar. 
            Cada detalhe integra arquitetura, bem-estar e rotina urbana, criando ambientes pensados para 
            desacelerar, respirar e viver com mais equilíbrio.
          </p>
        </div>

        {/* Content Grid */}
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          {/* Image */}
          <div className="overflow-hidden rounded-2xl shadow-elevated">
            <img
              src={interiorImage}
              alt="Interior sofisticado do apartamento decorado BIOMA Wellness Life"
              className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
              loading="lazy"
            />
          </div>

          {/* Benefits Grid */}
          <div className="grid gap-6 sm:grid-cols-2">
            {benefits.map((item, i) => (
              <div
                key={i}
                className="group rounded-xl bg-card p-6 shadow-card transition-all hover:-translate-y-1 hover:shadow-elevated"
              >
                <div className="mb-3 inline-flex rounded-lg bg-primary/10 p-2.5">
                  <item.icon className="h-5 w-5 text-primary" />
                </div>
                <h3 className="mb-1.5 font-display text-lg font-semibold text-foreground">
                  {item.title}
                </h3>
                <p className="font-body text-sm leading-relaxed text-muted-foreground">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
