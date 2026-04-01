
# AI Implementation Prompt – Real-Time Traffic Sign Detection (MEAN + Python)

## COPY & PASTE THIS PROMPT INTO ANY AI CODING ASSISTANT

```
You are a senior full-stack AI engineer.

I am building a REAL-TIME Driver Assistance System using:
- Python (YOLO / OpenCV)
- Node.js (Express + Socket.IO)
- Angular (Frontend dashboard)

### EXISTING DETAILS (IMPORTANT)
- My Python detection file is named: detect4.py
- My trained YOLO model folder is: bestDetectTrafficSign_ncnn_model
- The model detects traffic signs like:
  - danger
  - mandatory
  - prohibitory
  - speed limit
- Camera source: USB camera (cv2.VideoCapture(0))

### OBJECTIVE
Convert my existing `detect4.py` into a **Socket.IO-based AI service** that:
1. Loads `bestDetectTrafficSign_ncnn_model`
2. Performs real-time traffic sign detection
3. Emits detection results EVERY TIME a sign appears (even repeated)
4. Sends data to a Node.js Socket.IO server
5. Does NOT crash
6. Does NOT block detection
7. Supports overlapping alerts

### DATA FORMAT TO EMIT
Emit the following JSON object through Socket.IO:

{
  "label": "STOP",
  "category": "prohibitory",
  "confidence": 0.91,
  "timestamp": "<ISO_TIME>"
}

### REQUIREMENTS – PYTHON SIDE
- Modify `detect4.py`, do NOT create a new file
- Use python-socketio client
- YOLO inference must remain inside a while loop
- Detection must continue even if Socket.IO disconnects
- Wrap model inference with try/except to avoid crashes
- Do NOT use Flask
- Use Python 3.10 compatibility

### REQUIREMENTS – NODE.JS SIDE
- Create a Socket.IO server using Express
- Receive `ai-detection` events from Python
- Re-broadcast them as `frontend-detection`
- Print all detections in console

### REQUIREMENTS – ANGULAR SIDE
- Create a Socket service
- Subscribe to `frontend-detection`
- Display detected sign label in RED color
- Update UI in real time

### BONUS FEATURES (OPTIONAL)
- If category == "danger", emit an extra alert
- If speed limit detected, emit "Slow Down" alert
- Add simple debounce (0.5s) per label (do not block repeats)

### OUTPUT FORMAT
Provide:
1. Updated `detect4.py` (FULL CODE)
2. Node.js `server.js`
3. Angular socket service
4. Angular component example
5. Clear run instructions for all 3 services

Do NOT explain theory.
Do NOT suggest other architectures.
Only provide clean, working, production-style code.
```
