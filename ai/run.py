import os
import sys
from pathlib import Path

project_root = Path(__file__).resolve().parent.parent
if str(project_root) not in sys.path:
    sys.path.insert(0, str(project_root))

from ai.api.routes import app, config
import uvicorn


if __name__ == "__main__":
    uvicorn.run(
        "ai.api.routes:app",
        host="0.0.0.0",
        port=int(os.environ.get("PORT", config.API_PORT)),
        reload=False,
    )