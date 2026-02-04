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

    updateArrayField(key: string, index: number, value: any) {
        const newData = { ...this.currentData };
        if (Array.isArray(newData[key])) {
            const newArray = [...newData[key]];
            newArray[index] = value;
            newData[key] = newArray;
            this.dataSubject.next(newData);
        }
    }

    addItemToArray(key: string, itemSchema?: SchemaField) {
        const newData = { ...this.currentData };
        if (Array.isArray(newData[key])) {
            const defaultValue = itemSchema ? this.getDefaultValueForType(itemSchema) : '';
            newData[key] = [...newData[key], defaultValue];
            this.dataSubject.next(newData);
        }
    }

    removeItemFromArray(key: string, index: number) {
        const newData = { ...this.currentData };
        if (Array.isArray(newData[key])) {
            newData[key] = newData[key].filter((_: any, i: number) => i !== index);
            this.dataSubject.next(newData);
        }
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

    private getDefaultValueForType(field: SchemaField): any {
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


