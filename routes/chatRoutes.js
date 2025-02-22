const express = require('express');
const { getChats, saveChat } = require('../controllers/chatController');  // 📌 Asegurar importación correcta
const OpenAI = require('openai');

const router = express.Router();

// Verificar API Key
if (!process.env.API_DEEPSEEK) {
  console.error('Error: La variable API_DEEPSEEK no está configurada.');
  process.exit(1);
}

// Configuración del cliente OpenAI con la API de DeepSeek
const openai = new OpenAI({
  baseURL: 'https://api.deepseek.com',
  apiKey: process.env.API_DEEPSEEK,
});

// 📌 Ruta GET para obtener chats
router.get('/', getChats);  // 📌 Asegurar que `getChats` está bien definido

// 📌 Ruta POST para enviar mensaje a DeepSeek y guardar en la base de datos
router.post('/', async (req, res) => {
  const { prompt } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: 'Se requiere un prompt válido' });
  }

  try {
    const completion = await openai.chat.completions.create({
      model: 'deepseek-chat',
      messages: [
        { role: 'system', content: 'Eres un asistente útil y amable.' },
        { role: 'user', content: prompt },
      ],
    });

    const responseMessage = completion.choices[0]?.message?.content || 'No se obtuvo respuesta';

    // Guardar en la base de datos
    await saveChat(prompt, responseMessage);

    res.status(200).json({ respuesta: responseMessage });
  } catch (error) {
    console.error('❌ Error al interactuar con DeepSeek:', error);
    res.status(500).json({ error: 'Error al obtener respuesta de DeepSeek' });
  }
});

module.exports = router;
