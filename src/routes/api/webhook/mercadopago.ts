import { createAPIFileRoute } from "@tanstack/react-start/api";
import { MercadoPagoConfig, Payment } from 'mercadopago';
import crypto from 'crypto';
import { env } from '../../../lib/env';

const client = new MercadoPagoConfig({ accessToken: env.MP_ACCESS_TOKEN });

export const APIRoute = createAPIFileRoute('/api/webhook/mercadopago')({
  POST: async ({ request }) => {
    try {
      const url = new URL(request.url);
      const xSignature = request.headers.get('x-signature');
      const xRequestId = request.headers.get('x-request-id');
      
      // Proteção de assinatura (Requisito 1.4)
      if (!xSignature || !xRequestId || !env.MP_WEBHOOK_SECRET) {
        console.warn('Webhook rejeitado: Falta assinatura ou segredo.');
        return new Response('Missing signature or secret', { status: 400 });
      }

      const parts = xSignature.split(',');
      let ts, v1;
      for (const part of parts) {
        const [key, value] = part.split('=');
        if (key === 'ts') ts = value;
        if (key === 'v1') v1 = value;
      }

      if (!ts || !v1) {
        return new Response('Invalid signature format', { status: 400 });
      }

      const dataID = url.searchParams.get('data.id');
      if (!dataID) {
        return new Response('No data.id provided', { status: 400 });
      }

      const manifest = `id:${dataID};request-id:${xRequestId};ts:${ts};`;
      const hmac = crypto.createHmac('sha256', env.MP_WEBHOOK_SECRET);
      hmac.update(manifest);
      const expectedSignature = hmac.digest('hex');

      // Comparação em tempo constante (evita ataques de timing)
      if (!crypto.timingSafeEqual(Buffer.from(expectedSignature), Buffer.from(v1))) {
        console.warn('Webhook rejeitado: Assinatura inválida (Hacker ou Credencial incorreta).');
        return new Response('Unauthorized', { status: 401 });
      }

      // Processamento Idempotente do Pagamento
      const payload = await request.json().catch(() => ({}));
      const type = url.searchParams.get('type') || payload.type;
      
      if (type === 'payment') {
        const paymentId = Number(dataID);
        // Consulta o status real (Evita spoofing de JSON)
        const payment = await new Payment(client).get({ id: paymentId });
        
        console.log(`[MP Webhook] Payment ${payment.id} status: ${payment.status} | ref: ${payment.external_reference}`);
        
        // FASE 3: Aqui injetaremos a atualização no Firebase.
        // ex: updateOrderStatus(payment.external_reference, payment.status)
      }

      return new Response('OK', { status: 200 });
    } catch (error) {
      console.error('Webhook processing error:', error);
      return new Response('Internal Server Error', { status: 500 });
    }
  }
});
