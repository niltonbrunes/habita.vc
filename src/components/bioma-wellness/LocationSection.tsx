"use client";
const localizacaoImage = "/bioma-wellness/localizacao-bioma.jpg";
import { MapPin, ShoppingBag, Stethoscope, Utensils, Building2 } from "lucide-react";

const nearby = [
  { icon: ShoppingBag, text: "Shopping Bougainville" },
  { icon: Stethoscope, text: "Hospital Órion" },
  { icon: Utensils, text: "Polo gastronômico do Marista" },
  { icon: Building2, text: "Promenade V3rso by Emiliano" },
];

const LocationSection = () => {
  return (
    <section id="localizacao" className="bg-earth-cream py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          {/* Text */}
          <div>
            <p className="mb-3 font-body text-sm font-semibold uppercase tracking-[0.2em] text-wellness">
              Localização Estratégica
            </p>
            <h2 className="mb-6 font-display text-4xl font-bold text-foreground md:text-5xl">
              O endereço mais desejado de Goiânia
            </h2>
            <p className="mb-8 font-body text-lg leading-relaxed text-muted-foreground">
              Rua Mário Bitar, Setor Marista — uma região de perfil cosmopolita com infraestrutura 
              completa, gastronomia premium e fácil acesso às principais vias da cidade. 
              Tudo isso sem abrir mão da sensação de refúgio em meio ao ritmo urbano.
            </p>

            <div className="mb-8 flex items-start gap-3">
              <MapPin className="mt-1 h-5 w-5 flex-shrink-0 text-primary" />
              <p className="font-body text-base text-foreground">
                R. Mário Bitar, 224-268 — Setor Marista, Goiânia - GO, 74150-150
              </p>
            </div>

            <div className="space-y-4">
              <h3 className="font-display text-xl font-semibold text-foreground">No entorno</h3>
              {nearby.map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-primary/10">
                    <item.icon className="h-5 w-5 text-primary" />
                  </div>
                  <span className="font-body text-base text-foreground">{item.text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Image */}
          <div className="overflow-hidden rounded-2xl shadow-elevated">
            <img
              src={localizacaoImage}
              alt="Vista aérea do Setor Marista em Goiânia, localização do BIOMA Wellness Life"
              className="h-full w-full object-cover"
              loading="lazy"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default LocationSection;
