import { Component } from '@angular/core';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from './shared/sidebar/sidebar.component';
import { NavbarComponent } from './shared/navbar/navbar.component';
import { SystemStateService } from './services/system-state.service';
import { SocketService } from './services/socket.service';
import { filter } from 'rxjs/operators';

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [CommonModule, RouterOutlet, SidebarComponent, NavbarComponent],
    templateUrl: './app.html',
    styleUrl: './app.css'
})
export class App {
    showLayout = true;

    constructor(
        public systemState: SystemStateService,
        private socketService: SocketService,
        private router: Router
    ) {
        // Hide sidebar/navbar on home page
        this.router.events.pipe(
            filter(event => event instanceof NavigationEnd)
        ).subscribe((event: any) => {
            this.showLayout = event.url !== '/';
        });
    }

    handleToggleCamera() {
        const isActive = this.systemState.toggleActive();
        this.socketService.sendControlCommand(isActive ? 'start' : 'stop');
    }
}
