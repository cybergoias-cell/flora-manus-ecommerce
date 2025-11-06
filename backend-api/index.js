const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs/promises');

const app = express();
const PORT = process.env.PORT || 3000;
const MARKETING_CONFIG_PATH = path.join(__dirname, 'marketing-config.json');

// Middleware
app.use(cors());
app.use(express.json());

// Servir arquivos estáticos da pasta 'uploads'
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Função para garantir que o arquivo de configuração exista
async function ensureMarketingConfigExists() {
  try {
    await fs.access(MARKETING_CONFIG_PATH);
  } catch (error) {
    if (error.code === 'ENOENT') {
      const defaultConfig = { "gtm_id": "", "ga4_id": "" };
      await fs.writeFile(MARKETING_CONFIG_PATH, JSON.stringify(defaultConfig, null, 2), 'utf-8');
      console.log(`[INIT] Arquivo ${path.basename(MARKETING_CONFIG_PATH)} criado com sucesso.`);
    } else {
      throw error;
    }
  }
}

// Rota GET /api/marketing-config
app.get('/api/marketing-config', async (req, res) => {
  try {
    // Não precisa de ensureMarketingConfigExists aqui, pois é chamado na inicialização
    const data = await fs.readFile(MARKETING_CONFIG_PATH, 'utf-8');
    res.json(JSON.parse(data));
  } catch (error) {
    console.error('Erro ao ler marketing-config.json:', error);
    res.status(500).json({ error: 'Erro interno do servidor.' });
  }
});

// Rota PUT /api/marketing-config
app.put('/api/marketing-config', async (req, res) => {
  const { gtm_id, ga4_id } = req.body;

  // Validação mínima
  if (typeof gtm_id !== 'string' || typeof ga4_id !== 'string') {
    return res.status(400).json({ error: 'Os campos gtm_id e ga4_id devem ser strings.' });
  }

  try {
    const newConfig = { gtm_id, ga4_id };
    await fs.writeFile(MARKETING_CONFIG_PATH, JSON.stringify(newConfig, null, 2), 'utf-8');
    res.status(200).json({ message: 'Configurações de marketing atualizadas com sucesso.', config: newConfig });
  } catch (error) {
    console.error('Erro ao escrever em marketing-config.json:', error);
    res.status(500).json({ error: 'Erro interno do servidor.' });
  }
});

// Inicialização do servidor
async function startServer() {
  await ensureMarketingConfigExists();
  app.listen(PORT, () => {
    console.log(`✅ Backend rodando na porta ${PORT}`);
  });
}

startServer();

