# pest-bin

A small [Deno](https://deno.com/) + [Express](https://expressjs.com/) API that stores and serves arbitrary content ("pastebin"-style) behind a slug/identifier, backed by PostgreSQL via [TypeORM](https://typeorm.io/).

## Tech Stack

- **Runtime:** Deno
- **Web framework:** Express 5
- **Database:** PostgreSQL 18 (via TypeORM)
- **Validation:** Zod
- **Logging:** Pino / pino-http

## Prerequisites

- [Deno](https://docs.deno.com/runtime/getting_started/installation/) (v2+)
- [Docker](https://docs.docker.com/get-docker/) & Docker Compose (to run PostgreSQL locally)

## Getting Started

### 1. Clone & configure environment

Create a `.env` file in the project root:

```env
NODE_ENV=development
PORT=3000

DB_HOST=localhost
DB_PORT=5432
DB_USER=root
DB_PASSWORD=root
DB_NAME=pest-bin
```

| Variable      | Description                          | Default       |
|---------------|---------------------------------------|----------------|
| `NODE_ENV`    | Runtime environment                   | `development`  |
| `PORT`        | Port the HTTP server listens on       | `3000`         |
| `DB_HOST`     | PostgreSQL host                       | `localhost`    |
| `DB_PORT`     | PostgreSQL port                       | `5432`         |
| `DB_USER`     | PostgreSQL username                   | `root`         |
| `DB_PASSWORD` | PostgreSQL password                   | `root`         |
| `DB_NAME`     | PostgreSQL database name              | `pest-bin`     |

### 2. Start the database

A Docker Compose file for a local Postgres instance is provided in `scripts/`:

```bash
docker compose -f scripts/docker-compose.db.yml up -d
```

This starts Postgres 18 on `localhost:5432` with the credentials/database above.

### 3. Run migrations

```bash
deno task migration:run
```

### 4. Run the app

```bash
deno task dev
```

The server starts on `http://localhost:3000` (or whatever `PORT` is set to), reloading automatically on file changes.

## Available Commands

| Command                        | Description                                                        |
|---------------------------------|----------------------------------------------------------------------|
| `deno task dev`                | Run the server in watch mode for local development                  |
| `deno task build`              | Compile the app into a standalone binary named `server`              |
| `deno task start`              | Run the compiled `./server` binary (run `build` first)               |
| `deno task migration:create`   | Scaffold a new migration file under `migrations/` (prompts for name if not given, e.g. `deno task migration:create add-users-table`) |
| `deno task migration:run`      | Apply all pending migrations                                         |
| `deno task migration:revert`   | Revert the last applied migration (pass a number to revert N steps, e.g. `deno task migration:revert 2`) |
| `deno task migration:show`     | Show whether there are pending migrations                            |

## Project Structure

```
.
├── migrations/                # TypeORM migration files
├── scripts/
│   ├── docker-compose.db.yml  # Local PostgreSQL instance
│   └── migration.ts           # Migration CLI (create/run/revert/show)
└── src/
    ├── db/                    # TypeORM DataSource & repository helpers
    ├── entities/               # TypeORM entities
    ├── middlewares/            # Express middlewares (error, validation, logging, 404)
    ├── routes/                 # Express routers
    ├── schemas/                # Zod request schemas
    ├── utils/                  # Shared utilities (logger, etc.)
    ├── app.ts                  # Express app setup
    └── server.ts               # Entry point
```

## API

### Health

`GET /health` — returns server status, current time, and uptime.

### Pest-bin

Base path: `/pestben`

| Method | Path                    | Description                                             |
|--------|--------------------------|-----------------------------------------------------------|
| `GET`  | `/pestben/get-slug`      | Generate a new random slug/identifier                     |
| `GET`  | `/pestben/fetch/:identifier` | Fetch content by identifier (min length 16)            |
| `POST` | `/pestben/save`          | Create or update content for an identifier (body: `{ identifier, bio }`) |

## Building for Production

```bash
deno task build   # compiles ./server binary
deno task start    # runs the compiled binary
```
