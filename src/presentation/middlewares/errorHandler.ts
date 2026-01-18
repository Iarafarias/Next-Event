import { Request, Response, NextFunction } from 'express';

export function errorHandler(err: any, req: Request, res: Response, next: NextFunction) {
  const status = err.status || 500;
  const message = err.message || 'Erro interno do servidor';
  const details = err.details || undefined;

  if (status >= 500) {
    console.error(`[${new Date().toISOString()}] [ERROR]`, err.stack || err);
  } else {
    console.warn(`[${new Date().toISOString()}] [WARN]`, message, details);
  }

  res.status(status).json({
    error: message,
    ...(details ? { details } : {})
  });
}
