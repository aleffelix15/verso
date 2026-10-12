import * as THREE from "three";

// Generate a procedural fabric bump map
function generateFabricBumpMap() {
  const canvas = document.createElement("canvas");
  canvas.width = 256;
  canvas.height = 256;
  const context = canvas.getContext("2d");
  if (!context) return null;

  context.fillStyle = "#808080";
  context.fillRect(0, 0, 256, 256);

  const imgData = context.getImageData(0, 0, 256, 256);
  const data = imgData.data;

  for (let i = 0; i < data.length; i += 4) {
    const noise = Math.random() * 20 - 10;
    data[i] = Math.min(255, Math.max(0, 128 + noise));
    data[i + 1] = Math.min(255, Math.max(0, 128 + noise));
    data[i + 2] = Math.min(255, Math.max(0, 128 + noise));
    data[i + 3] = 255;
  }

  // Adding weave pattern
  for (let y = 0; y < 256; y += 4) {
    for (let x = 0; x < 256; x += 4) {
      const idx = (y * 256 + x) * 4;
      const d0 = data[idx];
      const d1 = data[idx + 1];
      const d2 = data[idx + 2];
      if (d0 !== undefined) data[idx] = Math.min(255, d0 + 15);
      if (d1 !== undefined) data[idx + 1] = Math.min(255, d1 + 15);
      if (d2 !== undefined) data[idx + 2] = Math.min(255, d2 + 15);
    }
  }

  context.putImageData(imgData, 0, 0);

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(10, 10);
  return texture;
}

// Generate ribbed (canelado) map
function generateRibbedMap() {
  const canvas = document.createElement("canvas");
  canvas.width = 128;
  canvas.height = 128;
  const context = canvas.getContext("2d");
  if (!context) return null;

  const gradient = context.createLinearGradient(0, 0, 128, 0);
  for (let i = 0; i <= 10; i++) {
    gradient.addColorStop(i / 10, i % 2 === 0 ? "#aaaaaa" : "#666666");
  }
  context.fillStyle = gradient;
  context.fillRect(0, 0, 128, 128);

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(4, 1);
  return texture;
}

const fabricBumpMap = generateFabricBumpMap();
const ribbedBumpMap = generateRibbedMap();

export const materials = {
  getFabric: (color: string) =>
    new THREE.MeshStandardMaterial({
      color,
      roughness: 0.95,
      metalness: 0.05,
      bumpMap: fabricBumpMap,
      bumpScale: 0.002,
    }),
  getRibbed: (color: string) =>
    new THREE.MeshStandardMaterial({
      color,
      roughness: 0.9,
      metalness: 0.1,
      bumpMap: ribbedBumpMap,
      bumpScale: 0.01,
    }),
  getMetal: (color = "#aaaaaa") =>
    new THREE.MeshStandardMaterial({
      color,
      roughness: 0.4,
      metalness: 0.8,
    }),
};
