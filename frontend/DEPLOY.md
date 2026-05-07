# Frontend (Web) Deployment

The frontend is a standard React app (create-react-app). Deploy to Vercel, Netlify, or any static host.

Required environment variable for deployment:

- `REACT_APP_API_URL` — Base API URL used by the web dashboard (example: `https://aams-production-a221.up.railway.app`)

Build & deploy:

```bash
cd frontend
npm install
npm run build
# Deploy the `build/` folder to Vercel/Netlify or any static host
```

On Vercel/Netlify, set `REACT_APP_API_URL` as an environment variable in the project settings before building.
