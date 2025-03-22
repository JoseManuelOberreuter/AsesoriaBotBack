const express = require('express');
const authMiddleware = require('../middlewares/authMiddleware');
const router = express.Router();
const { createBot } = require('../controllers/botController');

router.post('/create', authMiddleware, createBot);
  
module.exports = router;