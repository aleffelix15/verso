export const colorMap: Record<string, string> = {
  "Preto lavado": "#1f1f1f",
  "Off-white": "#f5f5f0",
  Chumbo: "#363636",
  Cimento: "#878787",
  Vermelho: "#C8102E",
  Areia: "#C9B79C",
};

export function getHexColor(colorName?: string): string {
  if (!colorName) return "#0E0E0E";
  return colorMap[colorName] || "#0E0E0E";
}
