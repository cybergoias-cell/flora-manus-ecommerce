const express = require('express');
const fetch = require('node-fetch');
const { v4: uuidv4 } = require('uuid');
const cors = require('cors');
const path = require('path');
const fs = require('fs/promises');

const app = express();
const PORT = process.env.PORT || 3000;
const MARKETING_CONFIG_PATH = path.join(__dirname, 'marketing-config.json');
const VISUAL_CONFIG_PATH = path.join(__dirname, 'configuracoes-visuais.json');
const PRODUCTS_PATH = path.join(__dirname, 'data/produtos.json');
const LOGS_DIR = path.join(__dirname, 'logs');

const BASE_URL = process.env.BASE_URL || `http://localhost:${PORT}`;
const GA4_MEASUREMENT_ID = process.env.GA4_MEASUREMENT_ID;
const GA4_API_SECRET = process.env.GA4_API_SECRET;

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// --- Funções de Utilidade ---

async function ensureFileExists(filePath, defaultContent) {
  try {
    await fs.access(filePath);
  } catch (error) {
    if (error.code === 'ENOENT') {
      await fs.writeFile(filePath, JSON.stringify(defaultContent, null, 2), 'utf-8');
      console.log(`[INIT] Arquivo ${path.basename(filePath)} criado com sucesso.`);
    } else {
      throw error;
    }
  }
}

// --- Endpoints ---

// GET /api/marketing-config
app.get('/api/marketing-config', async (req, res) => {
  try {
    const data = await fs.readFile(MARKETING_CONFIG_PATH, 'utf-8');
    res.json(JSON.parse(data));
  } catch (error) {
    res.status(500).json({ error: 'Erro interno do servidor.' });
  }
});

// PUT /api/marketing-config
app.put('/api/marketing-config', async (req, res) => {
  const { gtm_id, ga4_id } = req.body;
  if (typeof gtm_id !== 'string' || typeof ga4_id !== 'string') {
    return res.status(400).json({ error: 'gtm_id e ga4_id devem ser strings.' });
  }
  try {
    await fs.writeFile(MARKETING_CONFIG_PATH, JSON.stringify({ gtm_id, ga4_id }, null, 2), 'utf-8');
    res.status(200).json({ message: 'Configurações de marketing atualizadas.' });
  } catch (error) {
    res.status(500).json({ error: 'Erro interno do servidor.' });
  }
});

// GET /api/configuracoes-visuais
app.get('/api/configuracoes-visuais', async (req, res) => {
    try {
        const data = await fs.readFile(VISUAL_CONFIG_PATH, 'utf-8');
        res.json(JSON.parse(data));
    } catch (error) {
        res.status(500).json({ error: 'Erro ao ler configurações visuais.' });
    }
});

// PUT /api/configuracoes-visuais
app.put('/api/configuracoes-visuais', async (req, res) => {
    const newConfig = req.body;

    // Validação mínima de tipo
    if (typeof newConfig !== 'object' || newConfig === null) {
        return res.status(400).json({ error: 'O corpo da requisição deve ser um objeto JSON.' });
    }

    try {
        const currentData = await fs.readFile(VISUAL_CONFIG_PATH, 'utf-8');
        const currentConfig = JSON.parse(currentData);

        // Mesclar a nova configuração com a existente (deep merge simples)
        const updatedConfig = { ...currentConfig, ...newConfig };

        await fs.writeFile(VISUAL_CONFIG_PATH, JSON.stringify(updatedConfig, null, 2), 'utf-8');
        res.status(200).json({ message: 'Configurações visuais atualizadas com sucesso.', config: updatedConfig });
    } catch (error) {
        console.error('Erro ao atualizar configuracoes-visuais.json:', error);
        res.status(500).json({ error: 'Erro interno do servidor.' });
    }
});

