const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Todo\'s backend docs',
      version: '1.0.0',
    },
  },
  apis: ['src/routes/todoROutes/index.ts'], // files containing annotations as above
};

export default swaggerJsdoc(options)