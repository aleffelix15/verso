export const colorMap: Record<string, string> = {
  "Preto lavado": "#1f1f1f",
  "Off-white": "#f5f5f0",
  "Chumbo": "#363636",
  "Cimento": "#878787",
};

export function getHexColor(colorName?: string): string {
  if (!colorName) return "#0E0E0E";
  return colorMap[colorName] || "#0E0E0E";
}
