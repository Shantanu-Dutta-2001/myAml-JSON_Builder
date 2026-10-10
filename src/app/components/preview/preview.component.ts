import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { JsonStateService } from '../../services/json-state.service';
import { Observable } from 'rxjs';
import { DynamicData } from '../../models/schema.model';

// PrimeNG
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { MessageService } from 'primeng/api';

@Component({
    selector: 'app-preview',
    standalone: true,
    imports: [CommonModule, ButtonModule, TooltipModule],
    templateUrl: './preview.component.html',
    styleUrl: './preview.component.scss'
})
export class PreviewComponent {
    state$: Observable<DynamicData>;

    constructor(private jsonState: JsonStateService, private messageService: MessageService) {
        this.state$ = this.jsonState.state$;
    }

    get jsonContent(): string {
        return JSON.stringify(this.jsonState.currentData, null, 2);
    }

    copyToClipboard() {
        navigator.clipboard.writeText(this.jsonContent).then(
            () => this.messageService.add({ severity: 'success', summary: 'Copied', detail: 'JSON copied to clipboard', life: 2500 }),
            () => this.messageService.add({ severity: 'error', summary: 'Copy failed', detail: 'Could not access the clipboard', life: 3000 })
        );
    }

    downloadJson() {
        const blob = new Blob([this.jsonContent], { type: 'application/json' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `myaml-data-${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        window.URL.revokeObjectURL(url);
        this.messageService.add({ severity: 'success', summary: 'Downloaded', detail: 'JSON file saved', life: 2500 });
    }
}
