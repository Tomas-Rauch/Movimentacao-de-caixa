import { Request, Response } from 'express'
import { AuthService } from '../services/authService'

export const authController = {
  async registrar(req: Request, res: Response) {
    const { email, password, role } = req.body

    try {
      const usuario = await AuthService.registrarUsuario(email, password, role)
      res.status(201).json({ message: 'Usuário criado com sucesso', usuario })
    } catch (error) {
      res.status(400).json({ message: (error as Error).message })
    }
  },

  async login(req: Request, res: Response) {
    const { email, password } = req.body

    try {
      const tokens = await AuthService.login(email, password)
      res.status(200).json(tokens)
    } catch (error) {
      res.status(401).json({ message: (error as Error).message })
    }
  }
}
