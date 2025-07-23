import { Request } from 'express';
import { UserRole } from '../../domain/user/entities/User';

export interface AuthenticatedRequest extends Request {
  user: {
    id: string;
    email: string;
    role: UserRole;
  };
} 