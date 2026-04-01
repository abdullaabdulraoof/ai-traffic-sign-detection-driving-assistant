# 🚦 AI Traffic Sign Detection & Smart Driving Assistant

An **AI-powered traffic sign detection and driving assistant system** built using **Computer Vision, YOLO, and the MEAN stack**.
The system detects traffic signs in real time, announces them using voice alerts, compares detected speed limits with user-defined speed, and includes an AI chatbot that provides driving safety guidance.

This project demonstrates how **AI + real-time systems + web applications** can work together to improve road safety.

---

# 🧠 Project Overview

This system performs three main tasks:

1. **Traffic Sign Detection**
2. **Speed Monitoring Assistant**
3. **AI Driving Chatbot**

The AI model detects traffic signs from a live camera feed, announces the sign, and helps drivers stay within safe speed limits.

---

# 🎯 Key Features

## 🚧 Traffic Sign Detection

* Real-time traffic sign detection using YOLO
* Detects important road signs such as:

  * Stop signs
  * Speed limit signs
  * Pedestrian crossing
  * Warning signs
* Displays detection on a live dashboard
* Sends alerts through voice assistant

---

## 🔊 Voice Driving Assistant

When a sign is detected, the system announces it.

Example:
Stop Sign Detected → "Stop sign ahead"
Speed Limit 60 → "Speed limit 60 detected"

This helps drivers focus on the road without looking at the screen.

---

## 🚗 Smart Speed Monitoring

The system includes an **input field where the user sets their current speed**.

When a speed limit sign is detected:

* If vehicle speed **exceeds the detected limit**
  → The system warns the driver.

* If vehicle speed **is within the limit**
  → No alert is triggered.

Example logic:

Detected Speed Limit: 60
User Speed Input: 80

AI Response:
"You are exceeding the speed limit."

---

## 🤖 AI Driving Chatbot

The system also includes an **AI chatbot assistant** that answers driving-related questions.

Example questions:

* When can I overtake a vehicle?
* What should I do in heavy traffic?
* What should I do if the road is blocked?
* Safe driving tips

The chatbot responds with **real-time AI-generated driving guidance**.

---

# 🧪 Dataset & Model Training

For better accuracy, the AI model was trained using:

* Two different traffic sign datasets
* Combined and merged into a single training dataset
* Custom training using YOLO

Steps used:

1. Data collection
2. Dataset merging
3. Data labeling
4. Model training
5. Model optimization

This improved detection performance in real-world scenarios.

---

# 🏗 System Architecture

AI Detection Engine (Python + YOLO)
↓
Socket.IO Real-time Communication
↓
Backend Server (Node.js + Express)
↓
MongoDB Database
↓
Angular Dashboard (Frontend)

Additional Components:
Voice Assistant (Text-to-Speech)
AI Chatbot Engine

---

# 🧰 Technologies Used

## Artificial Intelligence

* YOLOv8
* OpenCV
* Python

## Backend

* Node.js
* Express.js
* Socket.IO

## Frontend

* Angular
* TypeScript
* HTML / CSS

## Database

* MongoDB
* Mongoose

## AI Voice System

* pyttsx3 (Text-to-Speech)

---

# 📂 Project Structure

traffic-sign-ai-system
│
├── ai-engine
│   ├── traffic_detection.py
│   ├── chatbot.py
│
├── backend
│   ├── server.js
│   ├── database.js
│
├── frontend
│   ├── angular-dashboard
│
├── models
│   ├── best.pt
│
└── README.md

---

# ⚙️ Installation Guide

## 1 Clone Repository

git clone https://github.com/YOUR_USERNAME/traffic-sign-ai-system.git

cd traffic-sign-ai-system

---

# Install Backend

cd backend

npm install

node server.js

Server runs on:
http://localhost:3000

---

# Install AI Engine

pip install ultralytics opencv-python pyttsx3 python-socketio

Run detection system:

python traffic_detection.py --model models/best.pt --source 0

Run chatbot:

python chatbot.py

---

# Run Frontend

cd frontend

npm install

ng serve

Open browser:

http://localhost:4200

---

# 📡 Real-Time System Communication

The system uses **Socket.IO** to connect:

AI Engine
Backend Server
Frontend Dashboard

Events used in the system:

video-frame
ai-detection
camera-control
manual-speed-alert
user-message
bot-response

---

# 💡 Example Workflow

1 Start the system
2 Camera begins detecting traffic signs
3 AI announces detected sign
4 User inputs vehicle speed
5 AI checks speed limit
6 If speed exceeds limit → warning is triggered
7 User can ask chatbot driving questions

---

# 🔮 Future Improvements

Mobile application integration
GPS-based speed detection
Cloud AI deployment
Edge AI optimization
More traffic sign classes
Driver behavior analysis

---

# 👨‍💻 Author

Abdulla Abdul Raoof
AI Engineer | Computer Vision | Edge AI | IoT Developer

GitHub
https://github.com/abdullaabdulraoof

LinkedIn
https://www.linkedin.com/in/abdullaabdulraoof

---

# ⭐ If you like this project

Please give this repository a **star**.
