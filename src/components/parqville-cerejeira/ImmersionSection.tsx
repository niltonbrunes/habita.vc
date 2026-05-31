"use client";
import { motion } from "framer-motion";
import { TreePine, Footprints, Building2, Leaf } from "lucide-react";


const features = [
  { icon: TreePine, title: "Novo Urbanismo", desc: "Planejamento que prioriza a qualidade de vida e a integração urbana." },
  { icon: Footprints, title: "Caminhabilidade", desc: "Ruas pensadas para pessoas, com calçadas largas e ciclovias." },
  { icon: Leaf, title: "Natureza Integrada", desc: "Parques, praças e áreas verdes em cada esquina do bairro." },
  { icon: Building2, title: "Nova Centralidade", desc: "Comércio, serviços e lazer a poucos passos de casa." },
];

const ImmersionSection = () => (
  <section className="py-20 md:py-32 bg-background" id="conceito">
    <div className="container mx-auto px-6">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
        className="text-center mb-16"
      >
        <h2 className="font-display text-3xl md:text-5xl font-bold text-foreground mb-4">
          Um Conceito que Transforma
        </h2>
        <p className="max-w-2xl mx-auto text-muted-foreground text-lg font-body">
          Investir em lote em Aparecida de Goiânia nunca fez tanto sentido. O Cidade do Amanhã é um bairro planejado com valorização projetada desde a fase inicial.
        </p>
      </motion.div>

      <div className="grid md:grid-cols-2 gap-12 items-center">
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <img
            src="/parqville/neighborhood.jpg"
            alt="Parque urbano do bairro planejado Cidade do Amanhã"
            className="rounded-2xl card-elevated w-full"
            loading="lazy"
          />
        </motion.div>

        <div className="space-y-6">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="flex gap-4 items-start"
            >
              <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <f.icon className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="font-display text-xl font-semibold text-foreground">{f.title}</h3>
                <p className="text-muted-foreground font-body">{f.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  </section>
);

export default ImmersionSection;


