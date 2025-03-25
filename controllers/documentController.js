
const Document = require('../models/documentModel');
const Bot = require('../models/botModel');
const path = require('path');

// 📥 Subir documento
const uploadBotDocument = async (req, res) => {
  try {
    const { botId } = req.body;
    const file = req.file;

    if (!file) return res.status(400).json({ message: "No se subió ningún archivo." });

    const owner = req.user._id;

    // Validar que el bot pertenece al usuario
    const bot = await Bot.findOne({ _id: botId, owner });
    if (!bot) return res.status(403).json({ message: "No autorizado para subir archivos a este bot." });

    const newDocument = new Document({
      bot: botId,
      uploadedBy: owner,
      filename: file.filename,
      fileType: path.extname(file.originalname).replace('.', ''),
      url: `${req.protocol}://${req.get('host')}/uploads/documents/${file.filename}`,
      metadata: {
        size: file.size
      }
    });

    await newDocument.save();
    res.status(201).json({ message: "Documento subido exitosamente", document: newDocument });

  } catch (error) {
    console.error("❌ Error al subir documento:", error);
    res.status(500).json({ message: "Error al subir documento", error: error.message });
  }
};

// 📄 Obtener documentos de un bot
const getBotDocuments = async (req, res) => {
  try {
    const { botId } = req.params;
    const owner = req.user._id;

    const bot = await Bot.findOne({ _id: botId, owner });
    if (!bot) return res.status(403).json({ message: "No autorizado para ver los archivos de este bot." });

    const documents = await Document.find({ bot: botId });
    res.json(documents);

  } catch (error) {
    res.status(500).json({ message: "Error al obtener documentos", error: error.message });
  }
};

// 🗑️ Eliminar documento
const deleteDocument = async (req, res) => {
  try {
    const { docId } = req.params;
    const owner = req.user._id;

    const document = await Document.findById(docId).populate('bot');
    if (!document) return res.status(404).json({ message: "Documento no encontrado" });

    if (document.bot.owner.toString() !== owner.toString()) {
      return res.status(403).json({ message: "No autorizado para eliminar este documento." });
    }

    await document.deleteOne();
    res.json({ message: "Documento eliminado correctamente" });

  } catch (error) {
    res.status(500).json({ message: "Error al eliminar documento", error: error.message });
  }
};

module.exports = {
  uploadBotDocument,
  getBotDocuments,
  deleteDocument
};
