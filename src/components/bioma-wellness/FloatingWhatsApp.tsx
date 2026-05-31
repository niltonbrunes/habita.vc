"use client";
import { MessageCircle } from "lucide-react";
import { LeadCaptureWrapper } from "@/components/crmhabita/LeadCaptureWrapper";

const FloatingWhatsApp = () => {
  return (
    <LeadCaptureWrapper
      source="Landing Page Bioma Wellness (WhatsApp Flutuante)"
      whatsappMsg="Olá! Gostaria de saber mais sobre o BIOMA Wellness Life!"
    >
      <span
        aria-label="Falar no WhatsApp"
        className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-full bg-[#25D366] px-5 py-3.5 font-body text-sm font-semibold text-white shadow-elevated transition-all hover:scale-105 hover:shadow-cta animate-pulse-soft md:bottom-8 md:right-8"
      >
        <MessageCircle className="h-6 w-6" fill="currentColor" />
        <span className="hidden sm:inline">Falar no WhatsApp</span>
      </span>
    </LeadCaptureWrapper>
  );
};

export default FloatingWhatsApp;
