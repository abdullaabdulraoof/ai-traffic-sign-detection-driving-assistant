import socketio
import pyttsx3
import threading
import time

# ===================== SOCKET.IO SETUP =====================
sio = socketio.Client()

@sio.event
def connect():
    print("✅ Python AI Chatbot Connected to Server")

@sio.event
def disconnect():
    print("❌ Python AI Chatbot Disconnected")

@sio.on("user-message")
def handle_message(data):
    user_text = data.get("message", "").lower()
    print(f"📩 Received: {user_text}")
    
    response = generate_response(user_text)
    
    # Speak the response asynchronously
    speak_async(response)
    
    # Send back to server
    sio.emit("bot-response", {"response": response})
    print(f"📤 Sent Response: {response}")

# ===================== TTS SETUP =====================
def speak_async(text):
    def run():
        try:
            engine = pyttsx3.init()
            engine.setProperty("rate", 160)
            engine.setProperty("volume", 1.0)
            engine.say(text)
            engine.runAndWait()
        except Exception as e:
            print(f"🔊 TTS Error: {e}")
    threading.Thread(target=run, daemon=True).start()

# ===================== AI LOGIC =====================
def generate_response(text):
    if "overtake" in text or "pass" in text:
        return "Overtake only if the road is clear, you have enough space, and there are no solid lines or signs prohibiting it."
    
    elif "traffic" in text or "jam" in text:
        return "In heavy traffic, maintain a safe following distance and stay alert for sudden stops. Do not change lanes unnecessarily."
    
    elif "blocked" in text or "obstacle" in text:
        return "If the road is blocked, stop safely, turn on your hazard lights if necessary, and wait for instructions or a clear path."
    
    elif "speed" in text or "fast" in text:
        return "Always adhere to the posted speed limits. Reducing your speed gives you more time to react to unexpected hazards."
    
    elif "rain" in text or "weather" in text:
        return "In bad weather, reduce your speed and increase your following distance. Turn on your headlights for better visibility."
    
    elif "hello" in text or "hi" in text:
        return "Hello! I am your AI Driving Assistant. I can help you with safety tips and traffic rules. What's on your mind?"
    
    else:
        return "I understand. Please remember to stay alert and keep both hands on the wheel. Safety first!"

# ===================== MAIN LOOP =====================
def start_service():
    connected = False
    while not connected:
        try:
            sio.connect("http://127.0.0.1:3000")
            connected = True
        except Exception as e:
            print(f"⚠️ Connection failed, retrying in 5s... ({e})")
            time.sleep(5)
    
    try:
        sio.wait()
    except KeyboardInterrupt:
        sio.disconnect()

if __name__ == "__main__":
    start_service()
