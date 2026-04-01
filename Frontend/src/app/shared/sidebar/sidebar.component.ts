import { Component, signal, Output, EventEmitter, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SocketService } from '../../services/socket.service';
import { SystemStateService } from '../../services/system-state.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <!-- Bottom Navigation (Mobile Only) -->
    <nav class="lg:hidden fixed bottom-6 left-4 right-4 z-50">
      <div class="bg-black/60 backdrop-blur-xl border border-white/10 rounded-2xl p-2 shadow-2xl flex items-center justify-around">
        <a *ngFor="let item of bottomMenuItems" 
           [routerLink]="item.path" 
           routerLinkActive="bg-green-500/20 text-green-500 scale-110 shadow-lg shadow-green-500/20"
           class="flex flex-col items-center gap-1 p-2 rounded-xl text-gray-400 hover:text-white transition-all duration-300 active:scale-90">
          <span class="text-xl">{{ item.icon }}</span>
          <span class="text-[10px] font-bold uppercase tracking-tighter">{{ item.label }}</span>
        </a>
      </div>
    </nav>

    <!-- Sidebar (Desktop Only) -->
    <aside [class.w-64]="!isCollapsed()" 
           [class.w-20]="isCollapsed()" 
           class="hidden lg:flex h-screen bg-[#0B0F19] border-r border-gray-800 transition-all duration-300 flex-col z-50">
      
      <!-- Logo Section -->
      <div class="p-5 flex items-center gap-4">
        <img src="favicon.png" alt="Drive Mate Logo" class="w-14 h-14 object-contain rounded-lg shadow-lg shadow-blue-500/10">
        <div *ngIf="!isCollapsed()" class="overflow-hidden whitespace-nowrap">
          <h1 class="text-white font-bold text-lg tracking-tight">DRIVE MATE</h1>
          <p class="text-gray-500 text-xs">AI Driving Assistant</p>
        </div>
      </div>

      <!-- Navigation -->
      <nav class="flex-1 mt-6 px-4 space-y-2 overflow-y-auto">
        <a *ngFor="let item of menuItems" 
           [routerLink]="item.path" 
           routerLinkActive="bg-gray-800 text-white"
           class="flex items-center gap-4 px-4 py-3 rounded-xl text-gray-400 hover:bg-gray-800/50 hover:text-white transition-colors group/item">
          <span class="text-xl shrink-0">{{ item.icon }}</span>
          <span *ngIf="!isCollapsed()" class="font-medium whitespace-nowrap">{{ item.label }}</span>
          
          <!-- Tooltip for collapsed state -->
          <div *ngIf="isCollapsed()" class="fixed left-24 hidden group-hover/item:block bg-gray-800 text-white text-xs py-1 px-2 rounded ml-2 z-50">
            {{ item.label }}
          </div>
        </a>
      </nav>

      <!-- System Status -->
      <div class="p-4 mt-auto border-t border-gray-800">
        <div *ngIf="!isCollapsed()" class="bg-gray-900/50 rounded-xl p-4">
          <div class="flex items-center justify-between mb-2">
            <div class="flex items-center gap-2">
              <div [class.bg-green-500]="isConnected" [class.bg-red-500]="!isConnected" 
                   class="w-2 h-2 rounded-full"></div>
              <span class="text-xs font-medium" [class.text-green-500]="isConnected" [class.text-red-500]="!isConnected">
                {{ isConnected ? 'Online' : 'Offline' }}
              </span>
            </div>
            <!-- Mic Status -->
            <div *ngIf="systemState.isMicActive()" class="flex items-center gap-1.5 px-2 py-0.5 bg-red-500/20 rounded-full border border-red-500/30 animate-pulse">
                <i class="fas fa-microphone text-[10px] text-red-500"></i>
                <span class="text-[9px] font-bold text-red-500 uppercase">Live</span>
            </div>
          </div>
          <p class="text-[10px] text-gray-600 uppercase tracking-wider">System Status</p>
        </div>
        
        <div *ngIf="isCollapsed()" class="flex flex-col items-center gap-3">
          <div [class.bg-green-500]="isConnected" [class.bg-red-500]="!isConnected" 
               class="w-3 h-3 rounded-full"></div>
          <div *ngIf="systemState.isMicActive()" class="w-3 h-3 bg-red-500 rounded-full animate-ping"></div>
        </div>
      </div>
    </aside>
  `,
  styles: [`
    @keyframes slide-up {
      from { transform: translateY(10px); opacity: 0; }
      to { transform: translateY(0); opacity: 1; }
    }
    .animate-slide-up {
      animation: slide-up 0.2s ease-out forwards;
    }
  `]
})
export class SidebarComponent {
  isCollapsed = signal(false);
  isConnected = true;
  public systemState = inject(SystemStateService);

  menuItems = [
    { path: '/dashboard', label: 'Live View', icon: '📹' },
    { path: '/analytics', label: 'Analytics', icon: '📊' },
    { path: '/chat', label: 'Driver Chat', icon: '💬' },
    { path: '/alerts', label: 'Alerts', icon: '🔔' },
    { path: '/history', label: 'History', icon: '📁' },
    { path: '/about', label: 'About', icon: 'ℹ️' }
  ];

  bottomMenuItems = [
    { path: '/dashboard', label: 'Live', icon: '📹' },
    { path: '/chat', label: 'Chat', icon: '💬' },
    { path: '/analytics', label: 'Analytics', icon: '📊' },
    { path: '/alerts', label: 'Alerts', icon: '🔔' },
    { path: '/history', label: 'History', icon: '📁' }
  ];

  constructor(private socketService: SocketService) {
    this.socketService.onConnect().subscribe(() => {
      this.isConnected = true;
    });
  }

  toggleCollapse() {
    this.isCollapsed.update(v => !v);
  }
}
