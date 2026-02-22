"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { ContactForm } from "./ContactForm";
import {
  revealUp,
  staggerContainer,
  revealFade,
  useAnimationVariants,
} from "@/lib/animations";

const trustSignals = [
  "Response within 24 hours",
  "No obligation, just a conversation",
  "Your info stays confidential",
];

export const ContactSection = () => {
  const headingVariants = useAnimationVariants(revealUp);
  const bodyVariants = useAnimationVariants(revealFade);
  const trustContainerVariants = useAnimationVariants(staggerContainer);
  const trustItemVariants = useAnimationVariants(revealFade);
  const formVariants = useAnimationVariants(revealFade);

  return (
    <section
      id="contact"
      aria-labelledby="contact-heading"
      className="py-16 lg:py-24 bg-muted/50"
    >
      <div className="mx-auto max-w-[1200px] px-4 md:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
          {/* Left: heading + subtext + trust signals */}
          <div>
            <motion.h2
              id="contact-heading"
              className="text-3xl font-semibold text-foreground lg:text-4xl mb-4"
              variants={headingVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
            >
              Let&apos;s Build Something Together
            </motion.h2>
            <motion.p
              className="text-lg text-muted-foreground mb-8"
              variants={bodyVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
            >
              No pressure. No jargon. Just tell me about your project and
              I&apos;ll get back to you within 24 hours.
            </motion.p>
            <motion.ul
              className="flex flex-col gap-4"
              variants={trustContainerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              aria-label="Why reach out"
            >
              {trustSignals.map((signal) => (
                <motion.li
                  key={signal}
                  variants={trustItemVariants}
                  className="flex items-center gap-3 text-muted-foreground"
                >
                  <span
                    className="flex-shrink-0 w-5 h-5 rounded-full bg-orange-500/10 flex items-center justify-center"
                    aria-hidden="true"
                  >
                    <Check className="w-3 h-3 text-orange-500" />
                  </span>
                  <span>{signal}</span>
                </motion.li>
              ))}
            </motion.ul>
          </div>

          {/* Right: contact form */}
          <motion.div
            variants={formVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            <ContactForm />
          </motion.div>
        </div>
      </div>
    </section>
  );
};
