"use client";

import { motion, useReducedMotion, Variants } from "framer-motion";
import { Search, Shield, Globe, LucideIcon } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "./ui/card";

type Service = {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
};

const services: Service[] = [
  {
    id: "visibility",
    title: "Get Found by Local Customers",
    description:
      "Turn Google searches into phone calls. Your business shows up when people in your area are looking for exactly what you offer.",
    icon: Search,
  },
  {
    id: "authority",
    title: "Build Authority and Trust",
    description:
      "Present yourself as the expert you are. A polished website that makes potential clients confident before your first conversation.",
    icon: Shield,
  },
  {
    id: "ownership",
    title: "Own Your Online Presence",
    description:
      "Stop depending on algorithms. A website you control that showcases your work and captures leads on your terms.",
    icon: Globe,
  },
];

export const ServicesSection = () => {
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

  // Card animation
  const cardVariants: Variants = shouldReduceMotion
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
      id="services"
      aria-labelledby="services-heading"
      className="py-16 lg:py-24 bg-muted/50"
      initial={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: shouldReduceMotion ? 0 : 0.6, ease: "easeOut" }}
    >
      <div className="mx-auto max-w-[1200px] px-4 md:px-6 lg:px-8">
        <h2
          id="services-heading"
          className="text-3xl font-semibold text-foreground lg:text-4xl mb-8 lg:mb-12"
        >
          Services
        </h2>
        <motion.div
          className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          {services.map((service) => {
            const Icon = service.icon;
            return (
              <motion.div key={service.id} variants={cardVariants}>
                <Card data-testid="service-card" className="h-full py-5 px-5 lg:py-6 lg:px-6 shadow-sm hover:shadow-lg hover:border-orange-500 focus-within:ring-2 focus-within:ring-orange-500 focus-within:ring-offset-2 transition-all duration-150">
                  <CardHeader className="p-0">
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 text-orange-500" aria-hidden="true">
                        <Icon className="w-8 h-8" />
                      </div>
                      <CardTitle className="text-xl text-card-foreground">
                        {service.title}
                      </CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="p-0 pt-2">
                    <p className="text-muted-foreground">{service.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </motion.section>
  );
};
