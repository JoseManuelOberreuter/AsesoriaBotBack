// Carga variables de entorno
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const fs = require('fs');
const app = express();

// Rutas
const chatRoutes = require('./routes/chatRoutes');
const userRoutes = require('./routes/userRouter');
const botRoutes = require('./routes/botRoutes');
const documentRoutes = require('./routes/documentRoutes');

// 📁 Crear carpetas necesarias si no existen
const ensureDirectories = () => {
  const directories = ['uploads', 'uploads/documents'];
  directories.forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
      console.log(`✅ Carpeta creada automáticamente: ${dir}`);
    }
  });
};
ensureDirectories();

// Middlewares globales
app.use(cors());
app.use(express.json());

// Usar rutas
app.use('/chat', chatRoutes);
app.use('/users', userRoutes);
app.use('/bots', botRoutes);
app.use('/documents', documentRoutes);

// Servir archivos estáticos
app.use('/uploads', express.static('uploads'));

// Ruta principal
app.get('/', (req, res) => {
  res.send('¡Bienvenido al backend de AsessorIA con MongoDB y DeepSeek!');
});

module.exports = app;
