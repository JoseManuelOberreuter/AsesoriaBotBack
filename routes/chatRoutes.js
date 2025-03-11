const express = require('express');
const router = express.Router();
const { getUserChats } = require('../controllers/chatController'); 

// 📌 Ruta GET para obtener chats
router.get('/chats', getUserChats);  

router.post('/message', saveMessage);

router.put('/rename', renameChat);

router.delete('/delete/:chatId', deleteChat);

module.exports = router;
