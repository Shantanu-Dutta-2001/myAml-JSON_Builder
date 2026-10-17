import { SchemaField } from '../models/schema.model';

// Read-only display helpers for the preview and status bar.

export type TokenKind = 'key' | 'str' | 'num' | 'bool' | 'null' | 'punct' | 'ws';

export interface JsonToken {
    text: string;
    kind: TokenKind;
}

export interface JsonLine {
    tokens: JsonToken[];
    // Path of the value on this line; null for closing brackets.
    path: (string | number)[] | null;
}

// Tokenized lines matching JSON.stringify(value, null, 2).
export function renderJsonLines(value: unknown): JsonLine[] {
    const lines: JsonLine[] = [];
    const json = JSON.stringify(value ?? null);
    emit(json === undefined ? null : JSON.parse(json), 0, [], [], false, lines);
    return lines;
}

function emit(value: any, depth: number, keyTokens: JsonToken[], path: (string | number)[],
    trailingComma: boolean, lines: JsonLine[]) {
    const pad: JsonToken = { text: '  '.repeat(depth), kind: 'ws' };
    const comma: JsonToken[] = trailingComma ? [{ text: ',', kind: 'punct' }] : [];
    const isArray = Array.isArray(value);

    if (isArray || (value !== null && typeof value === 'object')) {
        const entries: [string | number, any][] = isArray
            ? value.map((v: any, i: number) => [i, v])
            : Object.entries(value);
        const [open, close] = isArray ? ['[', ']'] : ['{', '}'];
        if (entries.length === 0) {
            lines.push({ tokens: [pad, ...keyTokens, { text: open + close, kind: 'punct' }, ...comma], path });
            return;
        }
        lines.push({ tokens: [pad, ...keyTokens, { text: open, kind: 'punct' }], path });
        entries.forEach(([k, v], i) => {
            const childKey: JsonToken[] = isArray
                ? []
                : [{ text: JSON.stringify(k), kind: 'key' }, { text: ': ', kind: 'punct' }];
            emit(v, depth + 1, childKey, [...path, k], i < entries.length - 1, lines);
        });
        lines.push({ tokens: [pad, { text: close, kind: 'punct' }, ...comma], path: null });
        return;
    }

    const kind: TokenKind = typeof value === 'string' ? 'str'
        : typeof value === 'number' ? 'num'
            : typeof value === 'boolean' ? 'bool' : 'null';
    lines.push({ tokens: [pad, ...keyTokens, { text: JSON.stringify(value), kind }, ...comma], path });
}

// Paths of empty required fields (same rule as the Editor).
export function requiredEmptyPaths(fields: SchemaField[], data: any, base: (string | number)[] = []): string[] {
    const out: string[] = [];
    if (!data || typeof data !== 'object') return out;
    for (const field of fields) {
        const path = [...base, field.key];
        const val = data[field.key];
        if (field.type === 'object' && field.children) {
            out.push(...requiredEmptyPaths(field.children, val, path));
            continue;
        }
        if (field.type === 'array' && field.children?.[0]?.type === 'object' && Array.isArray(val)) {
            const itemFields = field.children[0].children || [];
            val.forEach((item: any, j: number) => out.push(...requiredEmptyPaths(itemFields, item, [...path, j])));
            continue;
        }
        if (!field.required) continue;
        if (field.type === 'boolean' || field.type === 'array' || field.type === 'null') continue;
        const empty = field.type === 'number' || field.type === 'integer'
            ? val === null || val === undefined
            : val === null || val === undefined || val === '';
        if (empty) out.push(pathKey(path));
    }
    return out;
}

export function pathKey(path: (string | number)[]): string {
    return JSON.stringify(path);
}

// Counts empty/duplicate keys (same rule as isKeyInvalid).
export function countKeyProblems(fields: SchemaField[] | undefined): number {
    if (!fields) return 0;
    let count = 0;
    fields.forEach((f, i) => {
        if (!f.key || !f.key.trim() || fields.some((s, j) => j !== i && s.key === f.key)) count++;
        if (f.type === 'object') count += countKeyProblems(f.children);
        if (f.type === 'array' && f.children?.[0]?.type === 'object') count += countKeyProblems(f.children[0].children);
    });
    return count;
}

// Nesting levels of the blueprint.
export function schemaDepth(fields: SchemaField[] | undefined): number {
    return Math.max(0, ...(fields || []).map(fieldDepth));
}

function fieldDepth(field: SchemaField): number {
    if (field.type === 'object') return 1 + schemaDepth(field.children);
    if (field.type === 'array') {
        const item = field.children?.[0];
        if (!item) return 1;
        return 1 + (item.type === 'object' ? schemaDepth(item.children) : fieldDepth(item));
    }
    return 1;
}

// Value count (root excluded) and bracket depth.
export function dataStats(value: unknown): { nodes: number; depth: number } {
    let nodes = 0;
    const walk = (v: any): number => {
        if (v === null || typeof v !== 'object') return 0;
        const children: any[] = Array.isArray(v) ? v : Object.values(v);
        nodes += children.length;
        return 1 + Math.max(0, ...children.map(walk));
    };
    const depth = walk(value);
    return { nodes, depth };
}

export function formatBytes(bytes: number): string {
    return bytes < 1024 ? `${bytes} B` : `${(bytes / 1024).toFixed(1)} KB`;
}
