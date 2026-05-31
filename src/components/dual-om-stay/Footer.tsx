"use client";
const scrollToSection = (id: string) => {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
};

export const Footer = () => {
  return (
    <footer className="border-t border-border bg-card px-4 py-12 md:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-8 md:grid-cols-3">
          {/* Brand */}
          <div>
            <h3 className="font-display text-xl font-bold text-foreground">
              Dual O.M <span className="text-gradient-gold">Stay</span>
            </h3>
            <p className="mt-3 font-body text-sm text-muted-foreground leading-relaxed">
              Studios e apartamentos no Setor Marista, Goiânia. O novo conceito de moradia inteligente e investimento seguro.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-body text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-4">
              Navegação
            </h4>
            <nav className="space-y-2">
              {[
                { label: "O Empreendimento", id: "sobre" },
                { label: "Localização", id: "localizacao" },
                { label: "Tipologias", id: "tipologias" },
                { label: "Investimento", id: "investimento" },
                { label: "Contato", id: "contato" },
              ].map((link) => (
                <button
                  key={link.id}
                  onClick={() => scrollToSection(link.id)}
                  className="block font-body text-sm text-secondary-foreground hover:text-primary transition-colors"
                >
                  {link.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-body text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-4">
              Contato
            </h4>
            <div className="space-y-2 font-body text-sm text-secondary-foreground">
              <p>Rua 1130, Setor Marista</p>
              <p>Goiânia – GO</p>
              <a
                href="https://wa.me/5562993076768"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block text-primary hover:underline mt-2"
              >
                WhatsApp: (62) 99307-6768
              </a>
            </div>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-border text-center">
          <p className="font-body text-xs text-muted-foreground">
            © {new Date().getFullYear()} Dual O.M Stay · O.M Incorporadora. Imagens meramente ilustrativas.
          </p>
        </div>
      </div>
    </footer>
  );
};
