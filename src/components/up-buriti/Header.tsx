"use client";
import { useEffect, useState } from "react";
import { MessageCircle, Menu, X } from "lucide-react";
import { WHATSAPP_URL } from "@/lib/contact";

const links = [
  { href: "#empreendimento", label: "Empreendimento" },
  { href: "#galeria", label: "Galeria" },
  { href: "#condicao", label: "Condição" },
  { href: "#localizacao", label: "Localização" },
  { href: "#faq", label: "Dúvidas" },
];

export const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-40 transition-smooth ${
        scrolled
          ? "bg-background/85 backdrop-blur-lg shadow-soft"
          : "bg-transparent"
      }`}
    >
      <div className="container flex h-16 items-center justify-between sm:h-18">
        <a
          href="#inicio"
          className={`font-display text-xl font-extrabold tracking-tight sm:text-2xl ${
            scrolled ? "text-foreground" : "text-white"
          }`}
        >
          UP <span className="text-primary">Buriti</span>
        </a>

        <nav className="hidden items-center gap-7 lg:flex">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className={`text-sm font-medium transition-smooth hover:text-primary ${
                scrolled ? "text-foreground/80" : "text-white/90"
              }`}
            >
              {l.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden items-center gap-2 rounded-full bg-whatsapp px-4 py-2 text-sm font-semibold text-whatsapp-foreground transition-smooth hover:brightness-110 sm:inline-flex"
          >
            <MessageCircle className="h-4 w-4" />
            WhatsApp
          </a>
          <button
            type="button"
            aria-label="Abrir menu"
            onClick={() => setOpen((v) => !v)}
            className={`inline-flex h-10 w-10 items-center justify-center rounded-full lg:hidden ${
              scrolled ? "text-foreground" : "text-white"
            }`}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="lg:hidden">
          <div className="mx-3 mb-3 rounded-2xl border border-border bg-card p-4 shadow-elegant animate-fade-in">
            <nav className="flex flex-col">
              {links.map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="rounded-lg px-3 py-3 text-sm font-medium text-card-foreground hover:bg-muted"
                >
                  {l.label}
                </a>
              ))}
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 inline-flex items-center justify-center gap-2 rounded-full bg-whatsapp px-4 py-3 text-sm font-semibold text-whatsapp-foreground"
              >
                <MessageCircle className="h-4 w-4" /> Falar no WhatsApp
              </a>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
};
