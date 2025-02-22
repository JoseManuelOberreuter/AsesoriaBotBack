const express = require('express');
const { registerUser, loginUser, updateUser } = require('../controllers/userController');
const router = express.Router();

// Ruta para registrar un usuario
router.post('/register', registerUser);

// Ruta para iniciar sesión
router.post('/login', loginUser);

// Ruta para actualizar un usuario
router.put('/update/:id', updateUser);

module.exports = router;
