import { supabase } from '../database/supabaseClient'
import { Request, Response } from 'express'
import bcrypt from 'bcrypt';

// Criar usuário (apenas admins)
export const createUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { nome, email, senha, perfil } = req.body

    console.log('Dados recebidos:', req.body);

    if (!nome || !email || !senha || !perfil) {
      res.status(400).json({ message: 'Preencha todos os campos' })
      return
    }

    // Gerar hash da senha
    const senhaHash = await bcrypt.hash(senha, 10);

    const { data, error } = await supabase
      .from('usuarios')
      .insert([{ nome, email, senha: senhaHash, perfil }])

    if (error) {
      res.status(500).json({ message: error.message })
      return
    }

    res.status(201).json({ message: 'Usuário criado com sucesso', data })
  } catch (error) {
    res.status(500).json({ message: 'Erro ao criar usuário' })
  }
}

// Buscar todos os usuários
export const getAllUsers = async (_: Request, res: Response): Promise<void> => {
  try {
    const { data, error } = await supabase.from('usuarios').select('*')

    if (error) {
      res.status(500).json({ message: error.message })
      return
    }

    res.status(200).json(data)
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar usuários' })
  }
}

// Buscar usuário por ID (apenas admins)
export const getUserById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params
    const { data, error } = await supabase.from('usuarios').select('*').eq('id', id).single()

    if (error) {
      res.status(500).json({ message: error.message })
      return
    }
    if (!data) {
      res.status(404).json({ message: 'Usuário não encontrado' })
      return
    }

    res.status(200).json(data)
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar usuário' })
  }
}

// Atualizar usuário (apenas admins)
export const updateUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params
    const { nome, email, perfil } = req.body

    const { data, error } = await supabase
      .from('usuarios')
      .update({ nome, email, perfil })
      .eq('id', id)

    if (error) {
      res.status(500).json({ message: error.message })
      return
    }

    res.status(200).json({ message: 'Usuário atualizado', data })
  } catch (error) {
    res.status(500).json({ message: 'Erro ao atualizar usuário' })
  }
}

// Deletar usuário (apenas admins)
export const deleteUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params

    const { error } = await supabase.from('usuarios').delete().eq('id', id)

    if (error) {
      res.status(500).json({ message: error.message })
      return
    }

    res.status(200).json({ message: 'Usuário deletado' })
  } catch (error) {
    res.status(500).json({ message: 'Erro ao deletar usuário' })
  }
}

// Buscar perfil do usuário logado
export const getUserProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: 'Não autorizado' })
      return
    }

    const { id } = req.user
    const { data, error } = await supabase.from('usuarios').select('*').eq('id', id).single()

    if (error) {
      res.status(500).json({ message: error.message })
      return
    }
    if (!data) {
      res.status(404).json({ message: 'Usuário não encontrado' })
      return
    }

    res.status(200).json(data)
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar perfil' })
  }
}

// Atualizar perfil do usuário logado
export const updateUserProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: 'Não autorizado' })
      return
    } 

    const { id } = req.user
    const { nome, email } = req.body

    const { data, error } = await supabase
      .from('usuarios')
      .update({ nome, email })
      .eq('id', id)

    if (error) {
      res.status(500).json({ message: error.message })
      return
    }

    res.status(200).json({ message: 'Perfil atualizado', data })
  } catch (error) {
    res.status(500).json({ message: 'Erro ao atualizar perfil' })
  }
}
