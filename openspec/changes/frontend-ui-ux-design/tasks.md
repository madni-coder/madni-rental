## 1. Foundation: shadcn/ui Init + Tailwind + Token Setup

- [ ] 1.1 Install `lucide-react` as a runtime dependency in `client/` — `npm install lucide-react`
- [ ] 1.2 Run `npx shadcn@latest init` inside `client/` — choose: TypeScript=No, baseColor=slate, cssVariables=Yes, tailwind config path=tailwind.config.js, components path=src/components/ui
- [ ] 1.3 Add Inter font via `next/font/google` in `client/src/app/layout.jsx` with `subsets: ['latin']` and apply `className` to `<html>` element
- [ ] 1.4 Override the entire `:root` block in `client/src/app/globals.css` with the Obsidian Dark HSL values: `--background: 230 15% 8%`, `--card: 230 22% 13%`, `--primary: 244 100% 69%`, `--destructive: 0 84% 60%`, `--border: 230 22% 23%`, `--muted-foreground: 220 9% 46%`, etc. (full mapping per design.md D2)
- [ ] 1.5 Extend `tailwind.config.js` with semantic alias colors wrapping the CSS vars: `bg: 'hsl(var(--background))'`, `surface: 'hsl(var(--card))'`, `border: 'hsl(var(--border))'`, `primary: 'hsl(var(--primary))'`, `text: 'hsl(var(--foreground))'`, `muted: 'hsl(var(--muted-foreground))'`, `danger: 'hsl(var(--destructive))'`
- [ ] 1.6 Add custom `boxShadow` tokens to Tailwind config: `shadow-card`, `shadow-modal`, `shadow-toast`
- [ ] 1.7 Add `safelist` array to Tailwind config covering all dynamic opacity variants: `bg-primary/10`, `bg-primary/15`, `bg-danger/15`, `border-danger/40`, `text-primary/70`, etc.
- [ ] 1.8 Set `body` background to `bg-background` and default text color to `text-foreground` in `globals.css`
- [ ] 1.9 Add global `strokeWidth` default for Lucide icons — apply `[&_svg]:stroke-[1.75]` on the root layout `<body>` or wrap in a provider

---

## 2. Layout Shell Components

- [ ] 2.1 Create `client/src/components/layout/Sidebar.jsx` — fixed `w-60 h-screen bg-surface border-r border-border` with logo area, nav items, and bottom user section
- [ ] 2.2 Implement sidebar nav items with active/hover/default states using Next.js `usePathname()` for active detection
- [ ] 2.3 Apply module-to-icon mapping in sidebar: `<LayoutDashboard />`, `<Building2 />`, `<Users />`, `<Receipt />`, `<Wallet />`, `<BarChart3 />` with correct `size={16}` and `aria-hidden="true"`
- [ ] 2.4 Add user display name, email, and Logout button to sidebar bottom area (`mt-auto border-t border-border p-4`)
- [ ] 2.5 Create `client/src/components/layout/AppShell.jsx` — `flex min-h-screen bg-bg` wrapper with sidebar + `ml-60 flex-1` content area
- [ ] 2.6 Create `client/src/components/layout/PageHeader.jsx` — accepts `title` and optional `action` slot; renders `flex items-center justify-between mb-6` with `text-2xl font-bold text-text`
- [ ] 2.7 Apply `AppShell` to all authenticated page routes via the root layout or a nested `(dashboard)` layout in Next.js App Router

---

## 3. Button Component

- [ ] 3.1 Install shadcn button: `npx shadcn@latest add button` — this creates `client/src/components/ui/button.jsx`
- [ ] 3.2 In `button.jsx`, rename `default` variant to also support `variant="primary"` alias via the CVA config (or create a thin `<Button>` re-export that maps `primary` → `default`, `danger` → `destructive`)
- [ ] 3.3 Add `danger` variant in the CVA `variants.variant` object: `danger: 'bg-danger/15 text-danger border border-danger/40 hover:bg-danger hover:text-white hover:border-danger'`
- [ ] 3.4 Add `loading` prop support: when `loading={true}`, prepend `<Loader2 size={16} className="animate-spin" />` to children and apply `pointer-events-none opacity-80`
- [ ] 3.5 Verify generated CSS variables produce correct colors for each variant against the Obsidian Dark palette — check in browser devtools

---

## 4. Input Components

