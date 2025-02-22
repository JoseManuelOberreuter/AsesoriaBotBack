require('dotenv').config();
const mongoose = require('mongoose');
const Chat = require('./models/chatModel');

// Conectar a MongoDB Atlas
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ Conectado a MongoDB Atlas');

    // Insertar un chat de prueba
    const chatPrueba = new Chat({
      prompt: "Hola, ¿cómo estás?",
      response: "¡Hola! Estoy bien, gracias por preguntar. 😊",
    });

    await chatPrueba.save();
    console.log('✅ Chat de prueba insertado correctamente');

    mongoose.connection.close(); // Cierra la conexión después de insertar
  } catch (error) {
    console.error('❌ Error al insertar chat de prueba:', error);
  }
};

// Ejecutar el script
connectDB();
