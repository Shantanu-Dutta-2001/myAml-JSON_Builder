import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { JsonStateService } from '../../services/json-state.service';
import { SchemaField, FieldType, DynamicSchema } from '../../models/schema.model';
import { Observable } from 'rxjs';

// PrimeNG
import { Select } from 'primeng/select';
import { Tooltip } from 'primeng/tooltip';
import { Checkbox } from 'primeng/checkbox';
import { ConfirmationService } from 'primeng/api';

@Component({
    selector: 'app-schema-builder',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        Select,
        Tooltip,
        Checkbox
    ],
    templateUrl: './schema-builder.component.html',
    styleUrl: './schema-builder.component.scss'
})
export class SchemaBuilderComponent implements OnInit {

    schema$: Observable<DynamicSchema>;

    // `hint` is shown under each option.
    fieldTypes = [
        { label: 'Text (string)', value: 'string', hint: 'Words or sentences, e.g. "hello"' },
        { label: 'Number (decimal)', value: 'number', hint: 'Any number, e.g. 3.14' },
        { label: 'Whole number (integer)', value: 'integer', hint: 'No decimals, e.g. 42' },
        { label: 'Yes/No (boolean)', value: 'boolean', hint: 'Either true or false' },
        { label: 'Group (object)', value: 'object', hint: 'Holds named fields inside it' },
        { label: 'List (array)', value: 'array', hint: 'Holds many entries of the same kind' },
        { label: 'Date', value: 'date', hint: 'Picked from a calendar' },
        { label: 'Choice (enum)', value: 'enum', hint: 'One value from a list you define' },
        { label: 'Empty (null)', value: 'null', hint: 'Always empty: a placeholder value' }
    ];

    constructor(private jsonState: JsonStateService, private confirmationService: ConfirmationService) {
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

        // Resync state
        this.jsonState.updateSchema({ fields: [...this.jsonState.currentSchema.fields] });
    }

    onTypeChange(type: FieldType, field: SchemaField) {
        field.type = type;
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
        this.jsonState.updateSchema({ fields: [...this.jsonState.currentSchema.fields] });
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

    // Confirm before deleting a field at any level.
    confirmRemoveField(field: SchemaField, index: number, parentFields?: SchemaField[], parentDescription?: string) {
        const keyLabel = this.escapeHtml(field.key || '(unnamed field)');
        const fromClause = parentDescription ? ` from ${parentDescription}` : '';
        this.confirmationService.confirm({
            header: 'Delete Field?',
            message: `Field "<strong>${keyLabel}</strong>" will be deleted${fromClause}. This cannot be undone.`,
            icon: 'pi pi-exclamation-triangle',
            acceptLabel: 'Delete',
            rejectLabel: 'Cancel',
            acceptButtonStyleClass: 'p-button-danger',
            rejectButtonStyleClass: 'p-button-secondary p-button-outlined',
            accept: () => this.removeField(index, parentFields)
        });
    }

    private escapeHtml(text: string): string {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    // "Where it lives" text for the delete message.
    childParentLabel(parentField: SchemaField): string {
        return `"${this.escapeHtml(parentField.label || parentField.key)}"`;
    }

    arrayItemParentLabel(arrayField: SchemaField): string {
        return `the item structure of "${this.escapeHtml(arrayField.label || arrayField.key)}"`;
    }

    updateField(index: number, changes: Partial<SchemaField>) {
        const currentSchema = this.jsonState.currentSchema;
        const newFields = [...currentSchema.fields];
        newFields[index] = { ...newFields[index], ...changes };
        this.jsonState.updateSchema({ fields: newFields });
    }

    // --- KEY RENAME HANDLERS ---
    // One-way [ngModel] so the old key is still known here and its data can be moved.

    onRootKeyChange(field: SchemaField, newKey: string) {
        const oldKey = field.key;
        field.key = newKey;
        this.jsonState.renameRootKey(oldKey, newKey);
        this.jsonState.updateSchema({ fields: [...this.jsonState.currentSchema.fields] });
    }

    onChildKeyChange(parentField: SchemaField, child: SchemaField, newKey: string) {
        const oldKey = child.key;
        child.key = newKey;
        this.jsonState.renameNestedObjectKey(parentField.key, oldKey, newKey);
        this.jsonState.updateSchema({ fields: [...this.jsonState.currentSchema.fields] });
    }

    onGrandchildKeyChange(arrayField: SchemaField, grandchild: SchemaField, newKey: string) {
        const oldKey = grandchild.key;
        grandchild.key = newKey;
        this.jsonState.renameArrayItemKey(arrayField.key, oldKey, newKey);
        this.jsonState.updateSchema({ fields: [...this.jsonState.currentSchema.fields] });
    }

    // --- REQUIRED / PLACEHOLDER ---
    // Mutate the field in place, then resync; works at any depth.

    toggleRequired(field: SchemaField, required: boolean) {
        field.required = required;
        this.jsonState.updateSchema({ fields: [...this.jsonState.currentSchema.fields] });
    }

    updatePlaceholder(field: SchemaField, placeholder: string) {
        field.placeholder = placeholder;
        this.jsonState.updateSchema({ fields: [...this.jsonState.currentSchema.fields] });
    }

    supportsPlaceholder(field: SchemaField): boolean {
        return field.type === 'string' || field.type === 'number' || field.type === 'integer';
    }

    // --- VALIDATION ---
    // Non-blocking: flags empty or duplicate keys.

    isKeyInvalid(key: string, siblings: SchemaField[] | undefined, ownIndex: number): boolean {
        if (!key || !key.trim()) return true;
        if (!siblings) return false;
        return siblings.some((f, idx) => idx !== ownIndex && f.key === key);
    }

    trackByFn(index: number) {
        return index;
    }

    // --- DISPLAY HELPERS ---

    pad(n: number): string {
        return n < 10 ? '0' + n : String(n);
    }

    typeLabel(type: FieldType): string {
        return this.fieldTypes.find(t => t.value === type)?.label ?? type;
    }
}
