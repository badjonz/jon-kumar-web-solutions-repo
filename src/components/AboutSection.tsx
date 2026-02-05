"use client";

import { motion, useReducedMotion, Variants } from "framer-motion";

type TrustSignal = {
  id: string;
  title: string;
  description: string;
};

const trustSignals: TrustSignal[] = [
  {
    id: "responsive",
    title: "I Actually Respond",
    description:
      "Same-day replies, not automated messages. You talk to me directly.",
  },
  {
    id: "results",
    title: "Results, Not Reports",
    description:
      "You'll see your business show up on Google, not just pretty charts.",
  },
  {
    id: "ownership",
    title: "You Own Everything",
    description: "Your domain, your content, your code. No vendor lock-in.",
  },
  {
    id: "speed",
    title: "Built for Speed",
    description:
      "Every site I build scores 100 on Google's performance tests.",
  },
];

const CheckmarkIcon = () => (
  <div
    className="flex-shrink-0 w-8 h-8 rounded-full bg-[var(--success)] flex items-center justify-center"
    aria-hidden="true"
  >
    <svg
      className="w-5 h-5 text-white"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={3}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  </div>
);

const TrustSignalItem = ({ signal }: { signal: TrustSignal }) => (
  <div className="flex items-start gap-4">
    <CheckmarkIcon />
    <div>
      <h3 className="font-semibold text-foreground">{signal.title}</h3>
      <p className="text-muted-foreground">{signal.description}</p>
    </div>
  </div>
);

const LighthouseBadge = ({ score = 100 }: { score?: number }) => (
  <div
    className="inline-flex items-center gap-3 p-4 bg-card border border-border rounded-lg shadow-sm"
    role="img"
    aria-label={`Lighthouse Performance Score: ${score} out of 100`}
  >
    <div className="w-16 h-16 rounded-full border-4 border-accent flex items-center justify-center">
      <span className="text-2xl font-bold text-foreground">{score}</span>
    </div>
    <div className="text-sm">
      <div className="font-medium text-foreground">Lighthouse</div>
      <div className="text-muted-foreground">Performance Score</div>
    </div>
  </div>
);

export const AboutSection = () => {
  const shouldReduceMotion = useReducedMotion();

  // Container animation with staggered children
  const containerVariants: Variants = shouldReduceMotion
    ? {
        hidden: { opacity: 1 },
        visible: { opacity: 1 },
      }
    : {
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren: 0.1,
            delayChildren: 0.2,
          },
        },
      };

  // Trust signal item animation
  const itemVariants: Variants = shouldReduceMotion
    ? {
        hidden: { opacity: 1, y: 0 },
        visible: { opacity: 1, y: 0 },
      }
    : {
        hidden: { opacity: 0, y: 20 },
        visible: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.4, ease: "easeOut" },
        },
      };

  return (
    <motion.section
      id="about"
      aria-labelledby="about-heading"
      className="py-16 lg:py-24 bg-background"
      initial={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: shouldReduceMotion ? 0 : 0.6, ease: "easeOut" }}
    >
      <div className="mx-auto max-w-[1200px] px-4 md:px-6 lg:px-8">
        <h2
          id="about-heading"
          className="text-3xl font-semibold text-foreground lg:text-4xl mb-8 lg:mb-12"
        >
          About
        </h2>
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Left: Intro text + Badge */}
          <div>
            <p className="text-lg text-muted-foreground mb-6">
              I help small businesses stop being invisible online. Whether
              you&apos;re running a local service, building a consultancy, or
              showcasing creative work, you deserve a website that shows up when
              people search—and looks good when they find you. No tech jargon,
              no complicated quotes. Just clean, fast sites that work.
            </p>
            <LighthouseBadge />
          </div>
          {/* Right: Trust signals with staggered animation */}
          <motion.div
            className="space-y-6"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
          >
            {trustSignals.map((signal) => (
              <motion.div key={signal.id} variants={itemVariants}>
                <TrustSignalItem signal={signal} />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
};
