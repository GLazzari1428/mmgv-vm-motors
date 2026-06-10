import { Router } from 'express'
import { updatePerfil, updateSenha } from '../controllers/authController.js'
import { auth } from '../middleware/auth.js'
import { validate, asyncHandler } from '../middleware/validate.js'
import { updatePerfilSchema, updateSenhaSchema } from '../validators/authValidators.js'

const router = Router()

router.use(auth)
router.put('/', validate(updatePerfilSchema), asyncHandler(updatePerfil))
router.put('/senha', validate(updateSenhaSchema), asyncHandler(updateSenha))

export default router
