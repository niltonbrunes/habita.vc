"use client";
import { Home, Key, TrendingUp } from "lucide-react";
import { CTAButton } from "../CTAButton";

const audiences = [
  {
    icon: Key,
    title: "Saindo do aluguel",
    desc: "Pare de pagar o sonho do outro. Com R$ 1.000 de entrada e parcelas que cabem no orçamento, você começa a construir o seu patrimônio hoje.",
  },
  {
    icon: Home,
    title: "Primeiro imóvel",
    desc: "Realize a conquista do primeiro apê com segurança, ITBI e Registro grátis e um projeto moderno em região em valorização.",
  },
  {
    icon: TrendingUp,
    title: "Investidor inteligente",
    desc: "Localização estratégica no Jardim Luz, alta demanda por locação e potencial real de valorização. Um ativo para a sua carteira.",
  },
];

export const ForWhom = () => {
  return (
    <section id="para-quem" className="bg-gradient-warm py-20 sm:py-28">
      <div className="container">
        <div className="mx-auto max-w-2xl text-center animate-fade-up">
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-primary">Para quem é</span>
          <h2 className="mt-3 font-display text-3xl font-bold text-foreground text-balance sm:text-4xl md:text-5xl">
            Feito para o seu próximo passo
          </h2>
        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {audiences.map((a) => (
            <div
              key={a.title}
              className="relative rounded-3xl border border-border bg-card p-8 shadow-soft transition-smooth hover:-translate-y-1 hover:shadow-elegant"
            >
              <div className="mb-5 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-accent text-accent-foreground">
                <a.icon className="h-7 w-7" strokeWidth={2} />
              </div>
              <h3 className="font-display text-xl font-bold text-card-foreground">{a.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{a.desc}</p>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <CTAButton size="lg" message="Olá! Quero entender se o UP Buriti é ideal para o meu perfil.">
            Falar com consultor agora
          </CTAButton>
        </div>
      </div>
    </section>
  );
};
