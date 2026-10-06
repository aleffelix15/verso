import { useState, type ReactNode } from 'react';
import { Link } from '@tanstack/react-router';
import { Search, ShoppingBag, Menu, ArrowUpRight, Instagram, MessageCircle, CreditCard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { useCart } from './cart-context';
import { products, money } from '@/data/products';
import { CartDrawer } from './cart-drawer';

export function StoreShell({ children }: { children: ReactNode }) {
  const [menu, setMenu] = useState(false);
  const [search, setSearch] = useState(false);
  const [query, setQuery] = useState('');
  const [policy, setPolicy] = useState('');
  const cart = useCart();
  
  const results = products.filter(p => `${p.name} ${p.verse} ${p.category}`.toLowerCase().includes(query.toLowerCase()));

  return (
    <>
      <div className="marquee" aria-label="Frete grátis acima de R$ 299, Drop 01 disponível, parcele em 3x">
        <div className="marquee-track">
          {Array.from({ length: 6 }, (_, i) => (
            <span key={i}>
              FRETE GRÁTIS ACIMA DE R$ 299 <span className="text-primary">•</span> DROP 01 DISPONÍVEL <span className="text-primary">•</span> PARCELE EM 3X
            </span>
          ))}
        </div>
      </div>
      
      <header className="site-header container-verso">
        <Link to="/" className="brand" aria-label="VERSO — início">
          VERSO<span className="text-primary">.</span>
        </Link>
        <nav className="site-nav" aria-label="Menu principal">
          <Link to="/loja">Loja</Link>
          <Link to="/drops">Drops</Link>
          <Link to="/sobre">Sobre</Link>
          <Link to="/contato">Contato</Link>
        </nav>
        <div className="header-actions">
          <Button variant="header" size="icon" aria-label="Buscar produtos" title="Buscar" onClick={() => setSearch(true)}>
            <Search size={19} />
          </Button>
          <Button variant="header" size="icon" aria-label={`Abrir sacola, ${cart.count} itens`} title="Sacola" onClick={() => cart.setOpen(true)} className="relative">
            <ShoppingBag size={19} />
            {cart.count > 0 && (
              <span className="absolute right-0 top-0 grid size-4 place-items-center bg-primary text-[9px] text-primary-foreground">
                {cart.count}
              </span>
            )}
          </Button>
          <Button variant="header" size="icon" className="sm:hidden" aria-label="Abrir menu" onClick={() => setMenu(true)}>
            <Menu size={20} />
          </Button>
        </div>
      </header>

      <main>{children}</main>

      <footer className="site-footer">
        <div className="container-verso">
          <div className="footer-main">
            <div className="footer-brand">
              <Link to="/" className="brand">
                VERSO<span className="text-primary">.</span>
              </Link>
              <p className="mt-4 text-xs text-chalk">Fé que veste. Propósito que fica.</p>
              <p className="eyebrow mt-5 text-chalk">FEITO PARA A RUA. NÃO PARA UMA CAIXA.</p>
            </div>
            <div className="footer-links">
              <p className="footer-heading">EXPLORAR</p>
              <Link to="/loja">Todas as peças</Link>
              <Link to="/drops">Drop 01</Link>
              <Link to="/sobre">Nossa história</Link>
              <Link to="/contato">Fala com a gente</Link>
            </div>
            <div className="footer-links">
              <p className="footer-heading">INFORMAÇÕES</p>
              <Button variant="header" className="h-auto justify-start p-0 text-[11px]" onClick={() => setPolicy('Trocas e devoluções')}>
                Trocas e devoluções
              </Button>
              <Button variant="header" className="h-auto justify-start p-0 text-[11px]" onClick={() => setPolicy('Entrega e frete')}>
                Entrega e frete
              </Button>
              <Button variant="header" className="h-auto justify-start p-0 text-[11px]" onClick={() => setPolicy('Privacidade')}>
                Privacidade
              </Button>
            </div>
            <div className="footer-links">
              <p className="footer-heading">CONECTE-SE</p>
              <Link to="/contato" className="flex items-center gap-2">
                <Instagram size={14} /> Instagram <ArrowUpRight size={12} />
              </Link>
              <Link to="/contato" className="flex items-center gap-2">
                <MessageCircle size={14} /> WhatsApp <ArrowUpRight size={12} />
              </Link>
              <p className="footer-heading mt-4">FORMAS DE PAGAMENTO</p>
              <div className="flex flex-wrap gap-3 text-[10px]">
                <CreditCard size={15} />
                <span>VISA</span>
                <span>Mastercard</span>
                <span>PIX</span>
              </div>
            </div>
          </div>
          <div className="footer-bottom">
            <span>© 2026 VERSO. Todos os direitos reservados.</span>
            <span>STORE OFICIAL</span>
          </div>
        </div>
      </footer>

      <Button asChild variant="ink" size="icon" className="whatsapp-float size-11 rounded-full" title="Falar com a VERSO">
        <Link to="/contato" aria-label="Falar com a VERSO pelo WhatsApp">
          <MessageCircle size={20} />
        </Link>
      </Button>

      <Sheet open={menu} onOpenChange={setMenu}>
        <SheetContent side="left" className="w-[85%]">
          <SheetTitle className="brand">VERSO.</SheetTitle>
          <SheetDescription>Fé que veste.</SheetDescription>
          <nav className="mt-10 flex flex-col gap-7 font-display text-4xl">
            <Link to="/loja" onClick={() => setMenu(false)}>LOJA</Link>
            <Link to="/drops" onClick={() => setMenu(false)}>DROPS</Link>
            <Link to="/sobre" onClick={() => setMenu(false)}>SOBRE</Link>
            <Link to="/contato" onClick={() => setMenu(false)}>CONTATO</Link>
          </nav>
        </SheetContent>
      </Sheet>

      <Dialog open={search} onOpenChange={setSearch}>
        <DialogContent className="max-h-[85svh] overflow-y-auto">
          <DialogTitle className="font-display text-3xl">ENCONTRE SEU VERSO.</DialogTitle>
          <DialogDescription>Peças, categorias e referências.</DialogDescription>
          <div className="relative">
            <input
              autoFocus
              aria-label="Buscar peças"
              placeholder="O que você procura?"
              value={query}
              onChange={e => setQuery(e.target.value.slice(0, 100))}
              className="w-full pr-10"
            />
            <Search className="absolute right-3 top-3" size={18} />
          </div>
          <div className="space-y-3">
            {results.map(p => (
              <Link key={p.slug} to="/produto/$slug" params={{ slug: p.slug }} onClick={() => setSearch(false)} className="grid grid-cols-[55px_minmax(0,1fr)_auto] items-center gap-3 border-b border-border pb-3">
                <img src={p.images[0]} alt={p.name} width={55} height={65} className="h-16 w-14 object-cover" />
                <span className="text-xs">{p.name}</span>
                <span className="text-xs">{money(p.price)}</span>
              </Link>
            ))}
            {results.length === 0 && <p className="py-5 text-sm">Nenhuma peça por aqui. Tenta outro nome.</p>}
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={!!policy} onOpenChange={() => setPolicy('')}>
        <DialogContent>
          <DialogTitle className="font-display text-3xl">{policy}</DialogTitle>
          <DialogDescription>Informações oficiais da loja.</DialogDescription>
          <p className="text-sm leading-7">
            {policy === 'Privacidade'
              ? 'Seus dados são processados e armazenados com criptografia de ponta a ponta. Ambiente seguro Mercado Pago.'
              : policy === 'Entrega e frete'
                ? 'Frete grátis em pedidos acima de R$ 299. Consulte o prazo na finalização da compra.'
                : 'Em compras online, o direito de arrependimento é de 7 dias após o recebimento. As condições de troca de tamanho e o canal de atendimento serão confirmados.'}
          </p>
        </DialogContent>
      </Dialog>

      <CartDrawer />
    </>
  );
}
