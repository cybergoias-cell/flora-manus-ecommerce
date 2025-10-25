# Backend API

Esta é a API de backend para o ecommerce, responsável por servir configurações e dados para o Admin e a Loja Virtual.

## Instalação

Navegue até o diretório e instale as dependências:

```bash
cd backend-api
npm install
```

## Execução

### Modo Desenvolvimento (`dev`)

O servidor será iniciado na porta `3000` (ou na porta definida pela variável de ambiente `PORT`).

```bash
npm run dev
# ou
npm start
```

## Endpoints

### 1. Configuração de Marketing (`/api/marketing-config`)

Este endpoint gerencia as configurações de integração com ferramentas de marketing (GTM e GA4), persistindo os dados no arquivo `marketing-config.json`.

#### GET /api/marketing-config

Retorna o JSON de configuração atual.

**Exemplo:**

```bash
curl http://localhost:3000/api/marketing-config
```

#### PUT /api/marketing-config

Atualiza o JSON de configuração. Requer um corpo JSON com os campos `gtm_id` e `ga4_id`.

**Exemplo:**

```bash
curl -X PUT http://localhost:3000/api/marketing-config \
  -H "Content-Type: application/json" \
  -d '{"gtm_id":"GTM-TESTE","ga4_id":"G-TESTE"}'
```

### 2. Configurações Visuais (`/api/configuracoes-visuais`)

Este endpoint retorna as configurações de layout da loja (logo, banners, etc.), lidas do arquivo `configuracoes-visuais.json`.

#### GET /api/configuracoes-visuais

Retorna o JSON de configurações visuais.

**Exemplo:**

```bash
curl http://localhost:3000/api/configuracoes-visuais
```

### 3. Feed Google Merchant (`/api/feed-google.json`)

Este endpoint gera um feed de produtos no formato JSON compatível com o Google Merchant Center, utilizando os dados de `data/produtos.json`.

#### GET /api/feed-google.json

Retorna o JSON do feed de produtos.

**Exemplo:**

```bash
curl http://localhost:3000/api/feed-google.json
```

**Observação para o Merchant Center:**
Ao configurar a fonte de dados no Google Merchant Center, utilize a URL completa deste endpoint (ex: `http://SEU_DOMINIO:3000/api/feed-google.json`).

### 4. Webhook PagSeguro (Esqueleto) (`/api/webhooks/pagseguro`)

Este endpoint recebe notificações do PagSeguro. Atualmente, ele apenas loga o payload recebido no diretório `logs/`.

#### POST /api/webhooks/pagseguro

Recebe o payload do webhook.

**Exemplo:**

```bash
curl -X POST http://localhost:3000/api/webhooks/pagseguro \
  -H "Content-Type: application/json" \
  -d '{"notificationCode":"ABC123XYZ","type":"transaction"}'
```

### 5. Arquivos Estáticos (`/uploads`)

O servidor expõe o diretório `uploads` como `/uploads`.

**Exemplo:**

Se você tiver um arquivo `backend-api/uploads/imagem.jpg`, ele estará acessível em:

```
http://localhost:3000/uploads/imagem.jpg
```

