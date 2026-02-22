"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useLenis } from "lenis/react";

const HERO_BG = "#ede8e0";
const HEADER_H = "4rem";
// Matches Yucca's --ease custom property
const EASE = "cubic-bezier(0.22, 1, 0.36, 1)";
const EASE_ARRAY = [0.22, 1, 0.36, 1] as const;

const HEADING_LINES = [
  "Websites that Work.",
  "Built for",
  "Business Growth.",
];

const SERVICES = [
  {
    id: "visibility",
    title: "Get Found Online",
    description:
      "Turn Google searches into phone calls. Your business shows up when people nearby search for exactly what you offer.",
    href: "#contact",
  },
  {
    id: "design",
    title: "Websites That Convert",
    description:
      "A polished website that builds confidence before the first conversation. Turn visitors into paying clients.",
    href: "#contact",
  },
  {
    id: "ownership",
    title: "Own Your Presence",
    description:
      "Stop depending on social algorithms. A website you control that captures leads on your terms, around the clock.",
    href: "#contact",
  },
];

export const HeroSection = () => {
  const [activeService, setActiveService] = useState<string | null>(null);
  const [isReady, setIsReady] = useState(false);
  const shouldReduceMotion = useReducedMotion();
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const parallaxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsTouchDevice("ontouchstart" in window || navigator.maxTouchPoints > 0);
  }, []);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  // Trigger entrance animations on mount (runs in sync with curtain lift)
  useEffect(() => {
    const raf = requestAnimationFrame(() => setIsReady(true));
    return () => cancelAnimationFrame(raf);
  }, []);

  // Parallax: image drifts upward at 0.2× scroll speed
  useLenis(
    (lenis) => {
      if (shouldReduceMotion || isTouchDevice || !parallaxRef.current) return;
      parallaxRef.current.style.transform = `translateY(${lenis.scroll * 0.2}px)`;
    },
    [shouldReduceMotion, isTouchDevice],
  );

  const noMotion = shouldReduceMotion === true;

  return (
    <section
      className="relative w-full overflow-hidden"
      style={{ backgroundColor: HERO_BG, height: `calc(100svh - ${HEADER_H})` }}
    >
      {/* Right-side parallax image — zooms from scale(1.1) → scale(1) on load */}
      <div
        className="absolute inset-y-0 right-0 w-full md:w-3/5 pointer-events-none overflow-hidden"
        aria-hidden="true"
      >
        {/* Scale wrapper: zoom-out reveal matching Yucca's hero image intro */}
        <div
          className="absolute inset-0"
          style={{
            transform: noMotion
              ? "none"
              : isReady
                ? "scale(1)"
                : "scale(1.1)",
            transition: noMotion ? "none" : `transform 1.6s ${EASE}`,
          }}
        >
          <div
            ref={parallaxRef}
            className="absolute inset-0 w-full"
            style={{ height: "115%", top: "-7%", willChange: "transform" }}
          >
            <Image
              src="https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=1600&q=80"
              alt=""
              fill
              sizes="(min-width: 768px) 60vw, 100vw"
              className="object-cover"
              priority
            />
          </div>
        </div>

        {/* Blend left edge into warm background */}
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(to right, ${HERO_BG} 0%, ${HERO_BG}bb 15%, ${HERO_BG}55 40%, transparent 100%)`,
          }}
        />
        {/* Soften bottom edge */}
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(to bottom, transparent 55%, ${HERO_BG}99 82%, ${HERO_BG} 100%)`,
          }}
        />
      </div>

      {/* Page content */}
      <div
        className="relative z-10 mx-auto w-full max-w-[1200px] flex flex-col h-full px-4 md:px-6 lg:px-8"
        style={{ paddingTop: "5rem", paddingBottom: "1.5rem" }}
      >
        {/* Heading — each line slides up from below, staggered */}
        <h1
          className="max-w-[56rem] text-stone-900 leading-[1.04] tracking-tight"
          style={{ fontSize: "clamp(2.6rem, 5.2vw, 5.5rem)", fontWeight: 300 }}
        >
          {HEADING_LINES.map((line, i) => (
            <span key={i} className="block overflow-hidden">
              <motion.span
                className="block"
                initial={noMotion ? {} : { y: "102%" }}
                animate={noMotion ? {} : { y: isReady ? "0%" : "102%" }}
                transition={{
                  duration: 1.2,
                  ease: EASE_ARRAY,
                  delay: 0.4 + i * 0.1,
                }}
              >
                {line}
              </motion.span>
            </span>
          ))}
        </h1>

        {/* Flex spacer — pushes cards to the bottom */}
        <div className="flex-1" />

        {/* Service cards — staggered slide-up entrance, then hover animations */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:w-[75%]">
          {SERVICES.map((service, index) => {
            const isActive = activeService === service.id;

            return (
              <motion.div
                key={service.id}
                initial={noMotion ? {} : { opacity: 0, y: 40 }}
                animate={noMotion ? {} : { opacity: 1, y: 0 }}
                transition={{
                  duration: 0.9,
                  ease: EASE_ARRAY,
                  delay: 0.7 + index * 0.08,
                }}
                className="rounded-2xl cursor-pointer select-none relative overflow-hidden"
                style={{
                  height: isMobile
                    ? isActive ? "200px" : "68px"
                    : "clamp(284px, 40vh, 364px)",
                  backgroundColor: isActive
                    ? "#FFFDF5"
                    : "rgba(255, 255, 255, 0.25)",
                  backdropFilter: isActive ? "none" : "blur(10px)",
                  WebkitBackdropFilter: isActive ? "none" : "blur(10px)",
                  border: isActive
                    ? "1px solid rgba(0,0,0,0.06)"
                    : "1px solid rgba(255,255,255,0.40)",
                  transition: noMotion
                    ? "none"
                    : isMobile
                      ? `height 0.6s ${EASE}, background-color 0.6s ${EASE}, border-color 0.6s ${EASE}`
                      : `background-color 0.6s ${EASE}, border-color 0.6s ${EASE}`,
                  willChange: "transform",
                }}
                onMouseEnter={!isMobile ? () => setActiveService(service.id) : undefined}
                onMouseLeave={!isMobile ? () => setActiveService(null) : undefined}
                onClick={isMobile ? () => setActiveService(prev => prev === service.id ? null : service.id) : undefined}
              >
                {/* Title — vertically centered, slides up and out on hover */}
                <div
                  className="absolute inset-0 flex items-center justify-center overflow-hidden"
                  style={{ padding: "1.5rem 1.75rem" }}
                >
                  <h3
                    className="text-stone-800 w-full text-center"
                    style={{
                      fontSize: "1.3rem",
                      fontWeight: 400,
                      transform: isActive
                        ? "translateY(-160%)"
                        : "translateY(0%)",
                      opacity: isActive ? 0 : 1,
                      transition: noMotion
                        ? "none"
                        : `transform 0.6s ${EASE}, opacity 0.6s ${EASE}`,
                    }}
                  >
                    {service.title}
                  </h3>
                </div>

                {/* Reveal content — description top, CTA bottom */}
                <div
                  className="absolute inset-0 flex flex-col justify-between"
                  style={{ padding: "1.5rem 1.75rem" }}
                >
                  {/* Description — starts hidden below, slides up */}
                  <div style={{ overflow: "hidden" }}>
                    <p
                      className="text-stone-500 leading-relaxed"
                      style={{
                        fontSize: "0.875rem",
                        transform: isActive
                          ? "translateY(0%)"
                          : "translateY(101%)",
                        transition: noMotion
                          ? "none"
                          : `transform 1s ${EASE}`,
                      }}
                    >
                      {service.description}
                    </p>
                  </div>

                  {/* Divider + CTA anchored to bottom */}
                  <div>
                    {/* Divider — scales in from left */}
                    <div
                      style={{
                        height: "1px",
                        backgroundColor: "rgb(214, 211, 209)",
                        transform: isActive ? "scaleX(1)" : "scaleX(0)",
                        transformOrigin: "left center",
                        transition: noMotion
                          ? "none"
                          : `transform 0.8s ${EASE} ${isActive ? "0.1s" : "0s"}`,
                      }}
                    />

                    {/* CTA — starts hidden below, slides up */}
                    <div style={{ overflow: "hidden", paddingTop: "0.75rem" }}>
                      <a
                        href={service.href}
                        className="flex items-center justify-between text-stone-900"
                        style={{
                          fontSize: "0.875rem",
                          transform: isActive
                            ? "translateY(0%)"
                            : "translateY(101%)",
                          transition: noMotion
                            ? "none"
                            : `transform 0.6s ${EASE} ${isActive ? "0.14s" : "0s"}`,
                        }}
                      >
                        <span>Get in touch</span>
                        <ArrowRight className="w-4 h-4" aria-hidden="true" />
                      </a>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
