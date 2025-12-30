import 'express';

declare module 'express' {
  export interface Request {
    user?: {
      id: string;
      email: string;
      role: 'admin' | 'student' | 'tutor' | 'scholarship_holder' | 'coordinator';
      [key: string]: any;
    };
  }
}
