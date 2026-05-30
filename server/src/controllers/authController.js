import bcrypt from 'bcryptjs'
import { query } from '../config/db.js'
import { signToken } from '../utils/jwt.js'
import { badRequest, conflict, unauthorized, notFound } from '../utils/httpError.js'

// monta o objeto de usuario sem expor o hash da senha
function publicUser(row) {
  return { id: row.id, nome: row.nome, email: row.email }
}

// POST /api/auth/register
export async function register(req, res) {
  const { nome, email, senha } = req.body

  const existe = await query('SELECT id FROM usuarios WHERE email = ?', [email])
  if (existe.length) throw conflict('ja existe uma conta com esse email')

  const senhaHash = await bcrypt.hash(senha, 10)
  const result = await query(
    'INSERT INTO usuarios (nome, email, senha_hash) VALUES (?, ?, ?)',
    [nome, email, senhaHash]
  )

  const usuario = { id: result.insertId, nome, email }
  const token = signToken(usuario.id)
  res.status(201).json({ token, usuario })
}

// POST /api/auth/login
export async function login(req, res) {
  const { email, senha } = req.body

  const rows = await query(
    'SELECT id, nome, email, senha_hash FROM usuarios WHERE email = ?',
    [email]
  )
  if (!rows.length) throw unauthorized('email ou senha invalidos')

  const ok = await bcrypt.compare(senha, rows[0].senha_hash)
  if (!ok) throw unauthorized('email ou senha invalidos')

  const token = signToken(rows[0].id)
  res.json({ token, usuario: publicUser(rows[0]) })
}

// GET /api/auth/me
export async function me(req, res) {
  const rows = await query('SELECT id, nome, email FROM usuarios WHERE id = ?', [
    req.userId,
  ])
  if (!rows.length) throw notFound('usuario nao encontrado')
  res.json(publicUser(rows[0]))
}

// PUT /api/usuario
export async function updatePerfil(req, res) {
  const { nome, email } = req.body

  const emailEmUso = await query(
    'SELECT id FROM usuarios WHERE email = ? AND id <> ?',
    [email, req.userId]
  )
  if (emailEmUso.length) throw conflict('email ja usado por outra conta')

  await query('UPDATE usuarios SET nome = ?, email = ? WHERE id = ?', [
    nome,
    email,
    req.userId,
  ])
  res.json({ id: req.userId, nome, email })
}

// POST /api/auth/reset-senha
// versao simplificada para o trabalho: redefine a senha direto pelo email,
// sem envio de codigo por email (nao temos servico de email configurado)
export async function resetSenha(req, res) {
  const { email, novaSenha } = req.body

  const rows = await query('SELECT id FROM usuarios WHERE email = ?', [email])
  if (!rows.length) throw notFound('nao encontramos uma conta com esse email')

  const novoHash = await bcrypt.hash(novaSenha, 10)
  await query('UPDATE usuarios SET senha_hash = ? WHERE id = ?', [novoHash, rows[0].id])
  res.json({ ok: true })
}

// PUT /api/usuario/senha
export async function updateSenha(req, res) {
  const { senhaAtual, novaSenha } = req.body

  const rows = await query('SELECT senha_hash FROM usuarios WHERE id = ?', [req.userId])
  if (!rows.length) throw notFound('usuario nao encontrado')

  const ok = await bcrypt.compare(senhaAtual, rows[0].senha_hash)
  if (!ok) throw badRequest('senha atual incorreta')

  const novoHash = await bcrypt.hash(novaSenha, 10)
  await query('UPDATE usuarios SET senha_hash = ? WHERE id = ?', [novoHash, req.userId])
  res.json({ ok: true })
}
