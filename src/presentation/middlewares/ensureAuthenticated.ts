import { Request, Response, NextFunction } from 'express';
import { verify } from 'jsonwebtoken';

interface TokenPayload {
  id: string;
  email: string;
  role: 'admin' | 'student' | 'tutor' | 'scholarship_holder' | 'coordinator';
}

interface AuthenticatedRequest extends Request {
  user: TokenPayload;
}

export function ensureAuthenticated(
  request: Request,
  response: Response,
  next: NextFunction
): void {
  const authHeader = request.headers.authorization;

  if (!authHeader) {
    throw new Error('Token JWT não fornecido');
  }

  const [, token] = authHeader.split(' ');

  try {
    const decoded = verify(token, process.env.JWT_SECRET as string) as TokenPayload;

    (request as AuthenticatedRequest).user = {
      id: decoded.id,
      email: decoded.email,
      role: decoded.role,
    };

    return next();
  } catch {
    throw new Error('Token JWT inválido');
  }
} 