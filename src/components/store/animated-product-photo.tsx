import { useRef } from "react";
import { useInView, useReducedMotion } from "framer-motion";

type AnimatedProductPhotoProps = {
  src: string | undefined;
  alt: string;
  className?: string;
  width: number;
  height: number;
  loading?: "lazy" | "eager";
};

export function AnimatedProductPhoto(props: AnimatedProductPhotoProps) {
  const ref = useRef<HTMLImageElement>(null);
  const visible = useInView(ref, { amount: 0.2 });
  const reduceMotion = useReducedMotion();
  const active = visible && !reduceMotion;

  return (
    <img
      {...props}
      ref={ref}
      className={`animated-product-photo ${props.className ?? ""}`}
      data-motion-active={active ? "true" : "false"}
    />
  );
}
