
import { z } from 'zod';

// User validation schemas
export const userLoginSchema = z.object({
  email: z.string().email('Email inválido').min(1, 'Email é obrigatório'),
  senha: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres')
});

export const userRegisterSchema = z.object({
  nome_completo: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres').max(100, 'Nome muito longo'),
  email: z.string().email('Email inválido'),
  senha: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres').max(50, 'Senha muito longa'),
  cargo: z.enum(['admin', 'tecnico', 'atendente'], { required_error: 'Cargo é obrigatório' })
});

// Client validation schema
export const clientSchema = z.object({
  nome: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres').max(100, 'Nome muito longo'),
  telefone: z.string().optional().nullable(),
  email: z.string().email('Email inválido').optional().nullable().or(z.literal('')),
  endereco: z.string().max(200, 'Endereço muito longo').optional().nullable()
});

// Service order validation schema
export const serviceOrderSchema = z.object({
  numero_os: z.string().min(1, 'Número da OS é obrigatório'),
  cliente_nome: z.string().min(2, 'Nome do cliente é obrigatório'),
  dispositivo: z.string().min(1, 'Dispositivo é obrigatório'),
  tipo_reparo: z.string().min(1, 'Tipo de reparo é obrigatório'),
  tecnico_responsavel: z.string().min(1, 'Técnico responsável é obrigatório'),
  status: z.string().optional(),
  valor: z.number().positive('Valor deve ser positivo').optional(),
  observacoes: z.string().max(500, 'Observações muito longas').optional()
});

// Stock validation schema
export const stockSchema = z.object({
  nome: z.string().min(1, 'Nome é obrigatório').max(100, 'Nome muito longo'),
  categoria: z.string().max(50, 'Categoria muito longa').optional(),
  marca: z.string().max(50, 'Marca muito longa').optional(),
  quantidade: z.number().int().min(0, 'Quantidade deve ser positiva'),
  estoque_minimo: z.number().int().min(0, 'Estoque mínimo deve ser positivo').optional(),
  valor_unitario: z.number().positive('Valor deve ser positivo').optional()
});

export type UserLoginData = z.infer<typeof userLoginSchema>;
export type UserRegisterData = z.infer<typeof userRegisterSchema>;
export type ClientData = z.infer<typeof clientSchema>;
export type ServiceOrderData = z.infer<typeof serviceOrderSchema>;
export type StockData = z.infer<typeof stockSchema>;
