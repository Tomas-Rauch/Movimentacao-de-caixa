import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET || 'default_secret';

export function authenticate(req: Request, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    res.status(401).json({ message: 'Token ausente' });
    return;
  }

  try {
    const decoded = jwt.verify(token, JWT_ACCESS_SECRET);
    if (typeof decoded === 'object' && decoded !== null) {
      req.user = decoded as Express.UserPayload;
      console.log('decoded JWT:', decoded);
      next();
    } else {
      res.status(401).json({ message: 'Token inválido' });
    }
  } catch (error) {
    res.status(401).json({ message: 'Token inválido ou expirado' });
  }
}