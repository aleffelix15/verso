import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { RoundedBox } from "@react-three/drei";
import { useLabelTexture } from "../make-label-texture";
import { materials } from "../materials";
import { getHexColor } from "../color-map";

import type { ModelProps } from "../types";

export function MoletomBoxy({
  color = "Preto lavado",
  accent = "#ff4500",
  autoRotate = false,
}: ModelProps) {
  const groupRef = useRef<THREE.Group>(null);
  const hex = getHexColor(color);

  const fabricMat = useMemo(() => materials.getFabric(hex), [hex]);
  const ribbedMat = useMemo(() => materials.getRibbed(hex), [hex]);
  const metalMat = useMemo(() => materials.getMetal(), []);

  const labelTexture = useLabelTexture({
    text: "SL 23",
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
    <group ref={groupRef} dispose={null} scale={1.1} position={[0, -0.15, 0]}>
      {/* Corpo Boxy */}
      <RoundedBox
        args={[0.75, 0.75, 0.35]}
        radius={0.08}
        smoothness={4}
        position={[0, 0, 0]}
        material={fabricMat}
      />

      {/* Capuz */}
      <mesh position={[0, 0.45, -0.1]}>
        <sphereGeometry args={[0.25, 32, 16, 0, Math.PI * 2, 0, Math.PI / 1.8]} />
        <primitive object={fabricMat} attach="material" side={THREE.DoubleSide} />
      </mesh>

      {/* Cordões do capuz */}
      <mesh position={[-0.1, 0.25, 0.15]}>
        <cylinderGeometry args={[0.005, 0.005, 0.2]} />
        <primitive object={fabricMat} attach="material" />
      </mesh>
      <mesh position={[-0.1, 0.14, 0.15]}>
        <cylinderGeometry args={[0.008, 0.008, 0.02]} />
        <primitive object={metalMat} attach="material" />
      </mesh>
      <mesh position={[0.1, 0.25, 0.15]}>
        <cylinderGeometry args={[0.005, 0.005, 0.2]} />
        <primitive object={fabricMat} attach="material" />
      </mesh>
      <mesh position={[0.1, 0.14, 0.15]}>
        <cylinderGeometry args={[0.008, 0.008, 0.02]} />
        <primitive object={metalMat} attach="material" />
      </mesh>

      {/* Bolso Canguru */}
      <RoundedBox
        args={[0.45, 0.25, 0.1]}
        radius={0.02}
        smoothness={2}
        position={[0, -0.2, 0.15]}
        material={fabricMat}
      />

      {/* Mangas amplas */}
      <RoundedBox
        args={[0.2, 0.65, 0.2]}
        radius={0.05}
        smoothness={4}
        position={[-0.48, 0.05, 0]}
        rotation={[0, 0, Math.PI / 8]}
        material={fabricMat}
      />
      <RoundedBox
        args={[0.2, 0.65, 0.2]}
        radius={0.05}
        smoothness={4}
        position={[0.48, 0.05, 0]}
        rotation={[0, 0, -Math.PI / 8]}
        material={fabricMat}
      />

      {/* Punhos canelados */}
      <mesh position={[-0.6, -0.25, 0]} rotation={[0, 0, Math.PI / 8]}>
        <cylinderGeometry args={[0.09, 0.09, 0.1, 16]} />
        <primitive object={ribbedMat} attach="material" />
      </mesh>
      <mesh position={[0.6, -0.25, 0]} rotation={[0, 0, -Math.PI / 8]}>
        <cylinderGeometry args={[0.09, 0.09, 0.1, 16]} />
        <primitive object={ribbedMat} attach="material" />
      </mesh>

      {/* Barra canelada */}
      <mesh position={[0, -0.4, 0]}>
        <boxGeometry args={[0.73, 0.08, 0.33]} />
        <primitive object={ribbedMat} attach="material" />
      </mesh>

      {/* Etiqueta */}
      <mesh position={[0.25, -0.15, 0.2]}>
        <planeGeometry args={[0.08, 0.04]} />
        <meshBasicMaterial map={labelTexture} transparent />
      </mesh>
    </group>
  );
}
