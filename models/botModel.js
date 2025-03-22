const mongoose = require('mongoose');

const botSchema = new mongoose.Schema({
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  description: { type: String, default: '' },
  avatar: { type: String, default: '' },
  type: { type: String, enum: ['support', 'internal', 'general'], default: 'general' },
  settings: {
    temperature: { type: Number, default: 0.7 },
    model: { type: String, default: 'deepseek-chat' },
    useExternalDB: { type: Boolean, default: false },
    externalDBConfig: {
      type: { type: String },
      url: { type: String },
      apiKey: { type: String }
    }
  },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Bot', botSchema);
