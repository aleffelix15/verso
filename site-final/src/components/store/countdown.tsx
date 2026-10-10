import { useEffect, useState } from "react";
import { storeConfig } from "@/data/products";
import { motion, AnimatePresence } from "framer-motion";
export function Countdown() {
  const [seconds, setSeconds] = useState<number | null>(null);
  useEffect(() => {
    const tick = () =>
      setSeconds(
        Math.max(0, Math.floor((new Date(storeConfig.dropDeadline).getTime() - Date.now()) / 1000)),
      );
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);
  if (seconds === 0) return <p className="eyebrow mt-6">DROP ABERTO · ENQUANTO DURAREM AS PEÇAS</p>;
  const values =
    seconds === null
      ? ["—", "—", "—", "—"]
      : [
          Math.floor(seconds / 86400),
          Math.floor((seconds % 86400) / 3600),
          Math.floor((seconds % 3600) / 60),
          seconds % 60,
        ].map((n) => String(n).padStart(2, "0"));
  return (
    <div>
      <div className="countdown" aria-label="Contagem regressiva do drop">
        {["DIAS", "HORAS", "MIN", "SEG"].map((label, i) => (
          <div key={label} className="flex flex-col items-center">
            <div className="relative overflow-hidden h-[1.2em] w-12 flex justify-center items-center">
              <AnimatePresence mode="popLayout">
                <motion.strong
                  key={values[i]}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -20, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="absolute"
                >
                  {values[i]}
                </motion.strong>
              </AnimatePresence>
            </div>
            <small>{label}</small>
          </div>
        ))}
      </div>
      <p className="eyebrow mt-3 text-chalk">ENCERRAMENTO DEMONSTRATIVO DO DROP</p>
    </div>
  );
}
