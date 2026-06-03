"use client";
import React from "react";
import { Shield } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-[#192723] text-[#F7F4EB]/70 py-16 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-12 gap-12 text-left">
        {/* Brand Description */}
        <div className="md:col-span-5 space-y-4">
          <img
            src="https://fazendavillagio.com.br/wp-content/uploads/2026/03/LOGO-FAZENDA.png"
            alt="Fazenda Villagio Logo"
            className="h-12 w-auto object-contain bg-white/5 p-2 rounded-xl"
          />
          <p className="text-sm font-light leading-relaxed max-w-sm">
            Fazenda Villagio Condomínio Horizontal. O autêntico estilo de vida campestre e a liberdade hípica do Texas, no ponto mais promissor da GO-010, pertinho de Goiânia.
          </p>
          <p className="text-xs text-white/40">
            Razão Social: Brdu Senador Canedo 01 Ltda • CNPJ: 59.667.395/0001-23
          </p>
        </div>

        {/* Realização & Vendas */}
        <div className="md:col-span-3 space-y-4">
          <h4 className="text-[#D4AF37] font-bold text-sm tracking-wider uppercase font-display">
            Desenvolvimento
          </h4>
          <ul className="text-sm space-y-2 font-medium text-[#F7F4EB]/90">
            <li>BrDU Urbanismo</li>
            <li>JFG Incorporadora</li>
          </ul>

          <h4 className="text-[#D4AF37] font-bold text-sm tracking-wider uppercase font-display pt-2">
            Vendas e Atendimento
          </h4>
          <ul className="text-sm space-y-1 font-medium text-[#F7F4EB]/90">
            <li>Frederico Brunes</li>
            <li className="text-xs text-white/50">Consultor Imobiliário</li>
          </ul>
        </div>

        {/* Contato Direct */}
        <div className="md:col-span-4 space-y-4">
          <h4 className="text-[#D4AF37] font-bold text-sm tracking-wider uppercase font-display">
            Fale com um Curador
          </h4>
          <p className="text-sm font-light">
            Entre em contato direto pelo telefone para receber agendamento e a tabela com exclusividade:
          </p>
          <div className="text-lg font-bold text-[#F7F4EB] space-y-1">
            <p>Telefone: (62) 99307-6768</p>
            <p>WhatsApp: (62) 99307-6768</p>
          </div>
          <p className="text-xs text-white/40 flex items-center gap-1.5 pt-2">
            <Shield size={14} className="text-[#D4AF37]" />
            Seus dados estão protegidos nos termos da LGPD.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 mt-16 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-[#F7F4EB]/40">
        <p>© 2026 Fazenda Villagio Condomínio Horizontal. Todos os direitos reservados.</p>
        <div className="flex gap-6">
          <a href="/politica-de-privacidade" className="hover:text-white transition-colors underline">
            Política de Privacidade
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
