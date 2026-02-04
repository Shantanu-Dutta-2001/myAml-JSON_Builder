import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { JsonStateService } from '../../services/json-state.service';
import { SchemaField, FieldType, DynamicSchema } from '../../models/schema.model';
import { Observable } from 'rxjs';

// PrimeNG v21
import { InputText } from 'primeng/inputtext';
import { Button } from 'primeng/button';
import { Select } from 'primeng/select';
import { Tooltip } from 'primeng/tooltip';

@Component({
    selector: 'app-schema-builder',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        Button,
        InputText,
        Select,
        Tooltip
    ],
    templateUrl: './schema-builder.component.html',
    styleUrl: './schema-builder.component.scss'
})
export class SchemaBuilderComponent implements OnInit {

    schema$: Observable<DynamicSchema>;

    fieldTypes = [
        { label: 'String', value: 'string' },
        { label: 'Number (Decimal)', value: 'number' },
        { label: 'Integer', value: 'integer' },
        { label: 'Boolean', value: 'boolean' },
        { label: 'Object', value: 'object' },
        { label: 'Array', value: 'array' },
        { label: 'Date', value: 'date' },
        { label: 'Enum / Dropdown', value: 'enum' },
        { label: 'Null', value: 'null' }
    ];

    constructor(private jsonState: JsonStateService) {
        this.schema$ = this.jsonState.schema$;
    }

    ngOnInit(): void { }

    addField(parentFields?: SchemaField[]) {
        if (parentFields) {
            const newField: SchemaField = {
                key: `child_${parentFields.length + 1}`,
                label: 'New Child Field',
                type: 'string'
            };
            parentFields.push(newField);
        } else {
            const currentSchema = this.jsonState.currentSchema;
            const newField: SchemaField = {
                key: `field_${currentSchema.fields.length + 1}`,
                label: 'New Field',
                type: 'string',
                placeholder: 'Enter value'
            };
            this.jsonState.updateSchema({
                fields: [...currentSchema.fields, newField]
            });
            return;
        }

        // Trigger generic update to sync the state
        this.jsonState.updateSchema({ fields: [...this.jsonState.currentSchema.fields] });
    }

    onTypeChange(index: number, type: FieldType, field: SchemaField) {
        if (type === 'object') {
            if (!field.children) {
                field.children = [
                    { key: 'child_1', label: 'Child Field', type: 'string' }
                ];
            }
        } else if (type === 'array') {
            if (!field.children) {
                field.children = [
                    { key: 'item', label: 'Item Schema', type: 'string' }
                ];
            }
        } else if (type === 'enum') {
            if (!field.options) {
                field.options = [
                    { label: 'Option 1', value: 'opt1' }
                ];
            }
            delete field.children;
        } else {
            delete field.children;
            delete field.options;
        }
        this.updateField(index, { type });
    }

    removeField(index: number, parentFields?: SchemaField[]) {
        if (parentFields) {
            parentFields.splice(index, 1);
            this.jsonState.updateSchema({ fields: [...this.jsonState.currentSchema.fields] });
        } else {
            const currentSchema = this.jsonState.currentSchema;
            const newFields = currentSchema.fields.filter((_, i) => i !== index);
            this.jsonState.updateSchema({ fields: newFields });
        }
    }

    updateField(index: number, changes: Partial<SchemaField>) {
        const currentSchema = this.jsonState.currentSchema;
        const newFields = [...currentSchema.fields];
        newFields[index] = { ...newFields[index], ...changes };
        this.jsonState.updateSchema({ fields: newFields });
    }

    trackByFn(index: number) {
        return index;
    }
}
