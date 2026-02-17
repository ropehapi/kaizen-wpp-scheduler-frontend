# Kaizen WPP Scheduler - Frontend

Frontend da aplicação **Kaizen WPP Scheduler**, um sistema de agendamento de mensagens via WhatsApp. Permite criar, visualizar, editar e cancelar agendamentos de mensagens para contatos, com suporte a envios únicos e recorrentes.

## Tecnologias

- **React 18** com **TypeScript**
- **Vite** como bundler e dev server
- **Tailwind CSS** para estilização
- **shadcn/ui** (Radix UI) como biblioteca de componentes
- **React Router DOM** para roteamento SPA
- **React Query (TanStack)** para gerenciamento de estado assíncrono e cache
- **Axios** para comunicação com a API
- **React Hook Form** + **Zod** para formulários e validação
- **date-fns** para formatação de datas (locale pt-BR)
- **Vitest** + **Testing Library** para testes

## Pré-requisitos

- [Node.js](https://nodejs.org/) >= 18 (recomendado v22+) e npm >= 9 **ou** [Docker](https://www.docker.com/) + Docker Compose
- API backend rodando (por padrão em `http://localhost:8080/api/v1`)

## Setup

### 1. Clonar o repositório

```bash
git clone https://github.com/seu-usuario/kaizen-wpp-scheduler-frontend.git
cd kaizen-wpp-scheduler-frontend
```

### 2. Configurar variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto a partir do exemplo:

```bash
cp .env.example .env
```

Edite o arquivo `.env` e configure a URL da API backend:

```env
VITE_API_BASE_URL=http://localhost:8080/api/v1
```

> Se a variável não for definida, a aplicação usará `http://localhost:8080/api/v1` como padrão.

---

### Opção A: Rodar com Docker (recomendado)

Suba a aplicação com um único comando:

```bash
docker compose up -d
```

A aplicação estará disponível em `http://localhost:3000`.

Para alterar a porta do host ou a URL da API, defina as variáveis no `.env`:

```env
VITE_API_BASE_URL=http://meu-backend:8080/api/v1
APP_PORT=4000
```

Para rebuildar a imagem após alterações no código ou nas variáveis:

```bash
docker compose up -d --build
```

Para parar os containers:

```bash
docker compose down
```

> **Nota:** A variável `VITE_API_BASE_URL` é injetada em tempo de **build** (pelo Vite). Se alterá-la, é necessário rebuildar a imagem com `--build`.

---

### Opção B: Rodar localmente com Node.js

Instale as dependências:

```bash
npm install
```

Inicie o servidor de desenvolvimento:

```bash
npm run dev
```

A aplicação estará disponível em `http://localhost:5173`.

## Scripts disponíveis

| Comando           | Descrição                                          |
| ----------------- | -------------------------------------------------- |
| `npm run dev`     | Inicia o servidor de desenvolvimento (HMR)         |
| `npm run build`   | Gera o build de produção em `dist/`                |
| `npm run build:dev` | Gera o build em modo desenvolvimento             |
| `npm run preview` | Serve o build de produção localmente               |
| `npm run lint`    | Executa o ESLint no projeto                        |
| `npm run test`    | Executa os testes uma vez                          |
| `npm run test:watch` | Executa os testes em modo watch                 |

## Estrutura do projeto

```
src/
├── components/
│   ├── layout/          # AppLayout e AppSidebar (estrutura da página)
│   ├── ui/              # Componentes shadcn/ui (Button, Card, Table, etc.)
│   ├── StatusBadge.tsx  # Badge de status do agendamento
│   ├── PageLoading.tsx  # Componente de loading
│   ├── ErrorState.tsx   # Componente de estado de erro
│   ├── EmptyState.tsx   # Componente de estado vazio
│   └── NavLink.tsx      # Link de navegação customizado
├── hooks/
│   ├── useSchedules.ts  # Hooks React Query para CRUD de agendamentos
│   └── use-toast.ts     # Hook para notificações toast
├── pages/
│   ├── Dashboard.tsx        # Página inicial com visão geral
│   ├── SchedulesList.tsx    # Listagem de agendamentos com filtros e paginação
│   ├── CreateSchedule.tsx   # Formulário de criação de agendamento
│   ├── EditSchedule.tsx     # Formulário de edição de agendamento
│   ├── ScheduleDetails.tsx  # Detalhes de um agendamento
│   └── NotFound.tsx         # Página 404
├── services/
│   └── api.ts           # Cliente Axios com interceptors e endpoints
├── types/
│   └── api.ts           # Tipagens TypeScript (Schedule, Contact, etc.)
├── lib/
│   └── utils.ts         # Utilitários (cn para classes CSS)
├── App.tsx              # Roteamento principal
├── main.tsx             # Entry point da aplicação
└── index.css            # Estilos globais e variáveis Tailwind
```

## Funcionalidades

### Dashboard
- Cards com contadores de agendamentos por status (total, agendados, enviados, cancelados)
- Lista dos últimos agendamentos com acesso rápido aos detalhes

### Listagem de agendamentos
- Tabela paginada com todos os agendamentos
- Filtro por status (agendados, enviados, cancelados)
- Ações rápidas: visualizar, editar e cancelar

### Criar agendamento
- Formulário com validação via Zod
- Campos: mensagem, data/hora, tipo (único ou recorrente) e frequência
- Gerenciamento dinâmico de contatos (adicionar/remover)
- Suporte a agendamentos recorrentes (diário, semanal, mensal)

### Detalhes do agendamento
- Visualização completa das informações do agendamento
- Lista de contatos vinculados
- Ações de editar e cancelar (quando o status permite)

### Edição de agendamento
- Formulário pré-preenchido com os dados atuais
- Mesma validação da criação

## API

A aplicação se comunica com uma API REST backend. Os principais endpoints consumidos são:

| Método   | Endpoint                   | Descrição                      |
| -------- | -------------------------- | ------------------------------ |
| `GET`    | `/api/v1/schedules`        | Lista agendamentos (paginado)  |
| `GET`    | `/api/v1/schedules/:id`    | Detalhes de um agendamento     |
| `POST`   | `/api/v1/schedules`        | Cria um novo agendamento       |
| `PUT`    | `/api/v1/schedules/:id`    | Atualiza um agendamento        |
| `PATCH`  | `/api/v1/schedules/:id/cancel` | Cancela um agendamento     |

### Modelos de dados

**Schedule (Agendamento)**
- `id` - Identificador único
- `message` - Conteúdo da mensagem
- `scheduledAt` - Data/hora de envio (ISO 8601)
- `status` - `scheduled` | `sent` | `canceled`
- `type` - `once` | `recurring`
- `frequency` - `daily` | `weekly` | `monthly` (apenas para recorrentes)
- `contacts` - Lista de contatos vinculados

**Contact (Contato)**
- `name` - Nome do contato
- `phone` - Número de telefone (formato: `5511999999999`)

## Docker

A aplicação é conteinerizada com um **Dockerfile multi-stage**:

1. **Build** — imagem `node:22-alpine` instala as dependências e gera o build de produção via Vite.
2. **Serve** — imagem `nginx:alpine` serve os arquivos estáticos com configuração otimizada para SPA (fallback para `index.html`).

### Variáveis de ambiente (Docker)

| Variável             | Descrição                                  | Padrão                             |
| -------------------- | ------------------------------------------ | ---------------------------------- |
| `VITE_API_BASE_URL`  | URL base da API backend (build-time)       | `http://localhost:8080/api/v1`     |
| `APP_PORT`           | Porta exposta no host pelo Docker Compose  | `3000`                             |

### Comandos úteis

```bash
# Subir a aplicação
docker compose up -d

# Subir e forçar rebuild
docker compose up -d --build

# Ver logs
docker compose logs -f frontend

# Parar a aplicação
docker compose down

# Build manual da imagem (sem Compose)
docker build --build-arg VITE_API_BASE_URL=http://meu-backend:8080/api/v1 -t kaizen-wpp-frontend .

# Rodar a imagem manualmente
docker run -p 3000:80 kaizen-wpp-frontend
```

## Build de produção (sem Docker)

Para gerar o build otimizado para produção:

```bash
npm run build
```

Os arquivos estáticos serão gerados na pasta `dist/`, prontos para deploy em qualquer servidor de arquivos estáticos (Nginx, Vercel, Netlify, etc.).

Para testar o build localmente:

```bash
npm run preview
```
