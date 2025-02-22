const Chat = require('../models/chatModel');  

// Obtener todos los chats
const getChats = async (req, res) => {
  try {
    const chats = await Chat.find().sort({ createdAt: -1 });
    res.status(200).json(chats);
  } catch (error) {
    console.error('❌ Error al obtener chats:', error);
    res.status(500).json({ error: 'Error al obtener los chats' });
  }
};

// Guardar un chat en la base de datos
const saveChat = async (prompt, response) => {
  try {
    const newChat = new Chat({ prompt, response });
    await newChat.save();
    console.log('✅ Chat guardado en la base de datos');
  } catch (error) {
    console.error('❌ Error al guardar el chat:', error);
  }
};

module.exports = { getChats, saveChat };
