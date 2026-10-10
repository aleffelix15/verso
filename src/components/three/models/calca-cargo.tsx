import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useLabelTexture } from "../make-label-texture";

export interface ModelProps {
  color?: string;
  accent?: string;
  autoRotate?: boolean;
}

export function CalcaCargo({
  color = "#0E0E0E",
  accent = "#ff4500",
  autoRotate = false,
}: ModelProps) {
  const groupRef = useRef<THREE.Group>(null);
  const labelTexture = useLabelTexture({ text: "FIRME", color: accent, fontSize: 80, width: 256, height: 128 });

  useFrame((_, delta) => {
    if (autoRotate && groupRef.current) groupRef.current.rotation.y += delta * 0.5;
  });
  return (
    <group ref={groupRef} dispose={null}>
      <group scale={1.1} position={[0, 0.4, 0]}>
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[0.5, 0.25, 0.25]} />
          <meshStandardMaterial color={color} roughness={0.9} />
        </mesh>
        {[-0.15, 0, 0.15].map((x, i) => (
          <mesh key={i} position={[x, 0.12, 0.126]}>
            <boxGeometry args={[0.02, 0.06, 0.01]} />
            <meshStandardMaterial color={accent} />
          </mesh>
        ))}
        <mesh position={[-0.13, -0.45, 0]}>
          <boxGeometry args={[0.23, 0.7, 0.23]} />
          <meshStandardMaterial color={color} roughness={0.9} />
        </mesh>
        <mesh position={[0.13, -0.45, 0]}>
          <boxGeometry args={[0.23, 0.7, 0.23]} />
          <meshStandardMaterial color={color} roughness={0.9} />
        </mesh>
        <mesh position={[-0.26, -0.3, 0.05]}>
          <boxGeometry args={[0.06, 0.25, 0.18]} />
          <meshStandardMaterial color={color} roughness={0.9} />
        </mesh>
        <mesh position={[0.26, -0.3, 0.05]}>
          <boxGeometry args={[0.06, 0.25, 0.18]} />
          <meshStandardMaterial color={color} roughness={0.9} />
        </mesh>
        <mesh position={[0.29, -0.2, 0.14]} rotation={[0, Math.PI / 2, 0]}>
          <planeGeometry args={[0.15, 0.075]} />
          <meshBasicMaterial map={labelTexture} transparent />
        </mesh>
      </group>
    </group>
  );
}
