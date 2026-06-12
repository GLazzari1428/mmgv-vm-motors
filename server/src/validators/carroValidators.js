import { z } from 'zod'

export const carroSchema = z.object({
  modelo: z.string().trim().min(1, 'informe o modelo').max(80),
  placa: z.string().trim().min(1, 'informe a placa').max(10),
  ano: z.coerce.number().int().min(1900).max(2100).optional().nullable(),
  cor: z.string().trim().max(40).optional().nullable(),
  proximaRevisao: z.string().trim().optional().nullable(),
  foto: z.string().max(2_000_000, 'imagem muito grande').nullable().optional(),
})

export const itemSchema = z.object({
  tipo: z.string().trim().min(1, 'informe o tipo do item'),
  ultimaTroca: z.string().trim().optional().nullable(),
  proximaTroca: z.string().trim().optional().nullable(),
  km: z.coerce.number().int().min(0).optional().nullable(),
})

export const itemUpdateSchema = z.object({
  ultimaTroca: z.string().trim().optional().nullable(),
  proximaTroca: z.string().trim().optional().nullable(),
  km: z.coerce.number().int().min(0).optional().nullable(),
})

export const transacaoSchema = z.object({
  categoria: z.string().trim().min(1, 'informe a categoria'),
  descricao: z.string().trim().min(1, 'informe a descricao').max(160),
  data: z.string().trim().min(1, 'informe a data'),
  valor: z.coerce.number().min(0, 'valor invalido'),
})
