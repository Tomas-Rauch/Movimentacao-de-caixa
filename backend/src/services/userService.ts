// src/services/userService.ts
import { supabase } from '../database/supabaseClient';
import bcrypt from 'bcrypt';

export class UserService {
  static async getUserById(id: number) {
    const { data, error } = await supabase
      .from('usuarios')
      .select('id, nome, email, role, avatar_url')
      .eq('id', id)
      .single();

    if (error) throw new Error(error.message);
    return data;
  }

  static async updateUser(id: number, nome: string, email: string, avatar_url?: string) {
    const { data, error } = await supabase
      .from('usuarios')
      .update({ nome, email, avatar_url })
      .eq('id', id)
      .select('id, nome, email, role, avatar_url')
      .single();

    if (error) throw new Error(error.message);
    return data;
  }

  static async changePassword(id: number, oldPassword: string, newPassword: string) {
    const { data: user, error: userError } = await supabase
      .from('usuarios')
      .select('password')
      .eq('id', id)
      .single();

    if (userError) throw new Error(userError.message);
    if (!user) throw new Error('Usuário não encontrado');

    const isPasswordValid = await bcrypt.compare(oldPassword, user.password);
    if (!isPasswordValid) throw new Error('Senha atual incorreta');

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    const { error } = await supabase
      .from('usuarios')
      .update({ password: hashedPassword })
      .eq('id', id);

    if (error) throw new Error(error.message);
    return true;
  }

  static async createUser(nome: string, email: string, password: string, role: 'admin' | 'user') {
    const hashedPassword = await bcrypt.hash(password, 10);

    const { data, error } = await supabase
      .from('usuarios')
      .insert([{ nome, email, password: hashedPassword, role }])
      .select('id, nome, email, role')
      .single();

    if (error) throw new Error(error.message);
    return data;
  }
}
