/**
 * @swagger
 * components:
 *   schemas:
 *     Document:
 *       type: object
 *       required:
 *         - bot
 *         - uploadedBy
 *         - filename
 *         - fileType
 *         - url
 *       properties:
 *         _id:
 *           type: string
 *           description: ID único del documento
 *         bot:
 *           type: string
 *           description: ID del bot al que pertenece el documento
 *         uploadedBy:
 *           type: string
 *           description: ID del usuario que subió el documento
 *         filename:
 *           type: string
 *           description: Nombre del archivo
 *         fileType:
 *           type: string
 *           description: Tipo de archivo (extensión)
 *         url:
 *           type: string
 *           description: URL para acceder al documento
 *         metadata:
 *           type: object
 *           properties:
 *             size:
 *               type: number
 *               description: Tamaño del archivo en bytes
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Fecha de subida del documento
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Fecha de última actualización
 */

/**
 * @swagger
 * /documents/upload:
 *   post:
 *     summary: Subir un documento para un bot
 *     tags: [Documentos]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - botId
 *               - file
 *             properties:
 *               botId:
 *                 type: string
 *                 description: ID del bot al que se subirá el documento
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: Archivo a subir
 *     responses:
 *       201:
 *         description: Documento subido exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Documento subido exitosamente"
 *                 document:
 *                   $ref: '#/components/schemas/Document'
 *       400:
 *         description: No se subió ningún archivo
 *       403:
 *         description: No autorizado para subir archivos a este bot
 *       500:
 *         description: Error del servidor
 * 
 * /documents/bot/{botId}:
 *   get:
 *     summary: Obtener todos los documentos de un bot
 *     tags: [Documentos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: botId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del bot
 *     responses:
 *       200:
 *         description: Lista de documentos obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Document'
 *       403:
 *         description: No autorizado para ver los archivos de este bot
 *       500:
 *         description: Error del servidor
 * 
 * /documents/{docId}:
 *   delete:
 *     summary: Eliminar un documento
 *     tags: [Documentos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: docId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del documento a eliminar
 *     responses:
 *       200:
 *         description: Documento eliminado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Documento eliminado correctamente"
 *       403:
 *         description: No autorizado para eliminar este documento
 *       404:
 *         description: Documento no encontrado
 *       500:
 *         description: Error del servidor
 */ 