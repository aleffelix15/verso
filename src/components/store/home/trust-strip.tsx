import { Truck, RotateCcw, ShieldCheck } from "lucide-react";
import { trustStripItems } from "@/data/products";
import { Reveal } from "@/components/store/reveal";

export function TrustStrip() {
  const getIcon = (name: string) => {
    switch (name) {
      case "Truck":
        return <Truck size={28} strokeWidth={1.25} className="text-foreground shrink-0" />;
      case "RotateCcw":
        return <RotateCcw size={28} strokeWidth={1.25} className="text-foreground shrink-0" />;
      case "ShieldCheck":
        return <ShieldCheck size={28} strokeWidth={1.25} className="text-foreground shrink-0" />;
      default:
        return null;
    }
  };

  return (
    <section className="container-verso py-6 sm:py-10">
      <Reveal>
        <div className="border border-border bg-card grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-border">
          {trustStripItems.map((item) => (
            <div key={item.title} className="flex items-center gap-4 p-5 sm:p-6 lg:p-7">
              {getIcon(item.icon)}
              <div className="min-w-0">
                <h3 className="font-semibold text-xs sm:text-sm text-foreground uppercase tracking-wide">
                  {item.title}
                </h3>
                <p className="text-[11px] sm:text-xs text-muted-foreground mt-0.5 leading-snug">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </Reveal>
    </section>
  );
}
