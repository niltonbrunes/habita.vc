"use client";
import { MapPin, Clock, TrendingUp, ShoppingBag } from "lucide-react";
import CTAButton from "./CTAButton";

const highlights = [
  { icon: MapPin, title: "Localização Premium", desc: "Rua C-252, Nova Suíça — a poucos minutos do Parque Vaca Brava e Av. T-63" },
  { icon: ShoppingBag, title: "Tudo por Perto", desc: "Cercado por escolas, supermercados, restaurantes e o Goiânia Shopping" },
  { icon: TrendingUp, title: "Valorização Garantida", desc: "Região com valorização de até 100% — imóveis da Dinâmica como Muy Bueno foram de R$ 4.600 para R$ 9.000/m²" },
  { icon: Clock, title: "Entrega Dez/2029", desc: "Tempo ideal para planejar com calma e pagamento facilitado durante a obra" },
];

const LocationSection = () => {
  return (
    <section id="localizacao" className="py-20 md:py-28 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <p className="font-body text-sm uppercase tracking-[0.2em] text-gold mb-3">
            Localização Estratégica
          </p>
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-4">
            No coração da Nova Suíça, Goiânia
          </h2>
          <p className="font-body text-muted-foreground max-w-2xl mx-auto">
            Seu endereço próximo a tudo que faz sentido. Mobilidade, conveniência e valorização.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {highlights.map((h) => (
            <div key={h.title} className="flex gap-4 items-start p-6 rounded-xl bg-card shadow-card">
              <div className="w-12 h-12 rounded-lg bg-gold/10 flex items-center justify-center shrink-0">
                <h.icon className="h-6 w-6 text-gold" />
              </div>
              <div>
                <h3 className="font-heading text-lg font-semibold text-foreground mb-1">{h.title}</h3>
                <p className="font-body text-sm text-muted-foreground leading-relaxed">{h.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="rounded-2xl overflow-hidden shadow-elevated">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m17!1m12!1m3!1d3821.5!2d-49.2765186!3d-16.7173281!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m2!1m1!1s0x0%3A0x0!5e0!3m2!1spt-BR!2sbr!4v1"
            width="100%"
            height="400"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Localização Fusion Dinâmica Home - Rua C-252, Nova Suíça, Goiânia"
          />
        </div>

        <div className="text-center mt-10">
          <CTAButton
            text="Agendar atendimento"
            message="Olá! Gostaria de agendar um atendimento para conhecer o Fusion Dinâmica Home."
            variant="primary"
          />
        </div>
      </div>
    </section>
  );
};

export default LocationSection;
