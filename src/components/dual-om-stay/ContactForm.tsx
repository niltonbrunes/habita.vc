"use client";
import { useState } from "react";
import { AnimatedSection } from "./AnimatedSection";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";
const fachadaNoiteImg = "/dual-om-stay/fachada-noite.jpg";

export const ContactForm = () => {
  const [formData, setFormData] = useState({
    nome: "",
    telefone: "",
    email: "",
    perfil: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.nome.trim() || !formData.telefone.trim()) {
      toast.error("Por favor, preencha nome e telefone.");
      return;
    }

    setLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke("send-lead-email", {
        body: formData,
      });

      if (error) throw error;

      setSubmitted(true);
      toast.success("Interesse registrado com sucesso!");
    } catch (err) {
      console.error("Erro ao enviar lead:", err);
      toast.error("Erro ao enviar. Tente novamente ou entre em contato pelo WhatsApp.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contato" className="section-padding bg-background relative overflow-hidden">
      {/* Background image */}
      <div className="absolute inset-0 opacity-[0.07]">
        <img src={fachadaNoiteImg} alt="" className="w-full h-full object-cover" aria-hidden="true" />
      </div>

      <div className="container-narrow relative z-10">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-start">
          {/* Text */}
          <AnimatedSection>
            <div>
              <span className="font-body text-xs font-semibold uppercase tracking-[0.2em] text-primary mb-3 block">
                Fale Conosco
              </span>
              <h2 className="font-display text-3xl font-bold md:text-4xl text-foreground text-balance">
                Receba informações <span className="text-gradient-gold">exclusivas</span>
              </h2>
              <p className="mt-6 font-body text-base leading-relaxed text-muted-foreground md:text-lg">
                Preencha o formulário e um especialista entrará em contato com tabela de preços atualizada, plantas detalhadas e condições de pagamento.
              </p>

              <div className="mt-8 space-y-4">
                <div className="flex items-center gap-3 font-body text-sm text-secondary-foreground">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                    <svg className="h-4 w-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </span>
                  Tabela de preços e disponibilidade atualizada
                </div>
                <div className="flex items-center gap-3 font-body text-sm text-secondary-foreground">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                    <svg className="h-4 w-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </span>
                  Plantas detalhadas de todas as tipologias
                </div>
                <div className="flex items-center gap-3 font-body text-sm text-secondary-foreground">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                    <svg className="h-4 w-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </span>
                  Condições especiais de lançamento
                </div>
                <div className="flex items-center gap-3 font-body text-sm text-secondary-foreground">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                    <svg className="h-4 w-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </span>
                  Simulação de rentabilidade para investidores
                </div>
              </div>

              {/* WhatsApp CTA */}
              <a
                href="https://wa.me/5562993076768?text=Olá, gostaria de receber informações sobre o Dual O.M Stay."
                target="_blank"
                rel="noopener noreferrer"
                className="mt-8 inline-flex items-center gap-2 font-body text-sm font-semibold text-primary hover:underline"
              >
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                Ou fale diretamente pelo WhatsApp
              </a>
            </div>
          </AnimatedSection>

          {/* Form */}
          <AnimatedSection delay={0.15}>
            <div className="rounded-sm border border-border bg-card p-6 md:p-8">
              {submitted ? (
                <div className="text-center py-12">
                  <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                    <svg className="h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h3 className="font-display text-2xl font-bold text-foreground">Obrigado pelo interesse!</h3>
                  <p className="mt-3 font-body text-sm text-muted-foreground">
                    Em breve um especialista entrará em contato com você com todas as informações sobre o Dual O.M Stay.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label htmlFor="nome" className="block font-body text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                      Nome *
                    </label>
                    <input
                      type="text"
                      id="nome"
                      value={formData.nome}
                      onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                      className="w-full rounded-sm border border-border bg-background px-4 py-3 font-body text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-colors"
                      placeholder="Seu nome completo"
                      maxLength={100}
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="telefone" className="block font-body text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                      Telefone / WhatsApp *
                    </label>
                    <input
                      type="tel"
                      id="telefone"
                      value={formData.telefone}
                      onChange={(e) => setFormData({ ...formData, telefone: e.target.value })}
                      className="w-full rounded-sm border border-border bg-background px-4 py-3 font-body text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-colors"
                      placeholder="(62) 99999-9999"
                      maxLength={20}
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block font-body text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                      E-mail
                    </label>
                    <input
                      type="email"
                      id="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full rounded-sm border border-border bg-background px-4 py-3 font-body text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-colors"
                      placeholder="seu@email.com"
                      maxLength={255}
                    />
                  </div>

                  <div>
                    <label className="block font-body text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
                      Perfil de Interesse
                    </label>
                    <div className="flex gap-3">
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, perfil: "moradia" })}
                        className={`flex-1 rounded-sm border px-4 py-2.5 font-body text-sm font-medium transition-all ${
                          formData.perfil === "moradia"
                            ? "border-primary bg-primary/10 text-primary"
                            : "border-border text-muted-foreground hover:border-primary/50"
                        }`}
                      >
                        Moradia
                      </button>
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, perfil: "investimento" })}
                        className={`flex-1 rounded-sm border px-4 py-2.5 font-body text-sm font-medium transition-all ${
                          formData.perfil === "investimento"
                            ? "border-primary bg-primary/10 text-primary"
                            : "border-border text-muted-foreground hover:border-primary/50"
                        }`}
                      >
                        Investimento
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gradient-gold px-8 py-4 font-body text-sm font-semibold uppercase tracking-wider text-primary-foreground rounded-sm shadow-gold transition-all hover:brightness-110 disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {loading ? "Enviando..." : "Quero saber valores e condições"}
                  </button>

                  <p className="text-center font-body text-[11px] text-muted-foreground">
                    Seus dados estão seguros. Não compartilhamos suas informações.
                  </p>
                </form>
              )}
            </div>
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
};
