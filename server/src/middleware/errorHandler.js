// tratamento central: qualquer erro chega aqui e vira uma resposta JSON
export function errorHandler(err, _req, res, _next) {
  const status = err.status || 500

  if (status === 500) {
    console.error('[erro]', err)
  }

  res.status(status).json({
    erro: status === 500 ? 'erro interno do servidor' : err.message,
  })
}

// rota nao encontrada
export function notFoundHandler(_req, res) {
  res.status(404).json({ erro: 'rota nao encontrada' })
}
