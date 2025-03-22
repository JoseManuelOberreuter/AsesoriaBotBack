const Bot = require('../models/botModel');

const createBot = async (req, res) => {
  const { name, description, avatar, type, settings } = req.body;

  try {
    const owner = req.user._id;

    console.log("📥 req.user recibido en createBot:", req.user);
    console.log("📦 owner extraído:", owner);

    if (!owner) {
      return res.status(401).json({ message: "ID de usuario no encontrado en la request." });
    }

    const newBot = await Bot.create({
      owner,
      name,
      description,
      avatar,
      type,
      settings
    });

    res.status(201).json(newBot);
  } catch (err) {
    console.error("❌ Error al crear bot:", err);
    res.status(500).json({ message: 'Error al crear bot', error: err.message });
  }
};

module.exports = { createBot };
