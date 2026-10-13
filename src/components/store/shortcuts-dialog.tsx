import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";

export function ShortcutsDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const shortcuts = [
    { key: "Ctrl + K / ⌘ + K", description: "Abrir busca instantânea" },
    { key: "/", description: "Focar campo de busca rápida" },
    { key: "?", description: "Ver esta lista de atalhos de teclado" },
    { key: "Esc", description: "Fechar qualquer modal, drawer ou busca aberta" },
    { key: "Tab", description: "Navegar pelos elementos interativos" },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        data-lenis-prevent
        className="max-w-md bg-card text-foreground border-border p-6"
      >
        <DialogTitle className="font-display text-2xl font-bold uppercase text-foreground">
          ATALHOS DE TECLADO
        </DialogTitle>
        <DialogDescription className="text-xs text-muted-foreground mt-1">
          Navegue pela loja com agilidade e acessibilidade.
        </DialogDescription>

        <div className="mt-5 divide-y divide-border border-y border-border">
          {shortcuts.map((s) => (
            <div key={s.key} className="flex items-center justify-between py-2.5 text-xs">
              <span className="text-muted-foreground">{s.description}</span>
              <kbd className="px-2 py-1 bg-surface border border-border font-mono text-[11px] rounded-none text-foreground font-semibold">
                {s.key}
              </kbd>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
