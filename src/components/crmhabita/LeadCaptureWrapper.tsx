"use client";
import React, { useState } from "react";
import { X } from "lucide-react";
import { LeadsService } from "@/services/leads.service";

interface LeadCaptureWrapperProps {
  children: React.ReactNode;
  source: string;
  whatsappMsg: string;
  whatsappNumber?: string;
}

export const LeadCaptureWrapper = ({ 
  children, 
  source, 
  whatsappMsg, 
  whatsappNumber = "5562993076768" 
}: LeadCaptureWrapperProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await LeadsService.create({
        name,
        email,
        phone,
        source,
        status: "lead"
      });

      window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMsg)}`, "_blank");
      
      setIsOpen(false);
    } catch (error) {
      console.error("Erro ao salvar lead:", error);
      alert("Houve um erro ao tentar contatar. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div onClick={(e) => {
        e.preventDefault();
        setIsOpen(true);
      }} className="inline-block cursor-pointer">
        <div style={{ pointerEvents: 'none' }}>
            {children}
        </div>
      </div>

      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
          <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl relative animate-in fade-in zoom-in duration-300">
            <button 
              onClick={(e) => {
                e.stopPropagation();
                setIsOpen(false);
              }}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-full p-2 transition-colors z-10"
            >
              <X size={20} />
            </button>

            <div className="p-8">
              <h2 className="text-2xl font-bold text-slate-800 mb-2">Quase lá!</h2>
              <p className="text-slate-600 mb-8">
                Preencha os dados abaixo para receber o atendimento de um de nossos corretores especialistas.
              </p>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Nome Completo</label>
                  <input 
                    required
                    type="text" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all text-slate-800"
                    placeholder="Seu nome"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">WhatsApp</label>
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
                  <label className="block text-sm font-semibold text-slate-700 mb-2">E-mail</label>
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
      )}
    </>
  );
};
