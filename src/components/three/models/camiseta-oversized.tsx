import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useLabelTexture } from "../make-label-texture";

export interface ModelProps {
  color?: string;
  accent?: string;
  autoRotate?: boolean;
}

export function CamisetaOversized({
  color = "#0E0E0E",
  accent = "#ff4500",
  autoRotate = false,
}: ModelProps) {
  const groupRef = useRef<THREE.Group>(null);
  
  const labelTexture = useLabelTexture({
    text: "LUZ",
    color: accent,
    fontSize: 80,
    width: 256,
    height: 128
  });

  useFrame((_, delta) => {
    if (autoRotate && groupRef.current) groupRef.current.rotation.y += delta * 0.5;
  });
  
  return (
    <group ref={groupRef} dispose={null}>
      <group scale={1.2} position={[0, -0.1, 0]}>
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[0.6, 0.8, 0.2]} />
          <meshStandardMaterial color={color} roughness={0.9} />
        </mesh>
        <mesh position={[-0.35, 0.25, 0]} rotation={[0, 0, Math.PI / 4]}>
          <cylinderGeometry args={[0.12, 0.12, 0.3, 16]} />
          <meshStandardMaterial color={color} roughness={0.9} />
        </mesh>
        <mesh position={[0.35, 0.25, 0]} rotation={[0, 0, -Math.PI / 4]}>
          <cylinderGeometry args={[0.12, 0.12, 0.3, 16]} />
          <meshStandardMaterial color={color} roughness={0.9} />
        </mesh>
        <mesh position={[0, 0.4, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.12, 0.02, 16, 32]} />
          <meshStandardMaterial color={color} roughness={0.9} />
        </mesh>
        
        <mesh position={[0, 0.1, 0.101]}>
          <planeGeometry args={[0.3, 0.15]} />
          <meshBasicMaterial map={labelTexture} transparent />
        </mesh>
      </group>
    </group>
  );
}
