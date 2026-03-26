## ADDED Requirements

### Requirement: Color Palette Tokens

The application MUST define exactly 7 CSS custom properties on `:root` that represent the entire color vocabulary of the app. Six are primary palette tokens; one (`--color-danger`) is reserved exclusively for destructive/error states.

#### Scenario: Token definitions on :root

Given the global CSS file is loaded,
When the browser parses `:root`,
Then the following CSS variables SHALL be defined:

```css
:root {
  --color-bg:      #0F1117;
  --color-surface: #1A1D27;
  --color-border:  #2E3244;
  --color-primary: #6C63FF;
  --color-text:    #E8EAF0;
  --color-muted:   #6B7280;
  --color-danger:  #EF4444;
}
```

And NO other color hex values SHALL appear anywhere in the component files or Tailwind utility classes except these seven and their Tailwind alpha variants (e.g., `bg-primary/15`).

#### Scenario: Tailwind config mirrors CSS variables

Given the project has a `tailwind.config.js`,
When the `theme.extend.colors` object is read,
Then it SHALL contain:
```js
colors: {
  bg:      '#0F1117',
  surface: '#1A1D27',
  border:  '#2E3244',
  primary: '#6C63FF',
  text:    '#E8EAF0',
  muted:   '#6B7280',
  danger:  '#EF4444',
}
```
So that Tailwind utility classes like `bg-surface`, `text-primary`, `border-border` are available throughout the project.

#### Scenario: Alpha / opacity variants are safelisted

Given that components use dynamic opacity classes like `bg-primary/15` and `border-danger/40`,
When Tailwind runs its purge/content scan,
Then the `safelist` array in `tailwind.config.js` SHALL include patterns covering:
- `bg-primary/10`, `bg-primary/15`, `bg-primary/20`
- `bg-danger/15`, `bg-danger/20`
- `bg-muted/15`, `bg-muted/20`
- `border-danger/40`, `border-primary/50`
- `text-primary/70`, `text-muted/50`, `text-muted/60`

---

### Requirement: Typography Tokens

The application MUST use a single font family (Inter) with a defined scale of 6 type styles. All text must use one of these styles — no arbitrary font sizes.

#### Scenario: Font family import

Given the app's `_app.jsx` or root layout,
When the page renders,
Then the Inter font SHALL be loaded (Google Fonts CDN or `next/font/google`) with subsets `['latin']`.

#### Scenario: Type scale coverage

Given a developer needs to style text anywhere in the app,
When they consult the design system,
Then exactly 6 type styles SHALL be available:

| Name | Tailwind classes | Size | Weight | Use |
|---|---|---|---|---|
| `heading-xl` | `text-2xl font-bold` | 24px | 700 | Page headings |
| `heading-lg` | `text-xl font-semibold` | 20px | 600 | Section headings, modal titles |
| `heading-md` | `text-base font-semibold` | 16px | 600 | Card titles, table column headers |
| `body` | `text-sm font-normal` | 14px | 400 | Body text, form labels, table rows |
| `caption` | `text-xs font-normal` | 12px | 400 | Helper text, tooltips, timestamps |
| `label` | `text-xs font-medium` | 12px | 500 | Input labels, stat card sub-labels, table headers |

All body text SHALL default to `color: var(--color-text)`. Secondary/supporting text SHALL use `color: var(--color-muted)`.

---

### Requirement: Spacing Scale

All layout spacing MUST follow the 8px base grid. Only these spacing values are permitted for padding, margin, and gap throughout the app.

#### Scenario: Spacing value conformance

Given any component in the application,
When inspecting its CSS padding, margin, or gap values,
Then all values SHALL be one of: `4px, 8px, 12px, 16px, 20px, 24px, 32px, 40px, 48px, 64px`.

Values of `4px` (Tailwind `p-1`) are permitted only for micro-spacing (icon padding, badge padding). All primary layout spacing uses `8px` multiples.

#### Scenario: Component-specific spacing constants

Given the design system constants,
Then the following structural dimensions SHALL be fixed:

| Element | Value |
|---|---|
| Sidebar width | `240px` (Tailwind: `w-60`) |
| Page horizontal padding | `24px` (Tailwind: `px-6`) |
| Page vertical padding | `24px` (Tailwind: `py-6`) |
| Card padding | `20px` (Tailwind: `p-5`) |
| Modal padding | `24px` (Tailwind: `p-6`) |
| Input padding | `12px × 8px` (Tailwind: `px-3 py-2`) |
| Table cell padding | `16px × 12px` (Tailwind: `px-4 py-3`) |

---

### Requirement: Border Radius Scale

All rounded corners MUST use one of exactly 4 radius levels. No arbitrary `rounded-[Xpx]` values are permitted.

#### Scenario: Radius token usage

Given any UI element,
When it has rounded corners,
Then it SHALL use one of:

| Token | Value | Elements |
|---|---|---|
| `rounded-sm` | 4px | Badges, tooltips, chips, file pills |
| `rounded-md` | 8px | Buttons, inputs, selects, textareas |
| `rounded-lg` | 12px | Cards, modals, dropdowns, upload zones |
| `rounded-xl` | 16px | Stat cards on the dashboard |

---

### Requirement: Shadow Scale

All drop shadows MUST use one of 3 defined shadow levels. No arbitrary box-shadow values are permitted.

#### Scenario: Shadow level definitions

Given the Tailwind config `theme.extend.boxShadow`,
Then the following custom shadows SHALL be defined:

```js
boxShadow: {
  card:  '0 1px 3px rgba(0,0,0,0.4)',
  modal: '0 8px 32px rgba(0,0,0,0.6)',
  toast: '0 4px 16px rgba(0,0,0,0.5)',
}
```

| Level | Use |
|---|---|
| `shadow-card` | Cards, sidebar, stat cards |
| `shadow-modal` | Modals, dropdowns, floating menus |
| `shadow-toast` | Toaster notifications |

---

### Requirement: Transition Tokens

All interactive elements MUST use one of 2 transition durations. No arbitrary durations are permitted.

#### Scenario: Transition speed definitions

Given any interactive element with a CSS transition,
Then it SHALL use one of:

| Token | Tailwind class | Use |
|---|---|---|
| Fast (150ms) | `transition-all duration-150` | Buttons, badges, icon buttons |
| Normal (200ms) | `transition-all duration-200` | Inputs focus ring, modals fade-in, nav item active state |

Toaster slide-in animation uses `200ms ease-out`. Tooltip fade-in uses `100ms` with a `300ms` hover delay. Modal entry uses `200ms ease-out` scale + opacity.
