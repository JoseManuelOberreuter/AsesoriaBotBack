require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Importar rutas
const chatRoutes = require('./routes/chatRoutes');

// Usar rutas
app.use('/chat', chatRoutes);

// Ruta raíz
app.get('/', (req, res) => {
  res.send('¡Bienvenido al backend con MongoDB y DeepSeek!');
});

// Exportar `app` para que `index.js` lo use
module.exports = app;
