"use client";
import { MessageCircle } from "lucide-react";
import { LeadCaptureWrapper } from "@/components/crmhabita/LeadCaptureWrapper";

const WHATSAPP_URL = "https://wa.me/5562993076768?text=Ol%C3%A1!%20Gostaria%20de%20saber%20mais%20sobre%20o%20BIOMA%20Wellness%20Life!";

const FloatingWhatsApp = () => {
  return (
    <LeadCaptureWrapper source="Landing Page Bioma Wellness (WhatsApp Flutuante)" whatsappMsg={decodeURIComponent("Ol%C3%A1!%20Gostaria%20de%20saber%20mais%20sobre%20o%20BIOMA%20Wellness%20Life!")}>
      return (
    <a
      
      
      
      aria-label="Falar no WhatsApp"
      className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-full bg-[#25D366] px-5 py-3.5 font-body text-sm font-semibold text-primary-foreground shadow-elevated transition-all hover:scale-105 hover:shadow-cta animate-pulse-soft md:bottom-8 md:right-8"
    >
      <MessageCircle className="h-6 w-6" fill="currentColor" />
      <span className="hidden sm:inline">Falar no WhatsApp</span>
    </a>
  );
    </LeadCaptureWrapper>
  );
};

export default FloatingWhatsApp;
