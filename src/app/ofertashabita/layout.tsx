import React from 'react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Ofertas Exclusivas | Habita.vc",
  description: "Encontre as melhores oportunidades imobiliárias antes de todo mundo.",
};

export default function OfertasLayout({ children }: { children: React.ReactNode }) {
  // We use a clean layout without the main Navbar/Footer to keep the user focused
  return (
    <div className="min-h-screen bg-background selection:bg-accent/20">
      {children}
    </div>
  );
}
