const Chat = require('../models/chatModel');
const Bot = require('../models/botModel');

// Crear un nuevo chat
const createChat = async (req, res) => {
  try {
    const { botId, title } = req.body;
    const owner = req.user._id;

    const bot = await Bot.findOne({ _id: botId, owner });
    if (!bot) return res.status(403).json({ message: "No autorizado para crear chat con este bot." });

    const newChat = new Chat({ bot: botId, title });
    await newChat.save();

    res.status(201).json(newChat);
  } catch (error) {
    console.error("❌ Error al crear el chat:", error);
    res.status(500).json({ message: 'Error al crear el chat', error: error.message });
  }
};
  
// Guardar un mensaje en un chat existente
const addMessageToChat = async (req, res) => {
  try {
    const { chatId, sender, content } = req.body;
    const owner = req.user._id;

    const chat = await Chat.findById(chatId).populate('bot');
    if (!chat) return res.status(404).json({ message: 'Chat no encontrado' });

    if (chat.bot.owner.toString() !== owner.toString()) {
      return res.status(403).json({ message: 'No autorizado para agregar mensajes a este chat' });
    }

    chat.messages.push({ sender, content });
    chat.updatedAt = new Date();
    await chat.save();

    res.json(chat);
  } catch (error) {
    res.status(500).json({ message: 'Error al agregar mensaje', error });
  }
};
  
// Obtener los chats de un usuario
const getChatsByUser = async (req, res) => {
  try {
      const owner = req.user._id;

      // Buscar bots del usuario
      const bots = await Bot.find({ owner }).select('_id');
      const botIds = bots.map(b => b._id);

      // Buscar chats asociados a esos bots
      const chats = await Chat.find({ bot: { $in: botIds } }).sort({ updatedAt: -1 });

      res.json(chats);
  } catch (error) {
      res.status(500).json({ message: 'Error al obtener los chats', error });
  }
};

// Renombrar un chat
const renameChat = async (req, res) => {
  try {
    const { chatId, title } = req.body;
    const owner = req.user._id;

    const chat = await Chat.findById(chatId).populate('bot');
    if (!chat) return res.status(404).json({ message: 'Chat no encontrado' });

    if (chat.bot.owner.toString() !== owner.toString()) {
      return res.status(403).json({ message: 'No autorizado para renombrar este chat' });
    }

    chat.title = title;
    await chat.save();

    res.json(chat);
  } catch (error) {
    res.status(500).json({ message: 'Error al renombrar el chat', error });
  }
};

// Eliminar un chat
const deleteChat = async (req, res) => {
  try {
    const { chatId } = req.params;
    const owner = req.user._id;

    const chat = await Chat.findById(chatId).populate('bot');
    if (!chat) return res.status(404).json({ message: 'Chat no encontrado' });

    if (chat.bot.owner.toString() !== owner.toString()) {
      return res.status(403).json({ message: 'No autorizado para eliminar este chat' });
    }

    await chat.deleteOne();

    res.json({ message: '🗑️ Chat eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar el chat', error });
  }
};

module.exports = {
    createChat,
    addMessageToChat,
    getChatsByUser,
    renameChat,
    deleteChat
};
