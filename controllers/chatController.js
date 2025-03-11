const Chat = require('../models/chatModel');

// Obtener todos los chats de un usuario
const getUserChats = async (req, res) => {
  try {
    const userId = req.user.id; // ID del usuario autenticado
    const chats = await Chat.find({ userId }).sort({ createdAt: -1 });
    res.status(200).json(chats);
  } catch (error) {
    console.error('❌ Error al obtener chats:', error);
    res.status(500).json({ error: 'Error al obtener los chats' });
  }
};

// Guardar un mensaje en un chat (o crear uno nuevo si no existe)
const saveMessage = async (req, res) => {
  try {
    const { chatId, message, sender } = req.body;
    let chat;

    if (chatId) {
      // Si el chat existe, agrega el mensaje
      chat = await Chat.findById(chatId);
      if (!chat) return res.status(404).json({ error: "Chat no encontrado" });
    } else {a
      // Si no hay chatId, crea un nuevo chat
      chat = new Chat({ userId: req.user.id, messages: [] });
    }

    chat.messages.push({ sender, message });
    await chat.save();
    res.status(200).json(chat);
  } catch (error) {
    console.error('❌ Error al guardar mensaje:', error);
    res.status(500).json({ error: 'Error al guardar mensaje' });
  }
};

// Cambiar el nombre de un chat
const renameChat = async (req, res) => {
  try {
    const { chatId, newTitle } = req.body;
    const chat = await Chat.findByIdAndUpdate(chatId, { title: newTitle }, { new: true });
    if (!chat) return res.status(404).json({ error: "Chat no encontrado" });
    res.status(200).json(chat);
  } catch (error) {
    console.error('❌ Error al renombrar chat:', error);
    res.status(500).json({ error: 'Error al renombrar chat' });
  }
};

// Eliminar un chat
const deleteChat = async (req, res) => {
  try {
    const { chatId } = req.params;
    await Chat.findByIdAndDelete(chatId);
    res.status(200).json({ message: 'Chat eliminado' });
  } catch (error) {
    console.error('❌ Error al eliminar chat:', error);
    res.status(500).json({ error: 'Error al eliminar chat' });
  }
};

module.exports = { getUserChats, saveMessage, renameChat, deleteChat };
