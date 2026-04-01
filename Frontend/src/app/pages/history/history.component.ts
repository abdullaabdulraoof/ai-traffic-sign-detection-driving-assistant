import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SystemStateService } from '../../services/system-state.service';

@Component({
  selector: 'app-history',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="space-y-4 lg:space-y-6">
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-3 lg:gap-4">
        <div>
          <h1 class="text-xl lg:text-2xl font-bold text-white uppercase tracking-wider">Detection History</h1>
          <p class="text-gray-500 text-xs lg:text-sm mt-1">Reviewing {{ systemState.detections().length }} total events.</p>
        </div>
        
        <div class="flex gap-3">
          <div class="relative flex-1 md:flex-initial">
            <input type="text" 
                   [(ngModel)]="searchQuery"
                   placeholder="Search signs..." 
                   class="bg-[#111827] border border-gray-800 rounded-xl px-8 lg:px-10 py-2 lg:py-2.5 text-xs lg:text-sm text-white focus:outline-none focus:border-green-500/50 w-full md:w-64">
            <span class="absolute left-3 lg:left-4 top-1/2 -translate-y-1/2 text-gray-500 text-sm">🔍</span>
          </div>
        </div>
      </div>

      <!-- Table -->
      <div class="bg-[#111827] rounded-2xl lg:rounded-3xl border border-gray-800 shadow-xl overflow-hidden">
        <div class="overflow-x-auto max-h-[500px] lg:h-[600px] overflow-y-auto custom-scrollbar">
          <!-- Desktop Table -->
          <table class="hidden md:table w-full text-left border-collapse">
            <thead class="sticky top-0 z-10">
              <tr class="bg-gray-900 border-b border-gray-800">
                <th class="px-4 lg:px-6 py-3 lg:py-4 text-[10px] font-bold text-gray-500 uppercase tracking-widest">Timestamp</th>
                <th class="px-4 lg:px-6 py-3 lg:py-4 text-[10px] font-bold text-gray-500 uppercase tracking-widest">Sign Name</th>
                <th class="px-4 lg:px-6 py-3 lg:py-4 text-[10px] font-bold text-gray-500 uppercase tracking-widest">Category</th>
                <th class="px-4 lg:px-6 py-3 lg:py-4 text-[10px] font-bold text-gray-500 uppercase tracking-widest">Confidence</th>
                <th class="px-4 lg:px-6 py-3 lg:py-4 text-[10px] font-bold text-gray-500 uppercase tracking-widest">Source</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-800/50">
              <tr *ngFor="let entry of filteredDetections()" class="hover:bg-white/[0.02] transition-colors group">
                <td class="px-4 lg:px-6 py-3 lg:py-4">
                  <span class="text-xs text-gray-400 font-mono">{{ entry.timestamp | date:'MMM d, HH:mm:ss.SSS' }}</span>
                </td>
                <td class="px-4 lg:px-6 py-3 lg:py-4">
                  <span class="text-sm font-medium text-white">{{ entry.label }}</span>
                </td>
                <td class="px-4 lg:px-6 py-3 lg:py-4">
                  <span [class]="getCategoryBadgeClass(entry.category)" class="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full border">
                    {{ entry.category }}
                  </span>
                </td>
                <td class="px-4 lg:px-6 py-3 lg:py-4">
                  <span class="text-xs text-gray-400 font-mono">{{ entry.confidence * 100 | number:'1.0-1' }}%</span>
                </td>
                <td class="px-4 lg:px-6 py-3 lg:py-4">
                  <span class="text-xs text-gray-500 uppercase">{{ entry.source }}</span>
                </td>
              </tr>
              <tr *ngIf="filteredDetections().length === 0">
                <td colspan="5" class="px-6 py-20 text-center text-gray-600">No detections match your search criteria.</td>
              </tr>
            </tbody>
          </table>

          <!-- Mobile Card View -->
          <div class="md:hidden space-y-3 p-3">
            <div *ngFor="let entry of filteredDetections()" class="bg-gray-900 rounded-xl p-4 border border-gray-800">
              <div class="flex justify-between items-start mb-3">
                <div>
                  <h3 class="text-white font-bold text-sm">{{ entry.label }}</h3>
                  <span class="text-[10px] text-gray-500 font-mono">{{ entry.timestamp | date:'MMM d, HH:mm:ss' }}</span>
                </div>
                <span [class]="getCategoryBadgeClass(entry.category)" class="text-[9px] font-bold uppercase px-2 py-0.5 rounded-full border">
                  {{ entry.category }}
                </span>
              </div>
              <div class="flex justify-between text-xs">
                <span class="text-gray-500">Confidence: <span class="text-gray-400 font-mono">{{ entry.confidence * 100 | number:'1.0-1' }}%</span></span>
                <span class="text-gray-500 uppercase">{{ entry.source }}</span>
              </div>
            </div>
            <div *ngIf="filteredDetections().length === 0" class="py-20 text-center text-gray-600 text-sm">
              No detections match your search criteria.
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class HistoryComponent {
  searchQuery = signal('');

  filteredDetections = computed(() => {
    const query = this.searchQuery().toLowerCase();
    const detections = this.systemState.detections();
    if (!query) return detections;
    return detections.filter(d =>
      d.label.toLowerCase().includes(query) ||
      d.category.toLowerCase().includes(query)
    );
  });

  constructor(public systemState: SystemStateService) { }

  getCategoryBadgeClass(category: string): string {
    switch (category) {
      case 'danger': return 'bg-red-500/10 text-red-500 border-red-500/20';
      case 'prohibitory': return 'bg-orange-500/10 text-orange-500 border-orange-500/20';
      case 'mandatory': return 'bg-green-500/10 text-green-500 border-green-500/20';
      default: return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
    }
  }
}
