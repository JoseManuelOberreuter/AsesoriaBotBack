const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  sender: { type: String, enum: ['user', 'bot'], required: true }, // Quién envió el mensaje
  message: { type: String, required: true },
  timestamp: { type: Date, default: Date.now }
});

const ChatSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },  // Usuario dueño del chat
  title: { type: String, default: 'Nuevo Chat' },  // Nombre del chat (editable)
  messages: [
      {
          role: { type: String, enum: ['user', 'bot'], required: true }, 
          text: { type: String, required: true },
          timestamp: { type: Date, default: Date.now }
      }
  ],
  createdAt: { type: Date, default: Date.now },  // Fecha de creación
  updatedAt: { type: Date, default: Date.now }   // Última actualización
}, { timestamps: true });

const Chat = mongoose.model('Chat', ChatSchema);
module.exports = Chat;
