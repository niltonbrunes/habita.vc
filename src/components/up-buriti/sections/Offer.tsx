"use client";
import { Check, Clock, Gift, Sparkles } from "lucide-react";
import { CTAButton } from "../CTAButton";

const flow = [
  { label: "Sinal", value: "R$ 1.000,00" },
  { label: "60 parcelas mensais", value: "R$ 886,67" },
  { label: "2 parcelas semestrais", value: "R$ 2.500,00" },
  { label: "Parcela única", value: "R$ 5.000,00" },
  { label: "Financiamento", value: "R$ 300.800,00" },
];

export const Offer = () => {
  return (
    <section id="condicao" className="relative overflow-hidden bg-foreground py-20 text-background sm:py-28">
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 20% 20%, hsl(var(--primary)) 0px, transparent 40%), radial-gradient(circle at 80% 80%, hsl(var(--accent)) 0px, transparent 35%)",
        }}
        aria-hidden
      />
      <div className="container relative">
        <div className="mx-auto max-w-3xl text-center animate-fade-up">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-accent/15 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-accent">
            <Sparkles className="h-3.5 w-3.5" />
            Condição especial
          </div>
          <h2 className="font-display text-3xl font-bold text-balance sm:text-4xl md:text-5xl">
            Unidade 103 • <span className="text-accent">Nascente</span> • 52,2m²
          </h2>
          <p className="mt-4 text-base text-background/70 sm:text-lg">
            Uma oportunidade real de sair do aluguel — com fluxo de pagamento facilitado.
          </p>
        </div>

        <div className="mx-auto mt-12 grid max-w-5xl gap-6 lg:grid-cols-5">
          {/* Price card */}
          <div className="lg:col-span-2 rounded-3xl bg-gradient-primary p-8 shadow-elegant">
            <span className="text-xs font-semibold uppercase tracking-wider text-primary-foreground/80">
              Valor à vista
            </span>
            <div className="mt-2 font-display text-4xl font-extrabold text-primary-foreground sm:text-5xl">
              R$ 365.000
            </div>
            <div className="mt-6 space-y-3 text-primary-foreground/95">
              {[
                "ITBI + Registro GRÁTIS",
                "Entrega: Dezembro/2027",
                "Face nascente — sol da manhã",
              ].map((b) => (
                <div key={b} className="flex items-start gap-2 text-sm">
                  <Check className="mt-0.5 h-4 w-4 shrink-0" strokeWidth={3} />
                  <span className="font-medium">{b}</span>
                </div>
              ))}
            </div>
            <div className="mt-6 flex items-center gap-2 rounded-xl bg-background/10 p-3 text-xs backdrop-blur-sm">
              <Clock className="h-4 w-4 text-accent" />
              <span className="text-primary-foreground/90">
                Condição válida até <strong>30/04/2026</strong>
              </span>
            </div>
          </div>

          {/* Payment flow */}
          <div className="lg:col-span-3 rounded-3xl border border-background/10 bg-background/5 p-8 backdrop-blur-sm">
            <h3 className="font-display text-xl font-bold sm:text-2xl">Fluxo de pagamento</h3>
            <p className="mt-1 text-sm text-background/60">Tudo o que você precisa para começar.</p>

            <div className="mt-6 divide-y divide-background/10">
              {flow.map((f) => (
                <div key={f.label} className="flex items-center justify-between py-3.5">
                  <span className="text-sm text-background/85 sm:text-base">{f.label}</span>
                  <span className="font-display text-base font-bold text-accent sm:text-lg">{f.value}</span>
                </div>
              ))}
            </div>

            <div className="mt-6 flex items-center gap-3 rounded-2xl bg-accent/15 p-4">
              <Gift className="h-6 w-6 shrink-0 text-accent" />
              <div className="text-sm">
                <div className="font-bold text-background">Bônus exclusivo</div>
                <div className="text-background/75">ITBI e Registro por nossa conta — economize milhares de reais.</div>
              </div>
            </div>

            <div className="mt-6">
              <CTAButton
                size="lg"
                className="w-full sm:w-auto"
                message="Olá! Quero garantir a Unidade 103 do UP Buriti com a condição especial."
              >
                Quero essa condição
              </CTAButton>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
