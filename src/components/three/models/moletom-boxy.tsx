import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useLabelTexture } from "../make-label-texture";

export interface ModelProps {
  color?: string;
  accent?: string;
  autoRotate?: boolean;
}

export function MoletomBoxy({
  color = "#0E0E0E",
  accent = "#ff4500",
  autoRotate = false,
}: ModelProps) {
  const groupRef = useRef<THREE.Group>(null);
  const labelTexture = useLabelTexture({ text: "SALMO 23", color: accent, fontSize: 60, width: 256, height: 128 });

  useFrame((_, delta) => {
    if (autoRotate && groupRef.current) groupRef.current.rotation.y += delta * 0.5;
  });
  return (
    <group ref={groupRef} dispose={null}>
      <group scale={1.1} position={[0, -0.15, 0]}>
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[0.7, 0.7, 0.3]} />
          <meshStandardMaterial color={color} roughness={0.95} />
        </mesh>
        <mesh position={[0, 0.45, -0.05]}>
          <sphereGeometry args={[0.25, 32, 16, 0, Math.PI * 2, 0, Math.PI / 1.8]} />
          <meshStandardMaterial color={color} roughness={0.95} side={THREE.DoubleSide} />
        </mesh>
        <mesh position={[0, -0.2, 0.15]}>
          <boxGeometry args={[0.4, 0.25, 0.05]} />
          <meshStandardMaterial color={color} roughness={0.95} />
        </mesh>
        <mesh position={[-0.45, 0.1, 0]} rotation={[0, 0, Math.PI / 6]}>
          <cylinderGeometry args={[0.15, 0.12, 0.6, 16]} />
          <meshStandardMaterial color={color} roughness={0.95} />
        </mesh>
        <mesh position={[0.45, 0.1, 0]} rotation={[0, 0, -Math.PI / 6]}>
          <cylinderGeometry args={[0.15, 0.12, 0.6, 16]} />
          <meshStandardMaterial color={color} roughness={0.95} />
        </mesh>
        <mesh position={[-0.08, 0.2, 0.15]}>
          <cylinderGeometry args={[0.005, 0.005, 0.2]} />
          <meshStandardMaterial color={accent} />
        </mesh>
        <mesh position={[0.08, 0.2, 0.15]}>
          <cylinderGeometry args={[0.005, 0.005, 0.2]} />
          <meshStandardMaterial color={accent} />
        </mesh>
        <mesh position={[0, 0.1, 0.151]}>
          <planeGeometry args={[0.2, 0.1]} />
          <meshBasicMaterial map={labelTexture} transparent />
        </mesh>
      </group>
    </group>
  );
}
