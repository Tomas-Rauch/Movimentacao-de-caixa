import { supabase } from '../database/supabaseClient'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import crypto from 'crypto'
import { sendEmail } from '../utils/mailer'

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
  const dataSemSenha = data?.map(usuario => {
    const { senha, ...semSenha } = usuario
    return semSenha
  })


  return dataSemSenha
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

  static async forgotPassword(email: string) {
    const { data: usuario, error } = await supabase
      .from('usuarios')
      .select('*')
      .eq('email', email)
      .single()

    if (!usuario) return // Não revela se existe

    const token = crypto.randomBytes(32).toString('hex')
    const expiry = new Date(Date.now() + 1000 * 60 * 30) // 30 minutos

    await supabase
      .from('usuarios')
      .update({ reset_token: token, reset_token_expiracao: expiry.toISOString() })
      .eq('id', usuario.id)

   const link = `http://localhost:5173/reset-password?token=${token}`
    await sendEmail(
      usuario.email,
      'Recuperação de senha',
      `<p>Para redefinir sua senha, clique no link: <a href="${link}">${link}</a></p>`
    ) 


  }

  static async resetPassword(token: string, newPassword: string) {
    const { data: usuario, error } = await supabase
      .from('usuarios')
      .select('*')
      .eq('reset_token', token)
      .single()

    if (!usuario) throw new Error('Token inválido')

    const now = new Date()
    if (!usuario.reset_token_expiracao || new Date(usuario.reset_token_expiracao) < now)
      throw new Error('Token expirado')

    const hash = await bcrypt.hash(newPassword, 12)

    await supabase
      .from('usuarios')
      .update({
        senha: hash,
        reset_token: null,
        reset_token_expiracao: null,
      })
      .eq('id', usuario.id)
  }
}
