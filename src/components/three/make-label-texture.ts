import * as THREE from "three";
import { useMemo, useEffect } from "react";

const textureCache = new Map<string, { texture: THREE.CanvasTexture; count: number }>();

export interface LabelOptions {
  text: string;
  fontSize?: number;
  color?: string;
  bgColor?: string;
  width?: number;
  height?: number;
  fontFamily?: string;
}

export function makeLabelTexture(options: LabelOptions): THREE.CanvasTexture {
  const {
    text,
    fontSize = 64,
    color = "#F8F8F8",
    bgColor = "transparent",
    width = 512,
    height = 256,
    fontFamily = "monospace",
  } = options;

  const cacheKey = `${text}-${fontSize}-${color}-${bgColor}-${width}-${height}-${fontFamily}`;

  if (textureCache.has(cacheKey)) {
    const cached = textureCache.get(cacheKey)!;
    cached.count += 1;
    return cached.texture;
  }

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext("2d");
  if (ctx) {
    if (bgColor !== "transparent") {
      ctx.fillStyle = bgColor;
      ctx.fillRect(0, 0, width, height);
    }

    ctx.fillStyle = color;
    ctx.font = `bold ${fontSize}px ${fontFamily}`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(text, width / 2, height / 2);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  textureCache.set(cacheKey, { texture, count: 1 });

  return texture;
}

export function disposeLabelTexture(options: LabelOptions) {
  const cacheKey = `${options.text}-${options.fontSize ?? 64}-${options.color ?? "#F8F8F8"}-${options.bgColor ?? "transparent"}-${options.width ?? 512}-${options.height ?? 256}-${options.fontFamily ?? "monospace"}`;

  if (textureCache.has(cacheKey)) {
    const cached = textureCache.get(cacheKey)!;
    cached.count -= 1;
    if (cached.count <= 0) {
      cached.texture.dispose();
      textureCache.delete(cacheKey);
    }
  }
}

// Hook to safely use and dispose textures when unmounted
export function useLabelTexture(options: LabelOptions) {
  // Pass stringified options to useMemo to avoid recreating texture on object reference change
  const optString = JSON.stringify(options);
  const texture = useMemo(() => makeLabelTexture(options), [optString]);

  useEffect(() => {
    return () => {
      disposeLabelTexture(options);
    };
  }, [optString]);

  return texture;
}
