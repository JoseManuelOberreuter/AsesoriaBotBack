require('dotenv').config();
const express = require('express');
const cors = require('cors');
const OpenAI = require('openai');

const app = express();
const PORT = process.env.PORT || 4005;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('¡Bienvenido al backend básico de DeepSeek con OpenAI SDK!');
});

app.post('/chat', async (req, res) => {
  const { prompt } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: 'Se requiere un prompt válido' });
  }

  try {
    // Aquí deberías hacer la llamada real a DeepSeek o usar respuestas simuladas
    res.status(200).json({ respuesta: `Respuesta a: "${prompt}"` });
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener respuesta' });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
