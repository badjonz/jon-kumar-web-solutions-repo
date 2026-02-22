"use client";

import { Variants } from "framer-motion";
import { useReducedMotion } from "framer-motion";

/**
 * Original fade-up — kept for backward compatibility.
 * New components should prefer `revealUp`.
 */
export const fadeUp: Variants = {
  hidden: {
    opacity: 0,
    y: 20,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut",
    },
  },
};

/**
 * The signature Yucca entrance: elements rise 60px with a long, weighted deceleration.
 * Use for section headings and primary content reveals.
 */
export const revealUp: Variants = {
  hidden: { opacity: 0, y: 60 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: [0.25, 0.1, 0.25, 1.0],
    },
  },
};

/**
 * Container variant that staggers children reveals with choreographed timing.
 * Pair with `revealUp` on each child.
 *
 * @example
 * ```tsx
 * <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true }}>
 *   <motion.div variants={revealUp}>Card 1</motion.div>
 *   <motion.div variants={revealUp}>Card 2</motion.div>
 * </motion.div>
 * ```
 */
export const staggerContainer: Variants = {
  hidden: { opacity: 1 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1,
    },
  },
};

/**
 * Emphasis reveal for hero headlines and key section headings.
 * Combines upward movement with a subtle scale-up.
 * Use sparingly — only on the hero headline and primary section headings.
 */
export const revealScale: Variants = {
  hidden: { opacity: 0, y: 40, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.9,
      ease: [0.25, 0.1, 0.25, 1.0],
    },
  },
};

/**
 * Soft content reveal for body text and secondary content.
 * Opacity only — no movement — so the animation stays invisible to the eye
 * while still creating a composed appearance.
 */
export const revealFade: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.6,
      ease: "easeOut",
    },
  },
};

/**
 * Hook that returns animation variants respecting `prefers-reduced-motion`.
 * When reduced motion is set, all variants return final (visible) state instantly
 * with no transforms or transitions.
 *
 * @example
 * ```tsx
 * const variants = useAnimationVariants(revealUp);
 * <motion.div variants={variants} initial="hidden" whileInView="visible" />
 * ```
 */
export function useAnimationVariants<T extends Variants>(variants: T): T {
  const shouldReduceMotion = useReducedMotion();
  if (shouldReduceMotion) {
    return Object.fromEntries(
      Object.entries(variants).map(([key]) => [
        key,
        key === "hidden" ? { opacity: 1 } : { opacity: 1, y: 0, scale: 1 },
      ])
    ) as T;
  }
  return variants;
}
