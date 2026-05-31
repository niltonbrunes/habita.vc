"use client";
import HeroSection from "@/components/bioma-wellness/HeroSection";
import AboutSection from "@/components/bioma-wellness/AboutSection";
import TypologiesSection from "@/components/bioma-wellness/TypologiesSection";
import GalleryLeisureSection from "@/components/bioma-wellness/GalleryLeisureSection";
import LocationSection from "@/components/bioma-wellness/LocationSection";
import DifferentialsSection from "@/components/bioma-wellness/DifferentialsSection";
import CTASection from "@/components/bioma-wellness/CTASection";
import FAQSection from "@/components/bioma-wellness/FAQSection";
import FooterBioma from "@/components/bioma-wellness/FooterBioma";
import FloatingWhatsApp from "@/components/bioma-wellness/FloatingWhatsApp";
import { useEffect } from "react";


const Index = () => {
  useEffect(() => {
    // JSON-LD Schema Markup
    const schema = {
      "@context": "https://schema.org",
      "@type": "RealEstateListing",
      "name": "BIOMA Wellness Life",
      "description": "Apartamentos de 63 a 122m² com conceito wellness no Setor Marista, Goiânia. Fachada biofílica, complexo wellness 200m², piscina climatizada e localização premium.",
      "url": window.location.href,
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "Rua Mário Bitar, 224-268",
        "addressLocality": "Goiânia",
        "addressRegion": "GO",
        "postalCode": "74150-150",
        "addressCountry": "BR",
        "neighborhood": "Setor Marista"
      },
      "geo": {
        "@type": "GeoCoordinates",
        "latitude": -16.7044,
        "longitude": -49.2559
      },
      "offers": {
        "@type": "AggregateOffer",
        "priceCurrency": "BRL",
        "availability": "https://schema.org/PreOrder"
      },
      "numberOfRooms": "2-3",
      "floorSize": {
        "@type": "QuantitativeValue",
        "minValue": 63,
        "maxValue": 122,
        "unitCode": "MTK"
      }
    };

    const faqSchema = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "Quais são as tipologias disponíveis no BIOMA Wellness Life?",
          "acceptedAnswer": { "@type": "Answer", "text": "Apartamentos de 2 quartos com 1 suíte (63m²), 2 suítes plenas (74 a 88m²) e 3 suítes plenas (112 a 122m²)." }
        },
        {
          "@type": "Question",
          "name": "Onde fica localizado o BIOMA Wellness Life?",
          "acceptedAnswer": { "@type": "Answer", "text": "Na Rua Mário Bitar, 224-268, Setor Marista, Goiânia - GO. Próximo ao Shopping Bougainville e Hospital Órion." }
        },
        {
          "@type": "Question",
          "name": "Qual a previsão de entrega?",
          "acceptedAnswer": { "@type": "Answer", "text": "Previsão de entrega para 2030. Em fase de lançamento com condições especiais." }
        }
      ]
    };

    const scriptEl = document.createElement("script");
    scriptEl.type = "application/ld+json";
    scriptEl.text = JSON.stringify(schema);
    document.head.appendChild(scriptEl);

    const faqScriptEl = document.createElement("script");
    faqScriptEl.type = "application/ld+json";
    faqScriptEl.text = JSON.stringify(faqSchema);
    document.head.appendChild(faqScriptEl);

    return () => {
      document.head.removeChild(scriptEl);
      document.head.removeChild(faqScriptEl);
    };
  }, []);

  return (
    <div className="theme-bioma-wellness antialiased">
      <main>
      <HeroSection />
      <AboutSection />
      <TypologiesSection />
      <GalleryLeisureSection />
      <DifferentialsSection />
      <LocationSection />
      <CTASection />
      <FAQSection />
      <FooterBioma />
      <FloatingWhatsApp />
    </main>
    </div>
  );
};


export default Index;