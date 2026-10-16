import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Title } from '@angular/platform-browser';
import { RELEASE_NOTES } from '../../data/release-notes';

@Component({
    selector: 'app-release-notes',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './release-notes.component.html',
    styleUrl: './release-notes.component.scss'
})
export class ReleaseNotesComponent implements OnInit {
    notes = RELEASE_NOTES;

    constructor(private title: Title) { }

    ngOnInit(): void {
        this.title.setTitle('Release Notes - MyAML Laboratory');
    }

    // This page is opened in a new tab from the builder header, so "Back" closes it to return to the
    // builder tab. Browsers only let script close tabs they consider script-closable (e.g. a fresh tab
    // opened from a link); if the page was reached directly, fall back to navigating to the builder.
    backToBuilder(event: Event) {
        event.preventDefault();
        window.close();
        setTimeout(() => {
            if (!window.closed) window.location.href = './';
        }, 150);
    }

    // Parse as local date parts so "2026-10-11" never shifts a day in negative-UTC timezones.
    formatDate(iso: string): string {
        const [y, m, d] = iso.split('-').map(Number);
        return new Date(y, m - 1, d).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
    }
}
