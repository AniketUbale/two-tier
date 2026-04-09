# Two-Tier App

This project contains a simple two-tier web app:

- `frontend/`: the presentation tier, served on `http://localhost:3000`
- `backend/`: the application/API tier, served on `http://localhost:3001`
- `postgres`: the backing database used by the backend API

## Prerequisite

Install dependencies:

```bash
npm install
```

## Database Configuration

The backend reads PostgreSQL settings from environment variables and also supports a local `.env` file.

For Docker-based PostgreSQL, use:

```bash
cp .env.example .env
```

For a local PostgreSQL install on macOS, the backend will also work without a `.env` file by defaulting to your current OS username and no password.

## Start PostgreSQL

This repo includes a local PostgreSQL setup with seed data:

```bash
docker compose up -d db
```

## Run it

From the project root:

```bash
npm start
```

## Endpoints

- `GET /api/health`
- `GET /api/dashboard`

## PostgreSQL Defaults

- Host: `localhost`
- Port: `5432`
- Database: `two_tier_app`
- User: `postgres` in Docker, otherwise your local OS username by default
- Password: `postgres` in Docker, otherwise blank by default for local Postgres
