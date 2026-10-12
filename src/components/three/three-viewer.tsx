import { Suspense, useState, useRef, useEffect } from "react";
import { Scene } from "./scene";
import { ThreeErrorBoundary } from "./three-error-boundary";
import { modelsRegistry } from "./registry";
import { Play, Pause, RotateCcw, RotateCw, RefreshCw } from "lucide-react";
import { Button } from "../ui/button";

export interface ThreeViewerProps {
  slug: string;
  fallbackImage: string;
  animated: boolean;
  color?: string;
  accent?: string;
}

export function ThreeViewer({
  slug,
  fallbackImage,
  animated: initialAnimated,
  color,
  accent,
}: ThreeViewerProps) {
  const Model = modelsRegistry[slug];
  const [isAnimated, setIsAnimated] = useState(initialAnimated);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const controlsRef = useRef<any>(null);

  // Garantir que não haja vazamento ao mudar de rota
  useEffect(() => {
    setIsAnimated(initialAnimated);
  }, [slug, initialAnimated]);

  if (!Model) {
    return (
      <img
        src={fallbackImage}
        alt="Produto 3D não disponível"
        className="object-cover w-full h-full"
      />
    );
  }

  const handleLeft = () => {
    if (controlsRef.current) {
      controlsRef.current.setAzimuthalAngle(controlsRef.current.getAzimuthalAngle() - Math.PI / 4);
    }
  };

  const handleRight = () => {
    if (controlsRef.current) {
      controlsRef.current.setAzimuthalAngle(controlsRef.current.getAzimuthalAngle() + Math.PI / 4);
    }
  };

  const handleReset = () => {
    if (controlsRef.current) {
      controlsRef.current.reset();
    }
  };

  return (
    <div className="relative w-full h-full group">
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
          <Scene animated={isAnimated} controlsRef={controlsRef}>
            <Model autoRotate={isAnimated} color={color} accent={accent} />
          </Scene>
        </ThreeErrorBoundary>
      </Suspense>

      {/* Controles de Câmera */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-background/80 backdrop-blur-md p-2 rounded-full border shadow-sm opacity-0 group-hover:opacity-100 transition-opacity focus-within:opacity-100">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 rounded-full"
          onClick={() => setIsAnimated(!isAnimated)}
          title="Auto-rotate"
        >
          {isAnimated ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
        </Button>
        <div className="w-px h-4 bg-border mx-1" />
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 rounded-full"
          onClick={handleLeft}
          title="Girar Esquerda"
        >
          <RotateCcw className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 rounded-full"
          onClick={handleReset}
          title="Resetar Posição"
        >
          <RefreshCw className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 rounded-full"
          onClick={handleRight}
          title="Girar Direita"
        >
          <RotateCw className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
