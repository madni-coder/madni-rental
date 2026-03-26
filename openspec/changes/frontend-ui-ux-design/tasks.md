## 1. Foundation: Tailwind + Token Setup

- [ ] 1.1 Install `lucide-react` as a runtime dependency in `client/` — `npm install lucide-react`
- [ ] 1.2 Add Inter font via `next/font/google` in `client/src/app/layout.jsx` with `subsets: ['latin']` and apply `className` to `<html>` element
- [ ] 1.3 Extend `tailwind.config.js` with the 7-color palette: `bg`, `surface`, `border`, `primary`, `text`, `muted`, `danger`
- [ ] 1.4 Add custom `boxShadow` tokens to Tailwind config: `shadow-card`, `shadow-modal`, `shadow-toast`
- [ ] 1.5 Add `safelist` array to Tailwind config covering all dynamic opacity variants: `bg-primary/10`, `bg-primary/15`, `bg-danger/15`, `border-danger/40`, `text-primary/70`, etc.
- [ ] 1.6 Define all 7 CSS custom properties (`--color-bg` through `--color-danger`) on `:root` in `client/src/app/globals.css`
- [ ] 1.7 Set `body` background to `bg-bg` and default text color to `text-text` in `globals.css`
- [ ] 1.8 Add global `strokeWidth` default for all Lucide icons — apply `[&_svg]:stroke-[1.75]` on the app root or create a wrapper

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

- [ ] 3.1 Create `client/src/components/ui/Button.jsx` accepting `variant` (`primary` | `secondary` | `ghost` | `danger` | `icon`), `size` (`sm` | `md` | `lg`), `loading`, `disabled`, `onClick`, `children`, `aria-label`
- [ ] 3.2 Implement `primary` variant: `bg-primary text-white rounded-md` with `hover:brightness-110 hover:shadow-md active:brightness-90 active:scale-[0.98]`
- [ ] 3.3 Implement `secondary` variant: `bg-surface text-text border border-border hover:bg-border/50`
- [ ] 3.4 Implement `ghost` variant: `transparent text-muted hover:text-text hover:bg-surface`
- [ ] 3.5 Implement `danger` variant: `bg-danger/15 text-danger border border-danger/40 hover:bg-danger hover:text-white hover:border-danger`
- [ ] 3.6 Implement `icon` variant: `transparent text-muted p-1.5 rounded-md hover:text-text hover:bg-surface`
- [ ] 3.7 Implement `loading` state: replace children with `<Loader2 size={16} className="animate-spin" />` + original label; apply `opacity-80 pointer-events-none`
- [ ] 3.8 Implement `disabled` state: `opacity-40 cursor-not-allowed pointer-events-none` across all variants
- [ ] 3.9 Implement focus-visible ring: `focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2 focus-visible:ring-offset-bg focus-visible:outline-none`
- [ ] 3.10 Apply size variants: `sm` (`px-3 py-1.5 text-xs`), `md` (`px-4 py-2 text-sm`), `lg` (`px-5 py-2.5 text-base`)
- [ ] 3.11 Add `transition-all duration-150` to all button variants as base class

---

## 4. Input Components

- [ ] 4.1 Create `client/src/components/ui/Input.jsx` with props: `label`, `helper`, `error`, `disabled`, `readOnly`, `leftIcon`, `rightIcon`
- [ ] 4.2 Implement base input styles: `bg-surface border border-border rounded-md px-3 py-2 text-sm text-text placeholder:text-muted w-full transition-colors duration-150`
- [ ] 4.3 Implement focus state: `focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none`
- [ ] 4.4 Implement error state when `error` prop present: `border-danger ring-2 ring-danger/20` + error message below with `<AlertCircle size={12} />`
- [ ] 4.5 Implement `disabled` state: `bg-bg opacity-50 cursor-not-allowed border-border/50`
- [ ] 4.6 Implement `readOnly` state: `bg-bg/50 text-muted border-border/30 cursor-default`
- [ ] 4.7 Render `label` above input: `text-xs font-medium text-muted uppercase tracking-wide block mb-1`
- [ ] 4.8 Render `helper` text below input: `text-xs text-muted mt-1`
- [ ] 4.9 Create `client/src/components/ui/Select.jsx` — same styles as Input with `appearance-none` + absolutely positioned `<ChevronDown size={16} className="text-muted" />`
- [ ] 4.10 Create `client/src/components/ui/Textarea.jsx` — same styles as Input + `resize-none min-h-[80px]`
- [ ] 4.11 Implement icon support: `leftIcon` renders with `pl-9` input and `absolute left-3` icon; `rightIcon` with `pr-9` and `absolute right-3` icon; both icons `pointer-events-none text-muted`

---

## 5. Modal Component

