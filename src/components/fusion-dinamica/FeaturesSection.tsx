"use client";
import {
  Building2, ShieldCheck, Dumbbell, Car, Waves, TreePine,
  Utensils, Baby, Dog, Bike, Package, Snowflake
} from "lucide-react";

const features = [
  { icon: Building2, title: "Torre Única", desc: "25 andares com apenas 176 unidades" },
  { icon: Maximize, title: "58 a 107 m²", desc: "Plantas inteligentes e funcionais" },
  { icon: Waves, title: "Piscina Aquecida", desc: "Fusion Pool com 57 m²" },
  { icon: Dumbbell, title: "Academia 134 m²", desc: "Equipamentos profissionais" },
  { icon: Dog, title: "Pet Club", desc: "Primeiro Pet Club residencial de Goiânia" },
  { icon: Snowflake, title: "Recovery Zone", desc: "Banheira de gelo e sauna" },
  { icon: Utensils, title: "Espaço Gourmet", desc: "Churrasqueira e varanda gourmet" },
  { icon: Baby, title: "Brinquedoteca", desc: "Espaço seguro para os pequenos" },
  { icon: Car, title: "4 Elevadores", desc: "Acessibilidade e comodidade" },
  { icon: Bike, title: "Bicicletário", desc: "Ferramentaria e Bike Wash" },
  { icon: Package, title: "Espaço Delivery", desc: "Minimercado no condomínio" },
  { icon: ShieldCheck, title: "Acabamento Premium", desc: "Rede frigorígena instalada" },
];

import { Maximize } from "lucide-react";

const FeaturesSection = () => {
  return (
    <section id="diferenciais" className="py-20 md:py-28 bg-muted">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <p className="font-body text-sm uppercase tracking-[0.2em] text-gold mb-3">
            Diferenciais
          </p>
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-4">
            Tudo que o mercado mais busca hoje
          </h2>
          <p className="font-body text-muted-foreground max-w-2xl mx-auto">
            Ambientes bem distribuídos, estrutura moderna e áreas de lazer pensadas para o seu ritmo.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {features.map((feat, i) => (
            <div
              key={feat.title}
              className="bg-card rounded-xl p-6 shadow-card hover:shadow-elevated transition-all duration-300 hover:-translate-y-1 group"
            >
              <div className="w-12 h-12 rounded-lg bg-gold/10 flex items-center justify-center mb-4 group-hover:bg-gradient-gold group-hover:text-primary-foreground transition-colors">
                <feat.icon className="h-6 w-6 text-gold group-hover:text-primary-foreground" />
              </div>
              <h3 className="font-heading text-lg font-semibold text-foreground mb-1">{feat.title}</h3>
              <p className="font-body text-sm text-muted-foreground">{feat.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
