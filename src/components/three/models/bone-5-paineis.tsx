import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Text } from "@react-three/drei";
import * as THREE from "three";

export interface ModelProps {
  color?: string;
  accent?: string;
  autoRotate?: boolean;
}

export function Bone5Paineis({
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
      <group scale={2.5} position={[0, -0.1, 0]}>
        <mesh position={[0, 0, 0]}>
          <sphereGeometry args={[0.2, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
          <meshStandardMaterial color={color} roughness={1} side={THREE.DoubleSide} />
        </mesh>
        <mesh position={[0, 0.1, 0.15]} rotation={[-0.2, 0, 0]}>
          <boxGeometry args={[0.18, 0.18, 0.05]} />
          <meshStandardMaterial color={color} roughness={1} />
        </mesh>
        <mesh position={[0, 0.02, 0.2]} rotation={[0.1, 0, 0]}>
          <cylinderGeometry args={[0.2, 0.2, 0.02, 32, 1, false, Math.PI * 0.65, Math.PI * 0.7]} />
          <meshStandardMaterial color={color} roughness={1} />
        </mesh>
        <mesh position={[0, 0.2, 0]}>
          <sphereGeometry args={[0.02, 8, 8]} />
          <meshStandardMaterial color={accent} />
        </mesh>
        <Text
          font="/fonts/inter.woff"
          position={[0, 0.1, 0.176]}
          rotation={[-0.2, 0, 0]}
          fontSize={0.05}
          color={accent}
        >
          VERSO
        </Text>
      </group>
    </group>
  );
}
