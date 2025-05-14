/**
 * @swagger
 * components:
 *   schemas:
 *     Message:
 *       type: object
 *       required:
 *         - sender
 *         - content
 *       properties:
 *         sender:
 *           type: string
 *           description: Quién envía el mensaje (user/bot)
 *         content:
 *           type: string
 *           description: Contenido del mensaje
 *         timestamp:
 *           type: string
 *           format: date-time
 *           description: Fecha y hora del mensaje
 * 
 *     Chat:
 *       type: object
 *       required:
 *         - bot
 *         - title
 *       properties:
 *         _id:
 *           type: string
 *           description: ID único del chat
 *         bot:
 *           type: string
 *           description: ID del bot asociado al chat
 *         title:
 *           type: string
 *           description: Título del chat
 *         messages:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Message'
 *           description: Lista de mensajes en el chat
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Fecha de creación del chat
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Fecha de última actualización del chat
 */

/**
 * @swagger
 * /chat:
 *   post:
 *     summary: Crear un nuevo chat
 *     tags: [Chats]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - botId
 *               - title
 *             properties:
 *               botId:
 *                 type: string
 *                 description: ID del bot con el que se creará el chat
 *               title:
 *                 type: string
 *                 description: Título del chat
 *     responses:
 *       201:
 *         description: Chat creado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Chat'
 *       403:
 *         description: No autorizado para crear chat con este bot
 *       500:
 *         description: Error del servidor
 * 
 *   get:
 *     summary: Obtener todos los chats del usuario
 *     tags: [Chats]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de chats obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Chat'
 *       500:
 *         description: Error del servidor
 * 
 * /chat/message:
 *   post:
 *     summary: Agregar un mensaje a un chat existente
 *     tags: [Chats]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - chatId
 *               - sender
 *               - content
 *             properties:
 *               chatId:
 *                 type: string
 *                 description: ID del chat
 *               sender:
 *                 type: string
 *                 description: Quién envía el mensaje (user/bot)
 *               content:
 *                 type: string
 *                 description: Contenido del mensaje
 *     responses:
 *       200:
 *         description: Mensaje agregado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Chat'
 *       403:
 *         description: No autorizado para agregar mensajes a este chat
 *       404:
 *         description: Chat no encontrado
 *       500:
 *         description: Error del servidor
 * 
 * /chat/rename:
 *   put:
 *     summary: Renombrar un chat existente
 *     tags: [Chats]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - chatId
 *               - title
 *             properties:
 *               chatId:
 *                 type: string
 *                 description: ID del chat
 *               title:
 *                 type: string
 *                 description: Nuevo título del chat
 *     responses:
 *       200:
 *         description: Chat renombrado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Chat'
 *       403:
 *         description: No autorizado para renombrar este chat
 *       404:
 *         description: Chat no encontrado
 *       500:
 *         description: Error del servidor
 * 
 * /chat/{chatId}:
 *   delete:
 *     summary: Eliminar un chat
 *     tags: [Chats]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: chatId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del chat a eliminar
 *     responses:
 *       200:
 *         description: Chat eliminado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "🗑️ Chat eliminado correctamente"
 *       403:
 *         description: No autorizado para eliminar este chat
 *       404:
 *         description: Chat no encontrado
 *       500:
 *         description: Error del servidor
 */ 