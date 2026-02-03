import { Variants } from "framer-motion";

/**
 * A reusable Framer Motion variants object for a standard "fade-up" entrance animation.
 *
 * @example
 * ```tsx
 * import { motion } from "framer-motion";
 * import { fadeUp } from "@/lib/animations";
 *
 * const MyComponent = () => (
 *   <motion.div
 *     initial="hidden"
 *     animate="visible"
 *     variants={fadeUp}
 *     transition={{ duration: 0.5 }}
 *   >
 *     Hello, I fade up!
 *   </motion.div>
 * );
 * ```
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
