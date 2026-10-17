import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { JsonStateService } from '../../services/json-state.service';
import { DynamicSchema, DynamicData, SchemaField } from '../../models/schema.model';
import { InputNumber } from 'primeng/inputnumber';
import { Checkbox } from 'primeng/checkbox';
import { Select } from 'primeng/select';
import { DatePicker } from 'primeng/datepicker';
import { Tooltip } from 'primeng/tooltip';
import { Observable, combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
    selector: 'app-form-editor',
    standalone: true,
    imports: [CommonModule, FormsModule, InputNumber, Checkbox, Select, DatePicker, Tooltip],
    templateUrl: './form-editor.component.html',
    styleUrls: ['./form-editor.component.scss']
})
export class FormEditorComponent implements OnInit {
    vm$: Observable<{ schema: DynamicSchema, data: DynamicData }>;

    constructor(private jsonState: JsonStateService) {
        this.vm$ = combineLatest([this.jsonState.schema$, this.jsonState.state$]).pipe(
            map(([schema, data]) => ({ schema, data }))
        );
    }

    ngOnInit(): void { }

    onFieldUpdate(key: string, value: any) {
        this.jsonState.updateField(key, value);
    }

    onObjectFieldUpdate(parentKey: string, childKey: string, value: any) {
        const parentData = { ...this.jsonState.currentData[parentKey] };
        parentData[childKey] = value;
        this.jsonState.updateField(parentKey, parentData);
    }

    addItem(field: SchemaField, data: any) {
        if (!field.children || !field.children[0]) return;
        if (!Array.isArray(data[field.key])) {
            data[field.key] = [];
        }
        data[field.key].push(this.jsonState.getDefaultValueForType(field.children[0]));
        this.jsonState.notifyDataChanged();
    }

    removeItem(field: SchemaField, data: any, index: number) {
        data[field.key].splice(index, 1);
        this.jsonState.notifyDataChanged();
    }

    // Label tag, e.g. "string", "list".
    typeTag(type: string): string {
        return type === 'array' ? 'list' : type === 'object' ? 'group' : type;
    }

    trackByFn(index: number, item: any) {
        return index;
    }

    getChildField(field: any, j: number) {
        return {
            ...field.children[0],
            key: j,
            label: 'Item #' + (j + 1)
        };
    }

    // Non-blocking: only flags an empty required field.
    isRequiredEmpty(field: SchemaField, data: any): boolean {
        if (!field.required || !data) return false;
        const val = data[field.key];
        if (field.type === 'number' || field.type === 'integer') return val === null || val === undefined;
        if (field.type === 'boolean' || field.type === 'object' || field.type === 'array' || field.type === 'null') return false;
        return val === null || val === undefined || val === '';
    }
}
