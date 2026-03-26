## Why

The Razvi Rental Management app has a fully planned backend and data model but no defined visual language. Without a strict design system, the frontend risks becoming inconsistent — different pages using different button styles, modals, colors, and spacing — making the product look unprofessional and hard to maintain. A locked-down 6-color design system, defined before a single component is built, ensures every screen looks intentional, cohesive, and premium.

## What Changes

- **New design system**: A complete 6-color palette (Obsidian Dark theme) defined as CSS custom properties + Tailwind config extensions
- **Typography system**: A single font family with defined scale (heading sizes, body, caption, label)
- **Spacing & layout grid**: 8px base grid, sidebar width, content max-width, card padding conventions
- **Color semantics**: Each color assigned a precise role (background, surface, border, primary action, text, accent/status)
- **Component design specs**: Detailed visual specs for every interactive component — buttons (5 variants), inputs, selects, modals, toasters, tooltips, badges, upload zones, confirmation dialogs, tables, sidebars, stat cards
- **Page layout specs**: Per-page wireframe descriptions for Dashboard, Properties, Tenants, Bills, Expenses, Reports, Login/Register
- **Motion & interaction**: Transition durations, easing functions, hover/focus/active states for all interactive elements
- **Icon system**: Lucide React icon usage conventions — size scale, stroke width, color binding
- **Accessibility baseline**: Focus rings, minimum contrast ratios, ARIA roles for modals and toasters

## Capabilities

### New Capabilities

- `design-tokens`: The 6-color palette, typography scale, spacing system, shadow levels, and border radius values defined as Tailwind config + CSS variables
- `component-design-system`: Visual specification for every UI primitive — buttons, inputs, modals, toasters, tooltips, badges, tables, upload zones, stat cards
- `page-layouts`: Per-page layout and composition specs covering all 7 pages of the application
- `interaction-states`: Hover, focus, active, disabled, loading, and error visual states for all interactive components
- `icon-conventions`: Lucide React icon usage rules — which icon for which action, sizing, and color binding

### Modified Capabilities

## Impact

- **`client/` project**: All component files in `src/components/ui/` will be implemented following these specs; `tailwind.config.js` will be extended with the design tokens
- **No backend impact**: Design system is purely frontend — zero changes to Express API, models, or business logic
- **Dependencies added**: No new npm packages beyond what is already planned (`lucide-react`, Tailwind CSS); CSS variables handle theming
