"use client";
import { MessageCircle, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { LeadCaptureWrapper } from "@/components/crmhabita/LeadCaptureWrapper";

interface CTAButtonProps {
  children: React.ReactNode;
  message?: string;
  variant?: "whatsapp" | "primary" | "outline";
  size?: "default" | "lg";
  className?: string;
  showIcon?: boolean;
}

export const CTAButton = ({
  children,
  message = "Olá! Tenho interesse no UP Buriti, no Jardim Luz. Pode me enviar mais informações?",
  variant = "whatsapp",
  size = "default",
  className,
  showIcon = true,
}: CTAButtonProps) => {
  const variants = {
    whatsapp: "bg-whatsapp text-whatsapp-foreground hover:brightness-110 shadow-cta",
    primary: "bg-gradient-primary text-primary-foreground hover:brightness-110 shadow-elegant",
    outline: "bg-transparent text-foreground border-2 border-foreground/15 hover:bg-foreground/5",
  };
  const sizes = {
    default: "px-6 py-3 text-sm",
    lg: "px-8 py-4 text-base sm:text-lg",
  };

  return (
    <LeadCaptureWrapper source="Landing Page Up Buriti" whatsappMsg={message}>
      <span
        className={cn(
          "group inline-flex items-center justify-center gap-2 rounded-full font-semibold transition-bounce hover:scale-[1.02] active:scale-100",
          variants[variant],
          sizes[size],
          className,
        )}
      >
        {showIcon && variant === "whatsapp" && <MessageCircle className="h-5 w-5" />}
        <span>{children}</span>
        {showIcon && variant !== "whatsapp" && (
          <ArrowRight className="h-4 w-4 transition-smooth group-hover:translate-x-1" />
        )}
      </span>
    </LeadCaptureWrapper>
  );
};
