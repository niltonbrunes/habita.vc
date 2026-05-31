"use client";
import CTAButton from "./CTAButton";

const VSLSection = () => {
  return (
    <section className="py-20 md:py-28 bg-muted">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <p className="font-body text-sm uppercase tracking-[0.2em] text-gold mb-3">
              Oportunidade Única
            </p>
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-6">
              Pare por um instante...
            </h2>
          </div>

          <div className="space-y-6 font-body text-muted-foreground leading-relaxed text-lg">
            <p>
              Se você está procurando um apartamento em Goiânia, mas sente que todos parecem iguais…
              com promessas vazias, pouca funcionalidade e preços que não fazem sentido…
            </p>
            <p className="font-semibold text-foreground">
              Então você precisa conhecer o Fusion Dinâmica Home.
            </p>
            <p>
              Um projeto que foi pensado justamente para fugir do padrão. Moderno, inteligente e funcional,
              criado para quem valoriza praticidade, conforto e uma vida mais dinâmica.
            </p>

            <blockquote className="border-l-4 border-gold pl-6 py-2 italic text-foreground bg-card rounded-r-xl pr-6">
              "Agora imagine isso… Você chegando em casa depois de um dia corrido… Entrando em um ambiente moderno, confortável…
              Com tudo ao seu alcance. Sem complicação. Sem desperdício de espaço. Sem arrependimento."
            </blockquote>

            <p>
              Empreendimentos com esse perfil estão sendo cada vez mais procurados em Goiânia.
              E quem entende de mercado já sabe: <strong className="text-foreground">os melhores momentos para comprar são no lançamento.</strong>
            </p>
          </div>

          <div className="mt-12 text-center space-y-4">
            <p className="font-heading text-xl font-semibold text-foreground">
              Você quer continuar apenas pesquisando… ou quer realmente entender se esse imóvel faz sentido para você?
            </p>
            <CTAButton
              text="Falar agora no WhatsApp"
              message="Olá! Vi a oportunidade do Fusion Dinâmica Home e quero entender se faz sentido pra mim."
              variant="whatsapp"
              className="text-lg px-10 py-5"
            />
            <p className="font-body text-sm text-muted-foreground">
              Sem compromisso. Sem pressão. Apenas uma conversa direta.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default VSLSection;
