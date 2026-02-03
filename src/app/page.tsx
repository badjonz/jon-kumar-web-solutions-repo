import { HeroSection } from "@/components/HeroSection";

export default function Home() {
  return (
    <>
      <HeroSection />

      {/* Services Section */}
      <section
        id="services"
        aria-labelledby="services-heading"
        className="py-16 lg:py-24 bg-muted/50"
      >
        <div className="mx-auto max-w-[1200px] px-4 md:px-6 lg:px-8">
          <h2
            id="services-heading"
            className="text-3xl font-semibold text-foreground lg:text-4xl"
          >
            Services
          </h2>
          {/* Placeholder for services grid - Epic 2 */}
        </div>
      </section>

      {/* About Section */}
      <section
        id="about"
        aria-labelledby="about-heading"
        className="py-16 lg:py-24 bg-background"
      >
        <div className="mx-auto max-w-[1200px] px-4 md:px-6 lg:px-8">
          <h2
            id="about-heading"
            className="text-3xl font-semibold text-foreground lg:text-4xl"
          >
            About
          </h2>
          {/* Placeholder for about content - Epic 2 */}
        </div>
      </section>

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
