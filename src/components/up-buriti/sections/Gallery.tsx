"use client";
const livingImg = "/up-buriti/gallery-living.jpg";
const living2Img = "/up-buriti/gallery-livingroom2.jpg";
const bedroomImg = "/up-buriti/gallery-bedroom.jpg";
const suiteImg = "/up-buriti/gallery-suite.jpg";
const kitchenImg = "/up-buriti/gallery-kitchen.jpg";
const gymImg = "/up-buriti/gallery-gym.jpg";
const gourmetImg = "/up-buriti/gallery-gourmet.jpg";
const kidsImg = "/up-buriti/gallery-kids.jpg";
const hallImg = "/up-buriti/gallery-hall.jpg";

const photos = [
  { src: livingImg, alt: "Sala de estar moderna e iluminada do UP Buriti", span: "lg:col-span-2 lg:row-span-2" },
  { src: kitchenImg, alt: "Cozinha integrada com acabamento contemporâneo", span: "" },
  { src: living2Img, alt: "Sala de TV e jantar com decoração clean", span: "" },
  { src: bedroomImg, alt: "Quarto aconchegante com duas camas e iluminação natural", span: "" },
  { src: suiteImg, alt: "Suíte com closet e marcenaria planejada", span: "" },
  { src: hallImg, alt: "Hall de entrada sofisticado do empreendimento", span: "lg:col-span-2" },
  { src: gourmetImg, alt: "Área gourmet com churrasqueira e pergolado", span: "lg:col-span-2" },
  { src: gymImg, alt: "Academia equipada para os moradores", span: "" },
  { src: kidsImg, alt: "Brinquedoteca lúdica para as crianças", span: "" },
];

export const Gallery = () => {
  return (
    <section id="galeria" className="py-20 sm:py-28">
      <div className="container">
        <div className="mx-auto max-w-2xl text-center animate-fade-up">
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-primary">Galeria</span>
          <h2 className="mt-3 font-display text-3xl font-bold text-foreground text-balance sm:text-4xl md:text-5xl">
            Imagine a sua nova rotina aqui
          </h2>
          <p className="mt-5 text-base text-muted-foreground sm:text-lg">
            Ambientes funcionais, modernos e áreas de lazer completas pensadas para o seu bem-estar.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-2 gap-3 lg:grid-cols-4 lg:auto-rows-[200px]">
          {photos.map((p) => (
            <div
              key={p.alt}
              className={`group relative overflow-hidden rounded-2xl shadow-soft ${p.span}`}
            >
              <img
                src={p.src}
                alt={p.alt}
                loading="lazy"
                width={1280}
                height={896}
                className="h-full w-full object-cover transition-smooth group-hover:scale-105"
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-foreground/40 via-transparent to-transparent opacity-0 transition-smooth group-hover:opacity-100" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