- [ ] 4.1 Install shadcn input, select, textarea, label: `npx shadcn@latest add input select textarea label`
- [ ] 4.2 Verify installed `input.jsx` styles inherit correctly from CSS variables (`bg-background`, `border-input`, `placeholder:text-muted-foreground`) — adjust any classes that deviate from the visual spec in design.md D6
- [ ] 4.3 Create `client/src/components/ui/FormField.jsx` — wrapper accepting `label`, `helper`, `error`, `children`; renders label (`text-xs font-medium text-muted uppercase tracking-wide block mb-1`), the child input, helper text (`text-xs text-muted mt-1`), and error message (`text-xs text-danger flex items-center gap-1 mt-1` with `<AlertCircle size={12} />`)
- [ ] 4.4 Create `client/src/components/ui/InputWithIcon.jsx` — wraps shadcn `<Input>` in a `relative` div with `leftIcon` (`absolute left-3 text-muted pointer-events-none`) and `rightIcon` support; applies `pl-9` or `pr-9` on the `<Input>` accordingly
- [ ] 4.5 Verify shadcn `<Select>` renders correctly with our CSS variables for `SelectTrigger`, `SelectContent`, `SelectItem` — override background to `bg-card` and border to `border-border` if default values differ

---

## 5. Modal Component

- [ ] 5.1 Install shadcn dialog: `npx shadcn@latest add dialog` — installs Radix UI Dialog with Escape key, focus trap, backdrop click, and ARIA out of the box
- [ ] 5.2 Create `client/src/components/ui/Modal.jsx` — a convenience wrapper around `Dialog` / `DialogContent` / `DialogHeader` / `DialogFooter` accepting `isOpen`, `onClose`, `title`, `icon`, `size` (`sm` | `md` | `lg`) props
- [ ] 5.3 Override `DialogContent` className to match visual spec: `bg-card border-border shadow-modal mt-[10vh]` and size variants (`max-w-sm`, `max-w-lg`, `max-w-2xl`) via `cn()` utility
- [ ] 5.4 Implement `Modal.Header` inside the wrapper: `px-6 py-4 border-b border-border flex items-center justify-between` with optional Lucide icon (`size={20} text-primary`) + title (`text-lg font-semibold`) + X close button
- [ ] 5.5 Implement `Modal.Body` slot: `px-6 py-5 overflow-y-auto max-h-[60vh]`
- [ ] 5.6 Implement `Modal.Footer` slot: `px-6 py-4 border-t border-border flex items-center justify-end gap-3`
- [ ] 5.7 Create `client/src/components/ui/ConfirmModal.jsx` — wraps `<Modal size="sm">` with `type="danger"` layout: `<AlertTriangle size={24} className="text-danger" />` header icon, danger-colored title, muted message body, Cancel (secondary) + Danger action button in footer

---

## 6. Toaster System

- [ ] 6.1 Install shadcn sonner: `npx shadcn@latest add sonner` — installs the `sonner` package and a pre-wired `<Toaster>` component
- [ ] 6.2 Add `<Toaster />` to `client/src/app/layout.jsx` — render it once at the root level
- [ ] 6.3 Configure `<Toaster>` props: `position="bottom-right"`, `theme="dark"`, `richColors={true}`, `closeButton={true}`, `duration={4000}`
- [ ] 6.4 Override Sonner's CSS variables in `globals.css` to match our palette: `--normal-bg`, `--normal-border`, `--success-bg`, `--success-border`, `--error-bg`, `--error-border` mapped to our surface/primary/danger tokens
- [ ] 6.5 Call `toast.success('Title', { description: 'msg' })`, `toast.error()`, `toast.warning()`, `toast.info()` directly from Sonner — no custom context needed
- [ ] 6.6 Verify toast visual matches spec: left-accent border color per type, correct icon, title + message layout, auto-dismiss at 4s

## 7. Badge Component

- [ ] 7.1 Install shadcn badge: `npx shadcn@latest add badge`
- [ ] 7.2 Extend the CVA `variants.variant` object in `badge.jsx` with our 7 status variants: `active`/`paid` (`bg-primary/15 text-primary`), `pending` (`bg-muted/15 text-muted`), `partial` (`bg-primary/10 text-primary/70`), `cancelled` (`bg-border/40 text-muted/60`), `overdue` (`bg-danger/15 text-danger`), `inactive`/`exited` (`bg-background/60 text-muted/50`)
- [ ] 7.3 Override base badge className to `inline-flex items-center gap-1 px-2 py-0.5 rounded-sm text-xs font-medium` (matching spec — shadcn default uses `rounded-full`, change to `rounded-sm`)
- [ ] 7.4 Add `dot` prop: prepend `<span className="w-1.5 h-1.5 rounded-full bg-current" aria-hidden="true" />` when `dot={true}`

