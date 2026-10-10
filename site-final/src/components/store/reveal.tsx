import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";
export function Reveal({ children, className }: { children: ReactNode; className?: string }) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={false}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.08 }}
      transition={{ duration: reduce ? 0 : 0.45 }}
    >
      {children}
    </motion.div>
  );
}
