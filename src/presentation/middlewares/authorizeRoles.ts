import { Request, Response, NextFunction } from 'express';

interface AuthenticatedRequest extends Request {
  user: {
    id: string;
    email: string;
    role: 'admin' | 'student' | 'tutor' | 'scholarship_holder' | 'coordinator';
  };
}

type UserRole = 'admin' | 'student' | 'tutor' | 'scholarship_holder' | 'coordinator';

export function authorizeRoles(roles: UserRole[]) {
  return (request: Request, response: Response, next: NextFunction): void => {
    const user = (request as AuthenticatedRequest).user;

    if (!user) {
      response.status(401).json({ message: 'User not authenticated' });
      return;
    }

    if (!roles.includes(user.role)) {
      response.status(403).json({ message: 'Acesso negado.' });
      return;
    }

    next();
  };
}
