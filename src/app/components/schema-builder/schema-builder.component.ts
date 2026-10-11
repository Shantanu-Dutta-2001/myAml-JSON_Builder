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
import { ConfirmationService } from 'primeng/api';

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

        // Trigger generic update to sync the state
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

    // Confirms before removing a field at any level (root, object child, or array-item grandchild),
    // naming both the field and where it lives so the warning is specific rather than generic.
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

    // Human-readable "where this field lives" fragments for the confirm-delete message, per level.
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
    // One-way [ngModel] + these handlers (instead of [(ngModel)]) so `field.key` still holds the
    // OLD key when the handler runs, letting us migrate any already-entered data to the new key
    // before the schema resync, instead of losing it.

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

    // --- VALIDATION ---
    // Non-blocking: flags empty/duplicate keys visually without preventing the edit.

    isKeyInvalid(key: string, siblings: SchemaField[] | undefined, ownIndex: number): boolean {
        if (!key || !key.trim()) return true;
        if (!siblings) return false;
        return siblings.some((f, idx) => idx !== ownIndex && f.key === key);
    }

    trackByFn(index: number) {
        return index;
    }
}
