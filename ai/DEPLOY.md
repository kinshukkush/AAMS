# AI Service Deployment

This folder contains the Python AI service used for face recognition and liveness checks. The service exposes a FastAPI app at `ai.api.routes:app` and by default listens on `AI_API_PORT` (8001).

This document explains how to deploy the AI service to Railway (recommended for simple deployments) plus guidance for Docker-based deployments when native ML dependencies are required.

Prerequisites
- A GitHub repository containing this project (Railway will connect to it).
- Ensure the `ai/` folder contains a `requirements.txt` listing Python dependencies required by the service. If your pipeline uses heavy native libraries (OpenCV, mediapipe, deep learning libs), prefer a Docker deployment or a VM.

Recommended start command
- Railway will provide a runtime `PORT` environment variable. Use UVicorn as the start command so the service binds to the Railway port:

```bash
uvicorn ai.api.routes:app --host 0.0.0.0 --port $PORT
```

Railway deployment (step-by-step)

1. Push your repo to GitHub (if not already).
2. Sign in to Railway.app and create a new project.
3. Choose "Deploy from GitHub" and pick the repository and branch containing this project.
4. When Railway asks for the root directory, set it to `ai` (so Railway builds from the `ai/` folder). If you want to deploy the whole monorepo, set the service root to `ai` in the Railway service settings.
5. Railway will attempt to detect the runtime. If it detects Python, set the following build and start settings:

	- Build command: `pip install -r requirements.txt`
	- Start command: `uvicorn ai.api.routes:app --host 0.0.0.0 --port $PORT`

	If Railway fails to detect Python, pick the "Python" runtime and supply the above commands manually.

6. Add environment variables in the Railway project settings (Environment tab):

	- `AI_API_PORT` — Optional, set to `8001` or to `$PORT` if you prefer the service config to use the Railway port. (Recommended: set `AI_API_PORT` to `$PORT` in Railway's environment variables so the app and Railway port match.)
	- `AI_RECOGNITION_MODEL` — Optional override (example: `Facenet`)
	- `LOG_LEVEL` — Optional (default: `INFO`)

	Note: Railway sets the `PORT` env variable automatically. The CLI `uvicorn ... --port $PORT` ensures the service binds to the correct port.

7. Persistent storage for registered faces and model files:

	- The pipeline stores registered faces in `ai/data/registered_faces` by default (see `PipelineConfig.REGISTERED_FACES_DIR`). Railway containers have ephemeral filesystem storage by default; on restart you will lose files unless you provision persistent disk or use an external object store.
	- Options:
	  - Use Railway Persistent Disk (add a disk under the service, then set `REGISTERED_FACES_DIR` to the mounted path, e.g. `/data/registered_faces`).
	  - Or use an S3-compatible storage bucket and modify the pipeline to use S3 for storing registered faces and model artifacts.

8. After deployment, find the service URL in Railway and set `AI_SERVICE_URL` in your backend (`backend` service environment) to point at `https://<your-railway-service>.railway.app` (or the provided domain).

Example `requirements.txt` (minimal)
```
fastapi
uvicorn[standard]
numpy
pillow
opencv-python-headless
scikit-image
scipy
# optional and heavy deps (only if needed / available on the host):
# mediapipe
# deepface
```

Notes on heavy ML dependencies
- Libraries such as `mediapipe`, `deepface`, or GPU-accelerated frameworks may require native system packages and are often not compatible with Railway's standard Python runtime. For these cases, use a Docker deployment and build an image with the required system-level dependencies, or deploy to a VM with the appropriate drivers.

Optional: Docker-based deployment (recommended for full control)

1. Add a `Dockerfile` at `ai/Dockerfile` that installs system packages, Python deps and copies the `ai/` folder.
2. Build and test locally with `docker build -t aams-ai ./ai` and `docker run -p 8001:8001 aams-ai`.
3. On Railway, create a new service and choose "Deploy from Dockerfile" or push your image to a registry and connect it.

Example `uvicorn` start (local development)

```bash
# Run locally on port 8001
uvicorn ai.api.routes:app --host 0.0.0.0 --port 8001
```

Troubleshooting
- If the deploy fails during `pip install`, inspect the build logs to see which package is failing — many ML packages require system libraries. Switch to the Docker path if needed.
- Verify that the service health endpoint is reachable: `GET /health`.
- If registered faces or model files are missing after restart, move files to persistent disk or external storage.

If you want, I can also:

- Add a sample `ai/requirements.txt` to the repo.
- Add an example `ai/Dockerfile` tuned for CPU-only deployments.

