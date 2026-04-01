import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SocketService } from '../../services/socket.service';

@Component({
    selector: 'app-speed-control',
    standalone: true,
    imports: [CommonModule, FormsModule],
    template: `
    <div class="bg-[#151B28] border border-gray-800 rounded-xl p-4 shadow-sm">
      <div class="flex items-center gap-3 mb-4">
        <div class="p-2 bg-blue-500/10 rounded-lg">
          <svg class="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
        <h3 class="font-semibold text-gray-100">Speed Control</h3>
      </div>
      
      <div class="space-y-4">
        <div>
          <label class="block text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">
            Target Speed Limit (km/h)
          </label>
          <div class="flex gap-2">
            <input 
              type="text" 
              [(ngModel)]="speedValue"
              placeholder="e.g. 50"
              class="flex-1 bg-[#0B0F19] border border-gray-700 rounded-lg px-3 py-2 text-sm text-gray-200 focus:outline-none focus:border-blue-500 transition-colors"
            />
            <button 
              (click)="sendAlert()"
              class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-lg shadow-blue-500/20"
            >
              Alert
            </button>
          </div>
        </div>
        
        <p class="text-xs text-gray-500 italic">
          Sends an immediate voice alert to the AI service.
        </p>
      </div>
    </div>
  `
})
export class SpeedControlComponent {
    private socketService = inject(SocketService);
    speedValue: string = '';

    sendAlert() {
        if (this.speedValue.trim()) {
            this.socketService.sendManualSpeedAlert(this.speedValue);
            console.log('Manual alert sent:', this.speedValue);
            this.speedValue = ''; // Clear after send
        }
    }
}
