# Admin Frontend - Configurações Visuais

Este projeto implementa o frontend administrativo para a gestão das configurações visuais da loja, como logo e banners.

## Requisitos

- Node.js (versão 18+)
- Backend da loja rodando (para as chamadas de API)

## Configuração

Crie um arquivo `.env` na raiz do projeto (`admin-frontend/`) baseado no `.env.example` e configure a URL base da API:

```bash
cp .env.example .env
# Edite o .env
VITE_API_BASE=http://localhost:3000
```

## Como Rodar

1.  **Instalar dependências:**
    ```bash
    npm install
    ```

2.  **Iniciar o servidor de desenvolvimento:**
    ```bash
    npm run dev
    ```
    O aplicativo estará acessível em `http://localhost:5173/`.

## Passos de Teste (Configurações Visuais)

Para testar a funcionalidade da tela "Configurações → Visual", siga os passos abaixo:

1.  **Garantir o Backend Rodando:**
    Certifique-se de que o backend da aplicação esteja rodando e acessível no endereço configurado em `VITE_API_BASE`.

2.  **Acessar a Tela:**
    Navegue para a rota `/settings/visual` ou clique em "Configurações → Visual" na barra lateral.

3.  **Teste de GET (Carregamento de Dados):**
    -   Ao carregar a página, os campos do formulário (Logo e Banners) devem ser preenchidos com os dados retornados pelo endpoint `GET /api/configuracoes-visuais`.
    -   *Se o backend não estiver rodando, dados mockados serão exibidos para fins de desenvolvimento.*

4.  **Teste de PUT (Salvar Dados):**
    -   Modifique alguns campos, como a URL da logo ou o intervalo do banner.
    -   Clique no botão **"Salvar Configurações"**.
    -   Um toast de **"Salvo com sucesso!"** deve aparecer.
    -   O console do navegador deve mostrar a requisição `PUT /api/configuracoes-visuais` sendo enviada com o objeto completo.

5.  **Verificação de Persistência:**
    -   Após o salvamento, recarregue a página (`/settings/visual`).
    -   Os dados carregados no passo 3 (Teste de GET) devem refletir as modificações feitas no passo 4 (Teste de PUT).

## Screenshots

*Screenshots da tela serão adicionados ao Pull Request.*

