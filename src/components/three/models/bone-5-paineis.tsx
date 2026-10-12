import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useLabelTexture } from "../make-label-texture";
import { materials } from "../materials";
import { getHexColor } from "../color-map";

import type { ModelProps } from "../types";

export function Bone5Paineis({
  color = "Preto lavado",
  accent = "#ff4500",
  autoRotate = false,
}: ModelProps) {
  const groupRef = useRef<THREE.Group>(null);
  const hex = getHexColor(color);

  const fabricMat = useMemo(() => materials.getFabric(hex), [hex]);

  const labelTexture = useLabelTexture({
    text: "CL 3:17",
    color: accent,
    bgColor: "#111",
    fontSize: 50,
    width: 256,
    height: 128,
  });

  useFrame((_, delta) => {
    if (autoRotate && groupRef.current) groupRef.current.rotation.y += delta * 0.5;
  });

  return (
    <group ref={groupRef} dispose={null} scale={2.5} position={[0, -0.1, 0]}>
      {/* Copa (coroa) */}
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[0.2, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <primitive object={fabricMat} attach="material" side={THREE.DoubleSide} />
      </mesh>

      {/* Painel frontal */}
      <mesh position={[0, 0.05, 0.15]} rotation={[-0.2, 0, 0]}>
        <boxGeometry args={[0.18, 0.18, 0.1]} />
        <primitive object={fabricMat} attach="material" />
      </mesh>

      {/* Aba curva */}
      <mesh position={[0, 0.02, 0.2]} rotation={[0.1, 0, 0]}>
        <cylinderGeometry args={[0.22, 0.22, 0.02, 32, 1, false, Math.PI * 0.65, Math.PI * 0.7]} />
        <primitive object={fabricMat} attach="material" />
      </mesh>

      {/* Botão no topo */}
      <mesh position={[0, 0.2, 0]}>
        <sphereGeometry args={[0.02, 8, 8]} />
        <meshStandardMaterial color={accent} />
      </mesh>

      {/* Etiqueta central */}
      <mesh position={[0, 0.1, 0.201]} rotation={[-0.2, 0, 0]}>
        <planeGeometry args={[0.08, 0.04]} />
        <meshBasicMaterial map={labelTexture} transparent />
      </mesh>
    </group>
  );
}
