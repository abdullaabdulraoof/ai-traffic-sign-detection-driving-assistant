import { Component, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SystemStateService } from '../../services/system-state.service';

@Component({
    selector: 'app-alerts',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="space-y-6">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-bold text-white uppercase tracking-wider">Alerts Log</h1>
          <p class="text-gray-500 text-sm mt-1">Dedicated feed of high-priority traffic sign detections.</p>
        </div>
        <button class="bg-red-500/10 text-red-500 border border-red-500/20 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest">Clear Log</button>
      </div>

      <div class="grid grid-cols-1 gap-4">
        <div *ngFor="let alert of alerts()" 
             [class]="getCategoryColor(alert.category)"
             class="p-6 rounded-3xl border flex items-center justify-between group hover:scale-[1.01] transition-all duration-300">
          <div class="flex items-center gap-6">
            <div class="w-12 h-12 rounded-2xl bg-black/20 flex items-center justify-center text-2xl group-hover:animate-bounce">
              {{ getIcon(alert.category) }}
            </div>
            <div>
              <div class="flex items-center gap-3">
                <h3 class="text-xl font-bold text-white">{{ alert.label }}</h3>
                <span class="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full border border-white/10 opacity-60">
                  {{ alert.category }}
                </span>
              </div>
              <p class="text-sm text-gray-500 mt-1">Detected at {{ alert.timestamp | date:'HH:mm:ss' }} via {{ alert.source }}</p>
            </div>
          </div>

          <div class="text-right">
             <div class="text-2xl font-mono font-bold text-white">{{ alert.confidence * 100 | number:'1.0-0' }}%</div>
             <div class="text-[10px] text-gray-500 uppercase font-bold tracking-tighter">Confidence</div>
          </div>
        </div>

        <div *ngIf="alerts().length === 0" class="py-20 text-center border-2 border-dashed border-gray-800 rounded-3xl">
           <p class="text-gray-600">No recent alerts to display.</p>
           <p class="text-xs text-gray-700 mt-2 uppercase">Start the camera to begin detection</p>
        </div>
      </div>
    </div>
  `,
})
export class AlertsComponent {
    constructor(public systemState: SystemStateService) { }

    alerts = computed(() => {
        return this.systemState.detections().slice(0, 20); // Show top 20
    });

    getCategoryColor(category: string): string {
        switch (category) {
            case 'danger': return 'bg-red-500/10 border-red-500/20 shadow-lg shadow-red-500/5';
            case 'prohibitory': return 'bg-orange-500/10 border-orange-500/20 shadow-lg shadow-orange-500/5';
            case 'mandatory': return 'bg-green-500/10 border-green-500/20 shadow-lg shadow-green-500/5';
            default: return 'bg-blue-500/10 border-blue-500/20';
        }
    }

    getIcon(category: string): string {
        switch (category) {
            case 'danger': return '⚠️';
            case 'prohibitory': return '🚫';
            case 'mandatory': return '⬆️';
            default: return '🚦';
        }
    }
}
