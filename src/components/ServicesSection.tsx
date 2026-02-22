"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useLenis } from "lenis/react";

const EASE = "cubic-bezier(0.22, 1, 0.36, 1)";
const EASE_ARRAY = [0.22, 1, 0.36, 1] as const;

const services = [
  {
    id: "visibility",
    title: "Get Found Online",
    description:
      "Turn Google searches into phone calls. Your business shows up when people nearby search for exactly what you offer.",
    href: "#contact",
    image:
      "https://images.unsplash.com/photo-1573804633927-bfcbcd909acd?w=1400&q=80",
  },
  {
    id: "design",
    title: "Websites That Convert",
    description:
      "A polished website that builds confidence before the first conversation. Turn visitors into paying clients.",
    href: "#contact",
    image:
      "https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=1400&q=80",
  },
  {
    id: "ownership",
    title: "Own Your Presence",
    description:
      "Stop depending on social algorithms. A website you control that captures leads on your terms, around the clock.",
    href: "#contact",
    image:
      "https://images.unsplash.com/photo-1497366216548-37526070297c?w=1400&q=80",
  },
];

// Active card: wider + taller. Inactive: narrower + shorter → portrait feel
const ACTIVE_W = "30%";
const INACTIVE_W = "24%";
const ACTIVE_H = "clamp(336px, 42vh, 436px)";
const INACTIVE_H = "clamp(296px, 39vh, 396px)";

const MOBILE_ACTIVE_H = 200;
const MOBILE_INACTIVE_H = 68;

