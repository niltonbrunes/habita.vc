import { Navbar } from "@/components/layout/Navbar";
import { Hero } from "@/components/layout/Hero";

export default function Home() {
  return (
    <div className="min-h-screen bg-background selection:bg-primary/10">
      <Navbar />
      <main>
        <Hero />
        
        {/* Features Preview Section */}
        <section className="py-24 bg-muted/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-bold mb-4">Por que escolher Habita.vc?</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                A tecnologia que faltava para transformar sua carreira imobiliária em uma jornada de alta performance.
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              {[
                { title: "CRM Inteligente", desc: "Gestão de leads com jornada progressiva e automação de tarefas." },
                { title: "Motor de Ganhos", desc: "Defina sua meta de salário e saiba exatamente o que fazer para chegar lá." },
                { title: "Portal SEO-First", desc: "Seus imóveis no topo das buscas com páginas de alta conversão." }
              ].map((feature, i) => (
                <div key={i} className="bg-white p-8 rounded-2xl shadow-premium border border-border hover:border-primary/20 transition-all">
                  <div className="w-12 h-12 bg-primary/5 rounded-xl mb-6 flex items-center justify-center text-primary font-bold text-xl">
                    0{i + 1}
                  </div>
                  <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {feature.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-primary py-12 text-white/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-sm">© 2026 Habita.vc - Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  );
}
