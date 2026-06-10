import { Router } from 'express'
import { auth } from '../middleware/auth.js'
import { validate, asyncHandler } from '../middleware/validate.js'
import { itemUpdateSchema } from '../validators/carroValidators.js'
import {
  listarTipos,
  atualizarItem,
  listarHistorico,
} from '../controllers/manutencaoController.js'
import {
  listarCategorias,
  removerTransacao,
} from '../controllers/financeiroController.js'

const router = Router()

router.use(auth)

// lookups, atualizacao de item e exclusao de transacao
router.get('/tipos-item', asyncHandler(listarTipos))
router.get('/categorias', asyncHandler(listarCategorias))
router.put('/itens/:itemId', validate(itemUpdateSchema), asyncHandler(atualizarItem))
router.get('/itens/:itemId/historico', asyncHandler(listarHistorico))
router.delete('/transacoes/:id', asyncHandler(removerTransacao))

export default router
