"use client";
import { useState } from "react";
import { X } from "lucide-react";
import { LeadsService } from "@/services/leads.service";

interface LeadCaptureModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function LeadCaptureModal({ isOpen, onClose }: LeadCaptureModalProps) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await LeadsService.create({
        name,
        email,
        phone,
        source: "Landing Page Parqville Cerejeira",
        status: "lead"
      });

      const whatsappMsg = "Ol\u00e1, quero mais informa\u00e7\u00f5es sobre o Cidade do Amanh\u00e3 em Aparecida de Goi\u00e2nia.";
      window.open("https://wa.me/5562993076768?text=${encodeURIComponent(whatsappMsg)}", "_blank");
      
      onClose();
    } catch (error) {
      console.error("Erro ao salvar lead:", error);
      alert("Houve um erro ao tentar contatar. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
      <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl relative animate-in fade-in zoom-in duration-300">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors"
        >
          <X className="w-6 h-6" />
        </button>
        
        <div className="p-8">
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Fale com um especialista</h2>
          <p className="text-slate-600 mb-6">
            Preencha seus dados para receber o atendimento exclusivo via WhatsApp.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Nome completo</label>
              <input 
                required
                type="text" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all text-slate-800"
                placeholder="Ex: Jo\u00e3o da Silva"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Telefone (WhatsApp)</label>
              <input 
                required
                type="tel" 
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all text-slate-800"
                placeholder="(62) 99999-9999"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">E-mail</label>
              <input 
                required
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all text-slate-800"
                placeholder="seu@email.com"
              />
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full mt-4 bg-green-600 hover:bg-green-700 text-white font-semibold py-4 rounded-xl shadow-lg shadow-green-600/30 transition-all flex justify-center items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? "Aguarde..." : "Ir para o WhatsApp"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}



