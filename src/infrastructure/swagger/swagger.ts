import express from 'express';
import swaggerUi from 'swagger-ui-express';
import fs from 'fs';
import yaml from 'js-yaml';


// Carrega o YAML e remove o campo servers para que o Swagger UI use window.location.origin
const swaggerDocumentRaw = yaml.load(fs.readFileSync('./openapi.yaml', 'utf8')) as any;
if (swaggerDocumentRaw.servers) {
  delete swaggerDocumentRaw.servers;
}
const swaggerDocument = swaggerDocumentRaw;


export function setupSwagger(app: express.Application) {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument, {
    swaggerOptions: {
      // Força o Swagger UI a usar a origem do navegador
      url: '/api-docs/openapi.yaml',
      urls: [
        { url: '/api-docs/openapi.yaml', name: 'Next-Event API' }
      ],
      // O validatorUrl: null desativa o warning de validação externa
      validatorUrl: null
    },
    customSiteTitle: 'Next-Event API Docs',
  }));

  // Servir o openapi.yaml diretamente para o Swagger UI
  app.get('/api-docs/openapi.yaml', (req, res) => {
    res.type('yaml').send(fs.readFileSync('./openapi.yaml', 'utf8'));
  });
}
