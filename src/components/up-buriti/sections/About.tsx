"use client";
import { Building2, ShoppingBag, Bus, TreePine, ShieldCheck, Sun } from "lucide-react";

const benefits = [
  { icon: Building2, title: "Localização privilegiada", desc: "Coração do Jardim Luz, em região em plena valorização." },
  { icon: ShoppingBag, title: "Comércio na porta", desc: "Mercados, farmácias, padarias e serviços a poucos minutos a pé." },
  { icon: Bus, title: "Mobilidade urbana", desc: "Acesso rápido às principais vias de Aparecida de Goiânia." },
  { icon: TreePine, title: "Bairro residencial", desc: "Tranquilidade e qualidade de vida para morar com a família." },
  { icon: ShieldCheck, title: "Segurança e modernidade", desc: "Projeto contemporâneo com soluções inteligentes." },
  { icon: Sun, title: "Unidade nascente", desc: "Sol da manhã, mais ventilação e iluminação natural." },
];

export const About = () => {
  return (
    <section id="empreendimento" className="bg-gradient-warm py-20 sm:py-28">
      <div className="container">
        <div className="mx-auto max-w-2xl text-center animate-fade-up">
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-primary">
            O empreendimento
          </span>
          <h2 className="mt-3 font-display text-3xl font-bold text-foreground text-balance sm:text-4xl md:text-5xl">
            Morar bem no <span className="text-primary">Jardim Luz</span> nunca foi tão acessível
          </h2>
          <p className="mt-5 text-base leading-relaxed text-muted-foreground sm:text-lg">
            O UP Buriti é pensado para quem busca praticidade, valorização e o conforto de chamar um endereço estratégico de "lar". Apartamentos compactos, modernos e funcionais — com tudo o que você precisa por perto.
          </p>
        </div>

        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {benefits.map((b, i) => (
            <article
              key={b.title}
              className="group rounded-2xl border border-border bg-card p-6 shadow-soft transition-smooth hover:-translate-y-1 hover:shadow-elegant"
              style={{ animationDelay: `${i * 60}ms` }}
            >
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-primary text-primary-foreground shadow-elegant">
                <b.icon className="h-6 w-6" strokeWidth={2} />
              </div>
              <h3 className="font-display text-lg font-bold text-card-foreground">{b.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{b.desc}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};
