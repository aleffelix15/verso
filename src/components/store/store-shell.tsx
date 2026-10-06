import { useState, type ReactNode } from 'react';
import { Link } from '@tanstack/react-router';
import { Search, ShoppingBag, Menu, ArrowUpRight, ArrowRight, Minus, Plus, Trash2, MessageCircle, Instagram, CreditCard, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { useCart } from './cart-context';
import { products, money, storeConfig } from '@/data/products';

export function StoreShell({children}:{children:ReactNode}) {
 const [menu,setMenu]=useState(false); const [search,setSearch]=useState(false); const [query,setQuery]=useState(''); const [policy,setPolicy]=useState(''); const cart=useCart();
 const results=products.filter(p=>`${p.name} ${p.verse} ${p.category}`.toLowerCase().includes(query.toLowerCase()));
 return <><div className="marquee" aria-label="Frete grátis acima de R$ 299, Drop 01 disponível, parcele em 3x"><div className="marquee-track">{Array.from({length:6},(_,i)=><span key={i}>FRETE GRÁTIS ACIMA DE R$ 299 <span className="text-primary">•</span> DROP 01 DISPONÍVEL <span className="text-primary">•</span> PARCELE EM 3X</span>)}</div></div><header className="site-header container-verso"><Link to="/" className="brand" aria-label="VERSO — início">VERSO<span className="text-primary">.</span></Link><nav className="site-nav" aria-label="Menu principal"><Link to="/loja">Loja</Link><Link to="/drops">Drops</Link><Link to="/sobre">Sobre</Link><Link to="/contato">Contato</Link></nav><div className="header-actions"><Button variant="header" size="icon" aria-label="Buscar produtos" title="Buscar" onClick={()=>setSearch(true)}><Search size={19}/></Button><Button variant="header" size="icon" aria-label={`Abrir sacola, ${cart.count} itens`} title="Sacola" onClick={()=>cart.setOpen(true)} className="relative"><ShoppingBag size={19}/>{cart.count>0&&<span className="absolute right-0 top-0 grid size-4 place-items-center bg-primary text-[9px] text-primary-foreground">{cart.count}</span>}</Button><Button variant="header" size="icon" className="sm:hidden" aria-label="Abrir menu" onClick={()=>setMenu(true)}><Menu size={20}/></Button></div></header><main>{children}</main><footer className="site-footer"><div className="container-verso"><div className="footer-main"><div className="footer-brand"><Link to="/" className="brand">VERSO<span className="text-primary">.</span></Link><p className="mt-4 text-xs text-chalk">Fé que veste. Propósito que fica.</p><p className="eyebrow mt-5 text-chalk">FEITO PARA A RUA. NÃO PARA UMA CAIXA.</p></div><div className="footer-links"><p className="footer-heading">EXPLORAR</p><Link to="/loja">Todas as peças</Link><Link to="/drops">Drop 01</Link><Link to="/sobre">Nossa história</Link><Link to="/contato">Fala com a gente</Link></div><div className="footer-links"><p className="footer-heading">INFORMAÇÕES</p><Button variant="header" className="h-auto justify-start p-0 text-[11px]" onClick={()=>setPolicy('Trocas e devoluções')}>Trocas e devoluções</Button><Button variant="header" className="h-auto justify-start p-0 text-[11px]" onClick={()=>setPolicy('Entrega e frete')}>Entrega e frete</Button><Button variant="header" className="h-auto justify-start p-0 text-[11px]" onClick={()=>setPolicy('Privacidade')}>Privacidade</Button></div><div className="footer-links"><p className="footer-heading">CONECTE-SE</p><Link to="/contato" className="flex items-center gap-2"><Instagram size={14}/> Instagram <ArrowUpRight size={12}/></Link><Link to="/contato" className="flex items-center gap-2"><MessageCircle size={14}/> WhatsApp <ArrowUpRight size={12}/></Link><p className="footer-heading mt-4">FORMAS DE PAGAMENTO</p><div className="flex flex-wrap gap-3 text-[10px]"><CreditCard size={15}/><span>VISA</span><span>Mastercard</span><span>PIX</span></div></div></div><div className="footer-bottom"><span>© 2026 VERSO. Todos os direitos reservados.</span><span>LOJA CONCEITO · PRODUTOS E CONTEÚDO DEMONSTRATIVOS</span></div></div></footer><Button asChild variant="ink" size="icon" className="whatsapp-float size-11 rounded-full" title="Falar com a VERSO"><Link to="/contato" aria-label="Falar com a VERSO pelo WhatsApp"><MessageCircle size={20}/></Link></Button>
 <Sheet open={menu} onOpenChange={setMenu}><SheetContent side="left" className="w-[85%]"><SheetTitle className="brand">VERSO.</SheetTitle><SheetDescription>Fé que veste.</SheetDescription><nav className="mt-10 flex flex-col gap-7 font-display text-4xl"><Link to="/loja" onClick={()=>setMenu(false)}>LOJA</Link><Link to="/drops" onClick={()=>setMenu(false)}>DROPS</Link><Link to="/sobre" onClick={()=>setMenu(false)}>SOBRE</Link><Link to="/contato" onClick={()=>setMenu(false)}>CONTATO</Link></nav></SheetContent></Sheet>
 <Dialog open={search} onOpenChange={setSearch}><DialogContent className="max-h-[85svh] overflow-y-auto"><DialogTitle className="font-display text-3xl">ENCONTRE SEU VERSO.</DialogTitle><DialogDescription>Peças, categorias e referências.</DialogDescription><div className="relative"><input autoFocus aria-label="Buscar peças" placeholder="O que você procura?" value={query} onChange={e=>setQuery(e.target.value.slice(0,100))} className="w-full pr-10"/><Search className="absolute right-3 top-3" size={18}/></div><div className="space-y-3">{results.map(p=><Link key={p.slug} to="/produto/$slug" params={{slug:p.slug}} onClick={()=>setSearch(false)} className="grid grid-cols-[55px_minmax(0,1fr)_auto] items-center gap-3 border-b border-border pb-3"><img src={p.images[0]} alt={p.name} width={55} height={65} className="h-16 w-14 object-cover"/><span className="text-xs">{p.name}</span><span className="text-xs">{money(p.price)}</span></Link>)}{results.length===0&&<p className="py-5 text-sm">Nenhuma peça por aqui. Tenta outro nome.</p>}</div></DialogContent></Dialog>
 <Dialog open={!!policy} onOpenChange={()=>setPolicy('')}><DialogContent><DialogTitle className="font-display text-3xl">{policy}</DialogTitle><DialogDescription>Informações desta loja conceito.</DialogDescription><p className="text-sm leading-7">{policy==='Privacidade'?'Esta demonstração não envia seus dados nem cadastra e-mails. A sacola existe apenas enquanto você navega.':policy==='Entrega e frete'?'Frete grátis em pedidos acima de R$ 299. Os valores por CEP são simulações, não cotações reais. Prazos e transportadoras serão confirmados antes da loja abrir.':'Em compras online, o direito de arrependimento é de 7 dias após o recebimento. As condições de troca de tamanho e o canal de atendimento serão confirmados na abertura da loja.'}</p></DialogContent></Dialog><CartDrawer/></>;
}
import { calculateFreight } from '@/server/shipping';
import { createPaymentPreference } from '@/server/checkout';

function CartDrawer(){const cart=useCart();const [cep,setCep]=useState('');const [shippingOptions,setShippingOptions]=useState<{name:string;price:number;estimated_days:number}[]|null>(null);const [selectedShipping,setSelectedShipping]=useState<{name:string;price:number}|null>(null);const [error,setError]=useState('');const [loading,setLoading]=useState(false);

 async function calculate(){
   const clean=cep.replace(/\D/g,'');
   if(!/^\d{8}$/.test(clean)||/^0{8}$/.test(clean)){setError('Digite um CEP válido com 8 números.');setShippingOptions(null);setSelectedShipping(null);return;}
   setError('');
   setLoading(true);
   try {
     const res = await calculateFreight({ data: { zip_code: clean, total_weight_kg: cart.items.length * 0.4, total_value: cart.subtotal } });
     if (res.success && res.options) {
       setShippingOptions(res.options);
       setSelectedShipping(res.options[0]); // Seleciona o primeiro por padrão
     }
   } catch(e) {
     setError('Não foi possível calcular o frete.');
   }
   setLoading(false);
 }

 async function finish(){
   setLoading(true);
   try {
     const payload = {
       items: cart.items.map(i => ({
         id: i.product.slug,
         title: `${i.product.name} - ${i.size} - ${i.color}`,
         quantity: i.quantity,
         unit_price: i.product.price,
         picture_url: `https://verso-streetwear.vercel.app${i.product.images[0]}`, // Fallback para logo/img local
         category_id: i.product.category
       })),
       payer: { name: 'Comprador', surname: 'Verso', email: 'contato@verso.com', phone: { area_code: '11', number: '999999999' }, address: { zip_code: cep.replace(/\D/g,''), street_name: 'Rua', street_number: '0' } },
       shipping_cost: selectedShipping ? selectedShipping.price : 0
     };
     
     const res = await createPaymentPreference({ data: payload });
     if (res.success && res.init_point) {
       // Redireciona para o checkout oficial seguro do MP
       window.location.href = res.init_point;
     } else {
       setError(res.error || 'Erro ao gerar o pagamento.');
     }
   } catch (e) {
     setError('Erro de conexão ao gerar o pagamento.');
   }
   setLoading(false);
 }

 return <><Sheet open={cart.open} onOpenChange={cart.setOpen}><SheetContent className="flex w-full flex-col sm:max-w-[450px]"><SheetTitle className="font-display text-3xl">SUA SACOLA <span className="text-muted-foreground">({cart.count})</span></SheetTitle><SheetDescription>{cart.items.length?'Suas próximas peças favoritas.':'Seu próximo verso começa aqui.'}</SheetDescription><div className="min-h-0 flex-1 overflow-y-auto">{cart.items.length===0?<div className="flex h-full flex-col items-center justify-center gap-5 py-14"><ShoppingBag size={42} strokeWidth={1}/><p className="text-sm">A sacola ainda está vazia.</p><Button variant="brand" asChild><Link to="/loja" onClick={()=>cart.setOpen(false)}>Explorar peças <ArrowRight/></Link></Button></div>:cart.items.map((item,i)=><div className="bag-line" key={`${item.product.slug}-${item.size}-${item.color}`}><img src={item.product.images[0]} alt={item.product.name} width={78} height={98}/><div className="min-w-0"><div className="flex justify-between gap-2"><Link to="/produto/$slug" params={{slug:item.product.slug}} onClick={()=>cart.setOpen(false)} className="text-xs leading-5">{item.product.name}</Link><Button variant="ghost" size="icon" className="size-6 shrink-0" aria-label={`Remover ${item.product.name}`} onClick={()=>cart.remove(i)}><Trash2 size={13}/></Button></div><p className="mt-1 text-[10px] text-muted-foreground">{item.color} · {item.size}</p><div className="mt-3 flex items-center justify-between"><div className="flex items-center border border-border"><Button variant="ghost" size="icon" className="size-7" aria-label={`Diminuir quantidade de ${item.product.name}`} onClick={()=>cart.update(i,item.quantity-1)} disabled={item.quantity===1}><Minus/></Button><span className="w-5 text-center text-xs">{item.quantity}</span><Button variant="ghost" size="icon" className="size-7" aria-label={`Aumentar quantidade de ${item.product.name}`} onClick={()=>cart.update(i,item.quantity+1)} disabled={item.quantity===10}><Plus/></Button></div><span className="text-xs">{money(item.product.price*item.quantity)}</span></div></div></div>)}</div>{cart.items.length>0&&<div className="border-t border-border pt-5"><div className="flex justify-between text-sm"><span>Subtotal</span><strong>{money(cart.subtotal)}</strong></div><p className="mt-2 text-[10px] text-muted-foreground">{cart.subtotal>299?'Seu pedido tem frete grátis.':`Faltam ${money(299.01-cart.subtotal)} para frete grátis.`}</p><label className="mt-5 block text-xs" htmlFor="shipping-cep">Calcular frete e Finalizar</label><div className="mt-2 flex gap-2"><input id="shipping-cep" value={cep} onChange={e=>{setCep(e.target.value.replace(/[^\d-]/g,'').slice(0,9));setShippingOptions(null);setSelectedShipping(null);}} placeholder="00000-000" inputMode="numeric" maxLength={9} className="w-full text-xs"/><Button variant="outline" className="h-auto" onClick={calculate} disabled={loading}>{loading?'...':'Calcular'}</Button></div>{error&&<p role="alert" className="mt-2 text-xs text-primary">{error}</p>}{shippingOptions&&<div className="mt-3 text-xs space-y-2">{shippingOptions.map(opt=><label key={opt.name} className="flex items-center justify-between border border-border p-2 cursor-pointer hover:bg-muted/50"><div className="flex items-center gap-2"><input type="radio" name="shipping" checked={selectedShipping?.name===opt.name} onChange={()=>setSelectedShipping(opt)} className="accent-ink"/><div><p className="font-semibold">{opt.name}</p><p className="text-[10px] text-muted-foreground">{opt.estimated_days} dias úteis</p></div></div><span>{opt.price===0?'Grátis':money(opt.price)}</span></label>)}<div className="mt-3 flex justify-between font-semibold pt-3 border-t border-border"><span>Total estimado</span><span>{money(cart.subtotal+(selectedShipping?.price||0))}</span></div></div>}<Button variant="brand" className="mt-5 h-12 w-full" onClick={finish} disabled={!selectedShipping || loading}><CreditCard size={17}/> {loading ? 'Gerando Pagamento...' : 'Ir para o Pagamento Seguro'} <ArrowUpRight size={17}/></Button><p className="mt-3 text-center text-[10px] text-muted-foreground">Checkout seguro processado pelo Mercado Pago.</p></div>}</SheetContent></Sheet></>;
}
