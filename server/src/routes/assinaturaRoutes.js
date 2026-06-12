import { Router } from 'express'
import { auth } from '../middleware/auth.js'
import { validate, asyncHandler } from '../middleware/validate.js'
import { assinarSchema } from '../validators/assinaturaValidators.js'
import { obter, assinar, cancelar } from '../controllers/assinaturaController.js'

const router = Router()

router.use(auth)
router.get('/', asyncHandler(obter))
router.post('/', validate(assinarSchema), asyncHandler(assinar))
router.delete('/', asyncHandler(cancelar))

export default router
