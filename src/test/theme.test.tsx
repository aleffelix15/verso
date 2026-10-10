import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import React from "react";
import { useTheme, ThemeProvider } from "@/components/theme/theme-provider";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Mock matchMedia
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // deprecated
    removeListener: vi.fn(), // deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

function TestComponent() {
  useTheme();
  return <div>Works</div>;
}

describe("Theme Context", () => {
  it("useTheme should throw when used outside of ThemeProvider", () => {
    // Suppress console.error for the expected throw
    const spy = vi.spyOn(console, "error");
    spy.mockImplementation(() => {});
    
    expect(() => render(<TestComponent />)).toThrow("useTheme must be used within a ThemeProvider");
    
    spy.mockRestore();
  });

  it("ThemeToggle should render successfully within ThemeProvider", () => {
    expect(() =>
      render(
        <ThemeProvider>
          <ThemeToggle />
        </ThemeProvider>
      )
    ).not.toThrow();
  });
});
