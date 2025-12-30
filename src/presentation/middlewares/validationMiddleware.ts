import { Request, Response, NextFunction } from 'express';
import { validationResult, ValidationError } from 'express-validator';

export function validationMiddleware(req: Request, res: Response, next: NextFunction) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      error: 'Validation failed',
      details: errors.array().map((e) => ({
        field: 'param' in e ? e.param : '_error',
        message: e.msg
      }))
    });
  }
  next();
}
