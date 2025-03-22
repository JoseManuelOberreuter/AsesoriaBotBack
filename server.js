require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();

// Importar rutas
const chatRoutes = require('./routes/chatRoutes');
const userRoutes = require('./routes/userRouter');
const botRoutes = require('./routes/botRoutes');

// Middleware
app.use(cors());
app.use(express.json());

// Rutas
app.use('/chat', chatRoutes);
app.use('/users', userRoutes);
app.use('/bots', botRoutes);
app.use('/uploads', express.static('uploads'));


// Ruta raíz
app.get('/', (req, res) => {
  res.send('¡Bienvenido al backend de AsessorIA con MongoDB y DeepSeek!');
});

// Exportar `app` para que `index.js` lo use
module.exports = app;
