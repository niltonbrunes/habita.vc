"use client";
import { Phone, MessageCircle, MapPin } from "lucide-react";
import CTAButton from "./CTAButton";

const FooterSection = () => {
  return (
    <footer className="bg-gradient-dark py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-secondary-foreground mb-4">
            As melhores unidades <span className="text-gradient-gold">saem primeiro</span>
          </h2>
          <p className="font-body text-secondary-foreground/70 max-w-xl mx-auto mb-8">
            Não perca tempo. Fale diretamente com nosso consultor e garanta as melhores condições de lançamento.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <CTAButton
              text="Quero mais informações"
              message="Olá! Quero saber mais sobre o Fusion Dinâmica Home."
              variant="whatsapp"
            />
            <CTAButton
              text="Receber tabela de preços"
              message="Olá! Gostaria de receber a tabela de preços do Fusion Dinâmica Home."
              variant="primary"
            />
          </div>
        </div>

        <div className="border-t border-secondary-foreground/10 pt-8 mt-8">
          <div className="grid md:grid-cols-3 gap-8 text-center md:text-left">
            <div>
              <h3 className="font-heading text-xl font-bold text-secondary-foreground mb-2">
                Fusion Dinâmica Home
              </h3>
              <p className="font-body text-sm text-secondary-foreground/60">
                Lançamento imobiliário em Goiânia pela Dinâmica Engenharia.
              </p>
            </div>
            <div>
              <h4 className="font-body text-sm font-semibold text-secondary-foreground mb-3">Consultor</h4>
              <p className="font-body text-sm text-secondary-foreground/70 mb-1">Frederico Brunes</p>
              <a
                href="https://wa.me/5562993076768"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 font-body text-sm text-gold hover:text-gold-light transition-colors justify-center md:justify-start"
              >
                <Phone className="h-4 w-4" />
                (62) 99307-6768
              </a>
            </div>
            <div>
              <h4 className="font-body text-sm font-semibold text-secondary-foreground mb-3">Endereço</h4>
              <p className="flex items-start gap-2 font-body text-sm text-secondary-foreground/70 justify-center md:justify-start">
                <MapPin className="h-4 w-4 shrink-0 mt-0.5" />
                Rua C-252, Nova Suíça, Goiânia – GO
              </p>
            </div>
          </div>

          <div className="text-center mt-8 pt-6 border-t border-secondary-foreground/10">
            <p className="font-body text-xs text-secondary-foreground/40">
              © {new Date().getFullYear()} Fusion Dinâmica Home. Imagens meramente ilustrativas.
              Informações sujeitas a alterações sem aviso prévio.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default FooterSection;
