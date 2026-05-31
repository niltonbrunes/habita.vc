"use client";
import {
  Droplets, Zap, Lock, Wind, TreePine, BatteryCharging,
} from "lucide-react";

const differentials = [
  {
    category: "Sustentabilidade",
    icon: TreePine,
    items: [
      "Fachada biofílica com jardim vertical",
      "Irrigação automatizada nos jardins",
      "Medição individualizada de água e energia",
      "Lâmpadas de baixo consumo nas áreas comuns",
      "Vaga verde para carregamento de carro elétrico",
      "Sanitários com descarga de duplo acionamento",
    ],
  },
  {
    category: "Tecnologia & Segurança",
    icon: Lock,
    items: [
      "Fechadura eletrônica em todas as unidades",
      "Controle de acesso eletrônico",
      "3 pulmões de segurança independentes",
      "Guarita com vidro de segurança",
      "Port Cochere no acesso de veículos",
      "Infraestrutura Wi-Fi nas áreas comuns",
    ],
  },
  {
    category: "Conforto Ambiental",
    icon: Wind,
    items: [
      "Consultoria especializada de acústica",
      "Ventilação natural em áreas de lazer",
      "Veneziana integrada nos quartos",
      "Rede frigorígena para ar-condicionado",
      "Persiana automatizada na suíte master (3 suítes)",
      "Piso nivelado varanda-sala",
    ],
  },
];

const DifferentialsSection = () => {
  return (
    <section id="diferenciais" className="bg-gradient-section py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-16 text-center">
          <p className="mb-3 font-body text-sm font-semibold uppercase tracking-[0.2em] text-wellness">
            Diferenciais do Projeto
          </p>
          <h2 className="mb-4 font-display text-4xl font-bold text-foreground md:text-5xl">
            Diferenciais de um morar wellness
          </h2>
          <p className="mx-auto max-w-2xl font-body text-lg text-muted-foreground">
            Cada detalhe foi pensado para oferecer sustentabilidade, tecnologia e conforto em harmonia.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {differentials.map((group, i) => (
            <div key={i} className="rounded-2xl bg-card p-8 shadow-card">
              <div className="mb-4 inline-flex rounded-xl bg-primary/10 p-3">
                <group.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mb-5 font-display text-2xl font-bold text-foreground">
                {group.category}
              </h3>
              <ul className="space-y-3">
                {group.items.map((item, j) => (
                  <li key={j} className="flex items-start gap-2.5">
                    <span className="mt-2 flex h-1.5 w-1.5 flex-shrink-0 rounded-full bg-primary" />
                    <span className="font-body text-sm leading-relaxed text-muted-foreground">
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default DifferentialsSection;
