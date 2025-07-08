const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3001; // Porta do seu backend

// Configura o CORS
app.use(cors({
    origin: 'http://localhost:3000' // Substitua pela URL do seu frontend React
}));

app.use(express.json()); // Para parsing de JSON no corpo das requisições

// Estado inicial do placar
let hitsRobotA = 0;
let hitsRobotB = 0;

// --- Rota GET para obter o placar atual ---
// O frontend faria GETs periódicos para esta rota
app.get('/api/score', (req, res) => {
    res.json({ hitsRobotA, hitsRobotB });
});

// --- Rota POST para registrar um impacto ---
// O modelo de visão computacional chamaria esta rota
app.post('/api/impact', (req, res) => {
    const { robot } = req.body; // Espera { "robot": "A" } ou { "robot": "B" }

    if (robot === 'A') {
        hitsRobotA++;
        console.log(`Impacto no Robô A! Placar: A=${hitsRobotA}, B=${hitsRobotB}`);
    } else if (robot === 'B') {
        hitsRobotB++;
        console.log(`Impacto no Robô B! Placar: A=${hitsRobotA}, B=${hitsRobotB}`);
    } else {
        return res.status(400).json({ error: 'Robô inválido. Use "A" ou "B".' });
    }

    res.json({ message: 'Impacto registrado com sucesso!', hitsRobotA, hitsRobotB });
});

// --- Rota POST para resetar o placar ---
// O frontend chamaria esta rota quando o botão "Reiniciar Jogo" for clicado
app.post('/api/reset-score', (req, res) => {
    hitsRobotA = 0;
    hitsRobotB = 0;
    res.json({ message: 'Placar resetado com sucesso!', hitsRobotA, hitsRobotB });
});

app.listen(PORT, () => {
    console.log(`Backend HTTP rodando na porta ${PORT}`);
});