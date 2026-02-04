"use client";

import { Button } from "./ui/button";
import { motion, useReducedMotion } from "framer-motion";

export const HeroSection = () => {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.section
      initial={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: shouldReduceMotion ? 0 : 0.3 }}
      className="relative w-full py-20 md:py-32"
    >
      <div className="container mx-auto px-4 md:px-6">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/3 h-1 bg-orange-500" />
        <div className="grid gap-6 text-center">
          <h1 className="text-[2.5rem] font-bold tracking-tighter md:text-[4rem]">
            Modern Web Solutions,{" "}
            <span className="text-orange-500">Expertly Delivered</span>
          </h1>
          <p className="mx-auto max-w-[700px] text-lg text-muted-foreground">
            From sleek designs to robust back-end systems, I build and deliver
            custom web solutions that drive business growth and user engagement.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button
              asChild
              size="lg"
              className="bg-orange-500 hover:bg-orange-600 text-white min-h-[44px]"
            >
              <a href="#contact">Let&apos;s Talk</a>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="min-h-[44px]"
            >
              <a href="#services">See Services</a>
            </Button>
          </div>
        </div>
      </div>
    </motion.section>
  );
};
