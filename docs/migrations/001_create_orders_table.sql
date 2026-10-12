-- Migration: 001_create_orders_table.sql
-- Descrição: Criação da tabela de pedidos com restrições de integridade, índices e RLS

CREATE TABLE IF NOT EXISTS public.orders (
  id TEXT PRIMARY KEY,
  external_reference TEXT UNIQUE NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('created', 'pending_payment', 'approved', 'rejected', 'cancelled', 'refunded')),
  customer_email TEXT NOT NULL,
  customer_name TEXT NOT NULL,
  total_cents INTEGER NOT NULL CHECK (total_cents > 0),
  order_data JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Índices de consulta rápida e integridade
CREATE INDEX IF NOT EXISTS idx_orders_external_reference ON public.orders(external_reference);
CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_customer_email ON public.orders(customer_email);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON public.orders(created_at DESC);

-- Habilita RLS (Row Level Security) estrito: NENHUM ACESSO PÚBLICO
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Política: Apenas a service_role (servidor) pode ler e gravar pedidos
CREATE POLICY "Apenas serviço de servidor pode gerenciar pedidos"
  ON public.orders
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Gatilho para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION public.handle_orders_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = timezone('utc'::text, now());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_orders_updated_at ON public.orders;
CREATE TRIGGER trigger_orders_updated_at
  BEFORE UPDATE ON public.orders
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_orders_updated_at();
