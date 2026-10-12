import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { ThreeErrorBoundary } from "../components/three/three-error-boundary";
import React from "react";

// Mute console.error for the expected error boundary catch
const originalError = console.error;
beforeAll(() => {
  console.error = vi.fn();
});
afterAll(() => {
  console.error = originalError;
});

const ThrowError = () => {
  throw new Error("R3F: Hooks can only be used within the Canvas component!");
};

describe("ThreeErrorBoundary", () => {
  it("renders children when no error occurs", () => {
    render(
      <ThreeErrorBoundary fallbackImage="/fallback.jpg">
        <div data-testid="success">Success</div>
      </ThreeErrorBoundary>,
    );
    expect(screen.getByTestId("success")).toBeDefined();
  });

  it("catches error and renders fallback UI", () => {
    render(
      <ThreeErrorBoundary fallbackImage="/fallback.jpg">
        <ThrowError />
      </ThreeErrorBoundary>,
    );
    expect(screen.getByText("3D indisponível neste dispositivo")).toBeDefined();
    const img = screen.getByAltText("Produto") as HTMLImageElement;
    expect(img.src).toContain("fallback.jpg");
  });
});
