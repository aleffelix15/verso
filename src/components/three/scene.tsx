import { Canvas } from "@react-three/fiber";
import { OrbitControls, ContactShadows } from "@react-three/drei";
import { ReactNode, Suspense, useEffect, useState } from "react";
import { ClientOnly } from "./client-only";

interface SceneProps {
  children: ReactNode;
  animated?: boolean;
}

function hasWebGL() {
  try {
    const canvas = document.createElement("canvas");
    return !!(
      window.WebGLRenderingContext &&
      (canvas.getContext("webgl2") ||
        canvas.getContext("webgl") ||
        canvas.getContext("experimental-webgl"))
    );
  } catch (e) {
    return false;
  }
}

export function Scene({ children, animated = false }: SceneProps) {
  const [isSupported, setIsSupported] = useState(true);

  useEffect(() => {
    setIsSupported(hasWebGL());
  }, []);

  if (!isSupported) {
    return (
      <div className="w-full h-full min-h-[300px] bg-muted/20 flex items-center justify-center text-sm text-muted-foreground">
        WebGL não suportado
      </div>
    );
  }

  return (
    <ClientOnly
      fallback={
        <div className="w-full h-full min-h-[300px] bg-muted/20 animate-pulse flex items-center justify-center text-sm text-muted-foreground">
          Carregando 3D...
        </div>
      }
    >
      <div className="w-full h-full min-h-[300px]">
        <Canvas
          frameloop={animated ? "always" : "demand"}
          dpr={[1, 1.5]}
          gl={{ alpha: true, antialias: true }}
          camera={{ position: [0, 0, 5], fov: 45 }}
        >
          <ambientLight intensity={0.4} />
          <hemisphereLight args={["#ffffff", "#444444", 0.6]} />
          <directionalLight position={[5, 5, 5]} intensity={0.8} />
          <directionalLight position={[-5, 5, 5]} intensity={0.3} color="#ffffff" />
          <directionalLight position={[0, 5, -5]} intensity={0.5} color="#ffffff" />

          <Suspense fallback={null}>
            {children}
            <ContactShadows
              position={[0, -1.2, 0]}
              opacity={0.5}
              scale={10}
              blur={2}
              far={2}
              resolution={256}
              color="#000000"
            />
          </Suspense>

          <OrbitControls enablePan={false} minDistance={2} maxDistance={10} makeDefault />
        </Canvas>
      </div>
    </ClientOnly>
  );
}
