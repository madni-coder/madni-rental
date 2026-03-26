## Context

Razvi Rental Management is a landlord-facing web application with 7 primary screens. The frontend is Next.js with Tailwind CSS and Lucide React icons. **shadcn/ui** is used as the component base layer — its primitives (Button, Input, Select, Textarea, Dialog, Badge, Tooltip, Table, Skeleton, Separator, Sonner) are installed and then themed with the Obsidian Dark token set by overriding shadcn's CSS variables. Components not covered by shadcn/ui (UploadZone, StatCard, FilterToolbar, PageHeader, Sidebar, AppShell) are built as custom Tailwind components. All visual decisions must be locked down here so the theming is applied consistently across both shadcn components and custom components. The audience is a single admin landlord — the UI should feel professional, trustworthy, and data-dense without being cluttered.

## Goals / Non-Goals

**Goals:**
- Define a strict 6-color palette with named semantic roles so every element in the app can be painted using only these tokens — no ad-hoc colors
- Specify typography, spacing, shadow, and border-radius scales
- Define the exact visual appearance of every interactive component (buttons, inputs, modals, toasters, tooltips, badges, tables, upload zones, stat cards, sidebar)
- Define hover / focus / active / disabled / loading / error states for all interactive elements
- Define per-page layout compositions
- Define icon usage conventions

**Non-Goals:**
- Animations beyond simple CSS transitions (no Framer Motion, no keyframe sequences)
- Dark/light mode toggle — one theme only (Obsidian Dark)
- Custom icon design — Lucide React only
- Responsive breakpoints below 768px — tablet and desktop only for this admin tool

---

## Decisions

### D1 — Theme: Obsidian Dark (Single Theme, No Toggle)

**Decision:** The entire app uses a single dark theme called **Obsidian Dark**. No light mode. No theme switcher.

**Rationale:** Admin dashboards with dense data tables are universally easier to read for long sessions in dark mode. A single locked theme eliminates conditional class logic and keeps the codebase simple.

---

### D1b — Component Library: shadcn/ui

