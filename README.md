# AAMS — Face Attendance System

This repository contains the Face Attendance System (AAMS) with these components:

- `backend/` — Node.js + Express API (PostgreSQL + pgvector)
- `App/` — Expo React Native mobile app
- `frontend/` — React web dashboard
- `ai/` — Python-based AI service for face recognition

See the per-service deployment guides:

- [backend/DEPLOY.md](backend/DEPLOY.md)
- [App/DEPLOY.md](App/DEPLOY.md)
- [frontend/DEPLOY.md](frontend/DEPLOY.md)
- [ai/DEPLOY.md](ai/DEPLOY.md)

Repository files added:

- `.gitignore`, `.easignore`
- `CONTRIBUTING.md`, `LICENSE` (MIT), `SECURITY.md`

Quick start (local):

```bash
# backend
cd backend
npm install
npm start

# mobile app (separate terminal)
cd App
npm install
npm start

# frontend
cd frontend
npm install
npm start
```
