const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController'); 

// Ruta para crear un chat
router.post('/create', chatController.createChat);  

// Ruta para crenombrar un chat
router.put('/rename', chatController.renameChat);

// Ruta para guardar los mensajes del chat
router.post('/add-message', chatController.addMessageToChat);

// Ruta para traer todos los chats del usuario
router.get('/user-chats/:userId', chatController.getUserChats);

// Ruta para eliminar un chat
router.delete('/delete/:chatId', chatController.deleteChat);

module.exports = router;
