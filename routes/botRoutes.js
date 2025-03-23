const express = require('express');
const authMiddleware = require('../middlewares/authMiddleware');
const router = express.Router();
const { createBot, getMyBots, getBotById, updateBot, deleteBot } = require('../controllers/botController');

// Ruta para crear un bot
router.post('/create', authMiddleware, createBot);

// Ruta para obtener todos los bots de un usuario
router.get('/mine', authMiddleware, getMyBots);

// Ruta para obtener un bot especifico por ID
router.get('/:id', authMiddleware, getBotById);

// Ruta para actualizar un bot
router.put('/update/:id', authMiddleware, updateBot);

// Ruta para eliminar un bot
router.delete('/delete/:id', authMiddleware, deleteBot);

module.exports = router;