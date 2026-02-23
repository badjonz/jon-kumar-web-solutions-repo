"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

const EASE_ARRAY = [0.22, 1, 0.36, 1] as const;

interface CTALinkProps {
  href: string;
  noMotion: boolean;
  label?: string;
}

export function CTALink({ href, noMotion, label = "Get in touch" }: CTALinkProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <a
      href={href}
      className="flex items-center justify-between text-stone-900"
      style={{ fontSize: "0.875rem" }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <motion.span
        animate={noMotion ? {} : { x: isHovered ? 3 : 0 }}
        transition={{ duration: 0.5, ease: EASE_ARRAY }}
      >
        {label}
      </motion.span>

      {/* Arrow: overflow-hidden wrapper clips two stacked arrows */}
      <div
        style={{
          width: "1rem",
          height: "1rem",
          overflow: "hidden",
          position: "relative",
          flexShrink: 0,
        }}
      >
        {/* Arrow 1: visible at rest, exits right on hover */}
        <motion.div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          animate={noMotion ? {} : { x: isHovered ? "100%" : "0%" }}
          transition={{ duration: 0.5, ease: EASE_ARRAY }}
        >
          <ArrowRight className="w-4 h-4" aria-hidden="true" />
        </motion.div>
        {/* Arrow 2: hidden to the left at rest, enters from left on hover */}
        <motion.div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          animate={noMotion ? {} : { x: isHovered ? "0%" : "-100%" }}
          transition={{ duration: 0.5, ease: EASE_ARRAY }}
        >
          <ArrowRight className="w-4 h-4" aria-hidden="true" />
        </motion.div>
      </div>
    </a>
  );
}
