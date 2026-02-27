# Kaizen WPP Scheduler - Frontend

## Visão geral

SPA React para gerenciamento de agendamentos de envio de mensagens via WhatsApp. Permite criar, visualizar, editar e cancelar agendamentos com suporte a envios únicos e recorrentes. Interface moderna com sidebar colapsável, dashboard com métricas e tabelas paginadas.

## Ecossistema

Este projeto faz parte do ecossistema **"manda-pra-mim"** de automação WhatsApp:
- **kaizen-wpp-scheduler-backend** → API REST em Go que este frontend consome (porta 8080)
- **messaging-officer** → API REST que conecta ao WhatsApp via Baileys (porta 3000)
- **kaizen-secretary** → Worker de cronjobs para rotinas automatizadas

## Stack

- **React 18** + **TypeScript**
- **Vite 5** → Bundler e dev server
- **Tailwind CSS 3** → Estilização utility-first
- **shadcn/ui** (Radix UI) → Biblioteca de componentes acessíveis
- **React Router DOM 6** → Roteamento SPA
- **React Query (TanStack Query 5)** → Estado assíncrono, cache e mutations
- **Axios** → Cliente HTTP com interceptors
- **React Hook Form 7** + **Zod** → Formulários e validação de schema
- **date-fns** → Formatação de datas (locale pt-BR)
- **Lucide React** → Ícones
- **Sonner** + **Radix Toast** → Notificações
- **Vitest** + **Testing Library** → Testes

## Arquitetura

```
src/
├── components/
│   ├── layout/
│   │   ├── AppLayout.tsx       # Layout principal (sidebar + content area)
│   │   └── AppSidebar.tsx      # Sidebar colapsável com navegação
│   ├── ui/                     # Componentes shadcn/ui (NÃO editar diretamente)
│   ├── StatusBadge.tsx         # Badge colorido por status do agendamento
│   ├── PageLoading.tsx         # Spinner de carregamento
│   ├── ErrorState.tsx          # Estado de erro com retry
│   ├── EmptyState.tsx          # Estado vazio com CTA
│   └── NavLink.tsx             # Link de navegação com estado ativo
├── hooks/
│   ├── useSchedules.ts         # Hooks React Query para CRUD de agendamentos
│   ├── use-toast.ts            # Hook de notificações toast
│   └── use-mobile.tsx          # Hook de detecção mobile
├── pages/
│   ├── Dashboard.tsx           # Página inicial com cards de métricas + últimos agendamentos
│   ├── SchedulesList.tsx       # Listagem paginada com filtro por status
│   ├── CreateSchedule.tsx      # Formulário de criação com validação Zod
│   ├── EditSchedule.tsx        # Formulário de edição (pré-preenchido)
│   ├── ScheduleDetails.tsx     # Detalhes completos do agendamento
│   ├── Index.tsx               # Redirect para Dashboard
│   └── NotFound.tsx            # Página 404
├── services/
│   └── api.ts                  # Cliente Axios + endpoints da API
├── types/
│   └── api.ts                  # Tipagens TypeScript (derivadas do contrato OpenAPI)
├── lib/
│   └── utils.ts                # Utilitário cn() para merge de classes CSS
├── test/
│   ├── setup.ts                # Setup do Vitest
│   └── example.test.ts         # Teste de exemplo
├── App.tsx                     # Roteamento principal + providers
├── main.tsx                    # Entry point
└── index.css                   # Variáveis CSS do tema + estilos globais Tailwind
```

## Rotas da aplicação

| Path | Página | Descrição |
|---|---|---|
| `/` | Dashboard | Cards de métricas + últimos agendamentos |
| `/schedules` | SchedulesList | Tabela paginada com filtros |
| `/schedules/new` | CreateSchedule | Formulário de criação |
| `/schedules/:id` | ScheduleDetails | Detalhes de um agendamento |
| `/schedules/:id/edit` | EditSchedule | Formulário de edição |
| `*` | NotFound | Página 404 |

