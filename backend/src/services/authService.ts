import { AppDataSource } from '../database/data-source'
import { User } from '../models/user'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

const userRepo = AppDataSource.getRepository(User)

const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET || 'access_default'
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'refresh_default'

export class AuthService {
  static async registrarUsuario(email: string, senha: string, role?: 'admin' | 'user') {
    const existe = await userRepo.findOneBy({ email })
    if (existe) throw new Error('Email já cadastrado')

    const totalUsuarios = await userRepo.count()
    const senhaHash = await bcrypt.hash(senha, 12)

    const novoUsuario = userRepo.create({
      email,
      password: senhaHash,
      role: totalUsuarios === 0 ? 'admin' : role || 'user',
    })

    return await userRepo.save(novoUsuario)
  }

  static async login(email: string, senha: string) {
    const usuario = await userRepo.findOneBy({ email })
    if (!usuario) throw new Error('Credenciais inválidas')

    const senhaCorreta = await bcrypt.compare(senha, usuario.password)
    if (!senhaCorreta) throw new Error('Credenciais inválidas')

    const accessToken = jwt.sign(
      { id: usuario.id, email: usuario.email, role: usuario.role },
      JWT_ACCESS_SECRET,
      { expiresIn: '15m' }
    )

    const refreshToken = jwt.sign(
      { id: usuario.id },
      JWT_REFRESH_SECRET,
      { expiresIn: '7d' }
    )

    return { accessToken, refreshToken }
  }
}
