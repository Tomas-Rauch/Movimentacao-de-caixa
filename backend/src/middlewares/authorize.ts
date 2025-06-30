import { Request, Response, NextFunction } from 'express'

declare global {
  namespace Express {
    interface Request {
      user?: { role?: string }
    }
  }
}

export function authorize(role: 'admin' | 'user') {
  return (req: Request, res: Response, next: NextFunction) => {
    const usuario = req.user as { role?: string }

    if (usuario?.role !== role) {
      return res.status(403).json({ message: 'Acesso negado: permissão insuficiente' })
    }

    next()
  }
}
