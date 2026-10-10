import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useLabelTexture } from "../make-label-texture";

export interface ModelProps {
  color?: string;
  accent?: string;
  autoRotate?: boolean;
}

export function Bone5Paineis({
  color = "#0E0E0E",
  accent = "#ff4500",
  autoRotate = false,
}: ModelProps) {
  const groupRef = useRef<THREE.Group>(null);
  const labelTexture = useLabelTexture({ text: "VERSO", color: accent, fontSize: 80, width: 256, height: 128 });
  
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
        <mesh position={[0, 0.1, 0.176]} rotation={[-0.2, 0, 0]}>
          <planeGeometry args={[0.2, 0.1]} />
          <meshBasicMaterial map={labelTexture} transparent />
        </mesh>
      </group>
    </group>
  );
}
