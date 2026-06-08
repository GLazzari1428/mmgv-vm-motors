import { Router } from 'express'
import { auth } from '../middleware/auth.js'
import { validate, asyncHandler } from '../middleware/validate.js'
import { carroSchema, itemSchema, transacaoSchema } from '../validators/carroValidators.js'
import { listar, obter, criar, atualizar, remover } from '../controllers/carrosController.js'
import { listarItens, criarItem } from '../controllers/manutencaoController.js'
import { resumo, historico, criarTransacao } from '../controllers/financeiroController.js'

const router = Router()

router.use(auth)

// CRUD de carros
router.get('/', asyncHandler(listar))
router.post('/', validate(carroSchema), asyncHandler(criar))
router.get('/:id', asyncHandler(obter))
router.put('/:id', validate(carroSchema), asyncHandler(atualizar))
router.delete('/:id', asyncHandler(remover))

// manutencao do carro
router.get('/:id/itens', asyncHandler(listarItens))
router.post('/:id/itens', validate(itemSchema), asyncHandler(criarItem))

// financeiro do carro
router.get('/:id/financeiro', asyncHandler(resumo))
router.get('/:id/financeiro/historico', asyncHandler(historico))
router.post('/:id/transacoes', validate(transacaoSchema), asyncHandler(criarTransacao))

export default router
