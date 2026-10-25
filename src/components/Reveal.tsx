import { motion, useReducedMotion, type HTMLMotionProps } from "motion/react";
import type { ReactNode } from "react";

interface RevealProps {
  children: ReactNode;
  className?: string;
  /** Seconds to wait before the reveal starts. */
  delay?: number;
  /** Vertical offset in px. */
  y?: number;
}

/**
 * Subtle scroll-reveal wrapper. Respects prefers-reduced-motion by
 * rendering content statically when the user opted out of animations.
 */
export function Reveal({ children, className, delay = 0, y = 24 }: RevealProps) {
  const reduced = useReducedMotion();

  const animationProps: HTMLMotionProps<"div"> = reduced
    ? {}
    : {
        initial: { opacity: 0, y },
        whileInView: { opacity: 1, y: 0 },
        transition: { duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] },
      };

  return (
    <motion.div className={className} viewport={{ once: true, margin: "-80px" }} {...animationProps}>
      {children}
    </motion.div>
  );
}
