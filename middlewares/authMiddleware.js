const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  try {
    console.log("✅ Middleware de autenticación ejecutado");

    const token = req.header("Authorization");
    if (!token) {
      console.log("⛔ No hay token en la solicitud");
      return res.status(401).json({ error: "Acceso denegado. No hay token." });
    }

    // Verificar y decodificar el token
    const decoded = jwt.verify(token.replace("Bearer ", ""), process.env.JWT_SECRET);

    // Guardar la información del usuario en `req.user`
    req.user = { _id: decoded.id };

    console.log("✅ Token verificado correctamente:", decoded);

    next(); // Continuar con la ejecución de la ruta
  } catch (error) {
    console.error("⛔ Error en la autenticación:", error);
    return res.status(403).json({ error: "Token inválido o expirado." });
  }
};

module.exports = authMiddleware;
