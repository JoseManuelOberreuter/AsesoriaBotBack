const express = require('express');
const { registerUser, loginUser, updateUser, verifyUser} = require('../controllers/userController');
const router = express.Router();

// Ruta para registrar un usuario
router.post('/register', registerUser);

// Ruta para iniciar sesión
router.post('/login', loginUser);

// Ruta para actualizar un usuario
router.put('/update/:id', updateUser);

// Ruta para verificar la cuenta con el token
router.get('/verify/:token', verifyUser);

module.exports = router;
