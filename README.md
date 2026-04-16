# 2tier-app

Simple app with:

- `frontend/`: UI
- `backend/`: API
- `PostgreSQL`: database

The folder name is `2tier-app`, but the current deployed setup is a 3-tier app because it includes a separate database tier.

## Structure

```text
2tier-app/
├── backend/
├── frontend/
├── database/
├── package.json
└── docker-compose.yml
```

## API

- `GET /api/health`
- `GET /api/dashboard`

## Docker Build

Backend:

```bash
cd /Users/tablesprintaniket/aniket/2tier-app
docker build -f backend/Dockerfile -t aniketu/2tier-backend:latest .
docker push aniketu/2tier-backend:latest
```

Frontend:

```bash
cd /Users/tablesprintaniket/aniket/2tier-app
docker build -f frontend/Dockerfile -t aniketu/2tier-ui:latest .
docker push aniketu/2tier-ui:latest
```

## Kubernetes Files

- `backend/deployment.yml`
- `backend/statefulset.yml`
- `backend/configmap.yml`
- `backend/secret.yml`
- `frontend/deployment.yml`

Namespace:

```text
2tier
```

Services:

- `backend-service`
- `db-headless`
- `frontend-service`

## Local Run

```bash
npm install
npm start
```
