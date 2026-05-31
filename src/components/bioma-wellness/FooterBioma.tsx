"use client";
import { Phone, MapPin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-earth-dark py-12">
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex flex-col items-center gap-6 text-center md:flex-row md:justify-between md:text-left">
          <div>
            <h3 className="mb-2 font-display text-2xl font-bold text-primary-foreground">
              BIOMA Wellness Life
            </h3>
            <p className="flex items-center justify-center gap-2 font-body text-sm text-primary-foreground/60 md:justify-start">
              <MapPin className="h-4 w-4" />
              R. Mário Bitar, Setor Marista, Goiânia - GO
            </p>
          </div>

          <div className="text-center md:text-right">
            <p className="mb-1 font-body text-sm font-medium text-primary-foreground/80">
              Consultor: Frederico Brunes
            </p>
            <a
              href="https://wa.me/5562993076768"
              className="flex items-center justify-center gap-2 font-body text-sm text-primary-foreground/60 transition-colors hover:text-primary-foreground md:justify-end"
            >
              <Phone className="h-4 w-4" />
              (62) 99307-6768
            </a>
          </div>
        </div>

        <div className="mt-8 border-t border-primary-foreground/10 pt-6 text-center">
          <p className="font-body text-xs text-primary-foreground/40">
            © {new Date().getFullYear()} BIOMA Wellness Life — WV Maldi Construtora. 
            Imagens meramente ilustrativas.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
