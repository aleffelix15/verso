import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { RoundedBox } from "@react-three/drei";
import { useLabelTexture } from "../make-label-texture";
import { materials } from "../materials";
import { getHexColor } from "../color-map";

import type { ModelProps } from "../types";

export function CalcaCargo({
  color = "Preto lavado",
  accent = "#ff4500",
  autoRotate = false,
}: ModelProps) {
  const groupRef = useRef<THREE.Group>(null);
  const hex = getHexColor(color);

  const fabricMat = useMemo(() => materials.getFabric(hex), [hex]);
  const metalMat = useMemo(() => materials.getMetal(), []);

  const labelTexture = useLabelTexture({
    text: "1 CO 16:13",
    color: accent,
    bgColor: "#111",
    fontSize: 40,
    width: 256,
    height: 128,
  });

  useFrame((_, delta) => {
    if (autoRotate && groupRef.current) groupRef.current.rotation.y += delta * 0.5;
  });

  return (
    <group ref={groupRef} dispose={null} scale={1.1} position={[0, 0.4, 0]}>
      {/* Cintura */}
      <RoundedBox
        args={[0.55, 0.25, 0.3]}
        radius={0.05}
        smoothness={4}
        position={[0, 0, 0]}
        material={fabricMat}
      />

      {/* Botão cintura */}
      <mesh position={[0, 0.05, 0.16]}>
        <sphereGeometry args={[0.015, 8, 8]} />
        <primitive object={metalMat} attach="material" />
      </mesh>

      {/* Pernas */}
      <RoundedBox
        args={[0.26, 0.8, 0.26]}
        radius={0.04}
        smoothness={4}
        position={[-0.14, -0.5, 0]}
        material={fabricMat}
      />
      <RoundedBox
        args={[0.26, 0.8, 0.26]}
        radius={0.04}
        smoothness={4}
        position={[0.14, -0.5, 0]}
        material={fabricMat}
      />

      {/* Bolsos Cargo laterais */}
      <RoundedBox
        args={[0.08, 0.25, 0.2]}
        radius={0.02}
        smoothness={2}
        position={[-0.28, -0.35, 0.05]}
        material={fabricMat}
      />
      <RoundedBox
        args={[0.08, 0.25, 0.2]}
        radius={0.02}
        smoothness={2}
        position={[0.28, -0.35, 0.05]}
        material={fabricMat}
      />

      {/* Etiqueta bolso */}
      <mesh position={[0.33, -0.3, 0.05]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[0.1, 0.05]} />
        <meshBasicMaterial map={labelTexture} transparent />
      </mesh>
    </group>
  );
}
