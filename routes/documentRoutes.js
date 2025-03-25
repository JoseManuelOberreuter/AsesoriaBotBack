const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const uploadDocument = require('../middlewares/documentMiddleware');
const {
  uploadBotDocument,
  getBotDocuments,
  deleteDocument
} = require('../controllers/documentController');

// Subir documento al bot
router.post('/upload', authMiddleware, uploadDocument.single('file'), uploadBotDocument);

// Obtener documentos del bot
router.get('/:botId', authMiddleware, getBotDocuments);

// Eliminar documento
router.delete('/:docId', authMiddleware, deleteDocument);

module.exports = router;
