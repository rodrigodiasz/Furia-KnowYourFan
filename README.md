# Furia Know Your Fan

Um aplicativo web moderno para engajamento e gerenciamento de fãs, construído com Next.js e NestJS.

## 🚀 Visão Geral

Furia Know Your Fan é uma aplicação full-stack projetada para melhorar o engajamento e gerenciamento de fãs. O aplicativo possui um frontend moderno construído com Next.js e um backend robusto alimentado por NestJS.

## 🛠️ Tecnologias Utilizadas

### Frontend (`furia-frontend/`)

- **Framework**: Next.js 15
- **Bibliotecas de UI**:
  - Material-UI (MUI)
  - Radix UI
  - Tailwind CSS
- **Gerenciamento de Estado**: React Hooks
- **Formulários**: React Hook Form com validação Zod
- **Autenticação**: NextAuth.js
- **Estilização**: Tailwind CSS com animações personalizadas
- **TypeScript**: Para segurança de tipos

### Backend (`furia-backend/`)

- **Framework**: NestJS
- **Banco de Dados**: Prisma ORM
- **Autenticação**: JWT com Passport
- **Processamento de Arquivos**: Capacidades de processamento de PDF
- **OCR**: Integração com Tesseract.js
- **Testes**: Jest para testes unitários e e2e
- **TypeScript**: Para segurança de tipos

## 📁 Estrutura do Projeto

```
.
├── furia-frontend/          # Aplicação Next.js frontend
│   ├── src/
│   │   ├── app/            # Páginas do roteador Next.js
│   │   ├── components/     # Componentes UI reutilizáveis
│   │   ├── lib/           # Funções utilitárias
│   │   ├── services/      # Serviços de API
│   │   └── types/         # Definições de tipos TypeScript
│   └── public/            # Arquivos estáticos
│
└── furia-backend/         # Aplicação NestJS backend
    ├── src/
    │   ├── app/          # Módulo principal da aplicação
    │   ├── document/     # Módulo de processamento de documentos
    │   ├── esports/      # Funcionalidades relacionadas a esports
    │   ├── points/       # Sistema de pontos
    │   ├── services/     # Serviços de lógica de negócios
    │   └── users/        # Gerenciamento de usuários
    └── prisma/          # Schema do banco de dados e migrações
```

## 🚀 Começando

### Clonando o Repositório

```bash
git clone https://github.com/rodrigodiasz/Furia-KnowYourFan.git
cd Furia-KnowYourFan
```

### Pré-requisitos

- Node.js (v18 ou superior)
- npm ou yarn
- PostgreSQL (para o backend)

### Configuração do Frontend

```bash
cd furia-frontend
npm install
npm run dev
```

### Configuração do Backend

```bash
cd furia-backend
npm install
npm run start
```

## 🔧 Variáveis de Ambiente

### Frontend (`.env.local`)

```env
# URL da API
NEXT_PUBLIC_API_URL=http://localhost:3001

# URLs de Redirecionamento
NEXT_PUBLIC_REDI_URL=http://localhost:3000

# IDs de Cliente para Autenticação Social
NEXT_PUBLIC_TWITCH_CLIENT_ID=seu_twitch_client_id
NEXT_PUBLIC_DISCORD_CLIENT_ID=seu_discord_client_id
NEXT_PUBLIC_TWITTER_CLIENT_ID=seu_twitter_client_id
NEXT_PUBLIC_INSTAGRAM_CLIENT_ID=seu_instagram_client_id
NEXT_PUBLIC_FACEBOOK_CLIENT_ID=seu_facebook_client_id
```

### Backend (`.env`)

```env
# Configurações da API
API_URL=http://localhost:3001

# Configurações do Banco de Dados
DATABASE_URL="postgresql://usuario:senha@localhost:5432/furia_knowyourfan?schema=public"

# Configurações JWT
JWT_SECRET=sua_chave_secreta_jwt
JWT_EXPIRES_IN=7d

# IDs e Segredos para Autenticação Social
TWITCH_CLIENT_ID=seu_twitch_client_id
TWITTER_CLIENT_ID=seu_twitter_client_id
FACEBOOK_CLIENT_SECRET=seu_facebook_client_secret
INSTAGRAM_CLIENT_ID=seu_instagram_client_id
DISCORD_CLIENT_SECRET=seu_discord_client_secret

# OpenAI
OPENAI_API_KEY=sua_chave_api_openai
```

Tanto o frontend quanto o backend requerem variáveis de ambiente configuradas.

## 📝 Funcionalidades

- Autenticação e autorização de usuários
- Processamento de documentos e capacidades OCR
- Sistema de pontos para engajamento de fãs
- Funcionalidades relacionadas a esports
- Interface moderna e responsiva
- Desenvolvimento com segurança de tipos usando TypeScript
