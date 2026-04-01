import { Injectable, inject } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { Observable } from 'rxjs';
import { SystemStateService } from './system-state.service';
import { environment } from '../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class SocketService {
    private socket: Socket;
    private readonly URL = environment.apiUrl;
    private systemState = inject(SystemStateService);

    constructor() {
        this.socket = io(this.URL);

        // Monitor global connection
        this.socket.on('connect', () => {
            console.log('✅ Connected to Socket Server');
            this.systemState.setSocketStatus(true);
        });

        this.socket.on('disconnect', () => {
            console.log('🔴 Disconnected from Socket Server');
            this.systemState.setSocketStatus(false);
        });

        // Listen for detection events globally
        this.socket.on('frontend-detection', (data) => {
            this.systemState.addDetection(data);
        });

        // Listen for performance data globally
        this.socket.on('performance-stats', (data: { fps: number }) => {
            this.systemState.updateFps(data.fps);
        });
    }

    // Send control command
    sendControlCommand(command: 'start' | 'stop') {
        this.socket.emit('camera-control', { command });
    }

    // Send manual speed alert
    sendManualSpeedAlert(speed: string) {
        this.socket.emit('manual-speed-alert', { speed });
    }

    // --- Driver Chat Methods ---
    sendMessage(message: string) {
        this.socket.emit('user-message', { message });
    }

    onBotResponse(): Observable<any> {
        return new Observable(observer => {
            this.socket.on('bot-response', (data) => observer.next(data));
            return () => this.socket.off('bot-response');
        });
    }

    // Listen for detection events specifically for components if needed (RxJS style)
    onDetection(): Observable<any> {
        return new Observable(observer => {
            this.socket.on('frontend-detection', (data) => observer.next(data));
            return () => this.socket.off('frontend-detection');
        });
    }

    // Listen for video frames (remains separate as it's binary-heavy)
    onVideoFrame(): Observable<string> {
        return new Observable(observer => {
            this.socket.on('video-frame', (data) => observer.next(data));
            return () => this.socket.off('video-frame');
        });
    }

    // Check connection status (RxJS style)
    onConnect(): Observable<void> {
        return new Observable(observer => {
            this.socket.on('connect', () => observer.next());
        });
    }
}

