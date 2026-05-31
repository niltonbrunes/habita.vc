"use client";
import { MessageCircle, MapPin } from "lucide-react";
import { WHATSAPP_URL } from "@/lib/contact";

export const Footer = () => {
  return (
    <footer className="border-t border-border bg-foreground py-12 text-background/80">
      <div className="container">
        <div className="grid gap-8 md:grid-cols-3">
          <div>
            <div className="font-display text-2xl font-extrabold text-background">UP Buriti</div>
            <p className="mt-2 text-sm text-background/70">
              Apartamentos modernos e funcionais com a melhor condição de entrada da região.
            </p>
          </div>

          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-background">Localização</h3>
            <p className="mt-3 inline-flex items-start gap-2 text-sm text-background/75">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
              Jardim Luz — Aparecida de Goiânia / GO
            </p>
          </div>

          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-background">Contato</h3>
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-flex items-center gap-2 rounded-full bg-whatsapp px-5 py-2.5 text-sm font-semibold text-whatsapp-foreground transition-smooth hover:brightness-110"
            >
              <MessageCircle className="h-4 w-4" />
              (62) 99307-6768
            </a>
          </div>
        </div>

        <div className="mt-10 border-t border-background/10 pt-6 text-center text-xs text-background/55">
          © {new Date().getFullYear()} UP Buriti. Todos os direitos reservados. Imagens meramente ilustrativas.
        </div>
      </div>
    </footer>
  );
};
