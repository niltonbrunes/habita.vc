"use client";
import { User, Briefcase, Heart } from "lucide-react";
import CTAButton from "./CTAButton";

const profiles = [
  {
    icon: User,
    title: "Jovens Casais",
    desc: "Plantas compactas e funcionais a partir de 58 m², perfeitas para o primeiro imóvel com todo o conforto.",
  },
  {
    icon: Heart,
    title: "Famílias",
    desc: "Opções de até 107 m² com 3 suítes, área de lazer completa e segurança para crianças e pets.",
  },
  {
    icon: Briefcase,
    title: "Investidores",
    desc: "Região com valorização de até 100% até a entrega das chaves. Oportunidade segura no lançamento.",
  },
];

const TargetAudienceSection = () => {
  return (
    <section className="py-20 md:py-28 bg-gradient-dark">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <p className="font-body text-sm uppercase tracking-[0.2em] text-gold-light mb-3">
            Para Quem é Esse Imóvel
          </p>
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-secondary-foreground mb-4">
            Seja para morar ou investir
          </h2>
          <p className="font-body text-secondary-foreground/70 max-w-xl mx-auto">
            Os melhores momentos para comprar são no lançamento. Quem entende de mercado já sabe disso.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {profiles.map((p) => (
            <div key={p.title} className="text-center p-8 rounded-2xl border border-secondary-foreground/10 hover:border-gold/30 transition-colors">
              <div className="w-16 h-16 rounded-full bg-gold/10 flex items-center justify-center mx-auto mb-6">
                <p.icon className="h-8 w-8 text-gold-light" />
              </div>
              <h3 className="font-heading text-xl font-bold text-secondary-foreground mb-3">{p.title}</h3>
              <p className="font-body text-sm text-secondary-foreground/70 leading-relaxed">{p.desc}</p>
            </div>
          ))}
        </div>

        <div className="text-center">
          <CTAButton
            text="Falar com consultor agora"
            message="Olá! Gostaria de falar com um consultor sobre o Fusion Dinâmica Home."
            variant="whatsapp"
          />
        </div>
      </div>
    </section>
  );
};

export default TargetAudienceSection;
