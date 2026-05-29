import { badRequest } from '../utils/httpError.js'

// valida req.body contra um schema zod e troca o body pelo dado ja parseado
export function validate(schema) {
  return (req, _res, next) => {
    const result = schema.safeParse(req.body)
    if (!result.success) {
      const msg = result.error.issues.map((i) => i.message).join('; ')
      return next(badRequest(msg))
    }
    req.body = result.data
    next()
  }
}

// envolve um handler async pra que erros caiam no errorHandler
export function asyncHandler(fn) {
  return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)
}
