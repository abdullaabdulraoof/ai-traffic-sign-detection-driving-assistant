import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <header class="h-16 lg:h-20 bg-[#0B0F19]/80 backdrop-blur-md border-b border-gray-800 flex items-center justify-between px-4 lg:px-8 sticky top-0 z-40">
      <!-- Left: Info -->
      <div class="flex items-center gap-3 lg:gap-6">
        <!-- Mobile Logo & Name (Visible only on mobile/tablet) -->
        <div class="flex lg:hidden items-center gap-2">
          <img src="favicon.png" alt="Logo" class="w-8 h-8 object-contain">
          <span class="text-white font-black text-sm tracking-tighter">DRIVE MATE</span>
        </div>

        <!-- Model Info (Hidden on small mobile) -->
        <div class="hidden sm:flex flex-col">
          <span class="text-[10px] lg:text-xs text-gray-500 uppercase tracking-wider font-semibold">Model</span>
          <span class="text-white font-medium text-xs lg:text-sm">YOLOv8 - Traffic Signs</span>
        </div>
        
        <div class="hidden md:block h-8 w-px bg-gray-800"></div>
        
        <!-- FPS Info (Hidden on mobile) -->
        <div class="hidden lg:flex flex-col">
          <span class="text-[10px] lg:text-xs text-gray-500 uppercase tracking-wider font-semibold">Performance</span>
          <span class="text-green-500 font-mono text-xs lg:text-sm">{{ fps }} <span class="text-[10px] text-gray-400">FPS</span></span>
        </div>
      </div>

      <!-- Right: Status + Controls -->
      <div class="flex items-center gap-2 lg:gap-4">
        <!-- About Link (Mobile Only) -->
        <a routerLink="/about" 
           class="flex items-center justify-center w-8 h-8 lg:hidden rounded-full bg-blue-600/10 text-blue-500 border border-blue-500/20 hover:bg-blue-600/20 transition-all active:scale-95">
          <i class="fas fa-info-circle text-sm"></i>
        </a>

        <!-- Status Badge -->
        <div class="flex items-center bg-gray-900 border border-gray-800 rounded-full p-1 px-2 lg:p-1.5 lg:px-3 gap-1.5 lg:gap-2">
          <div [class.bg-green-500]="isActive" [class.bg-red-500]="!isActive" class="w-1.5 h-1.5 lg:w-2 lg:h-2 rounded-full"></div>
          <span class="text-[10px] lg:text-xs font-medium" [class.text-green-500]="isActive" [class.text-red-500]="!isActive">
            {{ isActive ? 'ACTIVE' : 'STANDBY' }}
          </span>
        </div>

        <!-- Start/Stop Button -->
        <button (click)="toggleCamera.emit()" 
                [class]="isActive ? 'bg-red-500/10 text-red-500 border-red-500/20' : 'bg-green-500/10 text-green-500 border-green-500/20'"
                class="flex items-center gap-1.5 lg:gap-2 px-3 lg:px-6 py-1.5 lg:py-2 rounded-full border font-bold text-xs lg:text-sm transition-all hover:scale-105 active:scale-95">
          <span class="hidden sm:inline">{{ isActive ? '⏹ STOP' : '▶ START' }}</span>
          <span class="sm:hidden">{{ isActive ? '⏹' : '▶' }}</span>
        </button>
      </div>
    </header>
  `,
  styles: [`
    :host { display: block; }
  `]
})
export class NavbarComponent {
  @Input() isActive = false;
  @Input() fps = 0;
  @Output() toggleCamera = new EventEmitter<void>();
}
