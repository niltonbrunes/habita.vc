export const metadata = {
  title: "Fazenda Villagio | Condomínio Horizontal de Alto Padrão",
  description: "Seu pedaço do Texas sem perder Goiânia de vista. Condomínio de lazer hípico com centro equestre, clube privativo, lago e lotes amplos de 600 a 1400m² na GO-010.",
};

import Header from "@/components/fazenda-villagio/Header";
import Hero from "@/components/fazenda-villagio/sections/Hero";
import Manifesto from "@/components/fazenda-villagio/sections/Manifesto";
import Amenities from "@/components/fazenda-villagio/sections/Amenities";
import Gallery from "@/components/fazenda-villagio/sections/Gallery";
import Location from "@/components/fazenda-villagio/sections/Location";
import FAQ from "@/components/fazenda-villagio/sections/FAQ";
import CTASection from "@/components/fazenda-villagio/sections/CTASection";
import Footer from "@/components/fazenda-villagio/sections/Footer";
import FloatingWhatsApp from "@/components/fazenda-villagio/FloatingWhatsApp";

const Index = () => {
  return (
    <div className="theme-fazenda-villagio antialiased min-h-screen bg-[#F7F4EB] text-[#162521] selection:bg-[#8C4A14] selection:text-[#F7F4EB]">
      <Header />
      <main>
        <Hero />
        <Manifesto />
        <Amenities />
        <Gallery />
        <Location />
        <FAQ />
        <CTASection />
      </main>
      <Footer />
      <FloatingWhatsApp />
    </div>
  );
};

export default function Page() {
  return <Index />;
}
