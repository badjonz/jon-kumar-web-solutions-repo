export default function Home() {
  return (
    <>
      {/* Hero Section */}
      <section id="hero" className="py-16 lg:py-24 bg-background">
        <div className="mx-auto max-w-[1200px] px-4 md:px-6 lg:px-8">
          <h1 className="text-4xl font-bold tracking-tight text-foreground md:text-5xl lg:text-6xl">
            Jon Kumar Web Solutions
          </h1>
          <p className="mt-6 text-lg leading-8 text-muted-foreground">
            Professional web development services in the Cayman Islands.
          </p>
          <div className="mt-10 flex items-center gap-x-6">
            <a
              href="#contact"
              className="rounded-md bg-accent px-6 py-3 text-base font-medium text-accent-foreground shadow-sm transition-colors hover:bg-accent/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
            >
              Let&apos;s Talk
            </a>
            <a
              href="#services"
              className="text-base font-medium text-foreground hover:text-muted-foreground"
            >
              See Services <span aria-hidden="true">→</span>
            </a>
          </div>
        </div>
      </section>

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
