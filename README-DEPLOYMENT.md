
# 📋 Guia de Deploy - Hi-Tech Sistema OS

## 🚀 Como executar o projeto

### 1. Execução Local (Desenvolvimento)
```bash
# Instalar dependências
npm install

# Executar em modo desenvolvimento
npm run dev

# Acessar: http://localhost:8080
```

### 2. Build para Web (Produção)
```bash
# Fazer build do projeto
npm run build

# Fazer deploy na Vercel
npm install -g vercel
vercel

# Ou fazer deploy no Render/Netlify
# Apenas faça upload da pasta 'dist' gerada
```

### 3. Aplicativo Windows (Electron)
```bash
# Instalar Electron (primeira vez)
npm install electron electron-builder --save-dev

# Copiar configuração do Electron
cp package-electron.json package.json

# Executar como aplicativo
npm run electron-dev

# Gerar instalador Windows (.exe)
npm run build-windows
```

## 🔧 Configurações Necessárias

### Variáveis de Ambiente (.env)
```env
VITE_SUPABASE_URL=https://bgbvmepolawsdbssdpmp.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Webhook Dashboard
- URL: `https://n8n.grapeassist.com/webhook/dash_diario`
- Método: POST
- Dados enviados: Estatísticas completas do dashboard

## 📊 Estrutura do Banco de Dados (Supabase)

### Tabelas Principais:

#### 🏢 clientes
- `id` (uuid, PK)
- `nome` (text, NOT NULL)
- `telefone` (text)
- `email` (text)
- `endereco` (text)
- `ativo` (boolean, DEFAULT true)
- `created_at` (timestamp)
- `updated_at` (timestamp)

#### 🔧 ordens_servico
- `id` (uuid, PK)
- `numero_os` (text, UNIQUE)
- `cliente_id` (uuid, FK → clientes)
- `cliente_nome` (text, NOT NULL)
- `dispositivo` (text, NOT NULL)
- `tipo_reparo` (text, NOT NULL)
- `tecnico_responsavel` (text, NOT NULL)
- `status` (text, DEFAULT 'Em Andamento')
- `valor` (decimal)
- `observacoes` (text)
- `created_at` (timestamp)
- `updated_at` (timestamp)
- `finalizada_em` (timestamp)

#### 📦 estoque
- `id` (uuid, PK)
- `nome` (text, NOT NULL)
- `categoria` (text)
- `marca` (text)
- `quantidade` (integer, DEFAULT 0)
- `valor_unitario` (decimal)
- `valor_total` (decimal, GENERATED)
- `estoque_minimo` (integer, DEFAULT 5)
- `created_at` (timestamp)
- `updated_at` (timestamp)

#### 👨‍🔧 tecnicos
- `id` (uuid, PK)
- `nome` (text, NOT NULL)
- `email` (text)
- `telefone` (text)
- `ativo` (boolean, DEFAULT true)
- `created_at` (timestamp)

#### 📝 atividades
- `id` (uuid, PK)
- `tipo` (text, NOT NULL)
- `descricao` (text, NOT NULL)
- `referencia_id` (uuid)
- `created_at` (timestamp)

## ✅ Status das Funcionalidades

### ✅ Funcionando
- [x] Login simples (admin/admin123)
- [x] Dashboard com estatísticas em tempo real
- [x] Envio de webhook com dados completos
- [x] CRUD completo de clientes
- [x] CRUD completo de ordens de serviço
- [x] CRUD completo de estoque
- [x] Integração total com Supabase
- [x] Layout responsivo
- [x] Execução local

### 🔧 Para Deploy Web
- [x] Build otimizado para produção
- [x] Configuração para Vercel/Netlify
- [x] URLs de produção do Supabase

### 🪟 Para Aplicativo Windows
- [x] Configuração do Electron
- [x] Script de build automatizado
- [x] Geração de instalador .exe
- [x] Ícone e configurações do app

## 🎯 Próximos Passos
1. Testar deploy em ambiente de produção
2. Validar instalador Windows
3. Configurar backup automático do Supabase
4. Adicionar notificações push (opcional)
