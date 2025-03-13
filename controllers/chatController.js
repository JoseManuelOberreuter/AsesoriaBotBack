const Chat = require('../models/chatModel');

// Crear un nuevo chat
const createChat = async (req, res) => {
    try {
        const { userId } = req.body;
        const newChat = new Chat({ userId });
        await newChat.save();
        res.status(201).json(newChat);
    } catch (error) {
        res.status(500).json({ message: 'Error al crear el chat', error });
    }
};

// Guardar un mensaje en un chat existente
const addMessageToChat = async (req, res) => {
    try {
        const { chatId, role, text } = req.body;

        const chat = await Chat.findById(chatId);
        if (!chat) return res.status(404).json({ message: 'Chat no encontrado' });

        chat.messages.push({ role, text });
        chat.updatedAt = new Date();
        await chat.save();

        res.json(chat);
    } catch (error) {
        res.status(500).json({ message: 'Error al agregar mensaje', error });
    }
};

// Obtener todos los chats de un usuario
const getUserChats = async (req, res) => {
    try {
        const { userId } = req.params;
        const chats = await Chat.find({ userId }).sort({ updatedAt: -1 });
        res.json(chats);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener los chats', error });
    }
};

// Renombrar un chat
const renameChat = async (req, res) => {
    try {
        const { chatId, title } = req.body;
        const chat = await Chat.findByIdAndUpdate(chatId, { title }, { new: true });
        res.json(chat);
    } catch (error) {
        res.status(500).json({ message: 'Error al renombrar el chat', error });
    }
};

// Eliminar un chat
const deleteChat = async (req, res) => {
    try {
        const { chatId } = req.params;
        await Chat.findByIdAndDelete(chatId);
        res.json({ message: 'Chat eliminado' });
    } catch (error) {
        res.status(500).json({ message: 'Error al eliminar el chat', error });
    }
};

module.exports = {
    createChat,
    addMessageToChat,
    getUserChats,
    renameChat,
    deleteChat
};
