'use client';

import React, { useState } from 'react';
import { MessageCircle, Phone, Loader2, CheckCircle2 } from 'lucide-react';
import { LeadsService } from '@/services/leads.service';

interface LeadFormProps {
  propertyId: string;
  propertyTitle: string;
  brokerId: string;
}

export const LeadForm = ({ propertyId, propertyTitle, brokerId }: LeadFormProps) => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await LeadsService.create({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        assigned_to_id: brokerId,
        source: `Portal: ${propertyTitle}`,
        status: 'lead',
        temperature: 'warm',
        score: 50,
        history: [{
          date: new Date().toISOString(),
          type: 'capture',
          message: `Lead capturado via portal no imóvel: ${propertyTitle}`
        }]
      });
      setSuccess(true);
    } catch (err) {
      console.error('Erro ao capturar lead:', err);
      alert('Ocorreu um erro ao enviar seus dados. Por favor, tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="bg-surface p-8 rounded-[3rem] shadow-card border border-green-100 text-center animate-in zoom-in duration-500">
        <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="text-green-500" size={40} />
        </div>
        <h3 className="text-xl font-bold text-heading mb-2">Solicitação Enviada!</h3>
        <p className="text-muted-foreground font-medium mb-6">
          Um de nossos consultores entrará em contato com você em breve.
        </p>
        <button 
          onClick={() => setSuccess(false)}
          className="text-primary font-bold underline"
        >
          Enviar outra mensagem
        </button>
      </div>
    );
  }

  return (
    <div className="bg-surface p-8 rounded-[3rem] shadow-card border border-border relative overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 bg-blue-primary/5 rounded-full -mr-16 -mt-16" />
      
      <div className="relative z-10 mb-8">
        <h3 className="text-xl font-bold text-heading mb-2">Tenho Interesse</h3>
        <p className="text-sm text-muted-foreground font-medium">Preencha os dados e um consultor entrará em contato em minutos.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-3">
          <input 
            type="text" 
            required
            placeholder="Seu Nome"
            value={formData.name}
            onChange={e => setFormData({ ...formData, name: e.target.value })}
            className="w-full px-6 py-4 bg-muted/50 border-2 border-transparent rounded-2xl focus:border-primary/10 focus:bg-surface focus:outline-none font-bold text-primary placeholder:text-muted-foreground/50 transition-all"
          />
          <input 
            type="email" 
            required
            placeholder="E-mail"
            value={formData.email}
            onChange={e => setFormData({ ...formData, email: e.target.value })}
            className="w-full px-6 py-4 bg-muted/50 border-2 border-transparent rounded-2xl focus:border-primary/10 focus:bg-surface focus:outline-none font-bold text-primary placeholder:text-muted-foreground/50 transition-all"
          />
          <input 
            type="text" 
            required
            placeholder="WhatsApp"
            value={formData.phone}
            onChange={e => setFormData({ ...formData, phone: e.target.value })}
            className="w-full px-6 py-4 bg-muted/50 border-2 border-transparent rounded-2xl focus:border-primary/10 focus:bg-surface focus:outline-none font-bold text-primary placeholder:text-muted-foreground/50 transition-all"
          />
        </div>
        
        <button 
          type="submit"
          disabled={loading}
          className="w-full bg-blue-primary text-white py-5 rounded-[1.5rem] font-black text-lg flex items-center justify-center gap-3 hover:bg-blue-primary-dark transition-all shadow-card group mt-4 disabled:opacity-70"
        >
          {loading ? <Loader2 className="animate-spin" size={24} /> : (
            <>
              <MessageCircle size={24} className="group-hover:scale-110 transition-transform" />
              Agendar Visita
            </>
          )}
        </button>
        
        <a 
          href={`https://wa.me/5562999999999?text=Olá! Gostaria de mais informações sobre o imóvel: ${propertyTitle}`}
          target="_blank"
          className="w-full bg-surface border-2 border-border text-primary py-4 rounded-[1.5rem] font-bold flex items-center justify-center gap-3 hover:bg-muted transition-all"
        >
          <Phone size={20} className="text-accent" />
          Conversar pelo WhatsApp
        </a>
      </form>

      <div className="mt-8 pt-8 border-t border-border flex items-center gap-4">
        <div className="w-16 h-16 bg-muted rounded-2xl flex items-center justify-center font-black text-primary/20 text-xl border border-white shadow-sm">
          H
        </div>
        <div>
          <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Consultoria Exclusiva</p>
          <p className="font-black text-primary text-lg">Habita.vc Concierge</p>
          <div className="flex items-center gap-2 mt-0.5">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-[10px] font-bold text-green-600 uppercase">Disponível agora</span>
          </div>
        </div>
      </div>
    </div>
  );
};
