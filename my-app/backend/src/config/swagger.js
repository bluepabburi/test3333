// src/config/swagger.js
import swaggerJSDoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.3',
    info: {
      title: 'Coda Homepage API',
      version: '1.0.0',
      description: '동아리 백엔드 API 문서',
    },
    servers: [{ url: 'http://localhost:4000', description: 'Local' }],
    components: {
      securitySchemes: {
        bearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
      },
    },
  },
  apis: [
    'src/routes/*.js',
    'src/**/*.js',
  ],
};

export const swaggerSpec = swaggerJSDoc(options);

