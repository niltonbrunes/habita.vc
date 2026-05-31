export const metadata = {
  title: "Fusion Dinamica | Habita.vc",
};

import HeroSection from "@/components/fusion-dinamica/HeroSection";
import AboutSection from "@/components/fusion-dinamica/AboutSection";
import FeaturesSection from "@/components/fusion-dinamica/FeaturesSection";
import LocationSection from "@/components/fusion-dinamica/LocationSection";
import AmenitiesSection from "@/components/fusion-dinamica/AmenitiesSection";
import FloorPlansSection from "@/components/fusion-dinamica/FloorPlansSection";
import TargetAudienceSection from "@/components/fusion-dinamica/TargetAudienceSection";
import VSLSection from "@/components/fusion-dinamica/VSLSection";
import FAQSection from "@/components/fusion-dinamica/FAQSection";
import FooterSection from "@/components/fusion-dinamica/FooterSection";
import WhatsAppFloat from "@/components/fusion-dinamica/WhatsAppFloat";

const Index = () => {
  return (
    <main>
      <HeroSection />
      <AboutSection />
      <FeaturesSection />
      <AmenitiesSection />
      <LocationSection />
      <FloorPlansSection />
      <TargetAudienceSection />
      <VSLSection />
      <FAQSection />
      <FooterSection />
      <WhatsAppFloat />
    </main>
  );
};

export default function Page() {
  return <Index />;
}

