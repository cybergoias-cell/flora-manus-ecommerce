# Flora Manus E-commerce (Monorepo)
- backend-api (Node/Express, porta 3000)
- admin-frontend (React/Vite, porta 5173)
- loja-virtual (React/Vite, porta 5174)

Sprint 0: Telemetria (GTM/GA4)



## Como Testar: Consumo de Configurações Visuais (Sprint 1)

**Objetivo:** Verificar se o logo e os banners estão sendo carregados da API e se as alterações feitas no Admin refletem na Loja.

### Pré-requisitos

1.  O **backend-api** deve estar rodando na porta `3000` (`http://localhost:3000`).
2.  O endpoint `/api/configuracoes-visuais` deve estar configurado para retornar dados reais (logo e banners).

### Passos de Teste

1.  **Instalar Dependências e Iniciar a Loja Virtual:**
    ```bash
    cd loja-virtual
    pnpm install
    # Certifique-se de que o backend está rodando antes de iniciar a loja
    pnpm run dev
    ```
2.  **Verificação Inicial (API com dados):**
    *   Acesse a loja virtual (porta 5173, ou a porta que o `pnpm run dev` indicar).
    *   Verifique se o logo no cabeçalho e os banners na página inicial **não** são os fallbacks locais (`/fallback-logo.png`, `/fallback-banner-X.jpg`).
    *   Inspecione a rede no navegador para confirmar que a requisição `GET http://localhost:3000/api/configuracoes-visuais` foi bem-sucedida.
3.  **Teste de Fallback (API fora do ar):**
    *   Pare o **backend-api**.
    *   Recarregue a página da loja virtual.
    *   Verifique se o logo e os banners agora são os fallbacks locais. O console deve exibir uma mensagem de erro (`Error fetching visual config... Falling back to local config.`).
4.  **Teste de Atualização (Admin):**
    *   Inicie o **backend-api** novamente.
    *   Altere o logo ou adicione/desative um banner via painel de administração.
    *   Recarregue a página da loja virtual e verifique se as alterações estão visíveis.

### Exemplos de Requisição (cURL)

Para testar o endpoint diretamente:
```bash
curl -X GET http://localhost:3000/api/configuracoes-visuais
```
A resposta esperada deve ser um JSON com a estrutura:
```json
{
  "logo": {
    "url": "...",
    "alt": "...",
    "width": 150,
    "height": 50
  },
  "banners": [
    {
      "id": 1,
      "url": "...",
      "link": "...",
      "active": true,
      "alt": "..."
    }
    // ... outros banners
  ]
}
```

