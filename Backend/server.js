const express = require('express')
const app = express()
const http = require('http')
const server = http.createServer(app)
const { Server } = require("socket.io")
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
})
const connectDB = require('./config/db')

const port = 3000

// Connect to MongoDB
connectDB();


app.get('/', (req, res) => {
    res.send('Hello World!')
})

io.on('connection', (socket) => {
    console.log('a user connected');

    socket.on('disconnect', () => {
        console.log('user disconnected');
    });

    socket.on('ai-detection', (data) => {
        console.log('AI Detection detected:', data);
        io.emit('frontend-detection', data);
    });

    socket.on('video-frame', (data) => {
        io.emit('video-frame', data);
    });

    socket.on('camera-control', (data) => {
        console.log('Camera Control:', data);
        io.emit('camera-control', data);
    });

    socket.on('manual-speed-alert', (data) => {
        console.log('Manual Speed Alert:', data);
        io.emit('manual-speed-alert', data);
    });

    // --- Driver Chat Events ---
    socket.on('user-message', (data) => {
        console.log('💬 User Message:', data.message);
        // Relay to Python AI
        io.emit('user-message', data);
    });

    socket.on('bot-response', (data) => {
        console.log('🤖 Bot Response:', data.response);
        // Relay back to Angular
        io.emit('bot-response', data);
    });
});

server.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})
