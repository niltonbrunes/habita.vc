"use client";
import { Home, Ruler, Car, Users } from "lucide-react";

const typologies = [
  {
    area: "63m²",
    quartos: "2 Quartos · 1 Suíte",
    vagas: "1 Vaga",
    destaque: "Ideal para casais",
    icon: Home,
  },
  {
    area: "74 a 88m²",
    quartos: "2 Suítes Plenas",
    vagas: "2 Vagas",
    destaque: "Mais procurado",
    featured: true,
    icon: Ruler,
  },
  {
    area: "112 a 122m²",
    quartos: "3 Suítes Plenas",
    vagas: "3 a 4 Vagas",
    destaque: "Máximo conforto",
    icon: Users,
  },
];

const WHATSAPP_URL = "https://wa.me/5562993076768?text=Ol%C3%A1!%20Gostaria%20de%20saber%20mais%20sobre%20as%20plantas%20do%20BIOMA%20Wellness%20Life!";

const TypologiesSection = () => {
  return (
    <section className="bg-earth-cream py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-16 text-center">
          <p className="mb-3 font-body text-sm font-semibold uppercase tracking-[0.2em] text-wellness">
            Tipologias
          </p>
          <h2 className="mb-4 font-display text-4xl font-bold text-foreground md:text-5xl">
            Plantas inteligentes para cada estilo de vida
          </h2>
          <p className="mx-auto max-w-2xl font-body text-lg text-muted-foreground">
            De 63 a 122 m² — todos com varanda, cozinha integrada e acabamento premium.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {typologies.map((t, i) => (
            <div
              key={i}
              className={`relative overflow-hidden rounded-2xl p-8 transition-all hover:-translate-y-2 hover:shadow-elevated ${
                t.featured
                  ? "bg-gradient-wellness text-primary-foreground shadow-elevated"
                  : "bg-card shadow-card"
              }`}
            >
              {t.featured && (
                <span className="absolute right-4 top-4 rounded-full bg-primary-foreground/20 px-3 py-1 font-body text-xs font-semibold">
                  ★ {t.destaque}
                </span>
              )}
              <div className={`mb-4 inline-flex rounded-xl p-3 ${t.featured ? 'bg-primary-foreground/20' : 'bg-primary/10'}`}>
                <t.icon className={`h-7 w-7 ${t.featured ? 'text-primary-foreground' : 'text-primary'}`} />
              </div>
              <h3 className="mb-1 font-display text-4xl font-bold">{t.area}</h3>
              <p className={`mb-1 font-body text-base font-medium ${t.featured ? '' : 'text-foreground'}`}>{t.quartos}</p>
              <p className={`mb-6 font-body text-sm ${t.featured ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>
                <Car className="mr-1 inline h-4 w-4" /> {t.vagas}
              </p>
              {!t.featured && (
                <p className="mb-4 rounded-full bg-muted px-3 py-1 text-center font-body text-xs font-medium text-muted-foreground">
                  {t.destaque}
                </p>
              )}
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className={`mt-2 block rounded-lg py-3 text-center font-body text-sm font-semibold transition-all hover:scale-[1.02] ${
                  t.featured
                    ? "bg-primary-foreground text-primary"
                    : "bg-gradient-wellness text-primary-foreground"
                }`}
              >
                Quero receber informações
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TypologiesSection;
