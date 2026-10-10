import { createContext, useContext, useEffect, useState, useMemo } from "react";

type ThemePreference = "system" | "light" | "dark";
type ResolvedTheme = "light" | "dark";

interface ThemeProviderState {
  preference: ThemePreference;
  resolvedTheme: ResolvedTheme;
  setPreference: (preference: ThemePreference) => void;
}

const ThemeContext = createContext<ThemeProviderState | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [preference, setPreferenceState] = useState<ThemePreference>("system");
  const [resolvedTheme, setResolvedTheme] = useState<ResolvedTheme>("light");

  // Initial read (client-side only to avoid hydration mismatch, but it quickly syncs)
  useEffect(() => {
    try {
      const stored = localStorage.getItem("verso-theme");
      if (stored === "light" || stored === "dark") {
        setPreferenceState(stored);
      }
      // Resolved theme has already been set by inline script in head, so we read it
      setResolvedTheme(document.documentElement.classList.contains("dark") ? "dark" : "light");
    } catch {
      // Theme storage may be unavailable in restricted browser contexts.
    }
  }, []);

  const setPreference = (newPref: ThemePreference) => {
    setPreferenceState(newPref);
    try {
      if (newPref === "system") {
        localStorage.removeItem("verso-theme");
      } else {
        localStorage.setItem("verso-theme", newPref);
      }
    } catch {
      // Theme storage may be unavailable in restricted browser contexts.
    }

    const isDark =
      newPref === "dark" ||
      (newPref === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches);

    document.documentElement.classList.toggle("dark", isDark);
    document.documentElement.style.colorScheme = isDark ? "dark" : "light";
    setResolvedTheme(isDark ? "dark" : "light");

    // Update meta theme-color dynamic
    const metaThemeColor = document.querySelector('meta[name="theme-color"]:not([media])');
    if (metaThemeColor) {
      metaThemeColor.setAttribute("content", isDark ? "#0a0a0a" : "#f8f8f8");
    }
  };

  // Listen to system changes if preference is 'system'
  useEffect(() => {
    if (preference !== "system") return;

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = (e: MediaQueryListEvent) => {
      const isDark = e.matches;
      document.documentElement.classList.toggle("dark", isDark);
      document.documentElement.style.colorScheme = isDark ? "dark" : "light";
      setResolvedTheme(isDark ? "dark" : "light");

      const metaThemeColor = document.querySelector('meta[name="theme-color"]:not([media])');
      if (metaThemeColor) {
        metaThemeColor.setAttribute("content", isDark ? "#0a0a0a" : "#f8f8f8");
      }
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [preference]);

  // Sync across tabs
  useEffect(() => {
    const handleStorage = (e: StorageEvent) => {
      if (e.key === "verso-theme") {
        const newVal = e.newValue;
        if (newVal === "light" || newVal === "dark") {
          setPreference(newVal);
        } else if (newVal === null) {
          setPreference("system");
        }
      }
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  const value = useMemo(
    () => ({ preference, resolvedTheme, setPreference }),
    [preference, resolvedTheme],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
