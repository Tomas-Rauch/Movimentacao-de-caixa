import { Router } from 'express';
import { movimentacaoController } from '../controllers/movimentacaoController';
import { authenticate } from '../middlewares/authenticate';

const router = Router();

function asyncHandler(fn: any) {
  return function (req: any, res: any, next: any) {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

/**
 * @swagger
 * /movimentacoes:
 *   get:
 *     summary: Lista todas as movimentações financeiras do usuário autenticado
 *     tags: [Movimentações]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de movimentações
 *       401:
 *         description: Token ausente ou inválido
 */
router.get('/', authenticate, asyncHandler(movimentacaoController.listar));

/**
 * @swagger
 * /movimentacoes:
 *   post:
 *     summary: Cria uma nova movimentação
 *     tags: [Movimentações]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               valor:
 *                 type: number
 *               descricao:
 *                 type: string
 *               categoria:
 *                 type: string
 *               data:
 *                 type: string
 *                 format: date
 *               tipo:
 *                 type: string
 *                 enum: [entrada, saida]
 *     responses:
 *       201:
 *         description: Movimentação criada com sucesso
 *       400:
 *         description: Dados inválidos
 */
router.post('/', authenticate, asyncHandler(movimentacaoController.criar));

/**
 * @swagger
 * /movimentacoes/{id}:
 *   put:
 *     summary: Atualiza uma movimentação existente
 *     tags: [Movimentações]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID da movimentação
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               valor:
 *                 type: number
 *               descricao:
 *                 type: string
 *               categoria:
 *                 type: string
 *               data:
 *                 type: string
 *                 format: date
 *               tipo:
 *                 type: string
 *                 enum: [entrada, saida]
 *     responses:
 *       200:
 *         description: Movimentação atualizada com sucesso
 *       404:
 *         description: Movimentação não encontrada
 */
router.put('/:id', authenticate, asyncHandler(movimentacaoController.atualizar));

/**
 * @swagger
 * /movimentacoes/{id}:
 *   delete:
 *     summary: Deleta uma movimentação
 *     tags: [Movimentações]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID da movimentação a ser removida
 *     responses:
 *       200:
 *         description: Movimentação removida com sucesso
 *       404:
 *         description: Movimentação não encontrada
 */
router.delete('/:id', authenticate, asyncHandler(movimentacaoController.deletar));

export default router;
