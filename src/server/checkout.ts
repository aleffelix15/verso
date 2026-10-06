import { createServerFn } from '@tanstack/react-start';
import { MercadoPagoConfig, Preference } from 'mercadopago';
import { z } from 'zod';
import { env } from '../lib/env';
import { getProductBySlug } from '../data/products';
import { calculateFreight } from './shipping';

const client = new MercadoPagoConfig({
  accessToken: env.MP_ACCESS_TOKEN,
  options: { timeout: 5000 }
});

const checkoutSchema = z.object({
  items: z.array(z.object({
    slug: z.string(),
    size: z.string(),
    color: z.string(),
    quantity: z.number().int().min(1).max(10)
  })).min(1, "Carrinho vazio"),
  payer: z.object({
    name: z.string().min(2, "Nome incompleto"),
    surname: z.string().optional(),
    email: z.string().email("E-mail inválido"),
    phone: z.object({
      area_code: z.string(),
      number: z.string()
    }).optional(),
    address: z.object({
      zip_code: z.string(),
      street_name: z.string(),
      street_number: z.string()
    }).optional()
  }),
  shipping_cep: z.string().min(8, "CEP inválido"),
  shipping_method: z.enum(['pac', 'sedex'])
});

export const createPaymentPreference = createServerFn({ method: "POST" })
  .validator((d: z.infer<typeof checkoutSchema>) => checkoutSchema.parse(d))
  .handler(async ({ data: payload }) => {
  try {
    const preference = new Preference(client);
    const mpItems: any[] = [];
    let subtotal = 0;
    
    // 1. Validação cruzada com Catálogo de Produtos
    for (const item of payload.items) {
      const dbProduct = getProductBySlug(item.slug);
      if (!dbProduct) throw new Error(`Produto não encontrado: ${item.slug}`);
      
      // Validação de cor e tamanho
      if (!dbProduct.colors.includes(item.color)) throw new Error(`Cor ${item.color} indisponível para ${item.slug}`);
      if (!dbProduct.sizes.includes(item.size)) throw new Error(`Tamanho ${item.size} indisponível para ${item.slug}`);

      subtotal += dbProduct.price * item.quantity;

      mpItems.push({
        id: `${dbProduct.id}-${item.color}-${item.size}`,
        title: `${dbProduct.name} - ${item.size} - ${item.color}`,
        quantity: item.quantity,
        unit_price: dbProduct.price,
        currency_id: 'BRL',
        picture_url: dbProduct.images[0].startsWith('http') ? dbProduct.images[0] : `${env.PUBLIC_SITE_URL}${dbProduct.images[0]}`,
        category_id: dbProduct.categoryId,
      });
    }

    // 2. Recálculo do Frete no Servidor
    // Nota: Como não temos o peso vindo do client, vamos estipular temporariamente a mesma regra de frete (cada peça ~0.4kg)
    const weight = payload.items.reduce((acc, item) => acc + (0.4 * item.quantity), 0);
    const shippingCalc = await calculateFreight({ data: { zip_code: payload.shipping_cep, total_weight_kg: weight, total_value: subtotal } });
    
    if (!shippingCalc.success || !shippingCalc.options) {
        throw new Error("Falha ao calcular rota de entrega para este CEP.");
    }
    
    const chosenShipping = payload.shipping_method.toLowerCase() === 'sedex' ? shippingCalc.options[1] : shippingCalc.options[0];
    let finalShippingCost = chosenShipping.price;

    if (finalShippingCost > 0) {
      mpItems.push({
        id: 'shipping',
        title: `Frete - ${chosenShipping.name}`,
        quantity: 1,
        unit_price: finalShippingCost,
        currency_id: 'BRL',
        picture_url: '',
        category_id: 'shipping'
      });
    }

    // 3. Montagem da Ordem
    const body = {
      items: mpItems,
      payer: payload.payer,
      back_urls: {
        success: `${env.PUBLIC_SITE_URL}/pagamento/sucesso`,
        pending: `${env.PUBLIC_SITE_URL}/pagamento/pendente`,
        failure: `${env.PUBLIC_SITE_URL}/pagamento/recusado`
      },
      auto_return: 'approved' as const,
      payment_methods: {
        excluded_payment_methods: [],
        excluded_payment_types: [],
        installments: 3 // Obs: O "sem juros" real deve ser ativado diretamente nas taxas do painel do Mercado Pago do lojista.
      },
      notification_url: `${env.PUBLIC_SITE_URL}/api/webhook/mercadopago`,
      statement_descriptor: 'VERSO STREETWEAR',
      external_reference: crypto.randomUUID()
    };

    const response = await preference.create({ body });
    return { success: true, init_point: response.init_point, id: response.id };

  } catch (error: any) {
    console.error('Erro de Segurança no Checkout:', error.message);
    return { success: false, error: error.message || 'Falha de validação da transação.' };
  }
});
