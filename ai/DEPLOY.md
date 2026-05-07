# AI Service Deployment

This folder contains the Python AI service used for face recognition and liveness checks.

Quick start (local):

```bash
cd ai
python -m venv .venv
source .venv/bin/activate  # or .\.venv\Scripts\activate on Windows
pip install -r requirements.txt
python run.py
```

Environment variables (optional):

- `AI_API_PORT` — Port to run the AI service (default: `8001`)
- `AI_RECOGNITION_MODEL` — Override recognition model (e.g., `Facenet`)

Deploy options: Railway, Heroku, or a VM. Ensure required Python packages are installed and any model files are present. Expose the service URL and set `AI_SERVICE_URL` in the backend environment to point to the deployed AI service.
