require('dotenv').config(); // Cargar variables de entorno
const connectDB = require('./database'); // Importar conexión a MongoDB
const app = require('./server'); // Importa la configuración del servidor

const PORT = process.env.PORT || 4005;

// Conectar a la base de datos antes de iniciar el servidor
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
  });
}).catch(err => {
  console.error("❌ Error al conectar a la base de datos:", err);
  process.exit(1); // Detiene la ejecución si la conexión falla
});
