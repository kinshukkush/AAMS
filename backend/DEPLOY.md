# Backend Deployment

The backend is a Node.js + Express API that requires a PostgreSQL database with the `pgvector` extension.

Recommended hosts: Railway, Render, Heroku, DigitalOcean, or a VM.

Required environment variables (set these during deployment):

- `DATABASE_URL` — Full PostgreSQL connection string (example: `postgresql://user:pass@host:5432/dbname?sslmode=require&channel_binding=require`)
- `JWT_SECRET` — Secret used to sign JWT tokens (set a strong random value)
- `AI_SERVICE_URL` — URL of the AI service (default: `http://localhost:8001`)
- `DEFAULT_ADMIN_EMAIL` — Initial admin email (default: `admin@attendance.com`)
- `DEFAULT_ADMIN_PASSWORD` — Initial admin password (default: `admin123`)
- `PORT` — Optional HTTP port (default: `8000`)

Optional per-field DB variables (if not using `DATABASE_URL`):

- `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, `DB_PASSWORD`

Notes:

- The database must have the `pgvector` extension enabled. On Neon or managed DBs, create the extension before first run:

```sql
CREATE EXTENSION IF NOT EXISTS vector;
```

- If using Railway or Heroku, set `DATABASE_URL` in the project settings and ensure SSL mode is allowed (Neon requires `sslmode=require`).

Start command (example):

```bash
npm install
npm start
```
