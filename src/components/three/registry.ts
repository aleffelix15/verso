import React from "react";

export const modelsRegistry: Record<string, React.LazyExoticComponent<React.ComponentType<unknown>>> = {
  "camiseta-luz": React.lazy(() =>
    import("./models/camiseta-oversized").then((m) => ({ default: m.CamisetaOversized })),
  ),
  "moletom-salmo-23": React.lazy(() =>
    import("./models/moletom-boxy").then((m) => ({ default: m.MoletomBoxy })),
  ),
  "bone-verso": React.lazy(() =>
    import("./models/bone-5-paineis").then((m) => ({ default: m.Bone5Paineis })),
  ),
  "jaqueta-graca": React.lazy(() =>
    import("./models/jaqueta-coach").then((m) => ({ default: m.JaquetaCoach })),
  ),
  "calca-firme": React.lazy(() =>
    import("./models/calca-cargo").then((m) => ({ default: m.CalcaCargo })),
  ),
};
