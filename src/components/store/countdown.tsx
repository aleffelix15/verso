import { useEffect, useState, useCallback } from "react";
import { storeConfig } from "@/data/products";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function calculateTimeRemaining(targetIso: string): number {
  const targetTime = new Date(targetIso).getTime();
  const now = Date.now();
  return Math.max(0, Math.floor((targetTime - now) / 1000));
}

export function Countdown() {
  const [mounted, setMounted] = useState(false);
  const [seconds, setSeconds] = useState<number>(0);
  const [reminded, setReminded] = useState(false);

  const tick = useCallback(() => {
    setSeconds(calculateTimeRemaining(storeConfig.dropDeadline));
  }, []);

  useEffect(() => {
    setMounted(true);
    tick();

    let intervalId: ReturnType<typeof setInterval> | null = setInterval(tick, 1000);

    const handleVisibility = () => {
      if (document.hidden) {
        if (intervalId) {
          clearInterval(intervalId);
          intervalId = null;
        }
      } else {
        tick();
        if (!intervalId) {
          intervalId = setInterval(tick, 1000);
        }
      }
    };

    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      if (intervalId) clearInterval(intervalId);
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, [tick]);

  const handleRemindMe = () => {
    setReminded(true);
    const text = encodeURIComponent(
      "Olá, VERSO! Gostaria de receber um lembrete exclusivo assim que o próximo Drop estiver no ar.",
    );
    window.open(
      `https://wa.me/${storeConfig.whatsapp}?text=${text}`,
      "_blank",
      "noopener,noreferrer",
    );
  };

  if (!mounted) {
    return (
      <div className="countdown" aria-label="Carregando contagem regressiva">
        {["DIAS", "HORAS", "MIN", "SEG"].map((label) => (
          <div key={label} className="flex flex-col items-center">
            <div className="h-[1.2em] w-12 flex justify-center items-center font-display text-3xl opacity-30">
              --
            </div>
            <small className="font-mono text-[10px] text-muted-foreground uppercase">{label}</small>
          </div>
        ))}
      </div>
    );
  }

  if (seconds === 0) {
    return (
      <div className="mt-4 p-4 bg-brand/10 border border-brand text-foreground">
        <p className="eyebrow-red mb-1">LANÇAMENTO ATIVO</p>
        <h3 className="font-display text-2xl font-bold uppercase tracking-wider text-brand">
          DROP DISPONÍVEL AGORA
        </h3>
        <p className="text-xs text-muted-foreground mt-1">
          Peças exclusivas com tiragem limitada. Garanta a sua antes que esgote.
        </p>
      </div>
    );
  }

  const values = [
    Math.floor(seconds / 86400),
    Math.floor((seconds % 86400) / 3600),
    Math.floor((seconds % 3600) / 60),
    seconds % 60,
  ].map((n) => String(n).padStart(2, "0"));

  return (
    <div className="flex flex-col gap-5">
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
                  transition={{ duration: 0.25 }}
                  className="absolute font-display text-3xl sm:text-4xl text-foreground font-bold"
                >
                  {values[i]}
                </motion.strong>
              </AnimatePresence>
            </div>
            <small className="font-mono text-[10px] text-muted-foreground uppercase tracking-widest mt-1">
              {label}
            </small>
          </div>
        ))}
      </div>

      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleRemindMe}
          className="font-mono text-xs uppercase tracking-wider gap-2 rounded-none border-border hover:border-brand"
        >
          <Bell size={13} className="text-brand" />
          {reminded ? "Lembrete solicitado" : "Lembrar-me no WhatsApp"}
        </Button>
        <span className="font-mono text-[10px] text-muted-foreground uppercase tracking-wider">
          Encerramento demonstrativo · Fuso de Brasília
        </span>
      </div>
    </div>
  );
}
