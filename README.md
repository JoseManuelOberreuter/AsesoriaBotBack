# AsesoriaBotBack
Este es el backend para la aplicación de chatbot, construido con Node.js, Express, y MongoDB. Permite a los usuarios autenticarse, gestionar múltiples chats y recibir respuestas del bot basadas en la API de DeepSeek y una base de datos interna.

## Características

- Autenticación de usuarios
- Gestión de múltiples chats
- Integración con DeepSeek API
- Base de datos MongoDB
- Documentación de API con Swagger

## Documentación de la API

La documentación completa de la API está disponible a través de Swagger UI en:

```
http://localhost:4005/api-docs/
```

Aquí podrás encontrar:
- Todos los endpoints disponibles
- Parámetros requeridos
- Ejemplos de peticiones y respuestas
- Esquemas de datos
- Autenticación y autorización

## Requisitos

- Node.js
- MongoDB
- npm o yarn

## Instalación

1. Clonar el repositorio
2. Instalar dependencias:
```bash
npm install
```
3. Configurar variables de entorno
4. Iniciar el servidor:
```bash
npm start
```

## Variables de Entorno

Crear un archivo `.env` con las siguientes variables:

```
API_DEEPSEEK=
MONGO_URI=
JWT_SECRET=
EMAIL_USER=
EMAIL_PASS=
```