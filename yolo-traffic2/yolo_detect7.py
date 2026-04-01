import cv2
import argparse
import threading
import time
import re
from ultralytics import YOLO
import pyttsx3
from collections import defaultdict
import socketio
import datetime
import base64

# ===================== SOCKET.IO SETUP =====================
sio = socketio.Client()
is_connected = False
is_active = False

@sio.event
def connect():
    global is_connected
    is_connected = True
    print("✅ Connected to Socket.IO Server")

@sio.event
def disconnect():
    global is_connected
    is_connected = False
    print("❌ Disconnected from Server")

@sio.on('camera-control')
def on_camera_control(data):
    global is_active
    command = data.get('command')
    if command == 'start':
        is_active = True
        print("▶️ System STARTED via Frontend")
    elif command == 'stop':
        is_active = False
        print("⏸️ System STOPPED via Frontend")

@sio.on('manual-speed-alert')
def on_manual_speed_alert(data):
    speed = data.get('speed', 'Unknown')
    print(f"📡 Manual Speed Alert Received: {speed} km/h")
    speak_async(f"Attention: Speed limit changed to {speed} kilometers per hour.")
    
    # Emit back as a detection so it shows in history
    if is_connected:
        sio.emit("ai-detection", {
            "label": f"MANUAL: {speed} KM/H",
            "category": "mandatory",
            "confidence": 1.0,
            "time": datetime.datetime.now().isoformat()
        })

def try_connect():
    try:
        sio.connect('http://127.0.0.1:3000', wait_timeout=10)
    except Exception as e:
        print(f"⚠️ Socket Connection Failed: {e}")

try_connect()

# ===================== SAFE ASYNC TTS =====================
tts_lock = threading.Lock()

def speak_async(text):
    def run():
        with tts_lock:
            try:
                engine = pyttsx3.init()
                engine.setProperty("rate", 160)
                engine.setProperty("volume", 1.0)
                engine.say(text)
                engine.runAndWait()
                # Do not stop/del the engine immediately as it can cause issues on some systems
            except Exception as e:
                print(f"🔊 TTS Error: {e}")
    threading.Thread(target=run, daemon=True).start()

# ===================== SPEED EXTRACT =====================
def get_speed_from_label(label):
    match = re.search(r'(\d+)', label)
    if match:
        return int(match.group(1))
    return None

# ===================== ARGUMENTS =====================
parser = argparse.ArgumentParser()
parser.add_argument("--model", required=True)
parser.add_argument("--source", required=True)
parser.add_argument("--resolution", default="640x480")
parser.add_argument("--thresh", type=float, default=0.5)
args = parser.parse_args()

# ===================== YOLO =====================
print(f"🔄 Loading Model: {args.model}")
model = YOLO(args.model, task="detect")
labels = model.names
print("✅ YOLO Detection Started")

# ===================== VIDEO =====================
source = int(args.source) if args.source.isdigit() else args.source
cap = None
resW, resH = map(int, args.resolution.split("x"))

# ===================== ALERT CONFIG =====================
PRIORITY = {
    "speed limit": 3,
    "stop": 3,
    "give way": 3,
    "child": 3
}

VOICE_TEXT = {
    "stop": "Stop sign ahead",
    "give way": "Give way sign ahead",
    "child": "Pedestrian crossing ahead",  # Ensure label matches YOLO model
    "child-pedestrian": "Pedestrian crossing ahead"  # Optional: for alternate YOLO labels
}

# ===================== LOGIC STATE =====================
last_alert_time = 0
ALERT_DELAY = 3
MAX_ALERTS = 3
alert_count = defaultdict(int)
visible_frames = defaultdict(int)
PERSIST_FRAMES = 5

# ===================== FPS =====================
prev_time = time.time()

print("📷 Waiting for START command...")

# ===================== MAIN LOOP =====================
while True:

    if not is_active:
        if cap:
            cap.release()
            cap = None
            sio.emit('video-frame', '')
        time.sleep(0.1)
        continue

    if cap is None:
        cap = cv2.VideoCapture(source)
        cap.set(3, resW)
        cap.set(4, resH)

    ret, frame = cap.read()
    if not ret:
        continue

    now = time.time()
    fps = int(1 / (now - prev_time)) if (now - prev_time) > 0 else 0
    prev_time = now

    results = model(frame, conf=args.thresh, verbose=False)
    detected = set()

    for r in results:
        if r.boxes is None:
            continue

        for box in r.boxes:
            cls = int(box.cls[0])
            label = labels[cls].lower()
            conf = float(box.conf[0])

            detected.add(label)
            visible_frames[label] += 1

            x1, y1, x2, y2 = map(int, box.xyxy[0])
            cv2.rectangle(frame, (x1, y1), (x2, y2), (0, 0, 255), 2)
            cv2.putText(frame, label.upper(), (x1, y1 - 10),
                        cv2.FONT_HERSHEY_SIMPLEX, 0.6, (0, 0, 255), 2)

            if is_connected:
                sio.emit("ai-detection", {
                    "label": label.upper(),
                    "confidence": round(conf, 2),
                    "time": datetime.datetime.now().isoformat()
                })

    # ===================== SELECT SIGN =====================
    chosen = None
    for lbl in detected:
        # Child/pedestrian crossing gets immediate priority
        if lbl in ["child", "child-pedestrian"]:
            chosen = lbl
            break
        elif visible_frames[lbl] >= PERSIST_FRAMES:
            chosen = lbl
            break

    # ===================== ALERT =====================
    if chosen:
        # Immediate alert for child/pedestrian crossing
        if chosen in ["child", "child-pedestrian"]:
            speak_async(VOICE_TEXT.get(chosen, "Pedestrian crossing ahead"))
            print(f"🚸 ALERT: {VOICE_TEXT.get(chosen)}")
        # Regular alert logic for other signs
        elif alert_count[chosen] < MAX_ALERTS and time.time() - last_alert_time >= ALERT_DELAY:
            if "speed limit" in chosen:
                speed = get_speed_from_label(chosen)
                if speed:
                    speak_async(f"Speed limit {speed} detected. Please reduce your speed to {speed}.")
            else:
                speak_async(VOICE_TEXT.get(chosen, "Traffic sign ahead"))

            alert_count[chosen] += 1
            last_alert_time = time.time()

    # ===================== HUD =====================
    cv2.putText(frame, f"FPS: {fps}", (10, resH - 10),
                cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0, 255, 255), 2)

    _, buffer = cv2.imencode('.jpg', frame)
    sio.emit("video-frame", base64.b64encode(buffer).decode())

# ===================== CLEANUP =====================
if cap:
    cap.release()
sio.disconnect()
