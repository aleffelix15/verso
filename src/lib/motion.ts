import type { Variants, Transition } from "framer-motion";

/**
 * VERSO Motion Tokens & Variants
 * Follows design principles:
 * - Only animate transform and opacity
 * - Durations 150ms–400ms
 * - Consistent custom easing
 * - Respect prefers-reduced-motion
 */

export const EASINGS = {
  easeOut: [0.16, 1, 0.3, 1] as const,
  easeInOut: [0.65, 0, 0.35, 1] as const,
};

export const DURATIONS = {
  fast: 0.15,
  base: 0.25,
  slow: 0.4,
};

export const defaultTransition: Transition = {
  duration: DURATIONS.base,
  ease: EASINGS.easeOut,
};

export const fadeUp: Variants = {
  initial: { opacity: 0, y: 20 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: DURATIONS.slow, ease: EASINGS.easeOut },
  },
  exit: {
    opacity: 0,
    y: -10,
    transition: { duration: DURATIONS.fast, ease: EASINGS.easeInOut },
  },
};

export const staggerContainer = (staggerDelay = 0.06): Variants => ({
  initial: {},
  animate: {
    transition: {
      staggerChildren: staggerDelay,
    },
  },
});

export const scaleIn: Variants = {
  initial: { opacity: 0, scale: 0.95 },
  animate: {
    opacity: 1,
    scale: 1,
    transition: { duration: DURATIONS.base, ease: EASINGS.easeOut },
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    transition: { duration: DURATIONS.fast, ease: EASINGS.easeOut },
  },
};

export const slideInRight: Variants = {
  initial: { opacity: 0, x: 20 },
  animate: {
    opacity: 1,
    x: 0,
    transition: { duration: DURATIONS.base, ease: EASINGS.easeOut },
  },
  exit: {
    opacity: 0,
    x: -20,
    transition: { duration: DURATIONS.fast, ease: EASINGS.easeInOut },
  },
};

export const heroLineMask: Variants = {
  initial: { y: "110%", opacity: 0 },
  animate: {
    y: "0%",
    opacity: 1,
    transition: { duration: DURATIONS.slow, ease: EASINGS.easeOut },
  },
};

export const bumpBadge: Variants = {
  initial: { scale: 1 },
  bump: {
    scale: [1, 1.35, 1],
    transition: { duration: 0.25, ease: EASINGS.easeOut },
  },
};

export const shakeIcon: Variants = {
  initial: { x: 0 },
  shake: {
    x: [0, -3, 3, -2, 2, 0],
    transition: { duration: 0.35, ease: EASINGS.easeInOut },
  },
};

/**
 * Executes a callback wrapped in Document View Transitions API if supported,
 * otherwise runs immediately.
 */
export function startSafeViewTransition(updateFn: () => void | Promise<void>) {
  if (
    typeof document !== "undefined" &&
    "startViewTransition" in document &&
    typeof (
      document as unknown as { startViewTransition?: (cb: () => void | Promise<void>) => unknown }
    ).startViewTransition === "function"
  ) {
    return (
      document as unknown as {
        startViewTransition: (cb: () => void | Promise<void>) => unknown;
      }
    ).startViewTransition(updateFn);
  }
  return updateFn();
}
