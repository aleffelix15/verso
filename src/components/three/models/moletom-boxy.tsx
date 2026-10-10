import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Text } from "@react-three/drei";
import * as THREE from "three";

export interface ModelProps { color?: string; accent?: string; autoRotate?: boolean; }

export function MoletomBoxy({ color = "#0E0E0E", accent = "#E4572E", autoRotate = false }: ModelProps) {
  const groupRef = useRef<THREE.Group>(null);
  useFrame((_, delta) => { if (autoRotate && groupRef.current) groupRef.current.rotation.y += delta * 0.5; });
  return (
    <group ref={groupRef} dispose={null}>
      <group scale={1.1} position={[0, -0.15, 0]}>
        <mesh position={[0, 0, 0]}><boxGeometry args={[0.7, 0.7, 0.3]} /><meshStandardMaterial color={color} roughness={0.95} /></mesh>
        <mesh position={[0, 0.45, -0.05]}><sphereGeometry args={[0.25, 32, 16, 0, Math.PI * 2, 0, Math.PI / 1.8]} /><meshStandardMaterial color={color} roughness={0.95} side={THREE.DoubleSide} /></mesh>
        <mesh position={[0, -0.2, 0.15]}><boxGeometry args={[0.4, 0.25, 0.05]} /><meshStandardMaterial color={color} roughness={0.95} /></mesh>
        <mesh position={[-0.45, 0.1, 0]} rotation={[0, 0, Math.PI / 6]}><cylinderGeometry args={[0.15, 0.12, 0.6, 16]} /><meshStandardMaterial color={color} roughness={0.95} /></mesh>
        <mesh position={[0.45, 0.1, 0]} rotation={[0, 0, -Math.PI / 6]}><cylinderGeometry args={[0.15, 0.12, 0.6, 16]} /><meshStandardMaterial color={color} roughness={0.95} /></mesh>
        <mesh position={[-0.08, 0.2, 0.15]}><cylinderGeometry args={[0.005, 0.005, 0.2]} /><meshStandardMaterial color={accent} /></mesh>
        <mesh position={[0.08, 0.2, 0.15]}><cylinderGeometry args={[0.005, 0.005, 0.2]} /><meshStandardMaterial color={accent} /></mesh>
        <Text position={[0, 0.1, 0.151]} fontSize={0.08} color={accent}>SALMO 23</Text>
      </group>
    </group>
  );
}