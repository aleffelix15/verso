import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";
import { EASINGS, DURATIONS } from "@/lib/motion";

export function Reveal({
  children,
  className,
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  const reduce = useReducedMotion();

  return (
    <motion.div
      className={className}
      initial={reduce ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.08 }}
      transition={{
        duration: reduce ? 0 : DURATIONS.slow,
        ease: EASINGS.easeOut,
        delay,
      }}
    >
      {children}
    </motion.div>
  );
}
