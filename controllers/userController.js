const User = require('../models/userModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const { sendVerificationEmail, sendPasswordResetEmail  } = require('../utils/mailer');
const { validatePassword } = require('../utils/passwordValidator'); 



const SECRET_KEY = process.env.JWT_SECRET || "supersecretkey";  // Usa una clave segura

// 📌 Registrar Usuario
const registerUser = async (req, res) => {
  try {
    console.log("📌 Recibida solicitud de registro:", req.body);

    const { name, email, password } = req.body;

    // 📌 Validar la seguridad de la contraseña
    const passwordValidation = validatePassword(password);
    if (!passwordValidation.isValid) {
      return res.status(400).json({ error: passwordValidation.message });
    }

    // Verificar si el usuario ya existe
    const userExists = await User.findOne({ email });
    if (userExists) {
      console.log("❌ El usuario ya existe:", email);
      return res.status(400).json({ error: "El usuario ya existe" });
    }

    // Encriptar contraseña
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Generar Token para verificación
    const verificationToken = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '1h' });

    // Crear usuario
    const newUser = new User({ 
      name, 
      email, 
      password: hashedPassword,
      isVerified: false, 
      verificationToken 
    });

    await newUser.save();
    console.log("✅ Usuario guardado en BD:", newUser);

    // 📌 Verificar si la función de correo se ejecuta
    console.log("📧 Llamando a sendVerificationEmail...");
    await sendVerificationEmail(email, verificationToken);
    console.log("✅ Correo de verificación enviado a:", email);

    res.status(201).json({ message: "Usuario creado exitosamente. Revisa tu correo." });
  } catch (error) {
    console.error("❌ Error al registrar usuario:", error);
    res.status(500).json({ error: "Error al registrar usuario" });
  }
};


// 📌 Iniciar Sesión
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Verificar si el usuario existe
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: "Usuario no encontrado" });

    // 📌 Verificar si la cuenta ha sido confirmada
    if (!user.isVerified) return res.status(400).json({ error: "Debes confirmar tu cuenta antes de iniciar sesión." });

    // Comparar contraseña
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: "Contraseña incorrecta" });

    // Generar token JWT
    const token = jwt.sign({ id: user._id }, SECRET_KEY, { expiresIn: "1h" });

    res.json({ message: "Inicio de sesión exitoso", token });
  } catch (error) {
    res.status(500).json({ error: "Error al iniciar sesión" });
  }
};

// 📌 Actualizar Usuario
const updateUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const userId = req.params.id;

    // Verificar si el usuario existe
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: "Usuario no encontrado" });

    // Si hay un nuevo password, encriptarlo
    let hashedPassword = user.password;
    if (password) {
      const salt = await bcrypt.genSalt(10);
      hashedPassword = await bcrypt.hash(password, salt);
    }

    // Actualizar datos
    user.name = name || user.name;
    user.email = email || user.email;
    user.password = hashedPassword;
    await user.save();

    res.json({ message: "Usuario actualizado correctamente" });
  } catch (error) {
    res.status(500).json({ error: "Error al actualizar usuario" });
  }
};

// 📌 Verificar Cuenta con el Token
const verifyUser = async (req, res) => {
  try {
    const { token } = req.params;

    // 📌 Decodificar el token
    const decoded = jwt.verify(token, SECRET_KEY);
    
    // 📌 Buscar usuario con el email del token
    const user = await User.findOne({ email: decoded.email });

    if (!user) return res.status(400).json({ error: "Token inválido o usuario no encontrado" });
    if (user.isVerified) return res.status(400).json({ error: "Cuenta ya confirmada" });

    // 📌 Marcar la cuenta como verificada
    user.isVerified = true;
    user.verificationToken = undefined; // Eliminamos el token de la BD
    await user.save();

    res.json({ message: "Cuenta confirmada con éxito. Ya puedes iniciar sesión." });
  } catch (error) {
    console.error("❌ Error al verificar cuenta:", error);
    res.status(400).json({ error: "Token inválido o expirado" });
  }
};

// 📌 Solicitar recuperación de contraseña
const requestPasswordReset = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ error: "No existe una cuenta con este correo." });
    }

    // 📌 Generar un JWT en lugar de un token aleatorio
    const resetToken = jwt.sign({ email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });

    // 📌 Enviar correo con el enlace de restablecimiento
    await sendPasswordResetEmail(user.email, resetToken);

    res.json({ message: "Correo de recuperación enviado. Revisa tu bandeja de entrada." });
  } catch (error) {
    console.error("❌ Error en solicitud de recuperación:", error);
    res.status(500).json({ error: "Error al solicitar la recuperación de contraseña." });
  }
};



// 📌 Restablecer la contraseña
const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    // 📌 Verificar el JWT
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      return res.status(400).json({ error: "Token inválido o expirado." });
    }

    // 📌 Buscar usuario por email
    const user = await User.findOne({ email: decoded.email });
    if (!user) {
      return res.status(400).json({ error: "Usuario no encontrado." });
    }

    // 📌 Validar seguridad de la nueva contraseña
    const passwordValidation = validatePassword(password);
    if (!passwordValidation.isValid) {
      return res.status(400).json({ error: passwordValidation.message });
    }

    // 📌 Encriptar la nueva contraseña
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    await user.save();

    res.json({ message: "Contraseña restablecida con éxito. Ya puedes iniciar sesión." });
  } catch (error) {
    console.error("❌ Error al restablecer contraseña:", error);
    res.status(500).json({ error: "Error al restablecer la contraseña." });
  }
};



module.exports = { registerUser, loginUser, updateUser, verifyUser, requestPasswordReset, resetPassword };
