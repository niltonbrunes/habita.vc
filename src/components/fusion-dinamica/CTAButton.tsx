"use client";
import { MessageCircle } from "lucide-react";
import { LeadCaptureWrapper } from "@/components/crmhabita/LeadCaptureWrapper";

const WHATSAPP_URL = "https://wa.me/5562993076768";

interface CTAButtonProps {
  text: string;
  message?: string;
  variant?: "primary" | "outline" | "whatsapp";
  className?: string;
}

const CTAButton = ({ text, message, variant = "primary", className = "" }: CTAButtonProps) => {
  const url = message
    ? `${WHATSAPP_URL}?text=${encodeURIComponent(message)}`
    : WHATSAPP_URL;

  const base = "inline-flex items-center justify-center gap-2 rounded-lg px-8 py-4 font-body text-base font-semibold transition-all duration-300 hover:scale-[1.02]";

  const variants = {
    primary: "bg-gradient-gold text-primary-foreground shadow-gold hover:shadow-lg",
    outline: "border-2 border-gold text-gold hover:bg-gold hover:text-primary-foreground",
    whatsapp: "bg-whatsapp text-primary-foreground shadow-lg hover:bg-whatsapp-hover",
  };

  return (
    <LeadCaptureWrapper source="Landing Page Fusion Dinâmica" whatsappMsg={"Olá, gostaria de saber mais"}>
      return (
    <a
      
      
      
      className={`${base} ${variants[variant]} ${className}`}
    >
      <MessageCircle className="h-5 w-5" />
      {text}
    </a>
  );
    </LeadCaptureWrapper>
  );
};

export default CTAButton;