// GET /api/feed-google.json
app.get('/api/feed-google.json', async (req, res) => {
    try {
        const produtosData = await fs.readFile(PRODUCTS_PATH, 'utf-8');
        const produtos = JSON.parse(produtosData);

        const feedItems = produtos.map(p => {
            const principalImage = p.imagens.find(img => img.principal);
            const image_link = principalImage ? `${BASE_URL}${principalImage.url}` : '';

            return {
                id: p.id,
                title: p.name,
                description: p.description,
                link: `http://localhost:5174/produto/${p.slug || p.id}`,
                image_link: image_link,
                brand: p.brand,
                price: `${p.price.toFixed(2)} BRL`,
                availability: p.estoque_atual > 0 ? 'in stock' : 'out of stock',
                condition: 'new',
                google_product_category: 'Health & Beauty > Health Care > Vitamins & Supplements'
            };
        });

        res.json({ items: feedItems });
    } catch (error) {
        console.error('Erro ao gerar feed do Google:', error);
        res.status(500).json({ error: 'Erro interno do servidor.' });
    }
});

// POST /api/webhooks/pagseguro
app.post('/api/webhooks/pagseguro', async (req, res) => {
    const payload = req.body;

    if (!payload || Object.keys(payload).length === 0) {
        return res.status(400).json({ error: 'Payload ausente.' });
    }

    const date = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const logFile = path.join(LOGS_DIR, `pagseguro-${date}.log`);
    let logEntry = `${new Date().toISOString()} | [WEBHOOK] | ${JSON.stringify(payload)}\n`;

    try {
        // --- Integração GA4 Measurement Protocol ---
        if (GA4_MEASUREMENT_ID && GA4_API_SECRET) {
            // Mock de dados do pedido, pois o PagSeguro envia dados de transação,
            // não o payload de compra completo com itens.
            // Aqui, assumimos que o payload contém o suficiente ou que o backend
            // faria uma consulta para obter os detalhes do pedido.
            // Para o escopo, vamos usar dados mockados para o GA4.
            const mockOrder = {
                transaction_id: payload.transaction_id || `PS-${Date.now()}`,
                value: payload.value || 120.50, // Exemplo de valor total
                currency: 'BRL',
                items: [
                    { item_id: '1', item_name: 'Whey Protein', price: 89.90, quantity: 1 },
                    { item_id: '3', item_name: 'Coqueteleira', price: 30.60, quantity: 1 }
                ]
            };

            const ga4Payload = {
                client_id: uuidv4(),
                events: [
                    {
                        name: 'purchase',
                        params: {
                            transaction_id: mockOrder.transaction_id,
                            value: mockOrder.value,
                            currency: mockOrder.currency,
                            items: mockOrder.items
                        }
                    }
                ]
            };

            const ga4Url = `https://www.google-analytics.com/mp/collect?measurement_id=${GA4_MEASUREMENT_ID}&api_secret=${GA4_API_SECRET}`;

            const ga4Response = await fetch(ga4Url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(ga4Payload)
            });

            if (ga4Response.status === 204) {
                logEntry += `${new Date().toISOString()} | [GA4] | Sucesso (204 No Content).\n`;
            } else {
                const ga4ErrorText = await ga4Response.text();
                logEntry += `${new Date().toISOString()} | [GA4] | Erro (${ga4Response.status}): ${ga4ErrorText}\n`;
            }
        } else {
            logEntry += `${new Date().toISOString()} | [GA4] | Ignorado. Variáveis GA4 não definidas.\n`;
        }

        // --- Fim Integração GA4 ---

        await fs.appendFile(logFile, logEntry);

        res.status(200).json({ ok: true });
    } catch (error) {
        logEntry += `${new Date().toISOString()} | [ERRO] | ${error.message}\n`;
        await fs.appendFile(logFile, logEntry);
        console.error('Erro no webhook do PagSeguro:', error);
        res.status(200).json({ ok: true }); // Não bloquear o fluxo do PagSeguro
    }
});


// --- Inicialização ---

async function startServer() {
    await ensureFileExists(MARKETING_CONFIG_PATH, { gtm_id: '', ga4_id: '' });
    await ensureFileExists(VISUAL_CONFIG_PATH, { logo: {}, banners: { items: [] } });
    await fs.mkdir(LOGS_DIR, { recursive: true });

    app.listen(PORT, () => {
        console.log(`✅ Backend rodando na porta ${PORT}`);
    });
}

startServer();

