import express from 'express';
import swaggerUi from 'swagger-ui-express';
import fs from 'fs';
import yaml from 'js-yaml';

const swaggerDocument = yaml.load(fs.readFileSync('./openapi.yaml', 'utf8')) as object;

export function setupSwagger(app: express.Application) {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument, {
    customSiteTitle: 'Next-Event API Docs',
  }));
}
