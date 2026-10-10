import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment } from "@react-three/drei";
import { ReactNode, Suspense } from "react";
import { ClientOnly } from "./client-only";

interface SceneProps {
  children: ReactNode;
}

export function Scene({ children }: SceneProps) {
  return (
    <ClientOnly fallback={<div className="w-full h-full min-h-[300px] bg-muted/20 animate-pulse flex items-center justify-center text-sm text-muted-foreground">Carregando 3D...</div>}>
      <div className="w-full h-full min-h-[300px]">
        <Canvas
          frameloop="demand"
          dpr={[1, 1.5]} // Limite entre 1 e 1.5 para salvar bateria
          gl={{ alpha: true, antialias: true }}
          camera={{ position: [0, 0, 5], fov: 45 }}
        >
          {/* Luz global bem suave preenchendo as sombras */}
          <ambientLight intensity={0.5} />
          
          {/* Luz direcional principal atuando como Sol */}
          <directionalLight position={[10, 10, 5]} intensity={1} />
          
          <Suspense fallback={null}>
            {/* Environment com preset urbano/neutro otimizado */}
            <Environment preset="city" />
            {children}
          </Suspense>
          
          {/* Controles restritos para não deixar o usuário se perder no void */}
          <OrbitControls 
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
