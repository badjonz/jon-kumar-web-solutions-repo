"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";
import {
  revealUp,
  staggerContainer,
  revealFade,
  useAnimationVariants,
} from "@/lib/animations";

type PricingTier = {
  id: string;
  name: string;
  tagline: string;
  price: string;
  features: string[];
  inclusions?: string; // "Everything in X, plus:" note
  cta: string;
  featured: boolean;
  badge?: string;
};

const pricingTiers: PricingTier[] = [
  {
    id: "essentials",
    name: "Essentials",
    tagline: "Get online and get found",
    price: "Starting at $997",
    features: [
      "Professional single-page website",
      "Mobile-responsive design",
      "SEO foundation (metadata + sitemap)",
      "Contact form with email notifications",
      "Google Business Profile setup guidance",
    ],
    cta: "Get Started",
    featured: false,
  },
  {
    id: "growth",
    name: "Growth",
    tagline: "Stand out and convert visitors into clients",
    price: "Starting at $1,997",
    inclusions: "Everything in Essentials, plus:",
    features: [
      "Multi-page website with custom sections",
      "Advanced SEO (structured data, keyword strategy)",
      "Performance optimisation (Lighthouse 95+)",
      "WhatsApp integration with pre-filled messages",
      "Ongoing support & maintenance",
    ],
    cta: "Let's Talk",
    featured: true,
    badge: "Most Popular",
  },
];

export const PricingSection = () => {
  const headingVariants = useAnimationVariants(revealUp);
  const subheadingVariants = useAnimationVariants(revealFade);
  const containerVariants = useAnimationVariants(staggerContainer);
  const cardVariants = useAnimationVariants(revealUp);

  return (
    <section
      id="pricing"
      aria-labelledby="pricing-heading"
      className="py-16 lg:py-24"
    >
      <div className="mx-auto max-w-[900px] px-4 md:px-6 lg:px-8">
        <div className="text-center mb-10 lg:mb-14">
          <motion.h2
            id="pricing-heading"
            className="text-3xl font-semibold text-foreground lg:text-4xl mb-3"
            variants={headingVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
          >
            Simple, Transparent Pricing
          </motion.h2>
          <motion.p
            className="text-lg text-muted-foreground"
            variants={subheadingVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
          >
            No hidden fees. No surprises. Just clear value.
          </motion.p>
        </div>

        <motion.div
          className="grid grid-cols-1 lg:grid-cols-2 gap-6"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          {pricingTiers.map((tier) => (
            <motion.article
              key={tier.id}
              aria-labelledby={`${tier.id}-heading`}
              variants={cardVariants}
              className={`relative flex flex-col rounded-xl border bg-card p-6 lg:p-8 shadow-sm ${
                tier.featured ? "border-orange-500" : "border-border"
              }`}
            >
              {tier.badge && (
                <span className="absolute top-4 right-4 rounded-full bg-orange-500 px-3 py-1 text-xs font-semibold text-stone-950">
                  {tier.badge}
                </span>
              )}

              <div className="mb-6">
                <h3
                  id={`${tier.id}-heading`}
                  className="text-xl font-semibold text-card-foreground mb-1"
                >
                  {tier.name}
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  {tier.tagline}
                </p>
                <p className="text-2xl font-bold text-foreground">
                  {tier.price}
                </p>
              </div>

              <div className="flex-1 mb-8">
                {tier.inclusions && (
                  <p className="text-sm text-muted-foreground italic mb-3">
                    {tier.inclusions}
                  </p>
                )}
                <ul
                  className="flex flex-col gap-3"
                  aria-label={`${tier.name} features`}
                >
                  {tier.features.map((feature, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-2 text-sm text-card-foreground"
                    >
                      <Check
                        className="w-4 h-4 text-orange-500 flex-shrink-0 mt-0.5"
                        aria-hidden="true"
                      />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <a
                href="#contact"
                className={`inline-flex items-center justify-center rounded-lg px-6 py-3 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2 ${
                  tier.featured
                    ? "bg-orange-500 text-white hover:bg-orange-600"
                    : "border border-orange-500 text-orange-500 hover:bg-orange-50"
                }`}
              >
                {tier.cta}
              </a>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  );
};
