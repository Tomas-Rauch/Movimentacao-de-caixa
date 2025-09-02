import { Request, Response, NextFunction } from 'express';

export function authorize(role: 'admin' | 'user') {
  return (req: Request, res: Response, next: NextFunction): void => {
    const usuario = req.user;

    if (!usuario?.role) {
      res.status(401).json({ message: 'Token inválido ou ausente' });
      return;
    }

    if (usuario.role !== role) {
      res.status(403).json({ message: 'Acesso negado: permissão insuficiente' });
      return;
    }

    next();
  };
}
