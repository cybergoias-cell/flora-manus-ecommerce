const express = require('express');
const cors = require('cors');
const fs = require('fs/promises');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const CONFIG_FILE = path.join(__dirname, 'marketing-config.json');

// Middlewares
app.use(express.json());
app.use(cors());

// Servir arquivos estáticos (se necessário, embora não haja pasta 'uploads' no momento)
// app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Rota GET: Retorna a configuração de marketing
app.get('/api/marketing-config', async (req, res) => {
    try {
        const data = await fs.readFile(CONFIG_FILE, 'utf8');
        const config = JSON.parse(data);
        res.json(config);
    } catch (error) {
        console.error('Erro ao ler marketing-config.json:', error.message);
        // Se o arquivo não existir, retorna a estrutura padrão
        if (error.code === 'ENOENT') {
            return res.status(200).json({ gtm_id: "", ga4_id: "" });
        }
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});

// Rota PUT: Atualiza a configuração de marketing
app.put('/api/marketing-config', async (req, res) => {
    const { gtm_id, ga4_id } = req.body;

    if (typeof gtm_id === 'undefined' || typeof ga4_id === 'undefined') {
        return res.status(400).json({ error: 'Os campos gtm_id e ga4_id são obrigatórios.' });
    }

    try {
        const newConfig = { gtm_id, ga4_id };
        await fs.writeFile(CONFIG_FILE, JSON.stringify(newConfig, null, 2), 'utf8');
        console.log('marketing-config.json atualizado com sucesso.');
        res.json({ message: 'Configuração de marketing atualizada com sucesso.', config: newConfig });
    } catch (error) {
        console.error('Erro ao escrever em marketing-config.json:', error.message);
        res.status(500).json({ error: 'Erro interno do servidor ao salvar a configuração.' });
    }
});

// Inicialização do servidor
app.listen(PORT, () => {
    console.log(`✅ Backend rodando na porta ${PORT}`);
});

