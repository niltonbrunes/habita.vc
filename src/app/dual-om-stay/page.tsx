export const metadata = {
  title: "Dual Om Stay | Habita.vc",
};

import { Navbar } from "@/components/dual-om-stay/Navbar";
import { HeroSection } from "@/components/dual-om-stay/HeroSection";
import { AboutSection } from "@/components/dual-om-stay/AboutSection";
import { LocationSection } from "@/components/dual-om-stay/LocationSection";
import { TypologiesSection } from "@/components/dual-om-stay/TypologiesSection";
import { AmenitiesSection } from "@/components/dual-om-stay/AmenitiesSection";
import { InvestorsSection } from "@/components/dual-om-stay/InvestorsSection";
import { GallerySection } from "@/components/dual-om-stay/GallerySection";
import { ContactForm } from "@/components/dual-om-stay/ContactForm";
import { Footer } from "@/components/dual-om-stay/Footer";

const Index = () => {
  return (
    <div className="theme-dual-om-stay antialiased">
      <main>
      <Navbar />
      <HeroSection />
      <AboutSection />
      <LocationSection />
      <TypologiesSection />
      <AmenitiesSection />
      <InvestorsSection />
      <GallerySection />
      <ContactForm />
      <Footer />
    </main>
    </div>
  );
};

export default function Page() {
  return <Index />;
}

