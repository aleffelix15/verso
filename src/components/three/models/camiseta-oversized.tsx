import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Text } from "@react-three/drei";
import * as THREE from "three";

export interface ModelProps {
  color?: string;
  accent?: string;
  autoRotate?: boolean;
}

export function CamisetaOversized({
  color = "#0E0E0E",
  accent = "#E4572E",
  autoRotate = false,
}: ModelProps) {
  const groupRef = useRef<THREE.Group>(null);
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
        <Text font="/fonts/inter.woff" position={[0, 0.1, 0.101]} fontSize={0.12} color={accent}>
          LUZ
        </Text>
      </group>
    </group>
  );
}
