const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  sender: { type: String, enum: ['user', 'bot'], required: true }, // Quién envió el mensaje
  message: { type: String, required: true },
  timestamp: { type: Date, default: Date.now }
});

const chatSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Vincular chat con usuario
  title: { type: String, default: "Nuevo Chat" }, // Nombre del chat (editable)
  messages: [messageSchema], // Array de mensajes
  createdAt: { type: Date, default: Date.now, expires: '30d' } // Se borra en 30 días automáticamente
});

const Chat = mongoose.model('Chat', chatSchema);
module.exports = Chat;
