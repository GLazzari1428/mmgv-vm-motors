import { z } from 'zod'

export const assinarSchema = z.object({
  ciclo: z.enum(['mensal', 'anual']),
})
