"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Card, CardHeader, CardTitle, CardContent } from "./ui/card";

type Service = {
  id: string;
  title: string;
  description: string;
};

const services: Service[] = [
  {
    id: "visibility",
    title: "Get Found by Local Customers",
    description:
      "Turn Google searches into phone calls. Your business shows up when people in your area are looking for exactly what you offer.",
  },
  {
    id: "authority",
    title: "Build Authority and Trust",
    description:
      "Present yourself as the expert you are. A polished website that makes potential clients confident before your first conversation.",
  },
  {
    id: "ownership",
    title: "Own Your Online Presence",
    description:
      "Stop depending on algorithms. A website you control that showcases your work and captures leads on your terms.",
  },
];

export const ServicesSection = () => {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.section
      id="services"
      aria-labelledby="services-heading"
      className="py-16 lg:py-24 bg-muted/50"
      initial={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: shouldReduceMotion ? 0 : 0.3 }}
    >
      <div className="mx-auto max-w-[1200px] px-4 md:px-6 lg:px-8">
        <h2
          id="services-heading"
          className="text-3xl font-semibold text-foreground lg:text-4xl mb-8 lg:mb-12"
        >
          Services
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
          {services.map((service) => (
            <Card
              key={service.id}
              className="!py-5 !px-5 lg:!py-6 lg:!px-6 hover:shadow-lg hover:border-orange-500 focus-within:ring-2 focus-within:ring-orange-500 focus-within:ring-offset-2 transition-all duration-150"
            >
              <CardHeader className="p-0">
                <CardTitle className="text-xl text-card-foreground">
                  {service.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0 pt-2">
                <p className="text-muted-foreground">{service.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </motion.section>
  );
};
