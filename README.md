# Atmo

**Atmo** is a full-stack project (React + Vite frontend + Node.js/Express backend) that simulates a cloud management system.  
Both services are containerized and orchestrated with Docker Compose.

---

## Project Structure

    Atmo/
    ├── Atmo-backend/          # Node.js + Express API
    │   ├── server.js
    │   ├── api/
    │   ├── services/
    │   └── package.json
    ├── Atmo-frontend/         # React + Vite frontend
    │   ├── src/
    │   ├── index.html
    │   └── package.json
    └── docker-compose.yaml

---

## Prerequisites

- Node.js ≥ 18 (for local development)
- Docker + Docker Compose

---

## Environment Variables

Frontend expects an API base URL:

- Local development (recommended):
  
      # Atmo-frontend/.env.local
      VITE_API_URL=http://localhost:3030/api/

- Docker Compose (already configured):
  
      VITE_API_URL=http://backend:3030/api/

Backend:
- Default port is `3030` (override via `PORT` if needed).

---

## Run Locally (without Docker)

1) Install dependencies

    cd Atmo-backend
    npm install

    cd ../Atmo-frontend
    npm install

2) Start services

- Backend (http://localhost:3030):

      cd Atmo-backend
      npm run dev

- Frontend (http://localhost:5173):

      cd Atmo-frontend
      npm run dev

---

## Run with Docker Compose

Build and start:

    docker-compose up --build

Services:

- Frontend → http://localhost:5173
- Backend  → http://localhost:3030

The frontend communicates with the backend inside the Docker network via:

    http://backend:3030/api/

---

## Frontend → Backend Base URL

In code (http.service.js), prefer using the Vite env:

    const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3030/api/';

Docker Compose sets:

    VITE_API_URL=http://backend:3030/api/

---

## Useful NPM Scripts

Frontend (Atmo-frontend):

- Dev server with hot reload:
  
      npm run dev

- Build production bundle:
  
      npm run build

- Preview built app:
  
      npm run preview

Backend (Atmo-backend):

- Start in development (nodemon):
  
      npm run dev

- Start in production:
  
      npm start

---

## Example API Call

Basic check (adjust endpoint to your routes, e.g. `/api/atmo`):

    curl http://localhost:3030/api/atmo

---

## Troubleshooting

- Port already in use:
  
      # Find and free the port
      sudo lsof -i :3030
      sudo lsof -i :5173

- Check container IPs (internal to Docker):

      docker inspect -f '{{range.NetworkSettings.Networks}}{{.IPAddress}}{{end}}' atmo-frontend
      docker inspect -f '{{range.NetworkSettings.Networks}}{{.IPAddress}}{{end}}' atmo-backend

- Verify Docker network attachments:

      docker network inspect atmo_atmo-net

---

## Roadmap

- Add backend tests (unit/integration)
- Improve Dockerfiles (multi-stage, smaller images)
- CI/CD (GitHub Actions) for build, test, and push
