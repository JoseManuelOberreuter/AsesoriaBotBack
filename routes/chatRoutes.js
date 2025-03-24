const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const {
    createChat,
    addMessageToChat,
    getChatsByUser,
    renameChat,
    deleteChat
} = require('../controllers/chatController'); 

// Ruta para crear un chat
router.post('/create', authMiddleware, createChat);  

// Ruta para guardar los mensajes del chat
router.post('/add-message', authMiddleware, addMessageToChat);

// Ruta para traer todos los chats del usuario
router.get('/user-chats/:userId', authMiddleware, getChatsByUser);

// Ruta para crenombrar un chat
router.put('/rename',authMiddleware, renameChat);

// Ruta para eliminar un chat
router.delete('/delete/:chatId', authMiddleware, deleteChat);

module.exports = router;
