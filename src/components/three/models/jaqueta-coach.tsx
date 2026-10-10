import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { RoundedBox } from "@react-three/drei";
import { useLabelTexture } from "../make-label-texture";
import { materials } from "../materials";
import { getHexColor } from "../color-map";

import type { ModelProps } from "../types";

export function JaquetaCoach({
  color = "Preto lavado",
  accent = "#ff4500",
  autoRotate = false,
}: ModelProps) {
  const groupRef = useRef<THREE.Group>(null);
  const hex = getHexColor(color);
  
  const fabricMat = useMemo(() => materials.getFabric(hex), [hex]);
  const metalMat = useMemo(() => materials.getMetal(), []);

  const labelTexture = useLabelTexture({
    text: "EF 2:8",
    color: accent,
    bgColor: "#111",
    fontSize: 50,
    width: 256,
    height: 128
  });

  useFrame((_, delta) => {
    if (autoRotate && groupRef.current) groupRef.current.rotation.y += delta * 0.5;
  });
  
  return (
    <group ref={groupRef} dispose={null} scale={1.2} position={[0, -0.1, 0]}>
      {/* Corpo */}
      <RoundedBox args={[0.65, 0.85, 0.22]} radius={0.04} smoothness={4} position={[0, 0, 0]} material={fabricMat} />
      
      {/* Gola */}
      <mesh position={[0.12, 0.45, 0.05]} rotation={[0.2, 0.2, -0.2]}>
        <boxGeometry args={[0.2, 0.1, 0.02]} />
        <primitive object={fabricMat} attach="material" />
      </mesh>
      <mesh position={[-0.12, 0.45, 0.05]} rotation={[0.2, -0.2, 0.2]}>
        <boxGeometry args={[0.2, 0.1, 0.02]} />
        <primitive object={fabricMat} attach="material" />
      </mesh>
      
      {/* Zíper frontal */}
      <mesh position={[0, 0, 0.111]}>
        <planeGeometry args={[0.015, 0.85]} />
        <primitive object={metalMat} attach="material" />
      </mesh>
      
      {/* Botões */}
      {[0.3, 0.1, -0.1, -0.3].map((y, i) => (
        <mesh key={i} position={[0.03, y, 0.115]}>
          <sphereGeometry args={[0.015, 8, 8]} />
          <primitive object={metalMat} attach="material" />
        </mesh>
      ))}
      
      {/* Mangas */}
      <RoundedBox args={[0.2, 0.7, 0.2]} radius={0.05} smoothness={4} position={[-0.4, 0.05, 0]} rotation={[0, 0, Math.PI / 8]} material={fabricMat} />
      <RoundedBox args={[0.2, 0.7, 0.2]} radius={0.05} smoothness={4} position={[0.4, 0.05, 0]} rotation={[0, 0, -Math.PI / 8]} material={fabricMat} />
      
      {/* Etiqueta */}
      <mesh position={[-0.2, 0.2, 0.112]}>
        <planeGeometry args={[0.08, 0.04]} />
        <meshBasicMaterial map={labelTexture} transparent />
      </mesh>
    </group>
  );
}
