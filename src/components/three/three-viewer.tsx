import { Suspense } from "react";
import { Scene } from "./scene";
import { ThreeErrorBoundary } from "./three-error-boundary";
import { modelsRegistry } from "./registry";

export interface ThreeViewerProps {
  slug: string;
  fallbackImage: string;
  animated: boolean;
  color?: string;
  accent?: string;
}

export function ThreeViewer({ slug, fallbackImage, animated, color, accent }: ThreeViewerProps) {
  const Model = modelsRegistry[slug];
  
  if (!Model) {
    return (
      <img
        src={fallbackImage}
        alt="Produto 3D não disponível"
        className="object-cover w-full h-full"
      />
    );
  }

  return (
    <Suspense
      fallback={
        <img
          src={fallbackImage}
          alt="Carregando 3D"
          className="opacity-50 object-cover w-full h-full"
        />
      }
    >
      <ThreeErrorBoundary fallbackImage={fallbackImage}>
        <Scene animated={animated}>
          <Model autoRotate={animated} color={color} accent={accent} />
        </Scene>
      </ThreeErrorBoundary>
    </Suspense>
  );
}
