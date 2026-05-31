"use client";
import { MessageCircle } from "lucide-react";
import { LeadCaptureWrapper } from "@/components/crmhabita/LeadCaptureWrapper";

interface CTAButtonProps {
  text: string;
  message?: string;
  variant?: "primary" | "outline" | "whatsapp";
  className?: string;
}

const CTAButton = ({ text, message = "Olá, gostaria de saber mais sobre o Fusion Dinâmica.", variant = "primary", className = "" }: CTAButtonProps) => {
  const base = "inline-flex items-center justify-center gap-2 rounded-lg px-8 py-4 font-body text-base font-semibold transition-all duration-300 hover:scale-[1.02]";

  const variants = {
    primary: "bg-gradient-gold text-primary-foreground shadow-gold hover:shadow-lg",
    outline: "border-2 border-gold text-gold hover:bg-gold hover:text-primary-foreground",
    whatsapp: "bg-whatsapp text-primary-foreground shadow-lg hover:brightness-110",
  };

  return (
    <LeadCaptureWrapper source="Landing Page Fusion Dinâmica" whatsappMsg={message ?? text}>
      <span className={`${base} ${variants[variant]} ${className}`}>
        <MessageCircle className="h-5 w-5" />
        {text}
      </span>
    </LeadCaptureWrapper>
  );
};

export default CTAButton;
