const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  isVerified: { type: Boolean, default: false }, // 📌 Usuario NO verificado por defecto
  verificationToken: { type: String }, // 📌 Token de verificación único
  avatar: { type: String, default: "" }
});

module.exports = mongoose.model('User', userSchema);
