import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment, ContactShadows } from "@react-three/drei";
import { ReactNode, Suspense } from "react";
import { ClientOnly } from "./client-only";

interface SceneProps {
  children: ReactNode;
}

export function Scene({ children }: SceneProps) {
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
          frameloop="demand"
          dpr={[1, 1.5]} // Limite entre 1 e 1.5 para salvar bateria
          gl={{ alpha: true, antialias: true }}
          camera={{ position: [0, 0, 5], fov: 45 }}
        >
          {/* Iluminação de 3 pontos para maior realismo */}
          <ambientLight intensity={0.4} />
          <directionalLight position={[5, 5, 5]} intensity={0.8} />
          <directionalLight position={[-5, 5, 5]} intensity={0.3} color="#ffffff" />
          <directionalLight position={[0, 5, -5]} intensity={0.5} color="#ffffff" />

          <Suspense fallback={null}>
            {/* Environment com preset urbano/neutro otimizado */}
            <Environment preset="city" />
            {children}
            {/* Sombra de contato suave e otimizada */}
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

          {/* Controles restritos para não deixar o usuário se perder no void */}
          <OrbitControls enablePan={false} minDistance={2} maxDistance={10} makeDefault />
        </Canvas>
      </div>
    </ClientOnly>
  );
}
