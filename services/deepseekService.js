const OpenAI = require('openai');

if (!process.env.API_DEEPSEEK) {
  console.error('Error: La variable API_DEEPSEEK no está configurada.');
  process.exit(1);
}

const openai = new OpenAI({
  baseURL: 'https://api.deepseek.com',
  apiKey: process.env.API_DEEPSEEK,
});

// Función para obtener respuesta de DeepSeek
const getDeepSeekResponse = async (prompt) => {
  try {
    const completion = await openai.chat.completions.create({
      model: 'deepseek-chat',
      messages: [
        { role: 'system', content: 'Eres un asistente útil y amable.' },
        { role: 'user', content: prompt },
      ],
    });

    return completion.choices[0]?.message?.content || 'No se obtuvo respuesta';
  } catch (error) {
    console.error('❌ Error al interactuar con DeepSeek:', error);
    throw new Error('Error al obtener respuesta de DeepSeek');
  }
};

module.exports = { getDeepSeekResponse };
