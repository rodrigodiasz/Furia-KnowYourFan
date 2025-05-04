
# Furia Know Your Fan 🐾

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
│   │   ├── lib/            # Funções utilitárias
│   │   ├── services/       # Serviços de API
│   │   └── types/          # Definições de tipos TypeScript
│   └── public/             # Arquivos estáticos
│
└── furia-backend/          # Aplicação NestJS backend
    ├── src/
    │   ├── app/            # Módulo principal da aplicação
    │   ├── document/       # Módulo de processamento de documentos
    │   ├── esports/        # Funcionalidades relacionadas a esports
    │   ├── points/         # Sistema de pontos
    │   ├── services/       # Serviços de lógica de negócios
    │   └── users/          # Gerenciamento de usuários
    └── prisma/             # Schema do banco de dados e migrações
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

## 🧬 Gerando o Cliente Prisma

Após instalar as dependências do backend, **é essencial** gerar o cliente Prisma para que a aplicação NestJS possa interagir corretamente com o banco de dados:

```bash
npx prisma generate
```


---

## 🔐 Configurando Autenticação Social

Para permitir que os usuários se autentiquem via redes sociais, é necessário registrar sua aplicação em cada provedor e configurar corretamente a URL de callback:

### 🔁 URL de Callback Padrão

Use a seguinte URL de redirecionamento (callback) para todos os provedores:

```
https://seu-link/auth/callback?provider=nomedaprovedora
```

Substitua `nomedaprovedora` por: `discord`, `twitch`, `twitter`, `instagram`, ou `facebook`.

---

### 🟣 Discord

1. Acesse: [Discord Developer Portal](https://discord.com/developers/applications)
2. Crie uma nova aplicação
3. Vá em **OAuth2 > Redirects** e adicione:
   ```
   https://seu-link/auth/callback?provider=discord
   ```
4. Copie o `Client ID` e `Client Secret` e insira no `.env`

---

### 🟪 Twitch

1. Acesse: [Twitch Developer Console](https://dev.twitch.tv/console/apps)
2. Crie um novo aplicativo
3. Adicione o redirect:
   ```
   https://seu-link/auth/callback?provider=twitch
   ```
4. Copie o `Client ID` e `Client Secret` e preencha no `.env`

---

### 🐦 Twitter (X)

> O Twitter exige aprovação para uso de OAuth. Você deve ter uma conta de desenvolvedor aprovada.

1. Acesse: [Twitter Developer Portal](https://developer.twitter.com/)
2. Crie um projeto e um App
3. Vá em **Authentication Settings** e defina como:
   - Callback URL:
     ```
     https://seu-link/auth/callback?provider=twitter
     ```
   - Website URL: https://furia-knowyourfan.vercel.app
4. Copie `Client ID` e `Client Secret` para o `.env`

---

### 📷 Instagram (Basic Display API)

> O Instagram exige configuração via Facebook for Developers.

1. Acesse: [Facebook for Developers](https://developers.facebook.com/)
2. Crie um App do tipo "Consumer"
3. No painel do App, adicione o produto **Instagram Basic Display**
4. Em **Configurações > URI de Redirecionamento válidas**, insira:
   ```
   https://seu-link/auth/callback?provider=instagram
   ```
5. Copie o `Client ID` e `Client Secret`

---

### 🔵 Facebook

1. Acesse: [Facebook for Developers](https://developers.facebook.com/)
2. Crie um App do tipo "Consumer"
3. Vá em **Facebook Login > Settings**
4. Em **Valid OAuth Redirect URIs**, adicione:
   ```
   https://seu-link/auth/callback?provider=facebook
   ```
5. Copie `Client ID` e `Client Secret`

---

## 📝 Funcionalidades

- Autenticação e autorização de usuários
- Processamento de documentos e capacidades OCR
- Sistema de pontos para engajamento de fãs
- Funcionalidades relacionadas a esports
- Interface moderna e responsiva
- Desenvolvimento com segurança de tipos usando TypeScript
