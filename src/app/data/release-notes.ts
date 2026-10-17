export interface ReleaseNoteSection {
    title: string; // e.g. 'Enhancement', 'Bug fixes & Improvements'
    items: string[];
}

export interface ReleaseNote {
    version: string;
    date: string; // ISO date (YYYY-MM-DD)
    sections: ReleaseNoteSection[];
}

// Newest first; the first entry is the latest update.
export const RELEASE_NOTES: ReleaseNote[] = [
    {
        version: 'v2.0.0',
        date: '2026-10-17',
        sections: [
            {
                title: 'Enhancement',
                items: [
                    'Brand-new "Developer Terminal" look: a dark, green-on-black theme with a monospace font, replacing the previous violet design.',
                    'New MyAML logo, a "{M}" mark built from JSON braces, now used in the browser tab, header and release notes.',
                    'Inputs now look like command-line prompts, and section titles read like terminal commands (e.g. "> data_blueprint").',
                    'Data types now use plain-language names such as "Text (string)" and "Group (object)", each with a short explanation in the dropdown.',
                    'The JSON preview now has line numbers and syntax colours, and highlights any line whose required field is still empty.',
                    'A status bar at the bottom shows whether your blueprint or JSON is valid, plus field count, nesting depth and file size.',
                    'On phones and tablets, the Editor can switch between your data and the JSON output with one tap.',
                    'Refreshed home page with a terminal-style welcome and a new "one_click_export()" feature card.'
                ]
            },
            {
                title: 'Bug fixes & Improvements',
                items: [
                    'Better accessibility: visible focus outlines, keyboard-friendly tabs, larger touch targets and stronger text contrast.',
                    'Animations are turned off automatically when your device asks for reduced motion.',
                    'The release notes page now matches the new theme.'
                ]
            }
        ]
    },
    {
        version: 'v1.3.0',
        date: '2026-10-11',
        sections: [
            {
                title: 'Enhancement',
                items: [
                    'Added a "Required" checkbox and a custom "Placeholder" input for every schema field (root fields, object children and array-item properties). Required fields show an asterisk and a "This field is required." hint in the Editor when empty.',
                    'Deleting a schema field at any nesting level now asks for confirmation, naming the field and where it lives.',
                    'Empty or duplicate field keys are now highlighted in the Blueprint without blocking the edit.',
                    'Renaming a field key now keeps the value already entered for it instead of resetting it to a default.'
                ]
            },
            {
                title: 'Bug fixes & Improvements',
                items: [
                    'Nested array entries in the Editor now wrap cleanly on mobile screens with no horizontal overflow or clipped "Add Item" controls.',
                    'Added a missing tooltip to the icon-only "Remove item" button in the Editor.'
                ]
            }
        ]
    },
    {
        version: 'v1.2.0',
        date: '2026-10-10',
        sections: [
            {
                title: 'Enhancement',
                items: [
                    'Copying the JSON to the clipboard or downloading it as a file now shows a success or error toast.',
                    'Removed the visitor counter and its tracking service.'
                ]
            },
            {
                title: 'Bug fixes & Improvements',
                items: [
                    '"Add Item" and "Remove Item" now work for arrays at any depth (arrays inside objects or inside other arrays).',
                    'Changing the type of a nested field no longer overwrites unrelated top-level fields.'
                ]
            }
        ]
    },
    {
        version: 'v1.1.0',
        date: '2026-02-05',
        sections: [
            {
                title: 'Bug fixes & Improvements',
                items: [
                    'Aligned all dependencies to Angular 20.x and PrimeNG 20.x and raised build budgets.',
                    'Unit tests now run on Vitest.'
                ]
            }
        ]
    },
    {
        version: 'v1.0.0',
        date: '2026-02-04',
        sections: [
            {
                title: 'Enhancement',
                items: [
                    'Initial release of MyAML: My Application Modeling Laboratory with the new logo and "Violet Glass" theme.',
                    'Blueprint builder supporting String, Number, Integer, Boolean, Object, Array, Date, Enum and Null fields with deep nesting.',
                    'Editor with a live JSON preview, copy to clipboard and download as a file.'
                ]
            }
        ]
    }
];
