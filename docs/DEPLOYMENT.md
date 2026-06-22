# Deployment Guide — AI Resume Screening System

This deployment guide is based on the current repository implementation. It covers Docker-based deployment, environment variables, ports, and verification steps. No new features are assumed.

## Frontend Deployment

### Implementation
- Built from `frontend/Dockerfile`.
- Build stage uses `node:18-alpine` to `npm install` and `npm run build`.
- Runtime stage uses `nginx:alpine` to serve static files from `/usr/share/nginx/html`.
- `nginx.conf` is copied from the frontend folder into the Nginx config.

### Service details
- Docker service name: `frontend`.
- Exposes container port `80`.
- Published host port: `3000` via docker-compose.
- Environment variable: `REACT_APP_API_URL` set to `http://localhost:5000/api` in compose.

### Notes
- The frontend is a static React app. It must be rebuilt when frontend sources change.
- In production, `REACT_APP_API_URL` should point to the backend host and port accessible from the browser.

## Backend Deployment

### Implementation
- Built from `backend/Dockerfile`.
- Uses `node:18-alpine` and installs only production dependencies.
- Exposes port `5000`.
- Starts with `npm start`, launching `server.js`.

### Service details
- Docker service name: `backend`.
- Published host port: `5000`.
- Depends on `mongodb` in docker-compose.
- Connects to AI module service at `http://ai-module:5001` by default.

### Required environment variables
- `MONGODB_URI` — connection string to MongoDB.
- `JWT_SECRET` — secret for JWT signing and validation.
- `PYTHON_API_URL` — URL of the AI module service.
- `NODE_ENV` — environment mode (`production` in compose).

### Backend configuration behavior
- Backend uses `backend/src/config/index.js`.
- It throws an error if `MONGODB_URI`, `JWT_SECRET`, or `PYTHON_API_URL` are missing in non-test environments.
- Default config values exist only for development convenience, but production must provide the required env vars.

## AI Deployment

### Implementation
- Built from `ai-module/Dockerfile`.
- Uses `python:3.9-slim` and installs dependencies from `requirements.txt`.
- Exposes port `5001`.
- Starts with `python app.py`.

### Service details
- Docker service name: `ai-module`.
- Published host port: `5001`.
- Environment variables used:
  - `FLASK_ENV=production`
  - `DEBUG=False`

### Notes
- The AI module currently serves `/health`, `/analyze`, and `/batch-analyze`.
- The backend expects it reachable at `http://ai-module:5001` within Docker.
- It is a separate service from the Node backend, so network connectivity must be confirmed.

## MongoDB Atlas Setup

### Current repository behavior
- `docker-compose.yml` currently defines a local `mongodb` service based on `mongo:5.0`.
- It publishes host port `27017:27017`.
- Local environment variables use `mongodb://root:password@mongodb:27017/resume-screening`.

### Atlas deployment guidance
- Replace the compose `mongodb` service with an external Atlas cluster by setting `MONGODB_URI` to the Atlas connection string.
- Example Atlas URI:
  - `mongodb+srv://<username>:<password>@cluster0.mongodb.net/resume-screening?retryWrites=true&w=majority`
- Remove or disable the local `mongodb` service from compose if using Atlas.
- Ensure network access and IP whitelist values in Atlas include the backend host.
- Set `MONGODB_URI` in the backend container or deployment environment accordingly.

## Environment Variables

### Backend variables
- `MONGODB_URI` — required.
- `JWT_SECRET` — required.
- `PYTHON_API_URL` — required.
- `NODE_ENV` — optional; set to `production` for production deployment.
- `PORT` — optional; defaults to `5000` if unspecified.

### Frontend variables
- `REACT_APP_API_URL` — API base URL for frontend requests.
- This is injected at build time in Docker compose.

### AI module variables
- `FLASK_ENV` — set to `production` in compose.
- `DEBUG` — set to `False` in compose.
- The AI module does not currently require additional user-provided variables in the repository implementation.

### Notes on `.env`
- The project does not include a root `.env` example in the repository.
- If using local Docker deploy, env values are declared directly in `docker-compose.yml`.
- For production, prefer external secret management rather than committing secrets into compose files.

## Run Commands

### Build and start all services
```bash
cd "c:\Users\hp\Desktop\ai resume screening system"
docker compose up --build
```

### Start in detached mode
```bash
docker compose up -d --build
```

### Stop and remove containers
```bash
docker compose down
```

### Rebuild a specific service
```bash
docker compose build backend
```

### View logs
```bash
docker compose logs -f backend
```

## Deployment Risks

- `backend/src/config/index.js` rejects startup if required env vars are missing; this can prevent a service from launching if env configuration is incomplete.
- Hardcoded frontend API URL in docker-compose may not match deployed backend host in other environments.
- Local MongoDB container uses weak default credentials (`root` / `password`); do not use these credentials in production.
- AI module availability is critical; if `PYTHON_API_URL` is unreachable, resume processing fails and resume status may be marked `Failed`.
- `uploads/` file storage is local disk-based; in distributed or cloud deployments this should be replaced with shared or object storage.
- Docker network names and service hostnames are only valid inside compose network; external access requires published ports or reverse proxy configuration.

## Verification Checklist

- [ ] Confirm `docker compose up --build` starts services: `mongodb`, `backend`, `ai-module`, `frontend`.
- [ ] Verify backend is reachable on `http://localhost:5000` and `/api/health` returns JSON.
- [ ] Verify AI module is reachable on `http://localhost:5001/health`.
- [ ] Verify frontend loads on `http://localhost:3000` and can call backend API.
- [ ] Confirm `MONGODB_URI`, `JWT_SECRET`, and `PYTHON_API_URL` are set for backend.
- [ ] Confirm `REACT_APP_API_URL` points to the backend API URL the browser can access.
- [ ] Review MongoDB credentials if using local Mongo; do not use `root/password` in production.
- [ ] Validate that backend can reach AI module via configured `PYTHON_API_URL`.
- [ ] If using Atlas, confirm network access and connection string are correct.
- [ ] Confirm ports do not collide with other services on the host.

---

This deployment guide reflects the current repository implementation and does not perform any deployment steps.