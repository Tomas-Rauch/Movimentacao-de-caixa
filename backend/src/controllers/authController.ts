import { Request, Response } from 'express'
import { AuthService } from '../services/authService'
import jwt from 'jsonwebtoken'
import { supabase } from '../database/supabaseClient'

export const authController = {
  async registrar(req: Request, res: Response) {
    const { nome, email, password, role } = req.body

    try {
      const usuario = await AuthService.registrarUsuario(nome, email, password, role)
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
  },

  async refresh(req: Request, res: Response) {
    const refreshToken = req.body.refreshToken

    if (!refreshToken) return res.status(401).json({ message: 'Token ausente' })

    try {
      const decoded = jwt.verify(
        refreshToken,
        process.env.JWT_REFRESH_SECRET || 'refresh_default'
      ) as any

      const { data: usuario, error } = await supabase
        .from('usuarios')
        .select('id, email, perfil')
        .eq('id', decoded.id)
        .single()

      if (error || !usuario) {
        return res.status(403).json({ message: 'Erro ao encontrar usuário para refresh' })
      }

      const accessToken = jwt.sign(
        { id: usuario.id, email: usuario.email, role: usuario.perfil },
        process.env.JWT_ACCESS_SECRET || 'access_default',
        { expiresIn: '15m' }
      )

      res.status(200).json({ accessToken })
    } catch (error) {
      res.status(403).json({ message: 'Token inválido ou expirado' })
    }
  },

  async forgotPassword(req: Request, res: Response) {
    const { email } = req.body
    try {
      await AuthService.forgotPassword(email)
      res.status(200).json({ message: 'Se o email existir, um link foi enviado.' })
    } catch (error) {
      res.status(400).json({ message: (error as Error).message })
    }
  },

  async resetPassword(req: Request, res: Response) {
    const { token, newPassword } = req.body
    try {
      await AuthService.resetPassword(token, newPassword)
      res.status(200).json({ message: 'Senha redefinida com sucesso' })
    } catch (error) {
      res.status(400).json({ message: (error as Error).message })
    }
  },
}