"""
Quick liveness debug — run against a test image.
Usage:
  python debug_liveness.py <image_path>
  python debug_liveness.py  (uses webcam capture)
"""

import sys
from pathlib import Path

import cv2
import numpy as np

project_root = Path(__file__).resolve().parent.parent
if str(project_root) not in sys.path:
    sys.path.insert(0, str(project_root))

from ai.models.face_detector import FaceDetector
from ai.models.liveness_detector import LivenessDetector
from ai.config import PipelineConfig

config = PipelineConfig()
ld = LivenessDetector(config)
fd = FaceDetector(config)

if len(sys.argv) > 1:
    img = cv2.imread(sys.argv[1])
    if img is None:
        print(f"ERROR: cannot read {sys.argv[1]}")
        sys.exit(1)
    print(f"Loaded: {sys.argv[1]} | shape={img.shape}")
else:
    print("Opening webcam... press SPACE to capture, ESC to exit")
    cap = cv2.VideoCapture(0)
    img = None
    while True:
        ret, frame = cap.read()
        if not ret:
            break
        cv2.imshow("webcam", frame)
        k = cv2.waitKey(30) & 0xFF
        if k == 32:
            img = frame.copy()
            break
        if k == 27:
            break
    cap.release()
    cv2.destroyAllWindows()
    if img is None:
        print("No image captured")
        sys.exit(0)

det = fd.detect_single_face(img)
if not det:
    print("NO FACE DETECTED")
    sys.exit(1)

print(f"Face detected | confidence={det['detection_confidence']:.3f} | bbox={det['bbox']}")

result = ld.check(img, det['landmarks'], det['bbox'])
print("\n=== LIVENESS RESULT ===")
for key, value in result.items():
    if isinstance(value, float):
        print(f"  {key:30s}: {value:.4f}")
    else:
        print(f"  {key:30s}: {value}")
print(f"\nis_live = {result['is_live']}")
print(f"liveness_score = {result.get('liveness_score', 'N/A')}")