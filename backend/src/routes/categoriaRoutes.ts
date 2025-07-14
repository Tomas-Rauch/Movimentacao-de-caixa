import { Router } from 'express';
import { movimentacaoController } from '../controllers/movimentacaoController';
import { authenticate } from '../middlewares/authenticate';

const router = Router();

router.get('/', authenticate, movimentacaoController.listarCategorias);

export default router;
