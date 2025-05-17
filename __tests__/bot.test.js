const request = require('supertest');
const express = require('express');
const botRouter = require('../routes/botRoutes');
const jwt = require('jsonwebtoken');

// Mock del modelo Bot
jest.mock('../models/botModel', () => {
  const mockBot = {
    _id: '123',
    name: 'Test Bot',
    description: 'A test bot',
    type: 'assistant',
    owner: '123',
    save: jest.fn().mockResolvedValue(true)
  };

  return {
    find: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn().mockResolvedValue(mockBot),
    findOneAndDelete: jest.fn()
  };
});

const Bot = require('../models/botModel');

// Mock de jwt para la autenticación
jest.mock('jsonwebtoken', () => ({
  verify: jest.fn().mockImplementation((token, secret) => {
    if (token === 'mock_token' && secret === 'test_secret') {
      return { id: '123' };
    }
    throw new Error('Invalid token');
  })
}));

// Configuración de la aplicación de prueba
const app = express();
app.use(express.json());
app.use('/api/bots', botRouter);

describe('Bot Routes', () => {
  beforeEach(() => {
    // Limpiar todos los mocks antes de cada prueba
    jest.clearAllMocks();
  });

  describe('POST /api/bots/create', () => {
    it('should create a new bot', async () => {
      const botData = {
        name: 'Test Bot',
        description: 'A test bot',
        type: 'assistant'
      };

      const response = await request(app)
        .post('/api/bots/create')
        .set('Authorization', 'Bearer mock_token')
        .send(botData);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('name', botData.name);
    });

    it('should return 403 if token is invalid', async () => {
      const botData = {
        description: 'A test bot'
      };

      jwt.verify.mockImplementationOnce(() => {
        throw new Error('Invalid token');
      });

      const response = await request(app)
        .post('/api/bots/create')
        .set('Authorization', 'Bearer invalid_token')
        .send(botData);

      expect(response.status).toBe(403);
    });
  });

  describe('GET /api/bots/mine', () => {
    it('should get all bots for the authenticated user', async () => {
      const mockBots = [
        { _id: '1', name: 'Bot 1', owner: '123' },
        { _id: '2', name: 'Bot 2', owner: '123' }
      ];

      Bot.find.mockResolvedValue(mockBots);

      const response = await request(app)
        .get('/api/bots/mine')
        .set('Authorization', 'Bearer mock_token');

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body).toHaveLength(2);
    });
  });

  describe('GET /api/bots/:id', () => {
    it('should get a specific bot by ID', async () => {
      const mockBot = {
        _id: '123',
        name: 'Test Bot',
        owner: '123'
      };

      Bot.findOne.mockResolvedValue(mockBot);

      const response = await request(app)
        .get('/api/bots/123')
        .set('Authorization', 'Bearer mock_token');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('name', 'Test Bot');
    });

    it('should return 404 if bot is not found', async () => {
      Bot.findOne.mockResolvedValue(null);

      const response = await request(app)
        .get('/api/bots/nonexistent')
        .set('Authorization', 'Bearer mock_token');

      expect(response.status).toBe(404);
    });
  });

  describe('PUT /api/bots/update/:id', () => {
    it('should update a bot', async () => {
      const updateData = {
        name: 'Updated Bot',
        description: 'Updated description'
      };

      const mockBot = {
        _id: '123',
        owner: '123',
        ...updateData,
        save: jest.fn().mockResolvedValue(true)
      };

      Bot.findOne.mockResolvedValue(mockBot);

      const response = await request(app)
        .put('/api/bots/update/123')
        .set('Authorization', 'Bearer mock_token')
        .send(updateData);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message', 'Bot actualizado exitosamente');
      expect(response.body).toHaveProperty('bot');
    });

    it('should return 404 if bot is not found', async () => {
      Bot.findOne.mockResolvedValue(null);

      const response = await request(app)
        .put('/api/bots/update/nonexistent')
        .set('Authorization', 'Bearer mock_token')
        .send({ name: 'Updated Bot' });

      expect(response.status).toBe(404);
    });
  });

  describe('DELETE /api/bots/delete/:id', () => {
    it('should delete a bot', async () => {
      const mockBot = {
        _id: '123',
        owner: '123'
      };

      Bot.findOneAndDelete.mockResolvedValue(mockBot);

      const response = await request(app)
        .delete('/api/bots/delete/123')
        .set('Authorization', 'Bearer mock_token');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message', 'Bot eliminado exitosamente');
    });

    it('should return 404 if bot is not found', async () => {
      Bot.findOneAndDelete.mockResolvedValue(null);

      const response = await request(app)
        .delete('/api/bots/delete/nonexistent')
        .set('Authorization', 'Bearer mock_token');

      expect(response.status).toBe(404);
    });
  });
}); 