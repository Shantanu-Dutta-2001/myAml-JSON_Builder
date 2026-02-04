# MyAML Architect - JSON Structure Builder

![Banner](https://img.shields.io/badge/Angular-19-DD0031?style=for-the-badge&logo=angular&logoColor=white)
![Banner](https://img.shields.io/badge/PrimeNG-21-3B82F6?style=for-the-badge&logo=primeng&logoColor=white)
![Banner](https://img.shields.io/badge/Theme-Violet_Glass-8b5cf6?style=for-the-badge)

MyAML Architect is a sophisticated, flexible JSON schema and data builder designed for developers who need to generate complex, hierarchical data structures effortlessly. Featuring a modern "Violet Glass" aesthetic and infinite recursive nesting support.

## 🚀 Features

- **Dynamic Blueprinting**: Define your JSON schema with a variety of types including String, Number, Integer, Boolean, Object, Array, Date, Enum, and Null.
- **Infinite Recursion**: Build deeply nested structures (e.g., Arrays of Objects containing Arrays) with a single-page interface.
- **Real-time Preview**: See your generated JSON update instantly as you type.
- **Focus Preservation**: Optimized UI for a seamless typing experience even in complex nested forms.
- **Premium UI**: Modern glassmorphism design with a standardized violet/purple theme.

## 🛠️ Tech Stack

- **Framework**: [Angular 19](https://angular.io/) (Standalone Components)
- **UI Architecture**: [PrimeNG 21](https://primeng.org/) with custom Aura theme presets
- **Styling**: SCSS with custom design tokens for glassmorphism
- **State Management**: Reactive RxJS-based state service

## 📂 Project Structure

```text
json-builder/
├── src/
│   ├── app/
│   │   ├── components/
│   │   │   ├── form-editor/      # Recursive form generation
│   │   │   ├── schema-builder/   # Visual schema blueprinting
│   │   │   ├── preview/          # Real-time JSON output
│   │   │   └── hero/             # Landing page visuals
│   │   ├── services/
│   │   │   └── json-state.service.ts # Centralized reactive state
│   │   ├── models/
│   │   │   └── schema.model.ts    # JSON structural interfaces
│   │   ├── app.config.ts         # PrimeNG theme configuration
│   │   └── app.component.ts      # Root layout
│   └── styles.scss               # Global design system & glassmorphism utilities
└── README.md
```

## 🎨 UI Preview

The application uses a unified **Violet/Purple Glass** theme.

- **Blueprint Tab**: Define your data hierarchy visually.
- **Editor Tab**: Fill in data with professional inputs (DatePicker for dates, Dropdowns for enums).
- **Preview Panel**: Live JSON output with soft-dark syntax highlighting.

## 🛠️ Development

### Prerequisites
- Node.js & npm
- Angular CLI (`npm install -g @angular/cli`)

### Getting Started
1. Clone the repository
2. Install dependencies: `npm install`
3. Run the development server: `npm start`
4. Open `http://localhost:4200` in your browser

---
*Created with ❤️ by Shantanu Dutta*
