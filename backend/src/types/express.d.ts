declare global {
  namespace Express {
    interface UserPayload {
      id: number;
      email?: string;
      role?: 'admin' | 'user';
    }

    interface Request {
      user?: UserPayload;
    }
  }
}

export {};
