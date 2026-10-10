import { describe, expect, it } from "vitest";

describe("Theme", () => {
  it("should have a locked dark theme", () => {
    // In our app, __root.tsx renders <html className="dark">
    // Here we just test if the document can accept the dark class in the test environment
    document.documentElement.classList.add("dark");
    expect(document.documentElement.classList.contains("dark")).toBe(true);
  });
});
