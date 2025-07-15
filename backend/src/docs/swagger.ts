import swaggerJSDoc from 'swagger-jsdoc'

export const swaggerSpec = swaggerJSDoc({
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API de Autenticação',
      version: '1.0.0',
      description: 'Documentação da API para autenticação de usuários'
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      }
    },
    security: [{ bearerAuth: [] }] // Aplica a autenticação globalmente (pode ser removido se quiser por rota)
  },
  apis: ['./src/routes/*.ts'],
})