export const ServicesSection = () => {
  const [activeService, setActiveService] = useState(services[0].id);
  const [isMobile, setIsMobile] = useState(false);
  const shouldReduceMotion = useReducedMotion();
  const noMotion = shouldReduceMotion === true;

  const sectionRef = useRef<HTMLElement>(null);
  const parallaxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  // Parallax: background image drifts at 0.25× scroll speed relative to section entry
  useLenis(
    (lenis) => {
      if (shouldReduceMotion || isMobile || !parallaxRef.current || !sectionRef.current) return;
      const sectionTop = sectionRef.current.offsetTop;
      const offset = (lenis.scroll - sectionTop) * 0.25;
      parallaxRef.current.style.transform = `translateY(${offset}px)`;
    },
    [shouldReduceMotion, isMobile],
  );

  return (
    <section
      ref={sectionRef}
      id="services"
      aria-labelledby="services-heading"
      className="relative w-full overflow-hidden"
      style={{ height: "100svh" }}
    >
      {/* Background images — full bleed, crossfade on card switch */}
      <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
        {/* Parallax wrapper: oversized so drift doesn't reveal edges */}
        <div
          ref={parallaxRef}
          className="absolute w-full"
          style={{ height: "130%", top: "-15%", willChange: "transform" }}
        >
          {services.map((service) => (
            <div
              key={service.id}
              className="absolute inset-0"
              style={{
                opacity: activeService === service.id ? 1 : 0,
                transform: activeService === service.id ? "scale(1)" : "scale(1.08)",
                transition: noMotion ? "none" : `opacity 0.8s ${EASE}, transform 0.8s ${EASE}`,
              }}
            >
              <Image
                src={service.image}
                alt=""
                fill
                sizes="100vw"
                className="object-cover"
                priority={service.id === services[0].id}
              />
            </div>
          ))}
        </div>
        {/* Dark overlay */}
        <div
          className="absolute inset-0"
          style={{ backgroundColor: "rgba(0,0,0,0.45)" }}
        />
      </div>

      {/* Content */}
      <div
        className="relative z-10 mx-auto w-full max-w-[1200px] flex flex-col h-full px-4 md:px-6 lg:px-8"
        style={{ paddingTop: "3.5rem", paddingBottom: "2.5rem" }}
      >
        {/* Section label */}
        <h2
          id="services-heading"
          className="uppercase tracking-widest"
          style={{ fontSize: "0.7rem", fontWeight: 500, color: "rgba(255,255,255,0.4)" }}
        >
          How I Help
        </h2>

        {/* Top spacer — vertically centres the card row */}
        <div className="flex-1" />

        {/* Cards */}
        <div
          className={isMobile ? "flex flex-col gap-2" : "flex flex-row items-center justify-center gap-3"}
        >
          {services.map((service) => {
            const isActive = activeService === service.id;

            return (
              <motion.div
                key={service.id}
                data-testid="service-card"
                className="relative overflow-hidden flex-shrink-0 cursor-pointer"
                animate={
                  noMotion
                    ? {}
                    : {
                        flexBasis: isMobile ? "100%" : isActive ? ACTIVE_W : INACTIVE_W,
                        height: isMobile
                          ? isActive
                            ? MOBILE_ACTIVE_H
                            : MOBILE_INACTIVE_H
                          : isActive
                            ? ACTIVE_H
                            : INACTIVE_H,
                      }
                }
                transition={{ duration: 0.8, ease: EASE_ARRAY }}
                style={{
                  borderRadius: "22px",
                  flexBasis: isMobile ? "100%" : isActive ? ACTIVE_W : INACTIVE_W,
                  height: isMobile
                    ? isActive
                      ? MOBILE_ACTIVE_H
                      : MOBILE_INACTIVE_H
                    : isActive
                      ? ACTIVE_H
                      : INACTIVE_H,
                  backgroundColor: isActive
                    ? "#FFFDF5"
                    : "rgba(255,255,255,0.14)",
                  backdropFilter: isActive ? "none" : "blur(10px)",
                  WebkitBackdropFilter: isActive ? "none" : "blur(10px)",
                  border: isActive
                    ? "1px solid rgba(0,0,0,0.06)"
                    : "1px solid rgba(255,255,255,0.22)",
                  transition: noMotion
                    ? "none"
                    : `background-color 0.8s ${EASE}, border-color 0.8s ${EASE}, backdrop-filter 0.8s ${EASE}`,
                }}
                onMouseEnter={!isMobile ? () => setActiveService(service.id) : undefined}
                onClick={
                  isMobile
                    ? () => setActiveService((p) => (p === service.id ? "" : service.id))
                    : undefined
                }
              >
                {/* Inactive title — centered, white, slides up out on active */}
                <div
                  className="absolute inset-0 flex items-center justify-center overflow-hidden"
                  style={{ padding: "1.5rem 1.75rem" }}
                >
                  <h3
                    className="w-full text-center"
                    style={{
                      fontSize: "1.2rem",
                      fontWeight: 400,
                      color: "#ffffff",
                      transform: isActive ? "translateY(-160%)" : "translateY(0%)",
                      opacity: isActive ? 0 : 1,
                      transition: noMotion
                        ? "none"
                        : `transform 0.6s ${EASE}, opacity 0.5s ${EASE}`,
                    }}
                  >
                    {service.title}
                  </h3>
                </div>

                {/* Active content — title at top, CTA at bottom */}
                <div
                  className="absolute inset-0 flex flex-col justify-between"
                  style={{ padding: "1.75rem 1.75rem" }}
                >
                  {/* Top: title + description */}
                  <div>
                    {/* Title (large, dark) */}
                    <div style={{ overflow: "hidden" }}>
                      <p
                        className="text-stone-900"
                        style={{
                          fontSize: "clamp(1.6rem, 2vw, 2.2rem)",
                          fontWeight: 300,
                          lineHeight: 1.1,
                          transform: isActive ? "translateY(0%)" : "translateY(101%)",
                          transition: noMotion ? "none" : `transform 0.7s ${EASE}`,
                        }}
                      >
                        {service.title}
                      </p>
                    </div>

                    {/* Description */}
                    <div style={{ overflow: "hidden", marginTop: "0.875rem" }}>
                      <p
                        className="text-stone-500 leading-relaxed"
                        style={{
                          fontSize: "0.875rem",
                          transform: isActive ? "translateY(0%)" : "translateY(101%)",
                          transition: noMotion
                            ? "none"
                            : `transform 1s ${EASE} ${isActive ? "0.06s" : "0s"}`,
                        }}
                      >
                        {service.description}
                      </p>
                    </div>
                  </div>

                  {/* Bottom: divider + CTA */}
                  <div>
                    <div
                      style={{
                        height: "1px",
                        backgroundColor: "rgb(214,211,209)",
                        transform: isActive ? "scaleX(1)" : "scaleX(0)",
                        transformOrigin: "left center",
                        transition: noMotion
                          ? "none"
                          : `transform 0.8s ${EASE} ${isActive ? "0.12s" : "0s"}`,
                      }}
                    />
                    <div style={{ overflow: "hidden", paddingTop: "0.75rem" }}>
                      <a
                        href={service.href}
                        className="flex items-center justify-between text-stone-900"
                        style={{
                          fontSize: "0.875rem",
                          transform: isActive ? "translateY(0%)" : "translateY(101%)",
                          transition: noMotion
                            ? "none"
                            : `transform 0.6s ${EASE} ${isActive ? "0.16s" : "0s"}`,
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

        {/* Bottom spacer */}
        <div className="flex-1" />
      </div>
    </section>
  );
};
