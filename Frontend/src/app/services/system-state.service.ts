import { Injectable, signal, computed } from '@angular/core';

export interface Detection {
    id: string;
    label: string;
    category: 'danger' | 'prohibitory' | 'mandatory' | 'other';
    confidence: number;
    timestamp: Date;
    source: string;
}

export interface SystemSettings {
    cameraSource: string;
    resolution: string;
    confidenceThreshold: number;
    alertDelay: number;
    maxAlertsPerSign: number;
    voiceAlerts: boolean;
}

@Injectable({
    providedIn: 'root'
})
export class SystemStateService {
    isActive = signal(false);
    fps = signal(0);
    isSocketConnected = signal(false);
    isMicActive = signal(false);

    // Detections Store
    private _detections = signal<Detection[]>([]);
    detections = this._detections.asReadonly();

    recentDetections = computed(() => {
        return this._detections().slice(0, 50); // Keep last 50 for live views
    });

    // Stats computed from detections
    stats = computed(() => {
        const list = this._detections();
        return {
            total: list.length,
            danger: list.filter(d => d.category === 'danger').length,
            prohibitory: list.filter(d => d.category === 'prohibitory').length,
            mandatory: list.filter(d => d.category === 'mandatory').length,
            other: list.filter(d => d.category === 'other').length
        };
    });

    // Settings
    settings = signal<SystemSettings>({
        cameraSource: 'Integrated Webcam (0)',
        resolution: '720p',
        confidenceThreshold: 0.45,
        alertDelay: 100,
        maxAlertsPerSign: 5,
        voiceAlerts: true
    });

    updateFps(value: number) {
        this.fps.set(value);
    }

    toggleActive() {
        this.isActive.set(!this.isActive());
        return this.isActive();
    }

    addDetection(data: any) {
        const newDetection: Detection = {
            id: Math.random().toString(36).substr(2, 9),
            label: data.label || 'Unknown',
            category: (data.category?.toLowerCase() || 'other') as any,
            confidence: data.confidence || 0,
            timestamp: new Date(),
            source: this.settings().cameraSource
        };

        this._detections.update(prev => [newDetection, ...prev]);
    }

    updateSettings(newSettings: Partial<SystemSettings>) {
        this.settings.update(s => ({ ...s, ...newSettings }));
    }

    setSocketStatus(connected: boolean) {
        this.isSocketConnected.set(connected);
    }
}

