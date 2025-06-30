import { supabase } from '../database/supabaseClient'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET || 'access_default'
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'refresh_default'

export class AuthService {
  static async registrarUsuario(email: string, senha: string, role?: 'admin' | 'user') {
    // Verifica se já existe usuário com o email
    const { data: existe, error: errorExiste } = await supabase
      .from('users')
      .select('id')
      .eq('email', email)
      .single();

    if (errorExiste && errorExiste.code !== 'PGRST116') throw new Error('Erro ao buscar usuário');
    if (existe) throw new Error('Email já cadastrado');

    // Conta quantos usuários existem para definir o primeiro como admin
    const { count: totalUsuarios, error: errorCount } = await supabase
      .from('users')
      .select('id', { count: 'exact', head: true });

    if (errorCount) throw new Error('Erro ao contar usuários');

    const senhaHash = await bcrypt.hash(senha, 12);

    const { data: novoUsuario, error: errorInsert } = await supabase
      .from('users')
      .insert([{
        email,
        password: senhaHash,
        role: (totalUsuarios === 0) ? 'admin' : (role || 'user'),
      }])
      .select()
      .single();

    if (errorInsert) throw new Error('Erro ao criar usuário');

    return novoUsuario;
  }

  static async login(email: string, senha: string) {
    const { data: usuario, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    if (error) throw new Error('Erro ao buscar usuário');
    if (!usuario) throw new Error('Credenciais inválidas');

    const senhaCorreta = await bcrypt.compare(senha, usuario.password);
    if (!senhaCorreta) throw new Error('Credenciais inválidas');

    const accessToken = jwt.sign(
      { id: usuario.id, email: usuario.email, role: usuario.role },
      JWT_ACCESS_SECRET,
      { expiresIn: '15m' }
    );

    const refreshToken = jwt.sign(
      { id: usuario.id },
      JWT_REFRESH_SECRET,
      { expiresIn: '7d' }
    );

    return { accessToken, refreshToken };
  }
}