"use client";
import { MessageCircle } from 'lucide-react';
import { useState } from 'react';
import LeadCaptureModal from './LeadCaptureModal';

const WHATSAPP_URL = "https://wa.me/5562993076768?text=Olá,%20quero%20mais%20informações%20sobre%20o%20Cidade%20do%20Amanhã%20em%20Aparecida%20de%20Goiânia.";

const WhatsAppFloat = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  return (
    <>
  <button
      onClick={() => setIsModalOpen(true)}
    aria-label="Falar no WhatsApp"
    className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-primary cta-glow transition-transform hover:scale-110 md:h-16 md:w-16"
  >
    <MessageCircle className="h-7 w-7 text-primary-foreground" />
  </button>
    <LeadCaptureModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
};

export default WhatsAppFloat;


