"use client";
import { MessageCircle } from "lucide-react";
import { LeadCaptureWrapper } from "@/components/crmhabita/LeadCaptureWrapper";

const WHATSAPP_URL = "https://wa.me/5562993076768";

const WhatsAppFloat = () => {
  return (
    <LeadCaptureWrapper source="Landing Page Fusion Dinâmica (WhatsApp Flutuante)" whatsappMsg={"Olá, gostaria de saber mais"}>
      return (
    <a
      
      
      
      aria-label="Fale conosco no WhatsApp"
      className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-full bg-whatsapp px-5 py-3.5 font-body text-sm font-semibold text-primary-foreground shadow-lg transition-all hover:bg-whatsapp-hover hover:scale-105 animate-pulse-glow md:bottom-8 md:right-8"
    >
      <MessageCircle className="h-5 w-5" />
      <span className="hidden sm:inline">Fale no WhatsApp</span>
    </a>
  );
    </LeadCaptureWrapper>
  );
};

export default WhatsAppFloat;
