import { createServerFn } from '@tanstack/react-start';

type FreightPayload = {
  zip_code: string; // CEP de destino
  total_weight_kg: number;
  total_value: number;
};

// Cálculo de Frete Híbrido (API externa ou fallback de tabela)
// Executado de forma segura no servidor.
export const calculateFreight = createServerFn({ method: "POST" }).validator((d: FreightPayload) => d).handler(async ({ data: payload }) => {
  const cleanCep = payload.zip_code.replace(/\D/g, '');
  
  if (cleanCep.length !== 8) {
    throw new Error('CEP inválido.');
  }

  // Frete grátis para compras acima de R$ 299 (Regra de Negócio)
  if (payload.total_value >= 299) {
    return {
      success: true,
      options: [
        { name: 'Frete Grátis (Econômico)', price: 0, estimated_days: 7 },
        { name: 'Sedex (Expresso)', price: 29.90, estimated_days: 3 }
      ]
    };
  }

  // Lógica local/tabela de fretes simulando os Correios por região (Baseado no primeiro dígito do CEP)
  const regionCode = parseInt(cleanCep.charAt(0));
  
  // Tabela simplificada:
  // 0-3: SP, RJ, ES, MG (Sudeste)
  // 4-5: BA, SE, PE, AL, PB, RN, CE, PI, MA (Nordeste)
  // 6: DF, GO, TO, MT, MS (Centro-Oeste e Norte)
  // 7: DF, GO, TO, MT, MS, RO, AC (Centro-Oeste e Norte)
  // 8-9: PR, SC, RS (Sul)

  let basePac = 19.90;
  let baseSedex = 35.90;
  let daysPac = 5;
  let daysSedex = 2;

  if (regionCode >= 4 && regionCode <= 5) { // Nordeste
    basePac = 29.90; baseSedex = 55.90; daysPac = 9; daysSedex = 4;
  } else if (regionCode >= 6 && regionCode <= 7) { // Centro-Oeste / Norte
    basePac = 34.90; baseSedex = 65.90; daysPac = 12; daysSedex = 5;
  } else if (regionCode >= 8 && regionCode <= 9) { // Sul
    basePac = 24.90; baseSedex = 42.90; daysPac = 6; daysSedex = 3;
  }

  // Adicional por peso (exemplo: R$ 2 a cada 1kg extra além de 1kg)
  const weightCharge = payload.total_weight_kg > 1 ? Math.floor(payload.total_weight_kg) * 2 : 0;

  return {
    success: true,
    options: [
      { name: 'PAC (Econômico)', price: parseFloat((basePac + weightCharge).toFixed(2)), estimated_days: daysPac },
      { name: 'Sedex (Expresso)', price: parseFloat((baseSedex + weightCharge).toFixed(2)), estimated_days: daysSedex }
    ]
  };
});
