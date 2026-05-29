// erro com status http, capturado pelo errorHandler central
export class HttpError extends Error {
  constructor(status, message) {
    super(message)
    this.status = status
  }
}

export const badRequest = (msg) => new HttpError(400, msg)
export const unauthorized = (msg = 'nao autorizado') => new HttpError(401, msg)
export const notFound = (msg = 'nao encontrado') => new HttpError(404, msg)
export const conflict = (msg) => new HttpError(409, msg)
