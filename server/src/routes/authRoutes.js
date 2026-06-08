import { Router } from 'express'
import { register, login, me, resetSenha } from '../controllers/authController.js'
import { auth } from '../middleware/auth.js'
import { validate, asyncHandler } from '../middleware/validate.js'
import {
  registerSchema,
  loginSchema,
  resetSenhaSchema,
} from '../validators/authValidators.js'

const router = Router()

router.post('/register', validate(registerSchema), asyncHandler(register))
router.post('/login', validate(loginSchema), asyncHandler(login))
router.post('/reset-senha', validate(resetSenhaSchema), asyncHandler(resetSenha))
router.get('/me', auth, asyncHandler(me))

export default router
