import { Router } from 'express';
import { movimentacaoController } from '../controllers/movimentacaoController';
import { authenticate } from '../middlewares/authenticate';

const router = Router();

function asyncHandler(fn: any) {
  return function (req: any, res: any, next: any) {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

// Todas as rotas exigem autenticação
router.get('/', authenticate, asyncHandler(movimentacaoController.listar));
router.post('/', authenticate, asyncHandler(movimentacaoController.criar));
router.put('/:id', authenticate, asyncHandler(movimentacaoController.atualizar));
router.delete('/:id', authenticate, asyncHandler(movimentacaoController.deletar));

export default router;