import express from 'express'
import { authenticate } from '../middlewares/authenticate'
import { authorize } from '../middlewares/authorize'
import {
  getUserProfile,
  updateUserProfile,
  getAllUsers,
  createUser,
  getUserById,
  updateUser,
  deleteUser,
} from '../controllers/userController'

const router = express.Router()

// Rotas de Perfil do usuário logado
router.get('/profile', authenticate, getUserProfile)
router.put('/profile', authenticate, updateUserProfile)

// Rotas de Admin para gerenciar usuários
router.get('/', authenticate, authorize('admin'), getAllUsers)
router.post('/', authenticate, authorize('admin'), createUser)
router.get('/:id', authenticate, authorize('admin'), getUserById)
router.put('/:id', authenticate, authorize('admin'), updateUser)
router.delete('/:id', authenticate, authorize('admin'), deleteUser)

export default router
