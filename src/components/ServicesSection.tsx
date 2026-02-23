"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { CTALink } from "@/components/CTALink";
import { useLenis } from "lenis/react";
import { SplitLines } from "@/components/SplitLines";

const EASE = "cubic-bezier(0.22, 1, 0.36, 1)";
const EASE_ARRAY = [0.22, 1, 0.36, 1] as const;

const services = [
  {
    id: "visibility",
    title: "Get Found Online",
    description:
      "Rank above your competitors before they even know you exist. Local SEO that puts you in front of people already searching for what you offer.",
    href: "#contact",
    image:
      "https://images.unsplash.com/photo-1573804633927-bfcbcd909acd?w=1400&q=80",
  },
  {
    id: "design",
    title: "Websites That Convert",
    description:
      "First impressions happen in seconds. A site designed to earn trust instantly and guide every visitor toward becoming a paying client.",
    href: "#contact",
    image:
      "https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=1400&q=80",
  },
  {
    id: "ownership",
    title: "Own Your Presence",
    description:
      "Social media can disappear overnight. A website is a permanent asset — one you own, control, and grow entirely on your own terms.",
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

const MOBILE_ACTIVE_H = 240;
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
      style={{ height: isMobile ? "520px" : "100svh" }}
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
        className={`relative z-10 mx-auto w-full max-w-[1200px] flex flex-col px-4 md:px-6 lg:px-8 ${isMobile ? "" : "h-full"}`}
        style={{
          paddingTop: isMobile ? "2.5rem" : "3.5rem",
          paddingBottom: isMobile ? "3rem" : "2.5rem",
        }}
      >
        {/* Section label */}
        <h2
          id="services-heading"
          className="uppercase tracking-widest"
          style={{ fontSize: "0.7rem", fontWeight: 500, color: "rgba(255,255,255,0.4)" }}
        >
          How I Help
        </h2>

        {/* Top spacer — desktop only: vertically centres the card row */}
        {!isMobile && <div className="flex-1" />}

        {/* Cards */}
        <div
          className={isMobile ? "flex flex-col gap-2 mt-4" : "flex flex-row items-center justify-center gap-3"}
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
                    : isMobile
                      ? { height: isActive ? MOBILE_ACTIVE_H : MOBILE_INACTIVE_H, flexBasis: "auto" }
                      : {
                          flexBasis: isActive ? ACTIVE_W : INACTIVE_W,
                          height: isActive ? ACTIVE_H : INACTIVE_H,
                        }
                }
                transition={{ duration: 0.8, ease: EASE_ARRAY }}
                style={{
                  borderRadius: "22px",
                  ...(isMobile
                    ? { width: "100%", height: isActive ? MOBILE_ACTIVE_H : MOBILE_INACTIVE_H, flexBasis: "auto" }
                    : { flexBasis: isActive ? ACTIVE_W : INACTIVE_W, height: isActive ? ACTIVE_H : INACTIVE_H }
                  ),
                  backgroundColor: isActive
                    ? "#FFFDF5"
                    : "rgba(255,255,255,0.25)",
                  backdropFilter: isActive ? "none" : "blur(27px)",
                  WebkitBackdropFilter: isActive ? "none" : "blur(27px)",
                  border: isActive
                    ? "1px solid rgba(0,0,0,0.06)"
                    : "none",
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
                {/* Inactive title — centered, white, fades out on active */}
                <div
                  className="absolute inset-0 flex items-center justify-center"
                  style={{ padding: "1.5rem 1.75rem" }}
                >
                  <h3
                    className="w-full text-center"
                    style={{
                      fontSize: "1.2rem",
                      fontWeight: 400,
                      color: "#ffffff",
                      opacity: isActive ? 0 : 1,
                      transition: noMotion
                        ? "none"
                        : `opacity 0.4s ${EASE}`,
                    }}
                  >
                    {service.title}
                  </h3>
                </div>

                {/* Active content — title (desktop only) + description + CTA */}
                <div
                  className="absolute inset-0 flex flex-col justify-between"
                  style={{ padding: "1.75rem 1.75rem" }}
                >
                  {/* Top: title + description */}
                  <div>
                    {/* Title — full animated version on desktop; compact fade on mobile */}
                    {isMobile ? (
                      <p
                        className="text-stone-900"
                        style={{
                          fontSize: "1.05rem",
                          fontWeight: 500,
                          lineHeight: 1.2,
                          opacity: isActive ? 1 : 0,
                          transition: noMotion ? "none" : `opacity 0.4s ${EASE}`,
                        }}
                      >
                        {service.title}
                      </p>
                    ) : (
                      <SplitLines
                        text={service.title}
                        isActive={isActive}
                        noMotion={noMotion}
                        className="text-stone-900"
                        style={{ fontSize: "clamp(1.6rem, 2vw, 2.2rem)", fontWeight: 300, lineHeight: 1.1 }}
                        delayStart={0.02}
                        lineDelay={0.04}
                        duration={0.4}
                      />
                    )}

                    {/* Description — each visual line slides up from clip */}
                    {/* key includes isMobile so it remounts and remeasures at the correct card width */}
                    <SplitLines
                      key={`${service.id}-${isMobile}`}
                      text={service.description}
                      isActive={isActive}
                      noMotion={noMotion}
                      className="text-stone-500 leading-relaxed"
                      style={{ fontSize: "0.875rem", marginTop: "0.5rem" }}
                      delayStart={isMobile ? 0.04 : 0.1}
                      lineDelay={0.04}
                      duration={0.4}
                    />
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
                      <motion.div
                        animate={noMotion ? {} : { y: isActive ? "0%" : "102%" }}
                        transition={{ duration: 0.5, ease: EASE_ARRAY, delay: isActive ? 0.08 : 0 }}
                      >
                        <CTALink href={service.href} noMotion={noMotion} />
                      </motion.div>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Bottom spacer — desktop only */}
        {!isMobile && <div className="flex-1" />}
      </div>
    </section>
  );
};
