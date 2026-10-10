import { Canvas, useThree } from "@react-three/fiber";
import { OrbitControls, ContactShadows } from "@react-three/drei";
import { ReactNode, Suspense, useEffect, useState, useRef } from "react";
import { ClientOnly } from "./client-only";
import * as THREE from "three";

interface SceneProps {
  children: ReactNode;
  animated?: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  controlsRef?: React.RefObject<any | null>;
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

export function Scene({ children, animated = false, controlsRef }: SceneProps) {
  const [isSupported, setIsSupported] = useState(true);
  const [isVisible, setIsVisible] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsSupported(hasWebGL());
  }, []);

  useEffect(() => {
    const handleVisibilityChange = () => {
      setIsVisible(document.visibilityState === "visible");
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, []);

  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new IntersectionObserver(([entry]) => setIsVisible(entry.isIntersecting), {
      threshold: 0.1,
    });
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  if (!isSupported) {
    throw new Error("WebGL não suportado neste dispositivo.");
  }

  // Se estiver animado e visível, frameloop é always. Senão, demand.
  const frameloop = animated && isVisible ? "always" : "demand";

  return (
    <ClientOnly
      fallback={
        <div className="w-full h-full min-h-[300px] bg-muted/20 animate-pulse flex items-center justify-center text-sm text-muted-foreground">
          Carregando 3D...
        </div>
      }
    >
      <div
        className="w-full h-full min-h-[300px]"
        ref={containerRef}
        style={{ touchAction: "pan-y" }}
      >
        <Canvas
          frameloop={frameloop}
          dpr={[1, 1.5]}
          gl={{ alpha: true, antialias: true, powerPreference: "high-performance" }}
          camera={{ position: [0, 0, 5], fov: 45 }}
          onCreated={({ gl }) => {
            gl.domElement.addEventListener("webglcontextlost", (e) => {
              e.preventDefault();
              setIsSupported(false);
            });
            gl.domElement.addEventListener("webglcontextrestored", () => {
              setIsSupported(true);
            });
          }}
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

          <OrbitControls
            ref={controlsRef}
            enablePan={false}
            minDistance={2}
            maxDistance={10}
            makeDefault
          />
        </Canvas>
      </div>
    </ClientOnly>
  );
}
