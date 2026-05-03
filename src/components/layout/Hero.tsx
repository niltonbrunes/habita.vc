import React from 'react';
import { Search, MapPin } from 'lucide-react';

export const Hero = () => {
  return (
    <section className="relative min-h-[90vh] flex items-center pt-20 overflow-hidden">
      {/* Background with abstract shapes for a premium look */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-accent/5 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider mb-6">
              <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
              Plataforma Completa para Corretores
            </div>
            <h1 className="text-5xl md:text-7xl font-bold leading-[1.1] mb-6">
              Encontre o imóvel dos seus <span className="text-accent">sonhos</span>
            </h1>
            <p className="text-lg text-muted-foreground mb-10 max-w-lg leading-relaxed">
              Conectamos você aos melhores corretores e imóveis do mercado. 
              Sua nova história começa aqui com inteligência e exclusividade.
            </p>

            <div className="bg-white p-2 rounded-2xl shadow-premium flex flex-col sm:flex-row gap-2 max-w-2xl border border-border">
              <div className="flex-1 flex items-center gap-3 px-4 py-3">
                <Search className="w-5 h-5 text-muted-foreground" />
                <input 
                  type="text" 
                  placeholder="Cidade, bairro ou tipo de imóvel..."
                  className="w-full bg-transparent border-none focus:outline-none text-primary placeholder:text-muted-foreground"
                />
              </div>
              <div className="h-10 w-[1px] bg-border hidden sm:block self-center" />
              <button className="bg-accent hover:bg-accent-light text-white px-8 py-4 rounded-xl font-bold transition-all shadow-lg active:scale-95">
                Buscar
              </button>
            </div>

            <div className="mt-10 flex items-center gap-8 grayscale opacity-50">
              <span className="text-sm font-semibold text-primary uppercase tracking-widest">Parceiros:</span>
              <div className="flex gap-6 font-bold text-xl tracking-tighter">
                <span>OPUS</span>
                <span>EBM</span>
                <span>TECCON</span>
              </div>
            </div>
          </div>

          <div className="relative hidden lg:block">
            <div className="relative z-10 rounded-3xl overflow-hidden shadow-luxury border-8 border-white">
              {/* Image placeholder - I will generate an actual image later if needed */}
              <div className="aspect-[4/5] bg-muted flex items-center justify-center">
                <MapPin className="w-12 h-12 text-primary/20" />
              </div>
            </div>
            {/* Floating Card */}
            <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-2xl shadow-luxury z-20 border border-border animate-bounce-slow">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-accent/20 rounded-xl flex items-center justify-center">
                  <Home className="w-6 h-6 text-accent" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground font-medium">Lançamento Exclusivo</p>
                  <p className="font-bold text-primary">Vita Residencial</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const Home = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
);
