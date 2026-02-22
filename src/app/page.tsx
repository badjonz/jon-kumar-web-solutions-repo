import { AboutSection } from "@/components/AboutSection";
import { ContactSection } from "@/components/ContactSection";
import { HeroSection } from "@/components/HeroSection";
import { PricingSection } from "@/components/PricingSection";
import { ServicesSection } from "@/components/ServicesSection";

export default function Home() {
  return (
    <>
      <HeroSection />

      {/* Interlude — breathing room between hero and services */}
      <section className="py-24 lg:py-36 bg-white">
        <div className="mx-auto max-w-[1200px] px-4 md:px-6 lg:px-8">
          <p
            className="text-stone-700 leading-[1.15] tracking-tight font-light"
            style={{ fontSize: "clamp(1.8rem, 3.5vw, 3.2rem)", maxWidth: "36rem" }}
          >
            Every business deserves a website that works as hard as they do.
          </p>
        </div>
      </section>

      <ServicesSection />

      <PricingSection />

      <AboutSection />

      <ContactSection />
    </>
  );
}
