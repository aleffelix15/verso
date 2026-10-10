# Implantação e checklist de segurança

## Variáveis na Vercel

Configure no projeto Vercel, por ambiente (Preview/Production), sem prefixo `VITE_` para segredos:

- `PUBLIC_SITE_URL`: origem HTTPS canônica da loja.
- `MP_ACCESS_TOKEN`: token privado do Mercado Pago.
- `MP_PUBLIC_KEY`: chave pública quando aplicável ao fluxo.
- `MP_WEBHOOK_SECRET`: segredo de assinatura de notificações.
- `SUPABASE_URL` e `SUPABASE_SERVICE_ROLE_KEY`: credenciais somente servidor.
- `FREIGHT_API_TOKEN`: opcional até integração real de frete.

Nunca inclua valores reais em commits, tickets, logs ou variáveis expostas ao navegador. `.env.example` contém apenas valores vazios/exemplo local. Se uma chave tiver sido exposta, revogue-a no provedor e substitua-a nos ambientes; não reutilize a antiga.

## Mercado Pago

Após implementar e implantar o endpoint no Lote B, configure no painel do Mercado Pago a URL HTTPS `https://<dominio-da-loja>/api/webhook/mercadopago` e o evento de pagamentos. Gere/registre o segredo de webhook no ambiente correspondente e valide eventos de teste antes de produção. O endpoint atual não deve ser considerado pronto para pagamentos confirmados até concluir o Lote B.

## CSP e cabeçalhos

A CSP está em `Content-Security-Policy-Report-Only`. Faça deploy Preview e teste navegação, imagens, fontes, ViaCEP, checkout/retorno do Mercado Pago e páginas legais. Inspecione o console e os relatórios de violações; revise diretivas com origens estritamente necessárias. Depois, altere o cabeçalho para `Content-Security-Policy` somente após essa revisão e repita a validação. HSTS está configurado para o domínio e subdomínios; confirme que todos suportam HTTPS antes de produção.

## Supabase e estoque

Supabase está definido para uso server-only, mas pedidos/migrações ainda não foram implementados. No Lote B, criar tabelas e ativar RLS sem policies públicas; executar migração somente após revisão/aprovação. Estoque ainda não é reservado nem decrementado. Desenho mínimo: validar disponibilidade e reservar atomicamente na criação do pedido, expirar/liberar reserva em pagamento recusado/expirado e reconciliar pagamento via webhook idempotente. Não aceitar operação real presumindo controle de estoque.

## Checklist de go-live

- [ ] Concluir Lote B: persistência de pedidos antes da preferência MP, validação/idempotência do webhook, newsletter e rate limits.
- [ ] Configurar segredos separados em Preview e Production e revisar acesso.
- [ ] Executar checkout de ponta a ponta em sandbox e verificar valor/moeda/external reference.
- [ ] Testar webhook assinado, replay, duplicado e estados de pagamento.
- [ ] Validar CSP no Preview e promover de Report-Only após tratar violações.
- [ ] Revisão jurídica das páginas de privacidade, termos e trocas.
- [ ] Definir processo de estoque, atendimento, devolução e rotação de credenciais.
- [ ] Confirmar HTTPS em domínio e subdomínios antes de manter HSTS.
