import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useLabelTexture } from "../make-label-texture";

export interface ModelProps {
  color?: string;
  accent?: string;
  autoRotate?: boolean;
}

export function JaquetaCoach({
  color = "#0E0E0E",
  accent = "#ff4500",
  autoRotate = false,
}: ModelProps) {
  const groupRef = useRef<THREE.Group>(null);
  const labelTexture = useLabelTexture({ text: "GRAÇA", color: accent, fontSize: 80, width: 256, height: 128 });

  useFrame((_, delta) => {
    if (autoRotate && groupRef.current) groupRef.current.rotation.y += delta * 0.5;
  });
  return (
    <group ref={groupRef} dispose={null}>
      <group scale={1.2} position={[0, -0.1, 0]}>
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[0.65, 0.85, 0.22]} />
          <meshStandardMaterial color={color} roughness={0.7} metalness={0.1} />
        </mesh>
        <mesh position={[0.12, 0.45, 0.05]} rotation={[0.2, 0.2, -0.2]}>
          <boxGeometry args={[0.2, 0.1, 0.02]} />
          <meshStandardMaterial color={color} roughness={0.7} />
        </mesh>
        <mesh position={[-0.12, 0.45, 0.05]} rotation={[0.2, -0.2, 0.2]}>
          <boxGeometry args={[0.2, 0.1, 0.02]} />
          <meshStandardMaterial color={color} roughness={0.7} />
        </mesh>
        <mesh position={[0, 0, 0.111]}>
          <planeGeometry args={[0.01, 0.85]} />
          <meshStandardMaterial color={accent} opacity={0.5} transparent />
        </mesh>
        {[0.3, 0.1, -0.1, -0.3].map((y, i) => (
          <mesh key={i} position={[0, y, 0.112]}>
            <sphereGeometry args={[0.015, 8, 8]} />
            <meshStandardMaterial color={accent} />
          </mesh>
        ))}
        <mesh position={[-0.4, 0.2, 0]} rotation={[0, 0, Math.PI / 5]}>
          <cylinderGeometry args={[0.12, 0.1, 0.6, 16]} />
          <meshStandardMaterial color={color} roughness={0.7} />
        </mesh>
        <mesh position={[0.4, 0.2, 0]} rotation={[0, 0, -Math.PI / 5]}>
          <cylinderGeometry args={[0.12, 0.1, 0.6, 16]} />
          <meshStandardMaterial color={color} roughness={0.7} />
        </mesh>
        <mesh position={[-0.18, 0.2, 0.112]}>
          <planeGeometry args={[0.2, 0.1]} />
          <meshBasicMaterial map={labelTexture} transparent />
        </mesh>
      </group>
    </group>
  );
}
