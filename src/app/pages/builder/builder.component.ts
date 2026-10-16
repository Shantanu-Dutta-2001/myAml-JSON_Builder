import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormEditorComponent } from '../../components/form-editor/form-editor.component';
import { PreviewComponent } from '../../components/preview/preview.component';
import { HeroComponent } from '../../components/hero/hero.component';
import { SchemaBuilderComponent } from '../../components/schema-builder/schema-builder.component';
import { JsonStateService } from '../../services/json-state.service';
import { RELEASE_NOTES } from '../../data/release-notes';
import { TabsModule } from 'primeng/tabs';
import { ButtonModule } from 'primeng/button';

@Component({
    selector: 'app-builder',
    standalone: true,
    imports: [
        CommonModule,
        FormEditorComponent,
        PreviewComponent,
        HeroComponent,
        ButtonModule,
        SchemaBuilderComponent,
        TabsModule
    ],
    templateUrl: './builder.component.html',
    styleUrl: './builder.component.scss'
})
export class BuilderComponent {
    latestVersion = RELEASE_NOTES[0]?.version ?? '';

    constructor(private jsonState: JsonStateService) { }

    reset() {
        this.jsonState.reset();
    }
}
