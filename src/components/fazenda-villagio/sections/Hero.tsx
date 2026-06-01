"use client";
import React, { useState } from "react";
import { LeadCaptureWrapper } from "@/components/crmhabita/LeadCaptureWrapper";
import { Play, Sparkles } from "lucide-react";

const Hero = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  return (
    <section className="relative min-h-screen flex items-center justify-center pt-24 pb-16 overflow-hidden">
      {/* Video Background */}
      <div className="absolute inset-0 z-0">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="w-full h-full object-cover"
          src="https://fazendavillagio.com.br/wp-content/uploads/2026/03/site-fv.mp4"
        />
        <div className="absolute inset-0 bg-[#1E352F]/70 mix-blend-multiply" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#F7F4EB] via-transparent to-black/45" />
      </div>

      {/* Hero Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Left Side: Copy */}
        <div className="lg:col-span-7 text-white text-left space-y-6 animate-in fade-in slide-in-from-left duration-700">
          <div className="inline-flex items-center gap-2 bg-[#D4AF37]/20 border border-[#D4AF37]/30 px-4 py-2 rounded-full text-xs font-semibold tracking-wider text-[#F7F4EB] uppercase backdrop-blur-sm">
            <Sparkles size={14} className="text-[#D4AF37]" />
            Lançamento Condomínio Hípico de Luxo
          </div>
          
          <h1 className="text-4xl sm:text-5xl xl:text-6xl font-extrabold text-shadow-premium text-white leading-tight font-display">
            Seu pedaço do Texas,<br />
            <span className="text-[#D4AF37]">sem perder Goiânia</span> de vista.
          </h1>
          
          <p className="text-lg md:text-xl text-[#F7F4EB]/90 font-light max-w-xl leading-relaxed">
            Um refúgio onde a liberdade equestre encontra o urbanismo inteligente. Viva no campo a apenas 18 minutos do Shopping Flamboyant.
          </p>

          {/* Quick Stats Banner */}
          <div className="bg-[#1E352F]/80 border border-white/10 p-5 rounded-2xl max-w-lg backdrop-blur-md grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-[#D4AF37] font-bold text-lg md:text-xl">GO-010</p>
              <p className="text-white/70 text-xs mt-1">Localização</p>
            </div>
            <div className="border-x border-white/10">
              <p className="text-[#D4AF37] font-bold text-lg md:text-xl">18 min</p>
              <p className="text-white/70 text-xs mt-1">do Flamboyant</p>
            </div>
            <div>
              <p className="text-[#D4AF37] font-bold text-lg md:text-xl">600m²+</p>
              <p className="text-white/70 text-xs mt-1">Lotes Amplos</p>
            </div>
          </div>
        </div>

        {/* Right Side: Lead Form Card */}
        <div className="lg:col-span-5 w-full flex justify-center lg:justify-end animate-in fade-in slide-in-from-right duration-700 delay-100">
          <div className="w-full max-w-md bg-[#25362F]/55 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl p-8 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#D4AF37]/10 rounded-full blur-2xl -z-10" />
            
            <h3 className="text-2xl font-bold font-display tracking-tight text-white mb-2 text-center lg:text-left">
              Assuma as Rédeas
            </h3>
            <p className="text-[#F7F4EB]/80 text-sm mb-6 text-center lg:text-left">
              Faça sua pré-reserva agora e garanta prioridade absoluta e tabela especial de lançamento.
            </p>

            <form
              onSubmit={(e) => {
                e.preventDefault();
              }}
              className="space-y-4"
            >
              <div>
                <input
                  required
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Seu Nome"
                  className="w-full bg-white/10 hover:bg-white/15 focus:bg-white/20 border border-white/10 focus:border-[#D4AF37] rounded-xl px-4 py-3 text-sm placeholder-white/50 focus:outline-none transition-all"
                />
              </div>

              <div>
                <input
                  required
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Seu Melhor E-mail"
                  className="w-full bg-white/10 hover:bg-white/15 focus:bg-white/20 border border-white/10 focus:border-[#D4AF37] rounded-xl px-4 py-3 text-sm placeholder-white/50 focus:outline-none transition-all"
                />
              </div>

              <div>
                <input
                  required
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="WhatsApp com DDD"
                  className="w-full bg-white/10 hover:bg-white/15 focus:bg-white/20 border border-white/10 focus:border-[#D4AF37] rounded-xl px-4 py-3 text-sm placeholder-white/50 focus:outline-none transition-all"
                />
              </div>

              <div className="flex items-start gap-2.5 text-xs text-white/70">
                <input
                  required
                  type="checkbox"
                  id="privacy"
                  className="mt-1 accent-[#D4AF37]"
                  defaultChecked
                />
                <label htmlFor="privacy" className="cursor-pointer select-none leading-relaxed">
                  Declaro que aceito receber atendimento personalizado e concordo com a política de privacidade.
                </label>
              </div>

              <LeadCaptureWrapper
                source="Hero Form Fazenda Villagio"
                whatsappMsg="Olá! Envei meus dados para a pré-reserva da Fazenda Villagio. Gostaria de informações exclusivas sobre o lançamento!"
              >
                <button
                  type="submit"
                  disabled={!name || !phone || !email}
                  className="w-full mt-2 bg-[#8C4A14] hover:bg-[#723a10] disabled:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold py-4 rounded-xl shadow-lg shadow-black/20 hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer uppercase text-xs tracking-wider"
                >
                  Fazer Pré-Reserva Agora
                </button>
              </LeadCaptureWrapper>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
