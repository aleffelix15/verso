import { describe, it, expect } from "vitest";
import { modelsRegistry } from "../components/three/registry";

describe("modelsRegistry", () => {
  it("should contain all 5 models", () => {
    expect(modelsRegistry).toHaveProperty("camiseta-luz");
    expect(modelsRegistry).toHaveProperty("moletom-salmo-23");
    expect(modelsRegistry).toHaveProperty("bone-verso");
    expect(modelsRegistry).toHaveProperty("jaqueta-graca");
    expect(modelsRegistry).toHaveProperty("calca-firme");
  });
});
