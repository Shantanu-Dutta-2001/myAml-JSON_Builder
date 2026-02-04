import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { JsonStateService } from '../../services/json-state.service';
import { DynamicSchema, DynamicData, SchemaField } from '../../models/schema.model';
import { InputText } from 'primeng/inputtext';
import { InputNumber } from 'primeng/inputnumber';
import { Checkbox } from 'primeng/checkbox';
import { Button } from 'primeng/button';
import { Select } from 'primeng/select';
import { DatePicker } from 'primeng/datepicker';
import { Observable, combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
    selector: 'app-form-editor',
    standalone: true,
    imports: [CommonModule, FormsModule, InputText, InputNumber, Checkbox, Button, Select, DatePicker],
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

    onArrayItemUpdate(key: string, index: number, value: any) {
        this.jsonState.updateArrayField(key, index, value);
    }

    addItem(field: SchemaField, data: any) {
        if (field.children && field.children[0]) {
            this.jsonState.addItemToArray(field.key, field.children[0]);
            // If the data object is local (passed via recursive template), we might need to manually push
            // if it's not the root data. Direct binding in template usually handles root state, 
            // but for nested we rely on the service to trigger the update.
        }
    }

    removeItem(key: string, index: number) {
        this.jsonState.removeItemFromArray(key, index);
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
}
