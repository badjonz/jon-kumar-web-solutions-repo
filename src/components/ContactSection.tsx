"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ContactForm } from "./ContactForm";

export const ContactSection = () => {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.section
      id="contact"
      aria-labelledby="contact-heading"
      className="py-16 lg:py-24 bg-muted/50"
      initial={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: shouldReduceMotion ? 0 : 0.6, ease: "easeOut" }}
    >
      <div className="mx-auto max-w-[1200px] px-4 md:px-6 lg:px-8">
        <h2
          id="contact-heading"
          className="text-3xl font-semibold text-foreground lg:text-4xl mb-4"
        >
          Contact
        </h2>
        <p className="text-lg text-muted-foreground mb-8 lg:mb-12">
          No pressure. No jargon. Just tell me about your project and I&apos;ll
          get back to you within 24 hours.
        </p>
        <div className="max-w-[600px]">
          <ContactForm />
        </div>
      </div>
    </motion.section>
  );
};
