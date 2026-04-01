import { Component, signal, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SocketService } from '../services/socket.service';
import { SystemStateService } from '../services/system-state.service';
import { Subscription } from 'rxjs';
import { SpeedControlComponent } from '../shared/speed-control/speed-control.component';

@Component({
    selector: 'app-dashboard',
    standalone: true,
    imports: [CommonModule, SpeedControlComponent],
    templateUrl: './dashboard.html',
    styleUrl: './dashboard.css'
})
export class DashboardComponent implements OnInit, OnDestroy {
    videoFrame = signal<string | null>(null);

    private subscriptions: Subscription = new Subscription();

    constructor(
        private socketService: SocketService,
        public systemState: SystemStateService
    ) { }

    ngOnInit() {
        this.subscriptions.add(
            this.socketService.onVideoFrame().subscribe((data) => {
                if (this.systemState.isActive()) {
                    this.videoFrame.set('data:image/jpeg;base64,' + data);
                }
            })
        );
    }

    getCategoryColor(category: string): string {
        switch (category) {
            case 'danger': return 'bg-red-500/10 text-red-500 border-red-500/20';
            case 'prohibitory': return 'bg-orange-500/10 text-orange-500 border-orange-500/20';
            case 'mandatory': return 'bg-green-500/10 text-green-500 border-green-500/20';
            default: return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
        }
    }

    ngOnDestroy() {
        this.subscriptions.unsubscribe();
    }
}
