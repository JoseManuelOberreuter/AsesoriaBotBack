/**
 * @swagger
 * components:
 *   schemas:
 *     Bot:
 *       type: object
 *       required:
 *         - name
 *         - owner
 *       properties:
 *         _id:
 *           type: string
 *           description: ID único del bot
 *         name:
 *           type: string
 *           description: Nombre del bot
 *         description:
 *           type: string
 *           description: Descripción del bot
 *         avatar:
 *           type: string
 *           description: URL del avatar del bot
 *         type:
 *           type: string
 *           description: Tipo de bot
 *         settings:
 *           type: object
 *           description: Configuraciones específicas del bot
 *         owner:
 *           type: string
 *           description: ID del usuario propietario del bot
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Fecha de creación del bot
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Fecha de última actualización del bot
 */

/**
 * @swagger
 * /bots:
 *   post:
 *     summary: Crear un nuevo bot
 *     tags: [Bots]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               avatar:
 *                 type: string
 *               type:
 *                 type: string
 *               settings:
 *                 type: object
 *     responses:
 *       201:
 *         description: Bot creado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Bot'
 *       401:
 *         description: No autorizado - ID de usuario no encontrado
 *       500:
 *         description: Error del servidor
 * 
 *   get:
 *     summary: Obtener todos los bots del usuario
 *     tags: [Bots]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de bots obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Bot'
 *       500:
 *         description: Error del servidor
 * 
 * /bots/{id}:
 *   get:
 *     summary: Obtener un bot específico por ID
 *     tags: [Bots]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del bot
 *     responses:
 *       200:
 *         description: Bot encontrado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Bot'
 *       404:
 *         description: Bot no encontrado
 *       500:
 *         description: Error del servidor
 * 
 *   put:
 *     summary: Actualizar un bot existente
 *     tags: [Bots]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del bot
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               avatar:
 *                 type: string
 *               type:
 *                 type: string
 *               settings:
 *                 type: object
 *     responses:
 *       200:
 *         description: Bot actualizado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 bot:
 *                   $ref: '#/components/schemas/Bot'
 *       404:
 *         description: Bot no encontrado o no autorizado
 *       500:
 *         description: Error del servidor
 * 
 *   delete:
 *     summary: Eliminar un bot
 *     tags: [Bots]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del bot
 *     responses:
 *       200:
 *         description: Bot eliminado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       404:
 *         description: Bot no encontrado
 *       500:
 *         description: Error del servidor
 */ 