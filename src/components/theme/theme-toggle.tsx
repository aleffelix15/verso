import { Moon, Sun, Monitor } from "lucide-react";
import { useTheme } from "./theme-provider";
import { useEffect, useState } from "react";

export function ThemeToggle() {
  const { preference, setPreference } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const cycleTheme = () => {
    if (preference === "system") setPreference("light");
    else if (preference === "light") setPreference("dark");
    else setPreference("system");
  };

  const getLabel = () => {
    if (preference === "system") return "Alternar tema: atual Sistema";
    if (preference === "light") return "Alternar tema: atual Claro";
    return "Alternar tema: atual Escuro";
  };

  if (!mounted) {
    // Placeholder neutro durante SSR para evitar hydration mismatch
    return (
      <button
        type="button"
        className="relative min-w-[44px] min-h-[44px] flex items-center justify-center rounded-full hover:bg-muted/50 transition-colors"
        aria-hidden="true"
      >
        <div className="w-5 h-5" />
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={cycleTheme}
      aria-label={getLabel()}
      className="relative min-w-[44px] min-h-[44px] flex items-center justify-center rounded-full hover:bg-muted/50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
    >
      {preference === "light" && <Sun className="w-5 h-5 transition-transform duration-300" />}
      {preference === "dark" && <Moon className="w-5 h-5 transition-transform duration-300" />}
      {preference === "system" && <Monitor className="w-5 h-5 transition-transform duration-300" />}
    </button>
  );
}
