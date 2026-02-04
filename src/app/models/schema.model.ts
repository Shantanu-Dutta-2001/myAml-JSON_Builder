export type FieldType =
    | 'string'
    | 'number'
    | 'integer'
    | 'boolean'
    | 'object'
    | 'array'
    | 'date'
    | 'enum'
    | 'null';

export interface SchemaField {
    key: string;
    label: string;
    type: FieldType;
    children?: SchemaField[]; // For nested objects OR array item schema
    required?: boolean;
    placeholder?: string;
    options?: { label: string; value: any }[]; // For enums
}

export interface DynamicSchema {
    fields: SchemaField[];
}

export interface DynamicData {
    [key: string]: any;
}

