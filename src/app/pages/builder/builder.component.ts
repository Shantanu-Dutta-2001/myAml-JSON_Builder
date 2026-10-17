import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormEditorComponent } from '../../components/form-editor/form-editor.component';
import { PreviewComponent } from '../../components/preview/preview.component';
import { HeroComponent } from '../../components/hero/hero.component';
import { SchemaBuilderComponent } from '../../components/schema-builder/schema-builder.component';
import { JsonStateService } from '../../services/json-state.service';
import { RELEASE_NOTES } from '../../data/release-notes';
import {
    countKeyProblems, dataStats, formatBytes, requiredEmptyPaths, schemaDepth
} from '../../utils/json-display';

type TabId = 'blueprint' | 'editor';

interface StatusInfo {
    ok: boolean;
    label: string;
    meta: string[];
    file: string;
}

@Component({
    selector: 'app-builder',
    standalone: true,
    imports: [
        CommonModule,
        FormEditorComponent,
        PreviewComponent,
        HeroComponent,
        SchemaBuilderComponent
    ],
    templateUrl: './builder.component.html',
    styleUrl: './builder.component.scss'
})
export class BuilderComponent {
    latestVersion = RELEASE_NOTES[0]?.version ?? '';

    tabs: { id: TabId; num: string; file: string }[] = [
        { id: 'blueprint', num: '01', file: 'blueprint.schema' },
        { id: 'editor', num: '02', file: 'editor.json' }
    ];
    activeTab: TabId = 'blueprint';

    // Mobile: one Editor pane at a time.
    editorView: 'data' | 'json' = 'data';

    constructor(private jsonState: JsonStateService) { }

    reset() {
        this.jsonState.reset();
    }

    selectTab(id: TabId) {
        this.activeTab = id;
    }

    // Arrow keys switch tabs.
    onTabKeydown(event: KeyboardEvent) {
        if (event.key !== 'ArrowRight' && event.key !== 'ArrowLeft') return;
        event.preventDefault();
        const next: TabId = this.activeTab === 'blueprint' ? 'editor' : 'blueprint';
        this.selectTab(next);
        setTimeout(() => document.getElementById('tab-' + next)?.focus());
    }

    // Status bar text (read-only).
    get status(): StatusInfo {
        const schema = this.jsonState.currentSchema;
        if (this.activeTab === 'blueprint') {
            const problems = countKeyProblems(schema.fields);
            const count = schema.fields.length;
            return {
                ok: problems === 0,
                label: problems === 0 ? 'valid blueprint' : `${problems} key ${problems === 1 ? 'problem' : 'problems'}`,
                meta: [`${count} ${count === 1 ? 'field' : 'fields'}`, `depth ${schemaDepth(schema.fields)}`],
                file: 'blueprint.schema'
            };
        }
        const data = this.jsonState.currentData;
        const missing = requiredEmptyPaths(schema.fields, data).length;
        const stats = dataStats(data);
        const bytes = new TextEncoder().encode(JSON.stringify(data, null, 2)).length;
        return {
            ok: missing === 0,
            label: missing === 0 ? 'valid JSON' : `${missing} required ${missing === 1 ? 'field' : 'fields'} empty`,
            meta: [`${stats.nodes} nodes`, `depth ${stats.depth}`, formatBytes(bytes)],
            file: 'output.json'
        };
    }
}
