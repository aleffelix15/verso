import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { RoundedBox } from "@react-three/drei";
import { useLabelTexture } from "../make-label-texture";
import { materials } from "../materials";
import { getHexColor } from "../color-map";

import type { ModelProps } from "../types";

export function CamisetaOversized({
  color = "Preto lavado",
  accent = "#ff4500",
  autoRotate = false,
}: ModelProps) {
  const groupRef = useRef<THREE.Group>(null);
  const hex = getHexColor(color);

  const fabricMat = useMemo(() => materials.getFabric(hex), [hex]);
  const ribbedMat = useMemo(() => materials.getRibbed(hex), [hex]);

  const labelTexture = useLabelTexture({
    text: "JO 1:5",
    color: accent,
    bgColor: "#111",
    fontSize: 60,
    width: 256,
    height: 128,
  });

  useFrame((_, delta) => {
    if (autoRotate && groupRef.current) groupRef.current.rotation.y += delta * 0.5;
  });

  return (
    <group ref={groupRef} dispose={null} scale={1.2} position={[0, -0.1, 0]}>
      {/* Corpo */}
      <RoundedBox
        args={[0.7, 0.9, 0.25]}
        radius={0.05}
        smoothness={4}
        position={[0, 0, 0]}
        material={fabricMat}
      />

      {/* Mangas oversized */}
      <RoundedBox
        args={[0.3, 0.4, 0.22]}
        radius={0.04}
        smoothness={4}
        position={[-0.45, 0.2, 0]}
        rotation={[0, 0, Math.PI / 8]}
        material={fabricMat}
      />
      <RoundedBox
        args={[0.3, 0.4, 0.22]}
        radius={0.04}
        smoothness={4}
        position={[0.45, 0.2, 0]}
        rotation={[0, 0, -Math.PI / 8]}
        material={fabricMat}
      />

      {/* Gola canelada */}
      <mesh position={[0, 0.45, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.16, 0.03, 16, 32]} />
        <primitive object={ribbedMat} attach="material" />
      </mesh>

      {/* Etiqueta na barra */}
      <mesh position={[0.25, -0.4, 0.13]}>
        <planeGeometry args={[0.08, 0.04]} />
        <meshBasicMaterial map={labelTexture} transparent />
      </mesh>
    </group>
  );
}
