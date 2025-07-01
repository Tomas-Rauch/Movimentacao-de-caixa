import { supabase } from '../database/supabaseClient'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET || 'access_default'
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'refresh_default'

export class AuthService {

  static async registrarUsuario(
  nome: string,
  email: string,
  senha: string,
  perfil: 'admin' | 'user' = 'user'
) {
  const { data: existente, error: erroBusca } = await supabase
    .from('usuarios')
    .select('*')
    .eq('email', email)
    .single()

  if (existente) throw new Error('Email já cadastrado')

  const { count } = await supabase
    .from('usuarios')
    .select('id', { count: 'exact', head: true })

  const hash = await bcrypt.hash(senha, 12)

  const { data, error } = await supabase.from('usuarios').insert([
    {
      nome,
      email,
      senha: hash,
      perfil: count === 0 ? 'admin' : perfil,
    },
  ])
  .select('*')

  if (error) {
    console.error('❌ Erro no insert:', error)
    throw new Error('Erro ao registrar usuário')
  }

  return data
}


  static async login(email: string, senha: string) {
    const { data: usuario, error } = await supabase
      .from('usuarios')
      .select('*')
      .eq('email', email)
      .single()

    if (!usuario || error) throw new Error('Credenciais inválidas')

    const senhaOk = await bcrypt.compare(senha, usuario.senha)
    if (!senhaOk) throw new Error('Credenciais inválidas')

    const accessToken = jwt.sign(
      { id: usuario.id, email: usuario.email, role: usuario.perfil },
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
