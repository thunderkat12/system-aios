
import { z } from 'zod';

// Enhanced user validation schemas with stronger security
export const userLoginSchema = z.object({
  email: z.string()
    .email('Email inválido')
    .min(1, 'Email é obrigatório')
    .max(254, 'Email muito longo')
    .toLowerCase()
    .trim(),
  senha: z.string()
    .min(8, 'Senha deve ter pelo menos 8 caracteres')
    .max(128, 'Senha muito longa')
});

export const userRegisterSchema = z.object({
  nome_completo: z.string()
    .min(2, 'Nome deve ter pelo menos 2 caracteres')
    .max(100, 'Nome muito longo')
    .trim()
    .refine(val => !/[<>]/.test(val), 'Nome contém caracteres inválidos'),
  email: z.string()
    .email('Email inválido')
    .max(254, 'Email muito longo')
    .toLowerCase()
    .trim(),
  senha: z.string()
    .min(12, 'Senha deve ter pelo menos 12 caracteres')
    .max(128, 'Senha muito longa')
    .refine(val => /[A-Z]/.test(val), 'Senha deve conter pelo menos uma letra maiúscula')
    .refine(val => /[a-z]/.test(val), 'Senha deve conter pelo menos uma letra minúscula')
    .refine(val => /[0-9]/.test(val), 'Senha deve conter pelo menos um número')
    .refine(val => /[!@#$%^&*(),.?":{}|<>]/.test(val), 'Senha deve conter pelo menos um caractere especial'),
  cargo: z.enum(['admin', 'tecnico', 'atendente'], { 
    required_error: 'Cargo é obrigatório',
    invalid_type_error: 'Cargo inválido' 
  })
});

// Enhanced client validation schema
export const clientSchema = z.object({
  nome: z.string()
    .min(2, 'Nome deve ter pelo menos 2 caracteres')
    .max(100, 'Nome muito longo')
    .trim()
    .refine(val => !/[<>]/.test(val), 'Nome contém caracteres inválidos'),
  telefone: z.string()
    .optional()
    .nullable()
    .refine(val => !val || /^[\d\s\-\(\)\+]+$/.test(val), 'Telefone contém caracteres inválidos'),
  email: z.string()
    .email('Email inválido')
    .max(254, 'Email muito longo')
    .optional()
    .nullable()
    .or(z.literal('')),
  endereco: z.string()
    .max(200, 'Endereço muito longo')
    .optional()
    .nullable()
    .refine(val => !val || !/[<>]/.test(val), 'Endereço contém caracteres inválidos')
});

// Enhanced service order validation schema
export const serviceOrderSchema = z.object({
  numero_os: z.string()
    .min(1, 'Número da OS é obrigatório')
    .max(50, 'Número da OS muito longo')
    .trim()
    .refine(val => !/[<>]/.test(val), 'Número da OS contém caracteres inválidos'),
  cliente_nome: z.string()
    .min(2, 'Nome do cliente é obrigatório')
    .max(100, 'Nome do cliente muito longo')
    .trim()
    .refine(val => !/[<>]/.test(val), 'Nome do cliente contém caracteres inválidos'),
  dispositivo: z.string()
    .min(1, 'Dispositivo é obrigatório')
    .max(100, 'Nome do dispositivo muito longo')
    .trim()
    .refine(val => !/[<>]/.test(val), 'Dispositivo contém caracteres inválidos'),
  tipo_reparo: z.string()
    .min(1, 'Tipo de reparo é obrigatório')
    .max(100, 'Tipo de reparo muito longo')
    .trim()
    .refine(val => !/[<>]/.test(val), 'Tipo de reparo contém caracteres inválidos'),
  tecnico_responsavel: z.string()
    .min(1, 'Técnico responsável é obrigatório')
    .max(100, 'Nome do técnico muito longo')
    .trim()
    .refine(val => !/[<>]/.test(val), 'Técnico responsável contém caracteres inválidos'),
  status: z.string().optional(),
  valor: z.number()
    .positive('Valor deve ser positivo')
    .max(999999.99, 'Valor muito alto')
    .optional(),
  observacoes: z.string()
    .max(500, 'Observações muito longas')
    .optional()
    .refine(val => !val || !/[<>]/.test(val), 'Observações contêm caracteres inválidos')
});

// Enhanced stock validation schema
export const stockSchema = z.object({
  nome: z.string()
    .min(1, 'Nome é obrigatório')
    .max(100, 'Nome muito longo')
    .trim()
    .refine(val => !/[<>]/.test(val), 'Nome contém caracteres inválidos'),
  categoria: z.string()
    .max(50, 'Categoria muito longa')
    .optional()
    .refine(val => !val || !/[<>]/.test(val), 'Categoria contém caracteres inválidos'),
  marca: z.string()
    .max(50, 'Marca muito longa')
    .optional()
    .refine(val => !val || !/[<>]/.test(val), 'Marca contém caracteres inválidos'),
  quantidade: z.number()
    .int('Quantidade deve ser um número inteiro')
    .min(0, 'Quantidade deve ser positiva')
    .max(999999, 'Quantidade muito alta'),
  estoque_minimo: z.number()
    .int('Estoque mínimo deve ser um número inteiro')
    .min(0, 'Estoque mínimo deve ser positivo')
    .max(999999, 'Estoque mínimo muito alto')
    .optional(),
  valor_unitario: z.number()
    .positive('Valor deve ser positivo')
    .max(999999.99, 'Valor muito alto')
    .optional()
});

export type UserLoginData = z.infer<typeof userLoginSchema>;
export type UserRegisterData = z.infer<typeof userRegisterSchema>;
export type ClientData = z.infer<typeof clientSchema>;
export type ServiceOrderData = z.infer<typeof serviceOrderSchema>;
export type StockData = z.infer<typeof stockSchema>;
