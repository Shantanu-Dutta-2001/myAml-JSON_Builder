import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-hero',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './hero.component.html',
    styleUrl: './hero.component.scss'
})
export class HeroComponent {

    /**
     * Smooth scroll to the builder section
     */
    scrollToBuilder(): void {
        const builderSection = document.getElementById('builder-section');
        if (builderSection) {
            builderSection.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    }
}
