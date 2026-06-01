"use client";
import React, { useState, useEffect } from "react";
import { LeadCaptureWrapper } from "@/components/crmhabita/LeadCaptureWrapper";
import { Menu, X } from "lucide-react";

const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { label: "Manifesto", href: "#manifesto" },
    { label: "Diferenciais", href: "#diferenciais" },
    { label: "Localização", href: "#localizacao" },
    { label: "Dúvidas", href: "#faq" },
  ];

  return (
    <header
      className={
        scrolled
          ? "fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-[#F7F4EB]/90 backdrop-blur-md shadow-md py-4 border-b border-[#8C4A14]/10"
          : "fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-transparent py-6"
      }
    >
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        {/* Logo */}
        <a href="#" className="flex items-center gap-2">
          <img
            src="https://fazendavillagio.com.br/wp-content/uploads/2026/03/LOGO-FAZENDA.png"
            alt="Fazenda Villagio Logo"
            className="h-10 md:h-12 w-auto object-contain transition-all"
          />
        </a>

        {/* Desktop Menu */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className={
                scrolled
                  ? "font-medium transition-colors hover:text-[#8C4A14] text-[#162521]"
                  : "font-medium transition-colors hover:text-[#8C4A14] text-white text-shadow-sm"
              }
            >
              {link.label}
            </a>
          ))}
          
          <LeadCaptureWrapper
            source="Navbar Fazenda Villagio"
            whatsappMsg="Olá! Gostaria de fazer minha pré-reserva e falar com um corretor sobre os lotes da Fazenda Villagio."
          >
            <span className="bg-[#8C4A14] hover:bg-[#723a10] text-[#F7F4EB] font-semibold px-6 py-3 rounded-full shadow-lg transition-transform hover:scale-105 inline-block text-center text-sm cursor-pointer">
              Garanta seu Lote
            </span>
          </LeadCaptureWrapper>
        </nav>

        {/* Mobile Toggle */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className={
            scrolled || mobileMenuOpen
              ? "md:hidden p-2 rounded-lg transition-colors text-[#162521]"
              : "md:hidden p-2 rounded-lg transition-colors text-white"
          }
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-[#F7F4EB] shadow-xl border-t border-[#8C4A14]/10 p-6 flex flex-col gap-4 animate-in slide-in-from-top duration-300">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className="text-[#162521] font-medium py-2 border-b border-slate-100 hover:text-[#8C4A14] transition-colors"
            >
              {link.label}
            </a>
          ))}
          <LeadCaptureWrapper
            source="Navbar Mobile Fazenda Villagio"
            whatsappMsg="Olá! Gostaria de fazer minha pré-reserva e falar com um corretor sobre os lotes da Fazenda Villagio."
          >
            <span className="w-full text-center bg-[#8C4A14] hover:bg-[#723a10] text-[#F7F4EB] font-semibold px-6 py-4 rounded-xl shadow-md transition-all inline-block mt-2">
              Fazer Pré-Reserva
            </span>
          </LeadCaptureWrapper>
        </div>
      )}
    </header>
  );
};

export default Header;
