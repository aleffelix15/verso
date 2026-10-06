import { createServerFn } from '@tanstack/react-start';
import { MercadoPagoConfig, Preference } from 'mercadopago';

// Configuração do Mercado Pago (com fallback de ambiente)
const client = new MercadoPagoConfig({
  accessToken: process.env.MP_ACCESS_TOKEN || 'APP_USR-test-token',
  options: { timeout: 5000 }
});

type CheckoutPayload = {
  items: { title: string; unit_price: number; quantity: number; picture_url: string; id: string; category_id: string }[];
  payer: { name: string; surname: string; email: string; phone: { area_code: string; number: string }; address: { zip_code: string; street_name: string; street_number: string } };
  shipping_cost: number;
};

// Server function para gerar a preferência de pagamento de forma segura
export const createPaymentPreference = createServerFn({ method: "POST" }).validator((d: CheckoutPayload) => d).handler(async ({ data: payload }) => {
  try {
    const preference = new Preference(client);
    
    // Converte os itens para o formato do MP
    const items = payload.items.map(item => ({
      id: item.id,
      title: item.title,
      quantity: item.quantity,
      unit_price: item.unit_price,
      currency_id: 'BRL',
      picture_url: item.picture_url,
      category_id: item.category_id,
    }));

    // Adiciona o frete como um item extra, se houver
    if (payload.shipping_cost > 0) {
      items.push({
        id: 'shipping',
        title: 'Frete e Entrega',
        quantity: 1,
        unit_price: payload.shipping_cost,
        currency_id: 'BRL',
        picture_url: '',
        category_id: 'shipping'
      });
    }

    const body = {
      items,
      payer: payload.payer,
      back_urls: {
        success: `${process.env.PUBLIC_SITE_URL || 'http://localhost:5173'}/pagamento/sucesso`,
        pending: `${process.env.PUBLIC_SITE_URL || 'http://localhost:5173'}/pagamento/pendente`,
        failure: `${process.env.PUBLIC_SITE_URL || 'http://localhost:5173'}/pagamento/recusado`
      },
      auto_return: 'approved' as const,
      payment_methods: {
        excluded_payment_methods: [],
        excluded_payment_types: [],
        installments: 3 // Max de 3 parcelas (como diz o site)
      },
      notification_url: `${process.env.PUBLIC_SITE_URL || 'http://localhost:5173'}/api/webhook/mercadopago`,
      statement_descriptor: 'VERSO STREETWEAR',
      external_reference: `ORDER-${Date.now()}`
    };

    const response = await preference.create({ body });
    return { success: true, init_point: response.init_point, id: response.id };

  } catch (error) {
    console.error('Erro ao criar preferência de pagamento no MP:', error);
    return { success: false, error: 'Falha ao processar o pagamento. Verifique as credenciais.' };
  }
});
