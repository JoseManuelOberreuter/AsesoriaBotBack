const Bot = require('../models/botModel');

// 📌 Crea un bot
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

// 📌 Obtiene todos los bots
const getMyBots = async (req, res) => {
  try {
    const bots = await Bot.find({ owner: req.user._id });
    res.json(bots);
  } catch (err) {
    res.status(500).json({ message: "Error al obtener bots", error: err.message });
  }
};

// 📌 Obtiene un bot por ID
const getBotById = async (req, res) => {
  const { id } = req.params;

  try {
    const bot = await Bot.findOne({ _id: id, owner: req.user._id });
    if (!bot) {
      return res.status(404).json({ message: "Bot no encontrado" });
    }

    res.json(bot);
  } catch (err) {
    res.status(500).json({ message: "Error al obtener bot", error: err.message });
  }
};

// 📌 Actualiza un bot
const updateBot = async (req, res) => {
  const { id } = req.params;
  const { name, description, avatar, type, settings } = req.body;

  try {
    const owner = req.user._id;

    const bot = await Bot.findOne({ _id: id, owner });
    if (!bot) {
      return res.status(404).json({ message: "Bot no encontrado o no autorizado." });
    }

    bot.name = name || bot.name;
    bot.description = description || bot.description;
    bot.avatar = avatar || bot.avatar;
    bot.type = type || bot.type;
    bot.settings = settings || bot.settings;

    await bot.save();
    res.json({ message: "Bot actualizado exitosamente", bot });
  } catch (err) {
    console.error("❌ Error al actualizar bot:", err);
    res.status(500).json({ message: "Error al actualizar bot", error: err.message });
  }
};

// 📌 Elimina un bot
//? Agregar validación? 
const deleteBot = async (req, res) => {
  const { id } = req.params;

  try {
    const owner = req.user._id;

    const bot = await Bot.findOneAndDelete({ _id: id, owner });
    if (!bot) {
      return res.status(404).json({ message: "Bot no encontrado" });
    }

    res.json({ message: "Bot eliminado exitosamente" });
  } catch (err) {
    console.error("❌ Error al eliminar bot:", err);
    res.status(500).json({ message: "Error al eliminar bot", error: err.message });
  }
};

module.exports = { createBot, getMyBots, getBotById, updateBot, deleteBot };