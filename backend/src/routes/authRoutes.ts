import { Router } from 'express'
import { authController } from '../controllers/authController'

const router = Router()

// Helper para tratar funções async no Express 5
function asyncHandler(fn: any) {
  return function (req: any, res: any, next: any) {
    Promise.resolve(fn(req, res, next)).catch(next)
  }
}

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Registra um novo usuário
 *     tags: [Autenticação]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: candido@exemplo.com
 *               password:
 *                 type: string
 *                 example: senhaSegura123
 *               role:
 *                 type: string
 *                 example: user
 *     responses:
 *       201:
 *         description: Usuário criado com sucesso
 *       400:
 *         description: Email já cadastrado ou dados inválidos
 */
router.post('/register', asyncHandler(authController.registrar))

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Autentica um usuário
 *     tags: [Autenticação]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: candido@exemplo.com
 *               password:
 *                 type: string
 *                 example: senhaSegura123
 *     responses:
 *       200:
 *         description: Login bem-sucedido com tokens JWT
 *       401:
 *         description: Credenciais inválidas
 */
router.post('/login', asyncHandler(authController.login))

/**
 * @swagger
 * /auth/refresh:
 *   post:
 *     summary: Gera um novo access token usando um refresh token
 *     tags: [Autenticação]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               refreshToken:
 *                 type: string
 *                 example: seu_refresh_token
 *     responses:
 *       200:
 *         description: Novo access token gerado
 *       401:
 *         description: Token ausente
 *       403:
 *         description: Token inválido ou expirado
 */
router.post('/refresh', asyncHandler(authController.refresh))

/**
 * @swagger
 * /auth/forgot-password:
 *   post:
 *     summary: Inicia recuperação de senha por email
 *     tags: [Autenticação]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: candido@exemplo.com
 *     responses:
 *       200:
 *         description: Email enviado se usuário existir
 */
router.post('/forgot-password', asyncHandler(authController.forgotPassword))

/**
 * @swagger
 * /auth/reset-password:
 *   post:
 *     summary: Finaliza recuperação de senha com token
 *     tags: [Autenticação]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               token:
 *                 type: string
 *                 example: token_recebido_no_email
 *               newPassword:
 *                 type: string
 *                 example: novaSenha123
 *     responses:
 *       200:
 *         description: Senha redefinida com sucesso
 *       400:
 *         description: Token inválido ou expirado
 */
router.post('/reset-password', asyncHandler(authController.resetPassword))

export default router