import { useState, useEffect, useCallback, useRef } from "react";
import { Link } from "@tanstack/react-router";
import {
  ShoppingBag,
  ArrowRight,
  Trash2,
  Minus,
  Plus,
  CreditCard,
  ArrowUpRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { useCart } from "./cart-context";
import { money } from "@/data/products";
import { calculateFreight } from "@/server/shipping";
import type { FreightOption } from "@/server/freight-calculator";
import { createPaymentPreference } from "@/server/checkout";
import { lookupCep } from "@/lib/viacep";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const checkoutSchema = z
  .object({
    name: z.string().min(2, "Nome incompleto"),
    email: z.string().email("E-mail inválido"),
    phone: z.string().min(10, "DDD + Número"),
    zipCode: z.string().regex(/^\d{5}-?\d{3}$/, "CEP inválido"),
    street: z.string().min(2, "Rua obrigatória"),
    number: z.string().min(1, "Obrigatório"),
    neighborhood: z.string().min(2, "Bairro obrigatório"),
    city: z.string().min(2, "Cidade obrigatória"),
    state: z.string().length(2, "UF inválida (ex: SP)"),
  })
  .strict();

type CheckoutForm = z.infer<typeof checkoutSchema>;

export function CartDrawer() {
  const cart = useCart();
  const [shippingOptions, setShippingOptions] = useState<FreightOption[] | null>(null);
  const [selectedShipping, setSelectedShipping] = useState<FreightOption | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CheckoutForm>({
    resolver: zodResolver(checkoutSchema),
  });

  const zipCode = watch("zipCode");
  const lastRequest = useRef("");
  const cartLineKey = cart.items.map((item) => `${item.product.slug}:${item.quantity}`).join(",");

  const calculateShipping = useCallback(
    async (cep: string) => {
      setLoading(true);
      try {
        const res = await calculateFreight({
          data: {
            cep,
            items: cart.items.map((item) => ({ slug: item.product.slug, quantity: item.quantity })),
          },
        });
        if (res.success && res.options) {
          const defaultShipping = res.options.find((option) => option.id === "pac");
          if (!defaultShipping) throw new Error("Freight option unavailable");
          setShippingOptions(res.options);
          setSelectedShipping(defaultShipping);
          setError("");
        }
      } catch {
        setError("Não foi possível calcular o frete.");
      } finally {
        setLoading(false);
      }
    },
    [cart.items],
  );

  useEffect(() => {
    const cleanZip = zipCode?.replace(/\D/g, "");
    if (!cleanZip || cleanZip.length !== 8) return;
    const requestKey = `${cleanZip}-${cartLineKey}`;
    if (lastRequest.current === requestKey) return;
    lastRequest.current = requestKey;
    void calculateShipping(cleanZip);
    let active = true;
    void lookupCep(cleanZip)
      .then((address) => {
        if (!active || !address) return;
        setValue("street", address.logradouro);
        setValue("neighborhood", address.bairro);
        setValue("city", address.localidade);
        setValue("state", address.uf);
      })
      .catch(() => {
        if (active) setError("Não foi possível consultar o CEP. Preencha o endereço manualmente.");
      });
    return () => {
      active = false;
      if (lastRequest.current === requestKey) lastRequest.current = "";
    };
  }, [zipCode, cartLineKey, calculateShipping, setValue]);

  const onSubmit = async (data: CheckoutForm) => {
    if (!selectedShipping) {
      setError("Selecione uma opção de frete.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const payload = {
        items: cart.items.map((i) => ({
          slug: i.product.slug,
          size: i.size,
          color: i.color,
          quantity: i.quantity,
        })),
        payer: {
          name: data.name,
          surname: "",
          email: data.email,
          phone: (() => {
            const cleanPhone = data.phone.replace(/\D/g, "");
            return { area_code: cleanPhone.slice(0, 2), number: cleanPhone.slice(2) };
          })(),
          address: {
            zip_code: data.zipCode.replace(/\D/g, ""),
            street_name: data.street,
            street_number: data.number,
          },
        },
        shipping_cep: data.zipCode.replace(/\D/g, ""),
        shipping_method: selectedShipping.id,
      };

      const res = await createPaymentPreference({ data: payload });
      if (res.success && res.init_point) {
        window.location.href = res.init_point;
      } else {
        setError(res.success ? "O provedor não retornou um link de pagamento." : res.error);
      }
    } catch (e) {
      setError("Erro de conexão ao gerar o pagamento seguro.");
    }
    setLoading(false);
  };

  return (
    <Sheet open={cart.open} onOpenChange={cart.setOpen}>
      <SheetContent className="flex w-full flex-col sm:max-w-[450px]">
        <SheetTitle className="font-display text-3xl">
          SUA SACOLA <span className="text-muted-foreground">({cart.count})</span>
        </SheetTitle>
        <SheetDescription>
          {cart.items.length ? "Suas próximas peças favoritas." : "Seu próximo verso começa aqui."}
        </SheetDescription>

        <div className="min-h-0 flex-1 overflow-y-auto">
          {cart.items.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center gap-5 py-14">
              <ShoppingBag size={42} strokeWidth={1} />
              <p className="text-sm">A sacola ainda está vazia.</p>
              <Button variant="brand" asChild>
                <Link to="/loja" onClick={() => cart.setOpen(false)}>
                  Explorar peças <ArrowRight />
                </Link>
              </Button>
            </div>
          ) : (
            cart.items.map((item, i) => (
              <div className="bag-line" key={`${item.product.slug}-${item.size}-${item.color}`}>
                <img src={item.product.images[0]} alt={item.product.name} width={78} height={98} />
                <div className="min-w-0">
                  <div className="flex justify-between gap-2">
                    <Link
                      to="/produto/$slug"
                      params={{ slug: item.product.slug }}
                      onClick={() => cart.setOpen(false)}
                      className="text-xs leading-5"
                    >
                      {item.product.name}
                    </Link>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="size-11 shrink-0"
                      onClick={() => cart.remove(i)}
                    >
                      <Trash2 size={13} />
                    </Button>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {item.color} · {item.size}
                  </p>
                  <div className="mt-3 flex items-center justify-between">
                    <div className="flex items-center border border-border">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="size-11"
                        onClick={() => cart.update(i, item.quantity - 1)}
                        disabled={item.quantity === 1}
                      >
                        <Minus />
                      </Button>
                      <span className="w-5 text-center text-xs">{item.quantity}</span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="size-11"
                        onClick={() => cart.update(i, item.quantity + 1)}
                        disabled={item.quantity === 10}
                      >
                        <Plus />
                      </Button>
                    </div>
                    <span className="text-xs">
                      {money(item.product.priceCents * item.quantity)}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {cart.items.length > 0 && (
          <div className="border-t border-border pt-5">
            <div className="flex justify-between text-sm">
              <span>Subtotal</span>
              <strong>{money(cart.subtotal)}</strong>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="mt-5 space-y-3">
              <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-widest">
                Dados do Comprador
              </label>

              <div className="grid grid-cols-1 gap-2">
                <div>
                  <input
                    {...register("name")}
                    placeholder="Nome Completo"
                    className="w-full text-xs p-2 border border-border bg-transparent outline-none focus:border-primary"
                  />
                  {errors.name && (
                    <span className="text-xs text-red-500">{errors.name.message}</span>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <input
                      {...register("email")}
                      type="email"
                      placeholder="E-mail"
                      className="w-full text-xs p-2 border border-border bg-transparent outline-none focus:border-primary"
                    />
                    {errors.email && (
                      <span className="text-xs text-red-500">{errors.email.message}</span>
                    )}
                  </div>
                  <div>
                    <input
                      {...register("phone")}
                      placeholder="Telefone com DDD"
                      className="w-full text-xs p-2 border border-border bg-transparent outline-none focus:border-primary"
                    />
                    {errors.phone && (
                      <span className="text-xs text-red-500">{errors.phone.message}</span>
                    )}
                  </div>
                </div>
              </div>

              <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-widest mt-4">
                Endereço e Frete
              </label>

              <div className="grid grid-cols-3 gap-2">
                <div className="col-span-1">
                  <input
                    {...register("zipCode")}
                    placeholder="CEP"
                    maxLength={9}
                    className="w-full text-xs p-2 border border-border bg-transparent outline-none focus:border-primary"
                  />
                  {errors.zipCode && (
                    <span className="text-xs text-red-500">{errors.zipCode.message}</span>
                  )}
                </div>
                <div className="col-span-2">
                  <input
                    {...register("street")}
                    placeholder="Rua / Avenida"
                    className="w-full text-xs p-2 border border-border bg-transparent outline-none focus:border-primary"
                  />
                  {errors.street && (
                    <span className="text-xs text-red-500">{errors.street.message}</span>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-4 gap-2">
                <div className="col-span-1">
                  <input
                    {...register("number")}
                    placeholder="Nº"
                    className="w-full text-xs p-2 border border-border bg-transparent outline-none focus:border-primary"
                  />
                  {errors.number && (
                    <span className="text-xs text-red-500">{errors.number.message}</span>
                  )}
                </div>
                <div className="col-span-3">
                  <input
                    {...register("neighborhood")}
                    placeholder="Bairro"
                    className="w-full text-xs p-2 border border-border bg-transparent outline-none focus:border-primary"
                  />
                </div>
              </div>

              <div className="grid grid-cols-4 gap-2">
                <div className="col-span-3">
                  <input
                    {...register("city")}
                    placeholder="Cidade"
                    className="w-full text-xs p-2 border border-border bg-transparent outline-none focus:border-primary"
                  />
                </div>
                <div className="col-span-1">
                  <input
                    {...register("state")}
                    placeholder="UF"
                    maxLength={2}
                    className="w-full text-xs p-2 border border-border bg-transparent outline-none uppercase focus:border-primary"
                  />
                </div>
              </div>

              {shippingOptions && (
                <div className="mt-3 text-xs space-y-2 border border-border p-2 bg-muted/20">
                  {shippingOptions.map((opt) => (
                    <label
                      key={opt.name}
                      className="flex items-center justify-between cursor-pointer hover:opacity-75"
                    >
                      <div className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="shipping"
                          checked={selectedShipping?.name === opt.name}
                          onChange={() => setSelectedShipping(opt)}
                          className="accent-ink"
                        />
                        <div>
                          <p className="font-semibold">{opt.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {opt.estimatedDays} dias úteis
                          </p>
                        </div>
                      </div>
                      <span>{opt.priceCents === 0 ? "Grátis" : money(opt.priceCents)}</span>
                    </label>
                  ))}
                </div>
              )}

              {error && (
                <p role="alert" className="mt-2 text-xs text-red-500 font-semibold">
                  {error}
                </p>
              )}

              <div className="mt-3 flex justify-between font-semibold pt-3 border-t border-border">
                <span>Total Estimado</span>
                <span>{money(cart.subtotal + (selectedShipping?.priceCents || 0))}</span>
              </div>

              <Button
                type="submit"
                variant="brand"
                className="mt-5 h-12 w-full text-xs tracking-widest"
                disabled={!selectedShipping || loading}
              >
                <CreditCard size={15} className="mr-2" />{" "}
                {loading ? "Gerando Pagamento..." : "IR PARA O PAGAMENTO"}{" "}
                <ArrowUpRight size={15} className="ml-2" />
              </Button>
            </form>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
