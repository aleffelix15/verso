import { describe, it, expect, vi } from "vitest";
import { makeLabelTexture, disposeLabelTexture } from "../components/three/make-label-texture";
import * as THREE from "three";

describe("makeLabelTexture", () => {
  it("should generate a CanvasTexture", () => {
    // Mock getContext to avoid jsdom missing canvas 2d features
    HTMLCanvasElement.prototype.getContext = vi.fn().mockReturnValue({
      fillRect: vi.fn(),
      fillText: vi.fn(),
      createLinearGradient: vi.fn().mockReturnValue({
        addColorStop: vi.fn(),
      }),
    } as unknown as CanvasRenderingContext2D);

    const texture = makeLabelTexture({ text: "TEST", color: "#F8F8F8", bgColor: "#0A0A0A" });
    expect(texture).toBeInstanceOf(THREE.CanvasTexture);

    // Dispose it
    disposeLabelTexture({ text: "TEST", color: "#F8F8F8", bgColor: "#0A0A0A" });
  });
});
