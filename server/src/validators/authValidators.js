import { z } from 'zod'

export const registerSchema = z.object({
  nome: z.string().trim().min(2, 'nome muito curto').max(120),
  email: z.string().trim().email('email invalido').max(160),
  senha: z.string().min(6, 'a senha precisa de ao menos 6 caracteres').max(72),
})

export const loginSchema = z.object({
  email: z.string().trim().email('email invalido'),
  senha: z.string().min(1, 'informe a senha'),
})

export const updatePerfilSchema = z.object({
  nome: z.string().trim().min(2, 'nome muito curto').max(120),
  email: z.string().trim().email('email invalido').max(160),
})

export const updateSenhaSchema = z.object({
  senhaAtual: z.string().min(1, 'informe a senha atual'),
  novaSenha: z.string().min(6, 'a nova senha precisa de ao menos 6 caracteres').max(72),
})

export const resetSenhaSchema = z.object({
  email: z.string().trim().email('email invalido'),
  novaSenha: z.string().min(6, 'a nova senha precisa de ao menos 6 caracteres').max(72),
})
