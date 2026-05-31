"use client";
import { MapPin, Navigation, Coffee, GraduationCap, Stethoscope, ShoppingBasket } from "lucide-react";

const nearby = [
  { icon: ShoppingBasket, label: "Comércio e mercados a poucos minutos" },
  { icon: Navigation, label: "Acesso rápido a vias principais" },
  { icon: Stethoscope, label: "Hospitais e farmácias na região" },
  { icon: GraduationCap, label: "Escolas e creches próximas" },
  { icon: Coffee, label: "Padarias, restaurantes e serviços" },
  { icon: MapPin, label: "Bairro residencial em valorização" },
];

export const Location = () => {
  return (
    <section id="localizacao" className="py-20 sm:py-28">
      <div className="container">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <div className="animate-fade-up">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-primary">Localização</span>
            <h2 className="mt-3 font-display text-3xl font-bold text-foreground text-balance sm:text-4xl md:text-5xl">
              Jardim Luz — <span className="text-primary">o melhor de Aparecida de Goiânia</span> ao seu redor
            </h2>
            <p className="mt-5 text-base leading-relaxed text-muted-foreground sm:text-lg">
              Morar no Jardim Luz é viver perto de tudo: comércio forte, mobilidade fácil e um bairro residencial que combina tranquilidade com a praticidade do dia a dia urbano.
            </p>

            <ul className="mt-8 space-y-3">
              {nearby.map((n) => (
                <li key={n.label} className="flex items-center gap-3 rounded-xl bg-muted px-4 py-3">
                  <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-primary text-primary-foreground">
                    <n.icon className="h-4 w-4" />
                  </span>
                  <span className="text-sm font-medium text-foreground sm:text-base">{n.label}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="relative aspect-[4/5] overflow-hidden rounded-3xl shadow-elegant">
            <iframe
              title="Mapa do Jardim Luz, Aparecida de Goiânia"
              src="https://www.google.com/maps?q=-16.7447312,-49.2703541&z=17&output=embed"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="h-full w-full border-0"
            />
          </div>
        </div>
      </div>
    </section>
  );
};
