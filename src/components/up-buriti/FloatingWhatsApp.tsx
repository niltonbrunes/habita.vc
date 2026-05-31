"use client";
import { MessageCircle } from "lucide-react";
import { LeadCaptureWrapper } from "@/components/crmhabita/LeadCaptureWrapper";

export const FloatingWhatsApp = () => {
  return (
    <LeadCaptureWrapper
      source="Landing Page Up Buriti (WhatsApp Flutuante)"
      whatsappMsg="Olá, gostaria de saber mais sobre o UP Buriti."
    >
      <span
        aria-label="Falar no WhatsApp"
        className="fixed bottom-5 right-5 z-50 flex items-center gap-2 rounded-full bg-whatsapp px-5 py-4 text-whatsapp-foreground shadow-cta animate-pulse-soft transition-bounce hover:scale-105"
      >
        <MessageCircle className="h-6 w-6" strokeWidth={2.2} />
        <span className="hidden sm:inline font-semibold text-sm">Fale agora</span>
      </span>
    </LeadCaptureWrapper>
  );
};
