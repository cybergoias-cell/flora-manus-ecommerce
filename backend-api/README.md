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

**Resposta de Exemplo:**

```json
{
  "gtm_id": "GTM-XXXXXX",
  "ga4_id": "G-YYYYYY"
}
```

#### PUT /api/marketing-config

Atualiza o JSON de configuração. Requer um corpo JSON com os campos `gtm_id` e `ga4_id`.

**Exemplo:**

```bash
curl -X PUT http://localhost:3000/api/marketing-config \
  -H "Content-Type: application/json" \
  -d '{"gtm_id":"GTM-TESTE","ga4_id":"G-TESTE"}'
```

**Resposta de Exemplo:**

```json
{
  "message": "Configurações de marketing atualizadas com sucesso.",
  "config": {
    "gtm_id": "GTM-TESTE",
    "ga4_id": "G-TESTE"
  }
}
```

### 2. Arquivos Estáticos (`/uploads`)

O servidor expõe o diretório `uploads` como `/uploads`.

**Exemplo:**

Se você tiver um arquivo `backend-api/uploads/imagem.jpg`, ele estará acessível em:

```
http://localhost:3000/uploads/imagem.jpg
```

