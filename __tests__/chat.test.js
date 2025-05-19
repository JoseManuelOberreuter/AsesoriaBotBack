const request = require('supertest');
const express = require('express');
const chatRouter = require('../routes/chatRoutes');
const jwt = require('jsonwebtoken');

// Mock de los modelos
jest.mock('../models/chatModel', () => {
  const mockChat = {
    _id: '123',
    bot: {
      _id: '456',
      owner: '123',
      toString: () => '123'
    },
    title: 'Test Chat',
    messages: [],
    createdAt: new Date(),
    updatedAt: new Date(),
    save: jest.fn().mockImplementation(function() {
      return Promise.resolve(this);
    }),
    deleteOne: jest.fn().mockResolvedValue({ deletedCount: 1 })
  };

  const Chat = function(data) {
    const chat = {
      ...mockChat,
      ...data,
      save: jest.fn().mockImplementation(function() {
        return Promise.resolve(this);
      }),
      deleteOne: jest.fn().mockResolvedValue({ deletedCount: 1 })
    };
    return chat;
  };

  Chat.find = jest.fn().mockReturnThis();
  Chat.sort = jest.fn().mockResolvedValue([mockChat]);
  Chat.findById = jest.fn().mockReturnThis();
  Chat.populate = jest.fn().mockResolvedValue(mockChat);

  return Chat;
});

jest.mock('../models/botModel', () => ({
  find: jest.fn().mockReturnThis(),
  select: jest.fn().mockResolvedValue([{ _id: '456' }]),
  findOne: jest.fn()
}));

const Chat = require('../models/chatModel');
const Bot = require('../models/botModel');

// Mock de jwt para la autenticación
jest.mock('jsonwebtoken', () => ({
  verify: jest.fn().mockImplementation((token, secret) => {
    if (token === 'mock_token' && secret === 'test_secret') {
      return { _id: '123' };
    }
    throw new Error('Invalid token');
  })
}));

// Configuración de la aplicación de prueba
const app = express();
app.use(express.json());
app.use('/api/chats', chatRouter);

describe('Chat Routes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /api/chats/create', () => {
    it('should create a new chat', async () => {
      const chatData = {
        botId: '456',
        title: 'New Chat'
      };

      Bot.findOne.mockResolvedValue({
        _id: '456',
        owner: '123'
      });

      const response = await request(app)
        .post('/api/chats/create')
        .set('Authorization', 'Bearer mock_token')
        .send(chatData);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('title', chatData.title);
    });

    it('should return 403 if user is not authorized to create chat with bot', async () => {
      const chatData = {
        botId: '456',
        title: 'New Chat'
      };

      Bot.findOne.mockResolvedValue(null);

      const response = await request(app)
        .post('/api/chats/create')
        .set('Authorization', 'Bearer mock_token')
        .send(chatData);

      expect(response.status).toBe(403);
    });
  });

  describe('POST /api/chats/add-message', () => {
    it('should add a message to an existing chat', async () => {
      const messageData = {
        chatId: '123',
        sender: 'user',
        content: 'Hello bot!'
      };

      const mockChat = {
        _id: '123',
        bot: {
          _id: '456',
          owner: '123',
          toString: () => '123'
        },
        messages: [],
        updatedAt: new Date(),
        save: jest.fn().mockImplementation(function() {
          this.messages.push(messageData);
          return Promise.resolve(this);
        })
      };

      Chat.findById.mockReturnThis();
      Chat.populate.mockResolvedValue(mockChat);

      const response = await request(app)
        .post('/api/chats/add-message')
        .set('Authorization', 'Bearer mock_token')
        .send(messageData);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('messages');
      expect(response.body.messages).toHaveLength(1);
    });

    it('should return 404 if chat is not found', async () => {
      const messageData = {
        chatId: 'nonexistent',
        sender: 'user',
        content: 'Hello bot!'
      };

      Chat.findById.mockReturnThis();
      Chat.populate.mockResolvedValue(null);

      const response = await request(app)
        .post('/api/chats/add-message')
        .set('Authorization', 'Bearer mock_token')
        .send(messageData);

      expect(response.status).toBe(404);
    });
  });

  describe('GET /api/chats/user-chats/:userId', () => {
    it('should get all chats for a user', async () => {
      const mockChats = [
        { _id: '123', title: 'Chat 1' },
        { _id: '124', title: 'Chat 2' }
      ];

      Bot.find.mockReturnThis();
      Bot.select.mockResolvedValue([{ _id: '456' }]);
      Chat.find.mockReturnThis();
      Chat.sort.mockResolvedValue(mockChats);

      const response = await request(app)
        .get('/api/chats/user-chats/123')
        .set('Authorization', 'Bearer mock_token');

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body).toHaveLength(2);
    });
  });

  describe('PUT /api/chats/rename', () => {
    it('should rename a chat', async () => {
      const renameData = {
        chatId: '123',
        title: 'New Title'
      };

      const mockChat = {
        _id: '123',
        bot: {
          _id: '456',
          owner: '123',
          toString: () => '123'
        },
        title: 'Old Title',
        updatedAt: new Date(),
        save: jest.fn().mockImplementation(function() {
          this.title = renameData.title;
          return Promise.resolve(this);
        })
      };

      Chat.findById.mockReturnThis();
      Chat.populate.mockResolvedValue(mockChat);

      const response = await request(app)
        .put('/api/chats/rename')
        .set('Authorization', 'Bearer mock_token')
        .send(renameData);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('title', renameData.title);
    });

    it('should return 404 if chat is not found', async () => {
      const renameData = {
        chatId: 'nonexistent',
        title: 'New Title'
      };

      Chat.findById.mockReturnThis();
      Chat.populate.mockResolvedValue(null);

      const response = await request(app)
        .put('/api/chats/rename')
        .set('Authorization', 'Bearer mock_token')
        .send(renameData);

      expect(response.status).toBe(404);
    });
  });

  describe('DELETE /api/chats/delete/:chatId', () => {
    it('should delete a chat', async () => {
      const mockChat = {
        _id: '123',
        bot: {
          _id: '456',
          owner: '123',
          toString: () => '123'
        },
        deleteOne: jest.fn().mockResolvedValue({ deletedCount: 1 })
      };

      Chat.findById.mockReturnThis();
      Chat.populate.mockResolvedValue(mockChat);

      const response = await request(app)
        .delete('/api/chats/delete/123')
        .set('Authorization', 'Bearer mock_token');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message', '🗑️ Chat eliminado correctamente');
    });

    it('should return 404 if chat is not found', async () => {
      Chat.findById.mockReturnThis();
      Chat.populate.mockResolvedValue(null);

      const response = await request(app)
        .delete('/api/chats/delete/nonexistent')
        .set('Authorization', 'Bearer mock_token');

      expect(response.status).toBe(404);
    });
  });
}); 