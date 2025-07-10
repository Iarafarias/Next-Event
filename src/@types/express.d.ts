type UserRole = 'admin' | 'participant';

import 'express';

declare module 'express' {
  export interface Request {
    user?: {
      id: string;
      email: string;
      role: 'admin' | 'participant';
      [key: string]: any;
    };
  }
}
