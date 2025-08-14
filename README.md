# API de Cursos (Fastify + Drizzle ORM + PostgreSQL)

Uma API simples para gerenciamento de cursos construída com Fastify 5, Zod para validação, Drizzle ORM para acesso ao banco, e PostgreSQL. Inclui documentação interativa da API em desenvolvimento.

- **Stack**: Fastify, Zod, Drizzle ORM, PostgreSQL
- **Linguagem/Runtime**: Node.js (TypeScript com suporte nativo do Node 22+)
- **Docs**: `GET /docs` (apenas em `NODE_ENV=development`)

## Requisitos

- Node.js 22+ (necessário para rodar `.ts` diretamente)
- Docker + Docker Compose (para PostgreSQL)
- PostgreSQL (opcional local; por padrão via Docker)

## Setup rápido

1) Instale dependências:
```bash
npm install
```

2) Suba o banco de dados com Docker:
```bash
docker compose up -d
```

3) Crie um arquivo `.env` na raiz com:
```bash
# URL do banco para Drizzle e a aplicação
DATABASE_URL=postgres://postgres:postgres@localhost:5432/desafio

# habilita docs interativas e configurações de dev
NODE_ENV=development
```

4) Rode migrações do Drizzle:
```bash
npm run db:migrate
```

5) Inicie a API em desenvolvimento:
```bash
npm run dev
```

- Servidor em: `http://localhost:3000`
- Documentação (dev): `http://localhost:3000/docs`

## Scripts NPM

- `npm run dev`: inicia o servidor com `--env-file=.env` e `--watch`
- `npm run db:generate`: gera migrações a partir do schema
- `npm run db:migrate`: aplica migrações no banco
- `npm run db:studio`: abre o Drizzle Studio

## Variáveis de ambiente

- `DATABASE_URL` (obrigatória): `postgres://USER:PASS@HOST:PORT/DB`
- `NODE_ENV` (opcional): use `development` para habilitar `/docs`

## Banco de dados

- Imagem: `postgres:17` (ver `docker-compose.yml`)
- Padrão de credenciais:
  - `POSTGRES_USER=postgres`
  - `POSTGRES_PASSWORD=postgres`
  - `POSTGRES_DB=desafio`
- Porta: `5432`

### Migrações e Schema

- Definições em: `src/database/schema.ts`
- Saída de migrações: `drizzle/`
- Configuração do Drizzle: `drizzle.config.ts` (usa `DATABASE_URL`)

Fluxo comum:
```bash
# edite o schema em src/database/schema.ts
npm run db:generate
npm run db:migrate
```

## Endpoints

Base URL: `http://localhost:3000`

- GET `/courses`
  - 200:
  ```json
  {
    "courses": [
      { "id": "uuid", "title": "string", "description": "string|null" }
    ]
  }
  ```

- GET `/courses/:id`
  - 200:
  ```json
  {
    "course": { "id": "uuid", "title": "string", "description": "string|null" }
  }
  ```
  - 404: corpo vazio

- POST `/courses`
  - Body:
  ```json
  { "title": "string (min 3)", "description": "string (opcional)" }
  ```
  - 201:
  ```json
  { "courseId": "uuid" }
  ```

### Exemplos de requests (cURL)

```bash
# Criar curso
curl -X POST http://localhost:3000/courses \
  -H "Content-Type: application/json" \
  -d '{ "title": "Node.js", "description": "APIs com Fastify" }'

# Listar cursos
curl http://localhost:3000/courses

# Obter curso por ID
curl http://localhost:3000/courses/<uuid>
```

Você também pode usar o arquivo `requests.http` na raiz do projeto.

## Documentação da API (dev)

Com `NODE_ENV=development`, a API expõe:
- OpenAPI via `@fastify/swagger`
- UI interativa via `@scalar/fastify-api-reference` em `GET /docs`

## Estrutura do projeto
