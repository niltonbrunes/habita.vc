"use client";
import { MessageCircle } from "lucide-react";
import { LeadCaptureWrapper } from "@/components/crmhabita/LeadCaptureWrapper";

const WhatsAppFloat = () => {
  return (
    <LeadCaptureWrapper
      source="Landing Page Fusion Dinâmica (WhatsApp Flutuante)"
      whatsappMsg="Olá, gostaria de saber mais sobre o Fusion Dinâmica."
    >
      <span
        aria-label="Fale conosco no WhatsApp"
        className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-full bg-whatsapp px-5 py-3.5 font-body text-sm font-semibold text-primary-foreground shadow-lg transition-all hover:brightness-110 hover:scale-105 animate-pulse-glow md:bottom-8 md:right-8"
      >
        <MessageCircle className="h-5 w-5" />
        <span className="hidden sm:inline">Fale no WhatsApp</span>
      </span>
    </LeadCaptureWrapper>
  );
};

export default WhatsAppFloat;
