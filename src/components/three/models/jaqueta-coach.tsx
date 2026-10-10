import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Text } from "@react-three/drei";
import * as THREE from "three";

export interface ModelProps {
  color?: string;
  accent?: string;
  autoRotate?: boolean;
}

export function JaquetaCoach({
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
        <Text
          font="/fonts/inter.woff"
          position={[-0.18, 0.2, 0.111]}
          fontSize={0.06}
          color={accent}
        >
          GRAÇA
        </Text>
      </group>
    </group>
  );
}
