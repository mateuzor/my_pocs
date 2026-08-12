import swaggerJsdoc from 'swagger-jsdoc';

// Aula 14 — OpenAPI / Swagger
//
// A ideia: gerar UMA especificação OpenAPI 3.0 que descreve toda a API e
// servir uma UI interativa (Swagger UI) em /docs. Frontend, mobile e
// integrações externas leem essa spec pra saber o que existe.
//
// Duas formas de fazer isso:
//
//   1. swagger-jsdoc + swagger-ui-express (o clássico, é o que uso aqui):
//      Anotações JSDoc `@openapi` em cada rota. O parser lê o código,
//      monta um objeto JSON e o Swagger UI renderiza. Curva baixa,
//      funciona com qualquer framework.
//
//   2. zod-to-openapi (moderno): reaproveita os schemas Zod que já existem
//      pra evitar duplicação. Mais elegante mas requer um wrapper no Zod.
//
// A escolha aqui é a #1 pra manter o padrão típico de curso — se o time
// crescer, migro pra #2 depois.

const spec = swaggerJsdoc({
  definition: {
    openapi: '3.0.3',
    info: {
      title: 'poc-node-backend API',
      version: '1.0.0',
      description:
        'API de tasks/attachments com autenticação JWT + refresh tokens.\n\n' +
        'Endpoints protegidos precisam de `Authorization: Bearer <access-token>`.',
    },
    servers: [{ url: 'http://localhost:3000', description: 'Local' }],
    components: {
      // securitySchemes registra o esquema de auth. `bearerAuth` é referenciado
      // por rotas individuais com `security: [{ bearerAuth: [] }]`.
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      // schemas reutilizáveis — referenciados via $ref: '#/components/schemas/Task'
      schemas: {
        Task: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            title: { type: 'string', example: 'Estudar Node' },
            done: { type: 'boolean', example: false },
            userId: { type: 'integer', example: 1 },
            createdAt: { type: 'string', format: 'date-time' },
          },
        },
        User: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            email: { type: 'string', format: 'email' },
            createdAt: { type: 'string', format: 'date-time' },
          },
        },
        Error: {
          type: 'object',
          properties: {
            error: { type: 'string', example: 'NOT_FOUND' },
            message: { type: 'string', example: 'Task não encontrada' },
          },
        },
      },
    },
  },
  // Arquivos onde swagger-jsdoc procura por anotações @openapi
  apis: ['./src/routes/*.ts'],
});

export const openApiSpec = spec;
