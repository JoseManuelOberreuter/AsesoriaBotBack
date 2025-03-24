const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  sender: { type: String, enum: ['user', 'bot'], required: true },
  content: { type: String, required: true },
  timestamp: { type: Date, default: Date.now }
});

const chatSchema = new mongoose.Schema({
  bot: { type: mongoose.Schema.Types.ObjectId, ref: 'Bot', required: true },
  title: { type: String, default: 'Nuevo chat' },
  messages: [messageSchema],
  createdAt: { type: Date, default: Date.now, expires: 60 * 60 * 24 * 30 } // ⏳ TTL de 30 días
});

module.exports = mongoose.model('Chat', chatSchema);
