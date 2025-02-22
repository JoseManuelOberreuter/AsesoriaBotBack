require('dotenv').config();  // Cargar variables de entorno desde .env
const express = require('express');
const cors = require('cors');  // Importar CORS
const OpenAI = require('openai');

if (!process.env.API_DEEPSEEK) {
  console.error('Error: La variable API_DEEPSEEK no está configurada.');
  process.exit(1);  // Detiene la ejecución si falta la API Key
}

// Configuración del cliente OpenAI con la API de DeepSeek
const openai = new OpenAI({
  baseURL: 'https://api.deepseek.com',  // Base URL personalizada
  apiKey: process.env.API_DEEPSEEK,     // API Key cargada desde .env
});

const app = express();
const PORT = process.env.PORT || 4005;

// Middleware
app.use(cors());  // Habilitar CORS para todas las rutas
app.use(express.json());  // Middleware nativo de Express para JSON

// Ruta básica de prueba
app.get('/', (req, res) => {
  console.log(`[GET] Llamada a la raíz desde la IP: ${req.ip} a las ${new Date().toLocaleString()}`);
  res.send('¡Bienvenido al backend básico de DeepSeek con OpenAI SDK!');
});

// Ruta POST para interactuar con DeepSeek
app.post('/chat', async (req, res) => {
  const { prompt } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: 'Se requiere un prompt válido' });
  }

  try {
    // Realiza la llamada a la API de DeepSeek
    const completion = await openai.chat.completions.create({
      model: 'deepseek-chat',  // Modelo actualizado
      messages: [
        { role: 'system', content: 'Eres un asistente útil y amable.' },
        { role: 'user', content: prompt },
      ],
    });

    const responseMessage = completion.choices[0]?.message?.content || 'No se obtuvo respuesta';

    res.status(200).json({ respuesta: responseMessage });
  } catch (error) {
    console.error('Error al interactuar con DeepSeek:', error);
    res.status(500).json({ error: 'Error al obtener respuesta de DeepSeek' });
  }
});

// Inicia el servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