- [ ] 5.1 Create `client/src/components/ui/Modal.jsx` accepting `isOpen`, `onClose`, `title`, `icon`, `size` (`sm` | `md` | `lg`), `children`
- [ ] 5.2 Implement overlay: `fixed inset-0 bg-bg/80 backdrop-blur-sm z-50 flex items-start justify-center` — click on overlay calls `onClose`
- [ ] 5.3 Implement container: `bg-surface rounded-lg shadow-modal border border-border w-full mx-4 mt-[10vh] overflow-hidden` with size variants (`max-w-sm`, `max-w-lg`, `max-w-2xl`)
- [ ] 5.4 Implement entry animation: `opacity-0 scale-95 → opacity-100 scale-100` over `200ms ease-out` using CSS transition or Tailwind `transition` classes
- [ ] 5.5 Implement `Modal.Header` sub-component: `px-6 py-4 border-b border-border flex items-center justify-between` with optional icon + title + X close button
- [ ] 5.6 Implement `Modal.Body` sub-component: `px-6 py-5 overflow-y-auto max-h-[60vh]`
- [ ] 5.7 Implement `Modal.Footer` sub-component: `px-6 py-4 border-t border-border flex items-center justify-end gap-3`
- [ ] 5.8 Add `Escape` key listener in Modal that calls `onClose` when the modal is open
- [ ] 5.9 Create `client/src/components/ui/ConfirmModal.jsx` — wraps Modal with `type="danger"` layout: `<AlertTriangle size={24} className="text-danger" />`, danger-colored title, muted message, Cancel + Danger action buttons

---

## 6. Toaster System

- [ ] 6.1 Create `client/src/components/ui/Toaster.jsx` — container: `fixed bottom-5 right-5 z-50 flex flex-col gap-2 items-end`
- [ ] 6.2 Create `client/src/components/ui/Toast.jsx` — individual toast with left-accent border, type icon, title, message, dismiss button
- [ ] 6.3 Implement toast type variants: `success` (`border-primary` + `<CheckCircle2 />`), `error` (`border-danger` + `<XCircle />`), `warning` (`border-muted` + `<AlertTriangle />`), `info` (`border-primary/50` + `<Info />`)
- [ ] 6.4 Implement sliding entry animation: `translate-x-full opacity-0 → translate-x-0 opacity-100` over `200ms ease-out`
- [ ] 6.5 Implement 4-second auto-dismiss with progress bar (2px bottom bar draining from `w-full` to `w-0`)
- [ ] 6.6 Implement pause-on-hover: pause the timer and freeze the progress bar on `mouseenter`, resume on `mouseleave`
- [ ] 6.7 Implement manual dismiss: `<X size={14} />` button triggers exit animation then removes toast from state
- [ ] 6.8 Create `client/src/context/ToastContext.jsx` with `useToast()` hook exposing `toast.success()`, `toast.error()`, `toast.warning()`, `toast.info()` helpers
- [ ] 6.9 Render `<Toaster />` in the root layout so toasts are available on all pages
- [ ] 6.10 Cap maximum visible toasts at 5 — auto-dismiss the oldest when the 6th is added

---

## 7. Badge Component

- [ ] 7.1 Create `client/src/components/ui/Badge.jsx` accepting `variant` (`active` | `paid` | `pending` | `partial` | `cancelled` | `overdue` | `inactive` | `exited`) and `dot` boolean
- [ ] 7.2 Implement base styles: `inline-flex items-center gap-1 px-2 py-0.5 rounded-sm text-xs font-medium`
- [ ] 7.3 Implement all 7 variant color combinations (background/text) per spec
- [ ] 7.4 Implement `dot` prop: prepend `<span className="w-1.5 h-1.5 rounded-full bg-current" />` when `dot={true}`

---

## 8. Tooltip Component

- [ ] 8.1 Create `client/src/components/ui/Tooltip.jsx` wrapping a trigger element with a tooltip container
- [ ] 8.2 Implement 300ms hover delay before showing, 0ms delay on hide
- [ ] 8.3 Implement tooltip appearance: `bg-surface border border-border text-xs text-text px-2 py-1 rounded-sm shadow-modal whitespace-nowrap max-w-[200px]`
- [ ] 8.4 Implement 4px CSS arrow triangle pointing toward the trigger element
- [ ] 8.5 Implement placement logic: default `top`, fallback to `bottom` if near viewport top, fallback to `right` if needed
- [ ] 8.6 Implement fade-in/out animation: `opacity-0 → opacity-100` over `100ms`

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

- [ ] 10.1 Create `client/src/components/ui/Table.jsx` with `columns` and `data` props, plus `loading` and `emptyMessage`
- [ ] 10.2 Implement container: `w-full bg-surface rounded-lg border border-border overflow-hidden`
- [ ] 10.3 Implement header row: `bg-bg border-b border-border` with header cells `px-4 py-3 text-xs font-medium text-muted uppercase tracking-wide`
- [ ] 10.4 Implement body rows: `border-b border-border last:border-0 hover:bg-border/20 transition-colors duration-100`, body cells `px-4 py-3 text-sm text-text`
- [ ] 10.5 Implement loading skeleton: 5 rows of shimmer cells `h-4 bg-border/30 animate-pulse rounded`
- [ ] 10.6 Implement empty state: `<Inbox size={32} className="text-muted mx-auto" />` + `text-sm text-muted mt-2` with `emptyMessage` prop
- [ ] 10.7 Implement pagination bar: `flex justify-between items-center px-4 py-3 border-t border-border` with "Showing X–Y of Z results" + Prev/Next buttons
- [ ] 10.8 Add `FilterToolbar.jsx` component: `flex gap-3 items-center mb-4` with search `<Input>` (`leftIcon={<Search size={16} />}`) and filter `<Select>` slots

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
