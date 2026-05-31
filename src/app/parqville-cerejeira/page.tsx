import HeroSection from "@/components/parqville-cerejeira/HeroSection";
import ImmersionSection from "@/components/parqville-cerejeira/ImmersionSection";
import ParqvilleSection from "@/components/parqville-cerejeira/ParqvilleSection";
import DecisionSection from "@/components/parqville-cerejeira/DecisionSection";
import ActionSection from "@/components/parqville-cerejeira/ActionSection";
import WhatsAppFloat from "@/components/parqville-cerejeira/WhatsAppFloat";

export const metadata = {
  title: "Cidade do Amanh\u00e3 - Parqville Cerejeira",
  description: "O primeiro bairro planejado que integra natureza, caminhabilidade e inova\u00e7\u00e3o urbana em Aparecida de Goi\u00e2nia.",
};

export default function ParqvilleCerejeiraPage() {
  return (
    <div className="theme-parqville antialiased">
      <header>
        <HeroSection />
      </header>
      <main>
        <ImmersionSection />
        <ParqvilleSection />
        <DecisionSection />
        <ActionSection />
      </main>
      <footer className="py-8 text-center bg-slate-900">
        <p className="text-slate-400 text-sm font-body">
          &copy; 2026 Cidade do Amanh&atilde; &ndash; Aparecida de Goi&acirc;nia, GO. Todos os direitos reservados.
        </p>
      </footer>
      <WhatsAppFloat />
    </div>
  );
}
