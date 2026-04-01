import { Component, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SystemStateService } from '../../services/system-state.service';

@Component({
  selector: 'app-analytics',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="space-y-6 lg:space-y-8">
      <div class="flex items-center justify-between">
        <h1 class="text-xl lg:text-2xl font-bold text-white uppercase tracking-wider">Analytics Overview</h1>
      </div>

      <!-- Stats Grid -->
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-6">
        <div *ngFor="let stat of computedStats()" class="bg-[#111827] p-4 lg:p-6 rounded-2xl lg:rounded-3xl border border-gray-800 shadow-xl group hover:border-gray-700 transition-all">
          <div class="flex items-center justify-between mb-3 lg:mb-4">
            <span class="text-2xl lg:text-3xl">{{ stat.icon }}</span>
          </div>
          <h3 class="text-gray-500 text-[10px] lg:text-sm font-medium uppercase tracking-wider">{{ stat.label }}</h3>
          <p class="text-2xl lg:text-3xl font-bold text-white mt-1">{{ stat.value | number }}</p>
        </div>
      </div>

      <!-- Live Chart Mockup -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
        <div class="bg-[#111827] p-6 lg:p-8 rounded-2xl lg:rounded-3xl border border-gray-800 shadow-xl">
          <h3 class="text-base lg:text-lg font-bold text-white mb-4 lg:mb-6 uppercase tracking-tight">Detection Distribution</h3>
          <div class="flex items-center gap-6 lg:gap-8">
            <div class="flex-1 space-y-3 lg:space-y-4">
               <div *ngFor="let item of categoryDistribution()" class="space-y-2">
                 <div class="flex justify-between text-[10px] lg:text-xs uppercase font-bold tracking-widest text-gray-500">
                   <span>{{ item.label }}</span>
                   <span>{{ item.percentage | number:'1.0-0' }}%</span>
                 </div>
                 <div class="w-full h-1.5 lg:h-2 bg-gray-800 rounded-full overflow-hidden">
                   <div [class]="item.color" class="h-full transition-all duration-1000" [style.width.%]="item.percentage"></div>
                 </div>
               </div>
            </div>
            <div class="hidden md:block w-24 h-24 lg:w-32 lg:h-32 border-8 border-gray-800 rounded-full relative">
              <div class="absolute inset-0 flex items-center justify-center text-xs font-bold text-gray-400">YOLO</div>
            </div>
          </div>
        </div>

        <div class="bg-[#111827] p-6 lg:p-8 rounded-2xl lg:rounded-3xl border border-gray-800 shadow-xl">
          <h3 class="text-base lg:text-lg font-bold text-white mb-4 lg:mb-6 uppercase tracking-tight">System Health</h3>
          <div class="space-y-4 lg:space-y-6">
             <div class="flex items-center justify-between">
               <span class="text-xs font-bold text-gray-500 uppercase">Detection Engine</span>
               <span [class.text-green-500]="systemState.isActive()" [class.text-red-500]="!systemState.isActive()" class="text-sm font-mono font-bold">
                 {{ systemState.isActive() ? 'RUNNING' : 'STOPPED' }}
               </span>
             </div>
             <div class="flex items-center justify-between">
               <span class="text-xs font-bold text-gray-500 uppercase">Socket Stream</span>
               <span [class.text-green-500]="systemState.isSocketConnected()" [class.text-red-500]="!systemState.isSocketConnected()" class="text-sm font-mono font-bold">
                 {{ systemState.isSocketConnected() ? 'ONLINE' : 'OFFLINE' }}
               </span>
             </div>
             <div class="flex items-center justify-between">
               <span class="text-xs font-bold text-gray-500 uppercase">Inference Speed</span>
               <span class="text-sm font-mono text-green-500 font-bold">{{ systemState.fps() }} FPS</span>
             </div>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class AnalyticsComponent {
  constructor(public systemState: SystemStateService) { }

  computedStats = computed(() => {
    const s = this.systemState.stats();
    return [
      { label: 'Total Signs', value: s.total, icon: '🚦' },
      { label: 'Danger Signs', value: s.danger, icon: '⚠️' },
      { label: 'Prohibitory', value: s.prohibitory, icon: '🚫' },
      { label: 'Mandatory', value: s.mandatory, icon: '⬆️' },
    ];
  });

  categoryDistribution = computed(() => {
    const s = this.systemState.stats();
    if (s.total === 0) return [];
    return [
      { label: 'Danger', percentage: (s.danger / s.total) * 100, color: 'bg-red-500' },
      { label: 'Prohibitory', percentage: (s.prohibitory / s.total) * 100, color: 'bg-orange-500' },
      { label: 'Mandatory', percentage: (s.mandatory / s.total) * 100, color: 'bg-green-500' },
      { label: 'Other', percentage: (s.other / s.total) * 100, color: 'bg-blue-500' },
    ];
  });
}
