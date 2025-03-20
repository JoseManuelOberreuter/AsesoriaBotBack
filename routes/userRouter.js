const express = require('express');
const authMiddleware = require('../middlewares/authMiddleware');
const { registerUser, loginUser, updateUser, verifyUser, requestPasswordReset, resetPassword, getUserData} = require('../controllers/userController');
const router = express.Router();

// Ruta para registrar un usuario
router.post('/register', registerUser);

// Ruta para iniciar sesión
router.post('/login', loginUser);

// Ruta para verificar la cuenta con el token
router.get('/verify/:token', verifyUser);

// Ruta para solicitar la recuperación de contraseña
router.post('/forgot-password', requestPasswordReset);

// Ruta para restablecer la contraseña con un token
router.post('/reset-password/:token', resetPassword);

// Ruta para actualizar un usuario
router.put('/update/:id', authMiddleware, updateUser);

// Ruta para traer los datos del usuario
router.get('/user-data', authMiddleware, getUserData);

module.exports = router;