## Comunicação com a API

### Configuração base
- URL base: `VITE_API_BASE_URL` ou `http://localhost:8080/api/v1` (fallback)
- Interceptor de request: adiciona JWT do `localStorage` se existir (preparado para auth futuro)
- Interceptor de response: extrai mensagem de erro do payload `{ error: "..." }`

### Endpoints consumidos
| Método | Endpoint | Função |
|---|---|---|
| GET | `/schedules` | `schedulesApi.list(params)` |
| GET | `/schedules/:id` | `schedulesApi.getById(id)` |
| POST | `/schedules` | `schedulesApi.create(payload)` |
| PUT | `/schedules/:id` | `schedulesApi.update(id, payload)` |
| PATCH | `/schedules/:id/cancel` | `schedulesApi.cancel(id)` |

### React Query hooks (`hooks/useSchedules.ts`)
| Hook | Query Key | Tipo |
|---|---|---|
| `useSchedulesList(params)` | `["schedules", params]` | useQuery |
| `useScheduleById(id)` | `["schedule", id]` | useQuery |
| `useCreateSchedule()` | — | useMutation (invalida `["schedules"]`) |
| `useUpdateSchedule()` | — | useMutation (invalida `["schedules"]`) |
| `useCancelSchedule()` | — | useMutation (invalida `["schedules"]`) |

## Modelos de dados (TypeScript)

### Schedule
```typescript
{ id, message, scheduledAt, status, type, frequency?, contacts[], createdAt, updatedAt }
```

### Enums
- **ScheduleStatus**: `"scheduled"` | `"sent"` | `"canceled"`
- **ScheduleType**: `"once"` | `"recurring"`
- **Frequency**: `"daily"` | `"weekly"` | `"monthly"`

### Respostas da API
- `APIResponse<T>`: `{ data?: T, error?: string }`
- `PaginatedResponse<T>`: `{ data?: T, error?: string, pagination?: PaginationInfo }`

## Variáveis de ambiente

| Variável | Default | Descrição |
|---|---|---|
| `VITE_API_BASE_URL` | `http://localhost:8080/api/v1` | URL base da API backend (build-time) |

> **Importante**: variáveis `VITE_*` são injetadas em tempo de **build** pelo Vite. Alterações requerem rebuild.

## Componentes shadcn/ui

Os componentes em `src/components/ui/` são gerenciados pelo shadcn/ui. **Não edite esses arquivos diretamente**. Para adicionar novos componentes:
```bash
npx shadcn-ui@latest add <component-name>
```

Configuração em `components.json` na raiz do projeto.

## Convenções de código

- Componentes de página em `src/pages/` (PascalCase, export default)
- Componentes reutilizáveis em `src/components/` (PascalCase, named export)
- Hooks customizados em `src/hooks/` (camelCase com prefixo `use`)
- Serviços de API em `src/services/` (namespace object pattern)
- Tipagens em `src/types/` (interfaces e type aliases)
- Path alias `@/` mapeia para `src/`
- Validação de formulários com Zod schemas inline
- Notificações via `toast()` do hook `use-toast` (sucesso/erro nas mutations)
- Estilização com Tailwind utility classes + `cn()` para merge condicional

## Comandos úteis

```bash
npm run dev          # Dev server com HMR (porta 5173)
npm run build        # Build de produção
npm run build:dev    # Build modo desenvolvimento
npm run preview      # Serve build localmente
npm run lint         # ESLint
npm run test         # Vitest (single run)
npm run test:watch   # Vitest (watch mode)
```

## Docker

- Dockerfile multi-stage: `node:22-alpine` (build) → `nginx:alpine` (serve)
- Nginx configurado para SPA (fallback `index.html`)
- Porta padrão no Docker: 3000
- `docker compose up -d --build` para iniciar
