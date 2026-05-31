export const metadata = {
  title: "Up Buriti | Habita.vc",
};

import { Header } from "@/components/up-buriti/Header";
import { Hero } from "@/components/up-buriti/sections/Hero";
import { About } from "@/components/up-buriti/sections/About";
import { Gallery } from "@/components/up-buriti/sections/Gallery";
import { Offer } from "@/components/up-buriti/sections/Offer";
import { Location } from "@/components/up-buriti/sections/Location";
import { ForWhom } from "@/components/up-buriti/sections/ForWhom";
import { FAQ } from "@/components/up-buriti/sections/FAQ";
import { FinalCTA } from "@/components/up-buriti/sections/FinalCTA";
import { Footer } from "@/components/up-buriti/sections/Footer";
import { FloatingWhatsApp } from "@/components/up-buriti/FloatingWhatsApp";

const Index = () => {
  return (
    <div className="theme-up-buriti antialiased bg-background text-foreground">
      <div className="min-h-screen bg-background">
      <Header />
      <main>
        <Hero />
        <About />
        <Gallery />
        <Offer />
        <Location />
        <ForWhom />
        <FAQ />
        <FinalCTA />
      </main>
<Footer />
<FloatingWhatsApp />
</div></div>);
};

export default function Page() {
  return <Index />;
}

