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

- [Node.js](https://nodejs.org/) >= 18 (recomendado v22+)
- npm >= 9
- API backend rodando (por padrão em `http://localhost:8080/api/v1`)

## Setup

### 1. Clonar o repositório

```bash
git clone https://github.com/seu-usuario/kaizen-wpp-scheduler-frontend.git
cd kaizen-wpp-scheduler-frontend
```

### 2. Instalar dependências

```bash
npm install
```

### 3. Configurar variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto a partir do exemplo:

```bash
cp .env.example .env
```

Edite o arquivo `.env` e configure a URL da API backend:

```env
VITE_API_BASE_URL=http://localhost:8080/api/v1
```

> Se a variável não for definida, a aplicação usará `http://localhost:8080/api/v1` como padrão.

### 4. Iniciar o servidor de desenvolvimento

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

## Build de produção

Para gerar o build otimizado para produção:

```bash
npm run build
```

Os arquivos estáticos serão gerados na pasta `dist/`, prontos para deploy em qualquer servidor de arquivos estáticos (Nginx, Vercel, Netlify, etc.).

Para testar o build localmente:

```bash
npm run preview
```
