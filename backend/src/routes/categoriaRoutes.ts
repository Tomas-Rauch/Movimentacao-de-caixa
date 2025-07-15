import { Router } from 'express';
import { movimentacaoController } from '../controllers/movimentacaoController';
import { authenticate } from '../middlewares/authenticate';

const router = Router();


/**
 * @swagger
 * /categorias:
 *   get:
 *     summary: Lista todas as categorias disponíveis
 *     tags: [Categorias]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de categorias retornada com sucesso
 *       401:
 *         description: Token ausente ou inválido
 */
router.get('/', authenticate, movimentacaoController.listarCategorias);

export default router;
