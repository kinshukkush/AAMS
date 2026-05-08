"""
REST API for Face Recognition Attendance System.
Connects AI pipeline to your website backend.
"""

from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from typing import Optional, List
import uvicorn
import traceback

# (AI imports moved to getter functions for lazy loading)

# ── Initialize (Lazy) ──
_pipeline = None

def get_pipeline():
    global _pipeline
    if _pipeline is None:
        from ai.config import PipelineConfig
        from ai.pipeline import FaceRecognitionPipeline
        config = PipelineConfig()
        _pipeline = FaceRecognitionPipeline(config)
    return _pipeline

def get_image_processor():
    from ai.utils.image_utils import ImageProcessor
    return ImageProcessor()

app = FastAPI(
    title="Face Recognition Attendance API",
    description="Multi-stage AI Pipeline (Lazy Loaded)",
    version="1.1.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Allow all for now, or load from get_pipeline().config.CORS_ORIGINS if needed
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ── Models ──
class Base64Request(BaseModel):
    image: str
    person_id: Optional[str] = None
    person_name: Optional[str] = None


class Base64VideoRequest(BaseModel):
    frames: List[str]
    person_id: Optional[str] = None
    person_name: Optional[str] = None
    min_samples: Optional[int] = 3


# ── Global error handler ──
@app.exception_handler(Exception)
async def global_error_handler(request, exc):
    return JSONResponse(
        status_code=500,
        content={"error": str(exc), "type": type(exc).__name__}
    )


# ── Endpoints ──

@app.get("/")
def root():
    return {
        "service": "Face Recognition Attendance API",
        "version": "1.0.0",
        "endpoints": {
            "health": "GET /health",
            "register_upload": "POST /register/upload",
            "register_base64": "POST /register/base64",
            "register_video": "POST /register/video",
            "verify_upload": "POST /verify/upload",
            "verify_base64": "POST /verify/base64",
            "verify_video": "POST /verify/video",
            "list_persons": "GET /persons",
            "delete_person": "DELETE /persons/{id}",
            "docs": "GET /docs"
        }
    }


@app.get("/health")
def health():
    # Return simple status if not loaded yet, full status if loaded
    if _pipeline is None:
        return {"status": "operational", "ai_status": "ready_to_load", "load_state": "idle"}
    return get_pipeline().status()


@app.post("/register/upload")
async def register_upload(
    file: UploadFile = File(...),
    person_id: str = Form(...),
    person_name: str = Form(...)
):
    try:
        contents = await file.read()
        if len(contents) == 0:
            raise HTTPException(400, "Empty file uploaded")
        image = get_image_processor().load_from_bytes(contents)
        result = get_pipeline().register_face(image, person_id, person_name)
        if not result["success"]:
            raise HTTPException(400, detail=result)
        return result
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(500, f"Registration failed: {str(e)}")


@app.post("/register/base64")
async def register_base64(req: Base64Request):
    if not req.person_id or not req.person_name:
        raise HTTPException(400, "person_id and person_name are required")
    try:
        image = get_image_processor().load_from_base64(req.image)
        result = get_pipeline().register_face(image, req.person_id, req.person_name)
        if not result["success"]:
            raise HTTPException(400, detail=result)
        return result
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(500, f"Registration failed: {str(e)}")


@app.post("/register/video")
async def register_video(req: Base64VideoRequest):
    if not req.person_id or not req.person_name:
        raise HTTPException(400, "person_id and person_name are required")
    if not req.frames:
        raise HTTPException(400, "frames are required")
    try:
        images = [get_image_processor().load_from_base64(frame) for frame in req.frames[:8]]
        result = get_pipeline().register_faces_from_frames(
            images, req.person_id, req.person_name,
            min_samples=max(1, int(req.min_samples or 3))
        )
        if not result["success"]:
            raise HTTPException(400, detail=result)
        return result
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(500, f"Video registration failed: {str(e)}")


@app.post("/verify/upload")
async def verify_upload(file: UploadFile = File(...)):
    try:
        contents = await file.read()
        if len(contents) == 0:
            raise HTTPException(400, "Empty file uploaded")
        image = get_image_processor().load_from_bytes(contents)
        return get_pipeline().verify_face(image)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(500, f"Verification failed: {str(e)}")


@app.post("/verify/base64")
async def verify_base64(req: Base64Request):
    try:
        image = get_image_processor().load_from_base64(req.image)
        return get_pipeline().verify_face(image)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(500, f"Verification failed: {str(e)}")


@app.post("/verify/video")
async def verify_video(req: Base64VideoRequest):
    if not req.frames:
        raise HTTPException(400, "frames are required")
    try:
        images = [get_image_processor().load_from_base64(frame) for frame in req.frames[:12]]
        return get_pipeline().verify_faces_from_frames(images)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(500, f"Video verification failed: {str(e)}")


@app.get("/persons")
def list_persons():
    persons = get_pipeline().list_persons()
    return {"persons": persons, "total": len(persons)}


@app.delete("/persons/{person_id}")
def delete_person(person_id: str):
    if get_pipeline().delete_person(person_id):
        return {"success": True, "deleted": person_id}
    raise HTTPException(404, f"Person {person_id} not found")


# ── Startup ──
if __name__ == "__main__":
    # We use default config values for the announcement logs
    print()
    print("=" * 50)
    print("  FACE RECOGNITION ATTENDANCE API")
    print("  Server:  http://localhost:8001")
    print("  Docs:    http://localhost:8001/docs")
    print("  Health:  http://localhost:8001/health")
    print("=" * 50)
    print()
    # In production, uvicorn is usually run from CLI, but for local:
    uvicorn.run(app, host="0.0.0.0", port=8001)