---

## 8. Tooltip Component

- [ ] 8.1 Install shadcn tooltip: `npx shadcn@latest add tooltip` — installs Radix UI Tooltip with placement, delay, and ARIA
- [ ] 8.2 Render `<TooltipProvider delayDuration={300}>` once in the root layout wrapping the entire app
- [ ] 8.3 Override `TooltipContent` className to match spec: `bg-card border border-border text-xs text-foreground px-2 py-1 rounded-sm shadow-modal whitespace-nowrap max-w-[200px]`
- [ ] 8.4 Create `client/src/components/ui/Tip.jsx` — convenience wrapper: `<Tip label="..."><child /></Tip>` that renders the full `Tooltip` + `TooltipTrigger` + `TooltipContent` boilerplate

---

## 9. Upload Zone Component

- [ ] 9.1 Create `client/src/components/ui/UploadZone.jsx` accepting `onFile`, `accept` (default `application/pdf`), `maxSizeMB` (default `5`)
- [ ] 9.2 Implement default state: dashed `border-2 border-dashed border-border rounded-lg`, `<Upload size={28} className="text-muted" />`, prompt text, caption
- [ ] 9.3 Implement drag-over state: swap to `border-primary bg-primary/5`, icon to `text-primary` — use `onDragEnter` / `onDragLeave` / `onDrop` handlers
- [ ] 9.4 Implement click-to-select: hidden `<input type="file">` triggered by zone click
- [ ] 9.5 Implement validation: reject non-PDF or files > 5 MB immediately, switch to error state with message below zone
- [ ] 9.6 Implement uploaded state: replace icon + prompt with file pill (`bg-surface border border-border rounded-sm px-3 py-1`) showing filename + remove `<X size={12} />` button
- [ ] 9.7 Implement remove: clicking `<X>` on file pill resets zone to default state and calls `onFile(null)`

---

## 10. Data Table Component

- [ ] 10.1 Install shadcn table and skeleton: `npx shadcn@latest add table skeleton`
- [ ] 10.2 Create `client/src/components/ui/DataTable.jsx` — wrapper accepting `columns`, `data`, `loading`, `emptyMessage`, `pagination` props; renders shadcn `Table` primitives inside a `w-full bg-card rounded-lg border border-border overflow-hidden` container
- [ ] 10.3 Style `TableHeader` row: `bg-background border-b border-border`; style each `TableHead` cell: `px-4 py-3 text-xs font-medium text-muted uppercase tracking-wide text-left`
- [ ] 10.4 Style `TableRow`: `border-b border-border last:border-0 hover:bg-border/20 transition-colors duration-100`; style `TableCell`: `px-4 py-3 text-sm text-foreground`
- [ ] 10.5 Implement loading state: when `loading={true}`, render 5 skeleton rows — each cell contains `<Skeleton className="h-4 bg-border/30" />` at realistic widths
- [ ] 10.6 Implement empty state: when `data` is empty and not loading, render a full-row centered section with `<Inbox size={32} className="text-muted mx-auto" />` + `text-sm text-muted mt-2 text-center` using `emptyMessage` prop
- [ ] 10.7 Implement pagination bar: `flex justify-between items-center px-4 py-3 border-t border-border text-xs text-muted` with "Showing X–Y of Z results" and Prev/Next `<Button variant="secondary" size="sm">` buttons
- [ ] 10.8 Create `client/src/components/ui/FilterToolbar.jsx` — `flex gap-3 items-center mb-4` with search `<InputWithIcon leftIcon={<Search size={16} />}>` and filter `<Select>` slots

---

## 11. Stat Card Component

- [ ] 11.1 Create `client/src/components/ui/StatCard.jsx` accepting `icon`, `value`, `label`, `trend` (optional: `{ direction, value }`)
- [ ] 11.2 Implement container: `bg-surface rounded-xl border border-border p-5 flex flex-col gap-3 shadow-card`
- [ ] 11.3 Implement icon container: `w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center` with `text-primary` icon
- [ ] 11.4 Implement value display: `text-2xl font-bold text-text`
- [ ] 11.5 Implement label display: `text-xs font-medium text-muted uppercase tracking-wide`
- [ ] 11.6 Implement trend indicator: `<TrendingUp size={12} />` in `text-primary` or `<TrendingDown size={12} />` in `text-danger` with the trend value

