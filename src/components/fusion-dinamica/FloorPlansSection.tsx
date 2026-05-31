"use client";
import CTAButton from "./CTAButton";
import { BedDouble, Maximize, Check } from "lucide-react";

const plans = [
  { name: "Final 06 e 07", beds: "2 Quartos (1 Suíte)", area: "58 m²", units: 44, features: ["Planta compacta e funcional", "Ideal para jovens casais", "A partir de R$ 582 mil"] },
  { name: "Final 02 e 03", beds: "2 Quartos (1 Suíte)", area: "66 m²", units: 44, features: ["Varanda com churrasqueira", "Rede frigorígena instalada", "Excelente custo-benefício"] },
  { name: "Final 04 e 05", beds: "2 Suítes Plenas", area: "76 m²", units: 44, features: ["Duas suítes completas", "Varanda com churrasqueira", "Privacidade para todos"], highlight: true },
  { name: "Final 08", beds: "3 Suítes", area: "84 m²", units: 22, features: ["3 suítes (2 americanas)", "Planta ampla e integrada", "Ideal para famílias"] },
  { name: "Final 01", beds: "3 Suítes Plenas", area: "107 m²", units: 22, features: ["Maior planta do projeto", "3 suítes plenas", "Máximo conforto e espaço"] },
];

const FloorPlansSection = () => {
  return (
    <section id="plantas" className="py-20 md:py-28 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <p className="font-body text-sm uppercase tracking-[0.2em] text-gold mb-3">
            Tipologias
          </p>
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-4">
            Plantas inteligentes para cada momento da vida
          </h2>
          <p className="font-body text-muted-foreground max-w-2xl mx-auto">
            De 58 a 107 m², todas com acabamento premium e infraestrutura de ar-condicionado.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {plans.map((p) => (
            <article
              key={p.name}
              className={`rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 ${
                p.highlight
                  ? "bg-gradient-dark text-secondary-foreground shadow-elevated ring-2 ring-gold"
                  : "bg-card shadow-card"
              }`}
            >
              {p.highlight && (
                <span className="inline-block bg-gradient-gold text-primary-foreground text-xs font-body font-semibold px-3 py-1 rounded-full mb-4">
                  Mais Procurado
                </span>
              )}
              <h3 className={`font-heading text-xl font-bold mb-2 ${p.highlight ? "text-secondary-foreground" : "text-foreground"}`}>
                {p.name}
              </h3>
              <div className="flex items-center gap-4 mb-4">
                <span className={`flex items-center gap-1 font-body text-sm ${p.highlight ? "text-gold-light" : "text-muted-foreground"}`}>
                  <BedDouble className="h-4 w-4" /> {p.beds}
                </span>
                <span className={`flex items-center gap-1 font-body text-sm ${p.highlight ? "text-gold-light" : "text-muted-foreground"}`}>
                  <Maximize className="h-4 w-4" /> {p.area}
                </span>
              </div>
              <ul className="space-y-2 mb-6">
                {p.features.map((f) => (
                  <li key={f} className={`flex items-center gap-2 font-body text-sm ${p.highlight ? "text-secondary-foreground/80" : "text-muted-foreground"}`}>
                    <Check className={`h-4 w-4 shrink-0 ${p.highlight ? "text-gold-light" : "text-gold"}`} />
                    {f}
                  </li>
                ))}
              </ul>
              <p className={`font-body text-xs mb-4 ${p.highlight ? "text-secondary-foreground/60" : "text-muted-foreground/60"}`}>
                {p.units} unidades disponíveis
              </p>
              <CTAButton
                text="Solicitar planta"
                message={`Olá! Gostaria de receber a planta do ${p.name} (${p.area}) do Fusion Dinâmica Home.`}
                variant={p.highlight ? "whatsapp" : "primary"}
                className="w-full text-sm"
              />
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FloorPlansSection;
