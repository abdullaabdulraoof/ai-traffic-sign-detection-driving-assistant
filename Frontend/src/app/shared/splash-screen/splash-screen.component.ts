import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-splash-screen',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './splash-screen.component.html',
    styleUrl: './splash-screen.component.css'
})
export class SplashScreenComponent implements OnInit {
    isVisible = true;

    ngOnInit() {
        // Component is managed by parent (App.ts)
    }
}