**Decision:** shadcn/ui is used as the UI primitive layer. Components are installed via `npx shadcn@latest add <component>` into `client/src/components/ui/`. This copies the component source into the project where it can be freely modified. Radix UI is the underlying accessibility/behaviour layer (installed automatically by shadcn). The `sonner` package is used for toast notifications (shadcn's recommended toaster).

**Rationale:** shadcn/ui provides production-quality accessible components (keyboard navigation, focus management, ARIA roles) out of the box, eliminating the need to re-implement these from scratch. Its Tailwind + CSS-variable architecture is purpose-built for the kind of theme customisation this project requires. The component source lives in our repo so there is no black-box dependency.

**shadcn/ui primitive → design decision mapping:**

| shadcn component | Covers design decision |
|---|---|
| `button` | D5 — Button Variants |
| `input`, `select`, `textarea`, `label` | D6 — Input Fields |
| `dialog` | D7 — Modal Design |
| `sonner` (via `sonner` package) | D8 — Toaster Notifications |
| `tooltip` | D9 — Tooltips |
| `badge` | D10 — Badge / Status Chip |
| `table` | D11 — Tables |
| `skeleton` | Table loading state |
| `separator` | Dividers / visual separators |

**Custom-built (not in shadcn/ui):**
`UploadZone`, `StatCard`, `FilterToolbar`, `PageHeader`, `Sidebar`, `AppShell`, `ConfirmModal` wrapper, `FilterToolbar`

---

### D2 — The 6-Color Palette

These are the ONLY colors used anywhere in the application. Every background, text, border, button, badge, shadow, and icon SHALL use one of these six tokens. No other color values are permitted.

| Token Name | Hex | Role |
|---|---|---|
| `--color-bg` | `#0F1117` | App background — the deepest layer; page canvas |
| `--color-surface` | `#1A1D27` | Card, sidebar, modal, dropdown backgrounds — one level above bg |
| `--color-border` | `#2E3244` | All borders, dividers, separator lines, input outlines |
| `--color-primary` | `#6C63FF` | Primary CTA buttons, active nav links, focused input rings, selected states, links |
| `--color-text` | `#E8EAF0` | All body text, headings, labels, input values |
| `--color-muted` | `#6B7280` | Placeholder text, disabled labels, secondary captions, empty states |

**Semantic status colors derived from the 6 (opacity/tint only — no new hues):**
- **Success**: `--color-primary` at 15% opacity background + full opacity text/icon (green feel is avoided; purple success fits the brand)
- **Danger/Error**: `#EF4444` — the ONLY exception, used exclusively for destructive actions (delete buttons, error toasters, error input borders). It is a 7th color but reserved solely for destructive/error states.
- **Warning**: `--color-muted` at 20% opacity background + `--color-text` text
- **Info**: `--color-primary` at 10% opacity background + `--color-primary` text/icon

**shadcn/ui CSS variable mapping (`globals.css`):**

shadcn/ui expects CSS variables in HSL format on `.dark` (or `:root` for a dark-only app). Map our palette to shadcn's variable names:

```css
:root {
  --background:          230 15% 8%;    /* #0F1117 — bg */
  --foreground:          220 20% 93%;   /* #E8EAF0 — text */
  --card:                230 22% 13%;   /* #1A1D27 — surface */
  --card-foreground:     220 20% 93%;   /* #E8EAF0 — text */
  --popover:             230 22% 13%;   /* #1A1D27 — surface */
  --popover-foreground:  220 20% 93%;   /* #E8EAF0 — text */
  --primary:             244 100% 69%;  /* #6C63FF */
  --primary-foreground:  0 0% 100%;     /* white */
  --secondary:           230 22% 13%;   /* #1A1D27 — surface */
  --secondary-foreground:220 20% 93%;   /* #E8EAF0 — text */
  --muted:               230 22% 13%;   /* #1A1D27 — surface */
  --muted-foreground:    220 9% 46%;    /* #6B7280 — muted */
  --accent:              230 22% 18%;   /* slightly lighter surface for hover */
  --accent-foreground:   220 20% 93%;   /* #E8EAF0 — text */
  --destructive:         0 84% 60%;     /* #EF4444 — danger */
  --destructive-foreground: 0 0% 100%;  /* white */
  --border:              230 22% 23%;   /* #2E3244 */
  --input:               230 22% 23%;   /* #2E3244 */
  --ring:                244 100% 69%;  /* #6C63FF — primary (focus ring) */
  --radius:              0.5rem;
}
```

These are the ONLY CSS variable values used. shadcn components consume them automatically. Custom components reference these via Tailwind's `bg-background`, `text-foreground`, `bg-card`, `border-border`, etc.

**Tailwind config extension (semantic aliases for use in custom components):**
```js
colors: {
  bg: 'hsl(var(--background))',
  surface: 'hsl(var(--card))',
  border: 'hsl(var(--border))',
  primary: 'hsl(var(--primary))',
  text: 'hsl(var(--foreground))',
  muted: 'hsl(var(--muted-foreground))',
  danger: 'hsl(var(--destructive))',
}
```

This means both `bg-background` (shadcn convention) and `bg-bg` (our shorthand) resolve to the same color.

---

### D3 — Typography

**Decision:** Use **Inter** (Google Fonts or system fallback). Single font family throughout.

| Scale | Class | Size | Weight | Use |
|---|---|---|---|---|
| `heading-xl` | `text-2xl font-bold` | 24px / 700 | Page headings |
| `heading-lg` | `text-xl font-semibold` | 20px / 600 | Section headings, modal titles |
| `heading-md` | `text-base font-semibold` | 16px / 600 | Card titles, table column headers |
| `body` | `text-sm font-normal` | 14px / 400 | All body text, form labels, table rows |
| `caption` | `text-xs font-normal` | 12px / 400 | Helper text, tooltips, timestamps, badge text |
| `label` | `text-xs font-medium` | 12px / 500 | Input labels, stat card sub-labels |

All `color: --color-text`. Secondary text uses `color: --color-muted`.

---

### D4 — Spacing, Grid, Shadows, Radius

**Base grid:** 8px. All spacing values are multiples of 8px (4px for micro-spacing).

| Token | Value | Use |
|---|---|---|
| Sidebar width | `240px` | Fixed left sidebar |
| Content max-width | `1280px` | Centered content area within main |
| Page padding | `px-6 py-6` | 24px horizontal, 24px vertical |
| Card padding | `p-5` | 20px all sides |
| Input padding | `px-3 py-2` | 12px × 8px |
| Modal padding | `p-6` | 24px all sides |

**Border radius:**
| Token | Value | Use |
|---|---|---|
| `rounded-sm` | `4px` | Badges, tooltips, small chips |
| `rounded-md` | `8px` | Inputs, buttons, table rows |
| `rounded-lg` | `12px` | Cards, modals, dropdowns |
| `rounded-xl` | `16px` | Stat cards on dashboard |

**Shadows (all use `--color-bg` as shadow color to create depth without glow):**
| Level | CSS | Use |
|---|---|---|
| `shadow-card` | `0 1px 3px rgba(0,0,0,0.4)` | Cards, sidebar |
| `shadow-modal` | `0 8px 32px rgba(0,0,0,0.6)` | Modals, dropdowns |
| `shadow-toast` | `0 4px 16px rgba(0,0,0,0.5)` | Toaster notifications |

---

### D5 — Button Variants

**Implementation:** Use shadcn's `button` component (`client/src/components/ui/button.jsx`). It ships with `default`, `secondary`, `ghost`, `destructive`, `outline`, and `link` variants and `default`, `sm`, `lg`, `icon` sizes via CVA. Extend it with a `loading` prop and map variant names to our conventions:

| Our variant | shadcn variant | Notes |
|---|---|---|
| `primary` | `default` | rename alias in our wrapper |
| `secondary` | `secondary` | direct match |
| `ghost` | `ghost` | direct match |
| `danger` | `destructive` | rename alias |
| `icon` | `size="icon"` | size prop, not variant |

All buttons use `rounded-md`, `text-sm font-medium`, `px-4 py-2` (normal) or `px-3 py-1.5` (small), `transition-all duration-150`.

| Variant | Background | Text | Border | Hover | Use |
|---|---|---|---|---|---|
| **Primary** | `--color-primary` | white | none | `brightness-110` + `shadow-md` | Main CTA: Save, Create, Generate, Record Payment |
| **Secondary** | `--color-surface` | `--color-text` | `1px --color-border` | `bg-border` | Cancel, Back, secondary actions |
| **Ghost** | transparent | `--color-muted` | none | `text-text bg-surface` | Tertiary: Edit icon button, view detail |
| **Danger** | `--color-danger` at 15% opacity | `--color-danger` | `1px --color-danger` at 40% | `bg-danger text-white` | Delete, Deactivate — text danger, hover fills |
| **Icon-only** | transparent | `--color-muted` | none | `text-text bg-surface rounded-md p-1.5` | Table action icons, Lucide icon buttons |

**Disabled state** (all variants): `opacity-40 cursor-not-allowed pointer-events-none`

**Loading state** (all variants): Replace button label with `<Loader2 size={16} className="animate-spin" />` + original label, `opacity-80 pointer-events-none`

**Size variants:**
- `sm`: `px-3 py-1.5 text-xs`
- `md` (default): `px-4 py-2 text-sm`
- `lg`: `px-5 py-2.5 text-base`

---

### D6 — Input Fields

**Implementation:** Use shadcn's `input`, `select`, `textarea`, and `label` components. They inherit all states (focus ring, disabled, error) from our CSS variable values automatically. Wrap them in a custom `FormField.jsx` helper that adds the label above, helper text below, and error message with `<AlertCircle size={12} />` — this wrapper is the component used across all forms.

All inputs: `bg-surface border border-border rounded-md px-3 py-2 text-sm text-text placeholder:text-muted w-full transition-colors duration-150`

| State | Border color | Notes |
|---|---|---|
| Default | `--color-border` | |
| Focus | `--color-primary` | `ring-2 ring-primary/20 border-primary` |
| Error | `--color-danger` | `ring-2 ring-danger/20 border-danger` |
| Disabled | `--color-border` at 50% | `bg-bg opacity-50 cursor-not-allowed` |
| Read-only | `--color-border` at 30% | `bg-bg/50 text-muted` |

**Input label:** `text-xs font-medium text-muted mb-1 uppercase tracking-wide`  
**Helper text:** `text-xs text-muted mt-1`  
**Error message:** `text-xs text-danger mt-1` with `<AlertCircle size={12} />` inline icon  

**Select dropdown:** Same styling as input. Native `<select>` with `appearance-none` + `<ChevronDown size={16} className="text-muted" />` absolutely positioned right.  

**Date picker input:** Same as input with `<Calendar size={16} className="text-muted" />` right icon.  

**Textarea:** Same as input, `resize-none min-h-[80px]`.

---

### D7 — Modal Design

**Implementation:** Use shadcn's `dialog` component (`Dialog`, `DialogContent`, `DialogHeader`, `DialogTitle`, `DialogDescription`, `DialogFooter`). It uses Radix UI Dialog underneath which handles Escape key, focus trap, backdrop click, and ARIA roles automatically. Wrap it in a `Modal.jsx` convenience component that accepts `isOpen`, `onClose`, `title`, `icon`, `size`, and renders the header/body/footer structure defined below.

**Overlay:** `fixed inset-0 bg-bg/80 backdrop-blur-sm z-50`  
**Container:** `bg-surface rounded-lg shadow-modal border border-border max-w-lg w-full mx-auto mt-[10vh] p-6`  
**Animation:** Fade + scale in — `opacity-0 scale-95 → opacity-100 scale-100` over `200ms ease-out`

**Structure:**
```
┌─────────────────────────────────────────────┐
│ [Icon] Modal Title            [X close btn] │  ← header: pb-4 border-b border-border
│─────────────────────────────────────────────│
│                                             │
│  Body content / form fields                 │  ← py-5 overflow-y-auto max-h-[60vh]
│                                             │
│─────────────────────────────────────────────│
│        [Secondary btn]  [Primary btn]       │  ← footer: pt-4 border-t border-border flex justify-end gap-3
└─────────────────────────────────────────────┘
```

**Modal title:** `text-lg font-semibold text-text` with a contextual Lucide icon left of the title in `--color-primary`.

**Modal sizes:**
| Size | max-width | Use |
|---|---|---|
| `sm` | `max-w-sm` (384px) | Confirmations, alerts |
| `md` | `max-w-lg` (512px) | Forms (create/edit) |
| `lg` | `max-w-2xl` (672px) | Record Payment modal, complex forms |

**Close button:** Top-right `X` using `<X size={18} />`, Ghost variant icon button.

**Confirmation / Destructive modal:**  
- `sm` size  
- Icon: `<AlertTriangle size={24} className="text-danger" />`  
- Title: `text-danger`  
- Body: `text-muted text-sm`  
- Buttons: Secondary "Cancel" + Danger "Delete / Deactivate"

---

### D8 — Toaster Notifications

**Implementation:** Use the `sonner` package installed via `npx shadcn@latest add sonner`. Render `<Toaster />` from `sonner` in the root layout. Call `toast.success()`, `toast.error()`, `toast.warning()`, `toast.info()` throughout the app. Theme it by passing the `theme`, `toastOptions` props to match our CSS variables. The visual spec below defines what each toast type should look like — implement this via `toastOptions.classNames` in the `<Toaster>` configuration.

**Position:** Fixed `bottom-right` — `fixed bottom-5 right-5 z-50 flex flex-col gap-2`  
**Container:** `bg-surface border border-border rounded-lg shadow-toast px-4 py-3 flex items-start gap-3 min-w-[300px] max-w-[400px]`  
**Animation:** Slide in from right + fade → auto-dismiss after 4s with fade-out  

| Type | Left border | Icon | Icon color |
|---|---|---|---|
| **Success** | `border-l-4 border-primary` | `<CheckCircle2 size={18} />` | `text-primary` |
| **Error** | `border-l-4 border-danger` | `<XCircle size={18} />` | `text-danger` |
| **Warning** | `border-l-4 border-muted` | `<AlertTriangle size={18} />` | `text-muted` |
| **Info** | `border-l-4 border-primary/50` | `<Info size={18} />` | `text-primary/70` |

**Title:** `text-sm font-semibold text-text`  
**Message:** `text-xs text-muted mt-0.5`  
**Dismiss button:** `<X size={14} />` Ghost, top-right of toast container  
**Progress bar:** 2px bottom bar, draining from full width → 0 over 4s, color matches left border

---

### D9 — Tooltips

**Implementation:** Use shadcn's `tooltip` component (`TooltipProvider`, `Tooltip`, `TooltipTrigger`, `TooltipContent`). It uses Radix UI Tooltip underneath which handles open/close delay, placement, and ARIA automatically. Style `TooltipContent` via our CSS variables so it matches the visual spec below. Wrap `TooltipProvider` at the root layout level once.

**Trigger:** Hover or focus on any element with `title` or `data-tooltip` attribute  
**Container:** `bg-surface border border-border text-xs text-text px-2 py-1 rounded-sm shadow-modal whitespace-nowrap`  
**Arrow:** 4px CSS triangle pointing toward the trigger  
**Animation:** Fade in over `100ms`; delay `300ms` before showing  
**Max width:** `200px`; wraps text if exceeded  
**Placement:** Auto — prefer `top`, fallback `bottom` or `right`

---

### D10 — Badge / Status Chip

**Implementation:** Use shadcn's `badge` component. It ships with `default`, `secondary`, `outline`, `destructive` variants. Extend it with our 7 status variants (`active`, `paid`, `pending`, `partial`, `cancelled`, `overdue`, `inactive`) by adding them to the CVA config in `badge.jsx`.

`inline-flex items-center gap-1 px-2 py-0.5 rounded-sm text-xs font-medium`

| Variant | Background | Text | Use |
|---|---|---|---|
| **Active / Paid** | `primary/15` | `text-primary` | Bill paid, tenant active |
| **Pending** | `muted/15` | `text-muted` | Bill pending |
| **Partial** | `primary/10` | `text-primary/70` | Bill partially paid |
| **Cancelled** | `border/40` | `text-muted/60` | Cancelled bill |
| **Danger / Overdue** | `danger/15` | `text-danger` | Overdue bill, error state |
| **Inactive / Exited** | `bg/60` | `text-muted/50` | Inactive tenant |

Optional leading dot: `w-1.5 h-1.5 rounded-full bg-current`

---

### D11 — Tables

**Implementation:** Use shadcn's `table` components (`Table`, `TableHeader`, `TableBody`, `TableRow`, `TableHead`, `TableCell`, `TableCaption`). Wrap them in a custom `DataTable.jsx` component that accepts `columns`, `data`, `loading`, and `emptyMessage` props, and handles the skeleton loading rows, empty state, and pagination bar on top of shadcn's unstyled table primitives.

**Container:** `w-full bg-surface rounded-lg border border-border overflow-hidden`  
**Header row:** `bg-bg border-b border-border`  
**Header cell:** `px-4 py-3 text-xs font-medium text-muted uppercase tracking-wide text-left`  
**Body row:** `border-b border-border last:border-0 hover:bg-border/20 transition-colors duration-100`  
**Body cell:** `px-4 py-3 text-sm text-text`  
**Empty state:** Full-width row, centered `<Inbox size={32} className="text-muted" />` + `text-sm text-muted mt-2` message  
**Loading skeleton:** 5 shimmer rows — `bg-border/30 animate-pulse h-4 rounded`  
**Pagination:** Bottom bar `flex justify-between items-center px-4 py-3 border-t border-border text-xs text-muted`

**Action column:** Always last; `flex gap-2 items-center justify-end`; uses Icon-only and Danger icon-only buttons

---

### D12 — Upload Zone

**Container:** `border-2 border-dashed border-border rounded-lg p-6 flex flex-col items-center justify-center gap-2 bg-bg cursor-pointer transition-colors duration-150`

| State | Border | Background | Text |
|---|---|---|---|
| Default | `border-border` dashed | `bg-bg` | `text-muted` |
| Drag-over | `border-primary` dashed | `bg-primary/5` | `text-primary` |
| Uploaded | `border-primary` solid | `bg-primary/5` | `text-text` |
| Error | `border-danger` dashed | `bg-danger/5` | `text-danger` |

**Icon:** `<Upload size={28} />` in `text-muted` (default) or `text-primary` (hover/uploaded)  
**Body text:** `text-sm text-muted` — "Click to upload or drag & drop"  
**Caption:** `text-xs text-muted` — "PDF only · Max 5 MB"  
**Uploaded file pill:** `bg-surface border border-border rounded-sm px-3 py-1 flex items-center gap-2 text-xs text-text` with `<FileText size={14} className="text-primary" />` and `<X size={12} />` remove button

---

### D13 — Stat Cards (Dashboard)

**Container:** `bg-surface rounded-xl border border-border p-5 flex flex-col gap-3 shadow-card`  
**Icon container:** `w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center`  
**Icon:** Lucide, `size={20}`, `text-primary`  
**Value:** `text-2xl font-bold text-text`  
**Label:** `text-xs font-medium text-muted uppercase tracking-wide`  
**Trend indicator (optional):** `text-xs font-medium` — `text-primary` with `<TrendingUp size={12} />` or `text-danger` with `<TrendingDown size={12} />`

**Layout:** 4-column grid on desktop, 2-column on tablet — `grid grid-cols-2 lg:grid-cols-4 gap-4`

---

### D14 — Sidebar Navigation

**Container:** `w-60 h-screen bg-surface border-r border-border flex flex-col fixed left-0 top-0 z-40`  
**Logo area:** `h-16 flex items-center px-5 border-b border-border` — app name in `text-base font-bold text-text` with logo icon in `text-primary`  
**Nav items:** `flex items-center gap-3 px-4 py-2.5 rounded-md mx-2 text-sm font-medium transition-colors duration-150`

| State | Background | Text | Icon |
|---|---|---|---|
| Default | transparent | `text-muted` | `text-muted` |
| Hover | `bg-border/30` | `text-text` | `text-text` |
| Active | `bg-primary/15` | `text-primary` | `text-primary` |

**Active indicator:** `3px left border-l-3 border-primary -ml-2 pl-[calc(1rem-3px)]` or left accent bar  
**Section labels:** `text-xs font-medium text-muted/50 uppercase tracking-wider px-4 py-2 mt-4`  
**Bottom area:** `mt-auto border-t border-border p-4` — user avatar area + logout button

---

### D15 — Page-Level Layouts

#### Auth Pages (Login / Register)
`min-h-screen bg-bg flex items-center justify-center`  
Centered card `max-w-sm w-full bg-surface border border-border rounded-lg p-8 shadow-modal`  
Logo + title above form. Link to register/login below submit button.

#### Dashboard
Top: `<PageHeader>` — title + date  
Below: 4-column stat card grid  
Below: Two-column row — `Overdue Alerts` panel (left, 5-col) + `Recent Payments` table (right, 7-col) on desktop  

#### Properties / Tenants / Expenses
`<PageHeader title="..." action={<PrimaryButton>Add ...</PrimaryButton>} />`  
Full-width table below with filter toolbar above — `flex gap-3 items-center mb-4`

#### Bills Page
`<PageHeader>` with two buttons top-right: `+ Create Bill` (Secondary) and `Generate Bills` (Primary)  
Filter toolbar (date range + status select) below  
Full-width bills table

#### Reports
Filter toolbar spanning full width  
Results table below  
Export buttons in page header right slot

---

### D16 — Icon Conventions (Lucide React)

**Default size:** `size={16}` in body / table actions  
**Medium:** `size={18}` in buttons with labels, toasters  
**Large:** `size={20}` in stat card icons, modal titles  
**XL:** `size={24}` in empty state icons, confirmation dialogs  
**Stroke width:** Always `strokeWidth={1.75}` (Lucide default is 2 — slightly lighter feels more refined)

| Action | Icon |
|---|---|
| Add / Create | `<Plus />` |
| Edit | `<Pencil />` |
| Delete | `<Trash2 />` |
| View detail | `<Eye />` |
| Save / Confirm | `<Check />` |
| Cancel / Close | `<X />` |
| Search | `<Search />` |
| Filter | `<SlidersHorizontal />` |
| Upload | `<Upload />` |
| Download / Export | `<Download />` |
| PDF | `<FileText />` |
| Excel | `<Sheet />` |
| Send reminder | `<Bell />` |
| Payment | `<CreditCard />` |
| Property | `<Building2 />` |
| Tenant | `<Users />` |
| Bills | `<Receipt />` |
| Expenses | `<Wallet />` |
| Reports | `<BarChart3 />` |
| Dashboard | `<LayoutDashboard />` |
| Overdue alert | `<AlertTriangle />` |
| Success | `<CheckCircle2 />` |
| Error | `<XCircle />` |
| Info | `<Info />` |
| Logout | `<LogOut />` |

---

## Risks / Trade-offs

| Risk | Mitigation |
|---|---|
| 6-color constraint feels restrictive for status differentiation | Use `opacity/alpha variants` of the 6 colors (e.g., `primary/15`, `danger/15`) to create tints — extends expressiveness without adding new hues |
| Purple primary (`#6C63FF`) on dark background may have contrast issues for small text | Minimum body text on `--color-surface` background passes WCAG AA; validate with contrast checker at build time |
| Single theme may feel limiting to some users | Explicit non-goal — document as a v2 consideration; adds zero complexity risk to v1 |
| Tailwind purge may strip dynamically generated classes like `border-primary/15` | Safelist dynamic opacity variants in `tailwind.config.js` `safelist` array |
| shadcn CSS variables use HSL format but Tailwind color tokens use hex — mismatch | Tailwind color tokens are defined as `hsl(var(--token))` wrappers so both systems stay in sync from a single source of truth in `globals.css` |
| shadcn ships new components with light-mode defaults; dark theme variables may not apply | Always run `npx shadcn@latest init` with `baseColor: slate` and `cssVariables: true`; immediately override `:root` with Obsidian Dark values before adding any component |
| shadcn component updates may overwrite customisations | shadcn copies source into the repo — it is never auto-updated. Treat installed files as owned code. |

## Open Questions

- Should the sidebar be collapsible (icon-only mode) for narrow viewports, or fixed width only?
- Should the Record Payment modal be `max-w-lg` or `max-w-2xl`? (Depends on final field count)
- Should stat cards show a sparkline/mini chart or remain purely numerical?
