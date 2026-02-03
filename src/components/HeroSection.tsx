"use client";

import { Button } from "./ui/button";
import { motion } from "framer-motion";

export const HeroSection = () => {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="relative w-full py-20 md:py-32"
    >
      <div className="container mx-auto px-4 md:px-6">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/3 h-1 bg-orange-500" />
        <div className="grid gap-6 text-center">
          <h1 className="text-4xl font-bold tracking-tighter md:text-6xl">
            Modern Web Solutions,{" "}
            <span className="text-orange-500">Expertly Delivered</span>
          </h1>
          <p className="mx-auto max-w-[700px] text-lg text-slate-600">
            From sleek designs to robust back-end systems, I build and deliver
            custom web solutions that drive business growth and user engagement.
          </p>
          <div className="flex justify-center gap-4">
            <a href="#contact">
              <Button variant="default" size="lg">
                Let&apos;s Talk
              </Button>
            </a>
            <a href="#services">
              <Button variant="outline" size="lg">
                See Services
              </Button>
            </a>
          </div>
        </div>
      </div>
    </motion.section>
  );
};
