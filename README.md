# 🧪 MyAML: My Application Modeling Laboratory

[![Angular](https://img.shields.io/badge/Angular-20-DD0031?style=for-the-badge&logo=angular&logoColor=white)](https://angular.io/)
[![PrimeNG](https://img.shields.io/badge/PrimeNG-20-3B82F6?style=for-the-badge&logo=primeng&logoColor=white)](https://primeng.org/)
[![Status](https://img.shields.io/badge/Status-Active-success?style=for-the-badge)](https://github.com/Shantanu-Dutta-2001/myAml)
[![License](https://img.shields.io/badge/License-MIT-gray?style=for-the-badge)](https://opensource.org/licenses/MIT)

**My Application Modeling Laboratory** — A form-based JSON builder that lets business analysts and other non-technical teammates create release notes and other JSON documents on their own, without asking a developer to hand-write them. Developers design the structure once; anyone can fill it in and export valid JSON. Featuring a "Developer Terminal" aesthetic (green-on-black, monospace, IDE-style status bar) and infinite recursive nesting support.

---

## ✨ Key Features

- **🎯 Precision Blueprinting**: Define your JSON schema with a rich set of types: String, Number, Integer, Boolean, Object, Array, Date, Enum, and Null.
- **🧬 Deep Nesting**: Architect complex, recursive structures (e.g., Arrays of Objects containing deeply nested children) with zero friction.
- **⚡ Live Preview**: Instant JSON feedback as you iterate on your schema or data.
- **💎 Premium UI**: A "Developer Terminal" theme: prompt-style inputs, line-numbered syntax-highlighted preview and an IDE status bar. All colours, spacing and fonts are CSS tokens in `src/styles.scss`.
- **⌨️ Developer Friendly**: Optimized focus management for seamless typing in complex nested forms.
- **📰 Release Notes**: A *View Last Update* pill in the header opens a version-by-version changelog in a new tab.

---

## 🛠️ Tech Stack

| Component | Technology |
| :--- | :--- |
| **Framework** | [Angular 20](https://angular.io/) (Standalone) |
| **UI Kit** | [PrimeNG 20](https://primeng.org/) |
| **Styling** | SCSS design tokens + PrimeNG terminal preset |
| **State** | Reactive RxJS State Management |
| **Routing** | Angular Router (`/` builder, `/release-notes`) |
| **Testing** | [Vitest](https://vitest.dev/) + jsdom |

---

## 📁 System Architecture

```text
src/app/
├── app.ts                # Root shell (router outlet, toast, confirm dialog)
├── app.routes.ts         # Routes: '' → Builder, 'release-notes' → Release Notes
├── pages/
│   ├── builder/          # Main builder page (header, Blueprint & Editor tabs)
│   └── release-notes/    # Version-by-version changelog page
├── components/
│   ├── form-editor/      # Recursive data entry engine
│   ├── schema-builder/   # Visual structure designer
│   ├── preview/          # Reactive JSON output
│   └── hero/             # Polished landing elements
├── data/
│   └── release-notes.ts  # Release notes content (newest first)
├── services/             # Centralized JSON State (RxJS)
└── models/               # Strongly-typed schema definitions
```

### 📰 Adding a Release Note
Add a new entry at the **top** of `RELEASE_NOTES` in [`src/app/data/release-notes.ts`](src/app/data/release-notes.ts). The first entry is shown as the latest update.

```ts
{
    version: 'v1.4.0',
    date: '2026-11-01', // YYYY-MM-DD
    sections: [
        { title: 'Enhancement', items: ['Describe the new feature.'] },
        { title: 'Bug fixes & Improvements', items: ['Describe the fix.'] }
    ]
}
```

---

## 🚀 Getting Started

### 📝 Prerequisites
- **Node.js**: v18+ (Recommended)
- **npm**: v9+

### 🛠️ Installation
1. **Clone the repository**
   ```bash
   git clone https://github.com/Shantanu-Dutta-2001/myAml.git
   cd myAml
   ```
2. **Install dependencies**
   ```bash
   npm install
   ```
3. **Launch visual editor**
   ```bash
   npm start
   ```
   *Visit [http://localhost:4200](http://localhost:4200) to start building.*
4. **Run tests**
   ```bash
   npm test
   ```

### 🌐 Deployment Note
The app uses path-based routing, so your host must serve `index.html` for unknown paths. Otherwise opening `/release-notes` directly returns a 404. For example, on Netlify add a `_redirects` file with `/* /index.html 200`. On Vercel, add a rewrite of `/(.*)` to `/index.html`.

---

## 🎨 Visual Identity

MyAML Architect utilizes a **Violet Glass** theme, balancing professional clarity with modern design trends.

- **Blueprint**: Visual data hierarchy definition.
- **Editor**: Context-aware inputs (DatePickers, Selectors, Enums).
- **Preview**: Soft-dark syntax highlighting for real-time validation.

---

## 🆕 Updates

- **Release Notes Page**: A *View Last Update* pill in the header opens a new **Release Note** page in a new tab. It lists every version with its date, sections and changes, and marks the newest with a *Latest* badge. *Back to Builder* closes the tab, or returns to the builder if the page was opened directly.
- **Routing**: The app now uses the Angular Router. The builder moved to its own page and the root component became a thin shell.
- **Required & Placeholder Options**: Every schema field (root, object child, and array-item property) now has a *Required* checkbox and a custom *Placeholder* input (for String, Number, and Integer types). The Form Editor marks required fields with an asterisk and shows a non-blocking "This field is required." hint when they're empty.
- **Delete Confirmations**: Removing a schema field at any nesting level now asks for confirmation first. The dialog names the field and where it lives (e.g. its parent object or array item structure).
- **Schema Key Validation**: Field keys that are empty or duplicated among siblings are flagged visually without blocking the edit.
- **Rename Preservation**: Renaming a field's key carries its entered value over to the new key (root fields, object children, and properties across every array item) instead of resetting it to a default.
- **Toast Feedback**: Copying JSON to the clipboard or downloading it as a file (`myaml-data-YYYY-MM-DD.json`) now shows a success or error toast.
- **Nested Array Fix**: *Add Item* / *Remove Item* now work for arrays at any depth (arrays inside objects or inside other arrays). Previously they did nothing, or wrote to the wrong root-level key.
- **Nested Type-Change Fix**: Changing the type of a nested field no longer overwrites unrelated top-level fields. Type changes on array-item properties now reach the generated data correctly.
- **Mobile Layout Fix**: Nested array entries in the Form Editor now wrap cleanly on small screens with no horizontal overflow or clipped *Add Item* controls.
- **Accessibility Polish**: Icon-only buttons, such as *Remove item* in the Form Editor, now have tooltips, matching the Schema Builder and Preview panels.
- **Cleanup**: Removed the visitor counter and its tracking service.
- **Tooling**: Dependencies are aligned to Angular 20.x and PrimeNG 20.x, and unit tests now run on Vitest (`npm test`) with a jsdom setup.

---

### 🙌 Credits
Developed with ❤️ by [Shantanu Dutta](https://github.com/Shantanu-Dutta-2001)

---

