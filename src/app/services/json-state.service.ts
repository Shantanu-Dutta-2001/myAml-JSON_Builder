import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { DynamicSchema, DynamicData, SchemaField } from '../models/schema.model';

@Injectable({
    providedIn: 'root'
})
export class JsonStateService {

    // Default Starting Schema
    private defaultSchema: DynamicSchema = {
        fields: [
            { key: 'version', label: 'Version', type: 'string', placeholder: 'e.g. 1.0.0' },
            { key: 'date', label: 'Date', type: 'string', placeholder: 'YYYY-MM-DD' },
            {
                key: 'details',
                label: 'Details',
                type: 'array',
                children: [
                    {
                        key: 'item',
                        label: 'Detail Item',
                        type: 'object',
                        children: [
                            { key: 'task', label: 'Task', type: 'string' },
                            {
                                key: 'subTask',
                                label: 'Sub Tasks',
                                type: 'array',
                                children: [
                                    { key: 'item', label: 'Item', type: 'string' }
                                ]
                            }
                        ]
                    }
                ]
            }
        ]
    };

    private schemaSubject = new BehaviorSubject<DynamicSchema>(this.defaultSchema);
    schema$ = this.schemaSubject.asObservable();

    private dataSubject = new BehaviorSubject<DynamicData>(this.initDataFromSchema(this.defaultSchema));
    state$ = this.dataSubject.asObservable();

    constructor() { }

    get currentData(): DynamicData {
        return this.dataSubject.getValue();
    }

    get currentSchema(): DynamicSchema {
        return this.schemaSubject.getValue();
    }

    // --- SCHEMA ACTIONS ---

    updateSchema(newSchema: DynamicSchema) {
        this.schemaSubject.next(newSchema);
        const oldData = this.currentData;
        const newData = this.initDataFromSchema(newSchema, oldData);
        this.dataSubject.next(newData);
    }

    // --- DATA ACTIONS ---

    updateField(key: string, value: any) {
        const newData = { ...this.currentData, [key]: value };
        this.dataSubject.next(newData);
    }

    // Call after mutating currentData in place so subscribers update.
    notifyDataChanged() {
        this.dataSubject.next(this.dataSubject.getValue());
    }

    // --- KEY RENAME ACTIONS ---
    // Move data to the new key before updateSchema() so it isn't reset. Empty/unchanged keys are skipped.

    renameRootKey(oldKey: string, newKey: string) {
        if (!oldKey || !newKey || oldKey === newKey) return;
        const data = this.currentData;
        if (!Object.prototype.hasOwnProperty.call(data, oldKey)) return;
        const newData = { ...data };
        newData[newKey] = newData[oldKey];
        delete newData[oldKey];
        this.dataSubject.next(newData);
    }

    renameNestedObjectKey(parentKey: string, oldKey: string, newKey: string) {
        if (!oldKey || !newKey || oldKey === newKey) return;
        const parentObj = this.currentData[parentKey];
        if (!parentObj || typeof parentObj !== 'object' || Array.isArray(parentObj)) return;
        if (!Object.prototype.hasOwnProperty.call(parentObj, oldKey)) return;
        const newParentObj = { ...parentObj };
        newParentObj[newKey] = newParentObj[oldKey];
        delete newParentObj[oldKey];
        this.dataSubject.next({ ...this.currentData, [parentKey]: newParentObj });
    }

    // Rename a key in every entry of an array field.
    renameArrayItemKey(arrayKey: string, oldKey: string, newKey: string) {
        if (!oldKey || !newKey || oldKey === newKey) return;
        const arr = this.currentData[arrayKey];
        if (!Array.isArray(arr)) return;
        const newArr = arr.map((item: any) => {
            if (item && typeof item === 'object' && Object.prototype.hasOwnProperty.call(item, oldKey)) {
                const newItem = { ...item };
                newItem[newKey] = newItem[oldKey];
                delete newItem[oldKey];
                return newItem;
            }
            return item;
        });
        this.dataSubject.next({ ...this.currentData, [arrayKey]: newArr });
    }

    reset() {
        this.dataSubject.next(this.initDataFromSchema(this.currentSchema));
    }

    // --- HELPERS ---

    private initDataFromSchema(schema: any, existingData: any = {}): any {
        const fields: SchemaField[] = schema.fields || schema;
        const data: any = {};

        fields.forEach((field: SchemaField) => {
            if (existingData && existingData[field.key] !== undefined) {
                if (field.type === 'object' && field.children) {
                    data[field.key] = this.initDataFromSchema({ fields: field.children }, existingData[field.key]);
                } else if (field.type === 'array' && field.children && Array.isArray(existingData[field.key])) {
                    // Try to preserve array items if they match the schema
                    data[field.key] = existingData[field.key].map((item: any) => {
                        if (field.children![0].type === 'object') {
                            return this.initDataFromSchema({ fields: field.children![0].children || [] }, item);
                        }
                        return item;
                    });
                } else {
                    data[field.key] = existingData[field.key];
                }
            } else {
                data[field.key] = this.getDefaultValueForType(field);
            }
        });
        return data;
    }

    getDefaultValueForType(field: SchemaField): any {
        switch (field.type) {
            case 'number':
            case 'integer': return 0;
            case 'boolean': return false;
            case 'date': return null;
            case 'enum': return field.options && field.options.length > 0 ? field.options[0].value : null;
            case 'array':
                return field.children ? [this.getDefaultValueForType(field.children[0])] : [];
            case 'object':
                return field.children ? this.initDataFromSchema({ fields: field.children }) : {};
            case 'null': return null;
            default: return '';
        }
    }
}


