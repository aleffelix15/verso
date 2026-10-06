import { createFileRoute } from '@tanstack/react-router'


export const Route = createFileRoute('/api/webhook/mercadopago')({
  staticData: { sitemap: false },
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          // Extraindo o evento do Mercado Pago
          const url = new URL(request.url);
          const type = url.searchParams.get('type') || url.searchParams.get('topic');
          const id = url.searchParams.get('data.id') || url.searchParams.get('id');

          if (type === 'payment' && id) {
            console.log(`[WEBHOOK] Pagamento recebido: ID ${id}`);
            // Aqui normalmente faríamos uma consulta com SDK mercadopago `new Payment(client).get({ id })`
            // para checar o status e persistir a aprovação do pedido no banco de dados.
            // ...
            return new Response("OK", { status: 200 });
          }

          return new Response("Ignored", { status: 200 });
        } catch (error) {
          console.error('[WEBHOOK ERROR]:', error);
          return new Response("Internal Error", { status: 500 });
        }
      }
    }
  }
});
