import { AboutSection } from "@/components/AboutSection";
import { HeroSection } from "@/components/HeroSection";
import { ServicesSection } from "@/components/ServicesSection";

export default function Home() {
  return (
    <>
      <HeroSection />

      <ServicesSection />

      <AboutSection />

      {/* Contact Section */}
      <section
        id="contact"
        aria-labelledby="contact-heading"
        className="py-16 lg:py-24 bg-muted/50"
      >
        <div className="mx-auto max-w-[1200px] px-4 md:px-6 lg:px-8">
          <h2
            id="contact-heading"
            className="text-3xl font-semibold text-foreground lg:text-4xl"
          >
            Contact
          </h2>
          {/* Placeholder for contact form - Epic 3 */}
        </div>
      </section>
    </>
  );
}
