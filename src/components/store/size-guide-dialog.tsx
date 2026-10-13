import { useState } from "react";
import { Ruler, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";

export function suggestSize(heightCm: number, weightKg: number): string | null {
  if (
    !heightCm ||
    !weightKg ||
    heightCm < 140 ||
    heightCm > 220 ||
    weightKg < 40 ||
    weightKg > 160
  ) {
    return null;
  }
  const bmi = weightKg / Math.pow(heightCm / 100, 2);

  if (weightKg <= 65 || (heightCm <= 170 && bmi < 22)) return "P";
  if (weightKg <= 78 || (heightCm <= 180 && bmi < 25)) return "M";
  if (weightKg <= 92 || (heightCm <= 188 && bmi < 28)) return "G";
  return "GG";
}

export function SizeGuideDialog({
  open,
  onOpenChange,
  onSelectSize,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelectSize?: (size: string) => void;
}) {
  const [height, setHeight] = useState<string>("");
  const [weight, setWeight] = useState<string>("");

  const suggested = suggestSize(Number(height), Number(weight));

  const measurements = [
    { size: "P", chest: "116 cm", length: "74 cm", sleeve: "24 cm" },
    { size: "M", chest: "122 cm", length: "76 cm", sleeve: "25 cm" },
    { size: "G", chest: "128 cm", length: "78 cm", sleeve: "26 cm" },
    { size: "GG", chest: "134 cm", length: "80 cm", sleeve: "27 cm" },
  ];

  const handleApplySize = (size: string) => {
    if (onSelectSize) onSelectSize(size);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        data-lenis-prevent
        className="max-w-lg bg-card text-foreground border-border p-6 sm:p-8 max-h-[85svh] overflow-y-auto"
      >
        <div className="flex items-center gap-2 mb-1">
          <Ruler size={18} className="text-brand" />
          <DialogTitle className="font-display text-2xl font-bold uppercase text-foreground">
            GUIA DE MEDIDAS & COMPARADOR
          </DialogTitle>
        </div>
        <DialogDescription className="text-xs text-muted-foreground">
          Modelagem streetwear com caimento oversized deliberado.
        </DialogDescription>

        {/* Recommender */}
        <div className="mt-5 p-4 bg-surface border border-border">
          <span className="font-mono text-[10px] uppercase tracking-wider text-brand font-semibold block mb-2">
            COMPARADOR INTELIGENTE DE TAMANHO
          </span>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label
                htmlFor="height-input"
                className="block text-[11px] font-mono text-muted-foreground uppercase mb-1"
              >
                Sua altura (cm)
              </label>
              <input
                id="height-input"
                type="number"
                placeholder="Ex: 178"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                className="w-full bg-background border border-border px-3 py-2 text-xs text-foreground focus:outline-none focus:border-brand rounded-none"
              />
            </div>
            <div>
              <label
                htmlFor="weight-input"
                className="block text-[11px] font-mono text-muted-foreground uppercase mb-1"
              >
                Seu peso (kg)
              </label>
              <input
                id="weight-input"
                type="number"
                placeholder="Ex: 75"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                className="w-full bg-background border border-border px-3 py-2 text-xs text-foreground focus:outline-none focus:border-brand rounded-none"
              />
            </div>
          </div>

          {suggested && (
            <div className="mt-3 pt-3 border-t border-border flex items-center justify-between">
              <div>
                <span className="text-[11px] text-muted-foreground">Tamanho sugerido: </span>
                <strong className="text-brand font-mono text-base font-bold ml-1">
                  {suggested}
                </strong>
              </div>
              <Button
                type="button"
                variant="brand"
                size="sm"
                className="h-8 font-mono text-xs uppercase rounded-none"
                onClick={() => handleApplySize(suggested)}
              >
                Selecionar {suggested}
              </Button>
            </div>
          )}
          <p className="mt-2 text-[10px] text-muted-foreground leading-normal">
            * Sugestão local aproximada. Para caimento mais rente ao corpo, opte por um número
            menor.
          </p>
        </div>

        {/* Measurements Table */}
        <div className="mt-5">
          <span className="font-mono text-[11px] uppercase tracking-wider text-foreground font-semibold block mb-2">
            TABELA DE MEDIDAS (PEÇAS DA PARTE SUPERIOR)
          </span>
          <div className="overflow-x-auto border border-border">
            <table className="w-full text-xs text-left">
              <thead className="bg-surface font-mono text-[10px] uppercase text-muted-foreground border-b border-border">
                <tr>
                  <th className="py-2.5 px-3">Tamanho</th>
                  <th className="py-2.5 px-3">Tórax</th>
                  <th className="py-2.5 px-3">Comprimento</th>
                  <th className="py-2.5 px-3">Manga</th>
                  <th className="py-2.5 px-3 text-right">Ação</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border font-mono">
                {measurements.map((m) => (
                  <tr key={m.size} className="hover:bg-muted/40 transition-colors">
                    <td className="py-2 px-3 font-bold text-foreground">{m.size}</td>
                    <td className="py-2 px-3 text-muted-foreground">{m.chest}</td>
                    <td className="py-2 px-3 text-muted-foreground">{m.length}</td>
                    <td className="py-2 px-3 text-muted-foreground">{m.sleeve}</td>
                    <td className="py-2 px-3 text-right">
                      <button
                        type="button"
                        onClick={() => handleApplySize(m.size)}
                        className="text-[10px] text-brand hover:underline uppercase"
                      >
                        Escolher
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