---

## 12. Auth Pages

- [ ] 12.1 Build `/login` page layout: `min-h-screen bg-bg flex items-center justify-center` with centered `max-w-sm bg-surface border border-border rounded-lg p-8 shadow-modal` card
- [ ] 12.2 Add logo icon + app name header, email/password form fields using `<Input>`, primary "Login" button (full width), and link to register
- [ ] 12.3 Build `/register` page layout with same card shell — Full Name, Email, Password, Confirm Password fields + "Create Account" button + link to login
- [ ] 12.4 Wire login/register forms to `AuthContext` — show loading state on button during submit, show error toast on failure, redirect on success

---

## 13. Dashboard Page

- [ ] 13.1 Build Dashboard page layout: `<PageHeader title="Dashboard" />` with current date on right, 4-column stat card grid, two-column panel row
- [ ] 13.2 Build `OverdueAlerts` panel: `bg-surface rounded-lg border border-border p-5` with `<AlertTriangle size={16} className="text-danger" />` header, list of overdue rows, empty state
- [ ] 13.3 Build `RecentPayments` panel: header + compact 4-column table (Tenant | Property | Amount | Date) showing last 10 rows

---

## 14. Properties Page

- [ ] 14.1 Build Properties page with `<PageHeader>` + "Add Property" button, filter toolbar (search + status), and properties table with all 7 columns
- [ ] 14.2 Build Add/Edit Property modal (`size="md"`): property name, address, type, rent, description, upload zone for agreement
- [ ] 14.3 Wire delete action to `<ConfirmModal type="danger">` — "Delete Property"

---

## 15. Tenants Page

- [ ] 15.1 Build Tenants page with `<PageHeader>` + "Add Tenant" button, filter toolbar (search + status + property), and tenants table with all 6 columns + actions
- [ ] 15.2 Build Add/Edit Tenant modal (`size="md"`): two-column grid layout inside modal body with all tenant fields + agreement upload zone
- [ ] 15.3 Wire deactivate action to `<ConfirmModal type="danger">` — "Mark as Exited"

---

## 16. Bills Page

- [ ] 16.1 Build Bills page with `<PageHeader>` + dual action buttons (Create Bill secondary, Generate Monthly Bills primary), filter toolbar (month + year + status + tenant), bills table with payment action
- [ ] 16.2 Build Record Payment modal (`size="lg"`): bill summary at top, amount/date/method/notes fields
- [ ] 16.3 Build Generate Bills confirmation modal (`size="sm"`): contextual month message + Confirm button
- [ ] 16.4 Build Create Bill modal (`size="md"`): tenant select, billing period, amount fields

---

## 17. Expenses Page

- [ ] 17.1 Build Expenses page with `<PageHeader>` + "Add Expense" button, date-range + property + category filters, expenses table with 6 columns
- [ ] 17.2 Build Add/Edit Expense modal with description, property, category, amount, date, receipt upload zone

---

## 18. Reports Page

- [ ] 18.1 Build Reports page with `<PageHeader>` + PDF/Excel export buttons, full-width filter toolbar (date range + property + report type), summary stat cards row
- [ ] 18.2 Build dynamic results table that changes column structure based on report type (Rent Collection / Expense Summary / Net P&L)
- [ ] 18.3 Implement full-page empty state for no-data condition: `<BarChart3 size={48} className="text-muted" />` + prompt message

---

## 19. Accessibility and Polish

- [ ] 19.1 Add `aria-label` to all icon-only buttons throughout the app (Edit, Delete, View, Close, Dismiss)
- [ ] 19.2 Add `aria-hidden="true"` to all decorative icons (nav icons alongside text, stat card icons, heading icons)
- [ ] 19.3 Verify focus ring is visible on all interactive elements — test with Tab key navigation
- [ ] 19.4 Verify all input error states display `<AlertCircle size={12} />` + error message below the field
- [ ] 19.5 Verify all disabled states show `opacity-40 cursor-not-allowed` + provide `title` tooltip explaining why
- [ ] 19.6 Verify `Escape` key closes all open modals
- [ ] 19.7 Verify no hex color values outside the 7-token palette appear in any component file
- [ ] 19.8 Run Tailwind build and confirm no purged classes are missing (check safelist covers all dynamic opacity variants)
