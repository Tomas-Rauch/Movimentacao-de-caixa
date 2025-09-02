import { Request, Response } from 'express';
import { MovimentacaoService } from '../services/movimentacaoService';

// Adiciona a tipagem correta para req.user
declare global {
  namespace Express {
    interface User {
      id: number;
      role?: string;
    }
    interface Request {
      user?: User;
    }
  }
}

export const movimentacaoController = {
  async listar(req: Request, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ message: 'Usuário não autenticado' });
      }

      const movimentacoes = await MovimentacaoService.listarMovimentacoes();
      res.json(movimentacoes);
    } catch (error) {
      res.status(400).json({ message: (error as Error).message });
    }
  },

  async criar(req: Request, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ message: 'Usuário não autenticado' });
      }

      const id_usuario = req.user.id;
      const { categoria, ...rest } = req.body;
      const mov = { ...rest, id_categoria: categoria, id_usuario };
      const novaMov = await MovimentacaoService.criarMovimentacao(mov);
      res.status(201).json(novaMov);
    } catch (error) {
      res.status(400).json({ message: (error as Error).message });
    }
  },

  async atualizar(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      const mov = req.body;
      const movAtualizada = await MovimentacaoService.atualizarMovimentacao(id, mov);
      res.json(movAtualizada);
    } catch (error) {
      res.status(400).json({ message: (error as Error).message });
    }
  },

  async deletar(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      await MovimentacaoService.deletarMovimentacao(id);
      res.status(204).send();
    } catch (error) {
      res.status(400).json({ message: (error as Error).message });
    }
  },

  async listarCategorias(req: Request, res: Response) {
    try {
      const categorias = await MovimentacaoService.listarCategorias();
      res.json(categorias);
    } catch (error) {
      res.status(400).json({ message: (error as Error).message });
    }
  }
};