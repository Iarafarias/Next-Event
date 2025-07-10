import { Request, Response, NextFunction } from 'express';

interface AuthenticatedRequest extends Request {
  user: {
    id: string;
    email: string;
    role: 'admin' | 'participant';
  };
}

type UserRole = 'admin' | 'participant';

export function authorizeRoles(roles: UserRole[]) {
  return (request: Request, response: Response, next: NextFunction): void => {
    const user = (request as AuthenticatedRequest).user;

    if (!user) {
      throw new Error('User not authenticated');
    }

    if (!roles.includes(user.role)) {
      throw new Error('User not authorized');
    }

    return next();
  };
}
