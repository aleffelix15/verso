import { describe, it, expect } from "vitest";
import { getHexColor } from "../components/three/color-map";

describe("color-map", () => {
  it("should return correct hex for known colors", () => {
    expect(getHexColor("Preto lavado")).toBe("#1f1f1f");
    expect(getHexColor("Off-white")).toBe("#f5f5f0");
  });

  it("should return default hex for unknown colors", () => {
    expect(getHexColor("Unknown")).toBe("#0E0E0E");
  });

  it("should return default hex when undefined", () => {
    expect(getHexColor()).toBe("#0E0E0E");
  });
});
