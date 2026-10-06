const fs = require("fs");
let content = fs.readFileSync("src/components/store/store-shell.tsx", "utf-8");

const importsToAdd = `
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const checkoutFormSchema = z.object({
  name: z.string().min(2, 'Nome muito curto'),
  email: z.string().email('E-mail inválido'),
  phone: z.string().min(10, 'DDD + Número'),
  zip_code: z.string().min(8, 'CEP inválido'),
  street_name: z.string().min(2, 'Rua inválida'),
  street_number: z.string().min(1, 'Número obrigatório'),
  complement: z.string().optional(),
  neighborhood: z.string().min(2, 'Bairro inválido'),
  city: z.string().min(2, 'Cidade inválida'),
  state: z.string().length(2, 'UF inválida')
});
`;

// Insert the imports at the top right after the existing imports
content = content.replace(
  /(import { createPaymentPreference } from '@\/server\/checkout';)/,
  "$1" + importsToAdd,
);

// Completely replace the logic inside CartDrawer before return
const logicToReplaceRegex = /function CartDrawer\(\) \{[\s\S]*?setLoading\(false\);\n  \}/;

const newLogic = `function CartDrawer() {
  const cart = useCart();
  const [shippingOptions, setShippingOptions] = useState<{name:string;price:number;estimated_days:number}[]|null>(null);
  const [selectedShipping, setSelectedShipping] = useState<{name:string;price:number}|null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<z.infer<typeof checkoutFormSchema>>({
    resolver: zodResolver(checkoutFormSchema)
  });
  
  const cepValue = watch('zip_code');

  async function calculate(cleanCep: string) {
    if (!/^\\d{8}$/.test(cleanCep)) {
      setError('Digite um CEP válido com 8 números.');
      setShippingOptions(null);
      setSelectedShipping(null);
      return;
    }
    setError('');
    setLoading(true);
    try {
      const res = await calculateFreight({ data: { zip_code: cleanCep, total_weight_kg: cart.items.length * 0.4, total_value: cart.subtotal } });
      if (res.success && res.options) {
        setShippingOptions(res.options);
        setSelectedShipping(res.options[0]);
      }
    } catch (e) {
      setError('Não foi possível calcular o frete.');
    }
    setLoading(false);
  }

  // Busca ViaCEP automática
  if (cepValue && cepValue.replace(/\\D/g, '').length === 8 && !shippingOptions && !loading) {
     const clean = cepValue.replace(/\\D/g, '');
     calculate(clean);
     fetch(\`https://viacep.com.br/ws/\${clean}/json/\`)
       .then(r => r.json())
       .then(d => {
         if(!d.erro) {
           setValue('street_name', d.logradouro);
           setValue('neighborhood', d.bairro);
           setValue('city', d.localidade);
           setValue('state', d.uf);
         }
       }).catch(()=>{});
  }

  const finish = handleSubmit(async (formData) => {
    setLoading(true);
    try {
      const payload = {
        items: cart.items.map(i => ({ slug: i.product.slug, size: i.size, color: i.color, quantity: i.quantity })),
        payer: { name: formData.name, surname: 'Comprador', email: formData.email, phone: { area_code: formData.phone.substring(0, 2), number: formData.phone.substring(2) }, address: { zip_code: formData.zip_code.replace(/\\D/g, ''), street_name: formData.street_name, street_number: formData.street_number } },
        shipping_cep: formData.zip_code.replace(/\\D/g, ''),
        shipping_method: (selectedShipping?.name || '').toLowerCase().includes('sedex') ? 'sedex' : 'pac' as 'pac' | 'sedex'
      };

      const res = await createPaymentPreference({ data: payload });
      if (res.success && res.init_point) {
        window.location.href = res.init_point;
      } else {
        setError(res.error || 'Erro ao gerar o pagamento.');
      }
    } catch (e) {
      setError('Erro de conexão ao gerar o pagamento.');
    }
    setLoading(false);
  });
`;

content = content.replace(logicToReplaceRegex, newLogic);

// Now replace the form rendering inside the JSX
const oldJSXRegex =
  /<label className="mt-5 block text-xs" htmlFor="shipping-cep">[\s\S]*?<Button[\s\S]*?variant="brand"[\s\S]*?onClick=\{finish\}[\s\S]*?<\/Button>/;

const newJSX = `<form onSubmit={finish} className="mt-5 space-y-3">
              <label className="block text-xs font-semibold">DADOS DO COMPRADOR</label>
              <input {...register('name')} placeholder="Nome completo" className="w-full text-xs p-2 border border-border" />
              {errors.name && <span className="text-[10px] text-red-500">{errors.name.message}</span>}
              
              <input {...register('email')} type="email" placeholder="E-mail" className="w-full text-xs p-2 border border-border" />
              {errors.email && <span className="text-[10px] text-red-500">{errors.email.message}</span>}
              
              <input {...register('phone')} placeholder="Telefone (DDD + Número)" className="w-full text-xs p-2 border border-border" />
              {errors.phone && <span className="text-[10px] text-red-500">{errors.phone.message}</span>}

              <label className="block text-xs font-semibold mt-4">ENDEREÇO E FRETE</label>
              <input {...register('zip_code')} placeholder="CEP" maxLength={9} className="w-full text-xs p-2 border border-border" />
              {errors.zip_code && <span className="text-[10px] text-red-500">{errors.zip_code.message}</span>}

              {shippingOptions && (
                <div className="mt-3 text-xs space-y-2">
                  {shippingOptions.map((opt) => (
                    <label key={opt.name} className="flex items-center justify-between border border-border p-2 cursor-pointer hover:bg-muted/50">
                      <div className="flex items-center gap-2">
                        <input type="radio" name="shipping" checked={selectedShipping?.name === opt.name} onChange={() => setSelectedShipping(opt)} className="accent-ink" />
                        <div>
                          <p className="font-semibold">{opt.name}</p>
                          <p className="text-[10px] text-muted-foreground">{opt.estimated_days} dias úteis</p>
                        </div>
                      </div>
                      <span>{opt.price === 0 ? "Grátis" : money(opt.price)}</span>
                    </label>
                  ))}
                </div>
              )}

              <div className="grid grid-cols-3 gap-2">
                <div className="col-span-2">
                  <input {...register('street_name')} placeholder="Rua" className="w-full text-xs p-2 border border-border" />
                </div>
                <input {...register('street_number')} placeholder="Nº" className="w-full text-xs p-2 border border-border" />
              </div>
              
              <div className="grid grid-cols-2 gap-2">
                 <input {...register('neighborhood')} placeholder="Bairro" className="w-full text-xs p-2 border border-border" />
                 <input {...register('city')} placeholder="Cidade" className="w-full text-xs p-2 border border-border" />
              </div>

              {error && <p role="alert" className="mt-2 text-xs text-red-500">{error}</p>}
              
              <div className="mt-3 flex justify-between font-semibold pt-3 border-t border-border">
                <span>Total estimado</span>
                <span>{money(cart.subtotal + (selectedShipping?.price || 0))}</span>
              </div>

              <Button type="submit" variant="brand" className="mt-5 h-12 w-full" disabled={!selectedShipping || loading}>
                <CreditCard size={17} /> {loading ? "Gerando Pagamento..." : "Ir para o Pagamento Seguro"} <ArrowUpRight size={17} />
              </Button>
            </form>`;

content = content.replace(oldJSXRegex, newJSX);

fs.writeFileSync("src/components/store/store-shell.tsx", content);
console.log("Done modifying store-shell.tsx");
