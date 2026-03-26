## ADDED Requirements

### Requirement: Button Component

The app MUST have a single reusable `<Button>` component that covers 5 visual variants and 3 sizes with consistent hover, focus, active, loading, and disabled states.

#### Scenario: Primary button renders correctly

Given a `<Button variant="primary">Save</Button>`,
When it renders in its default resting state,
Then it SHALL display:
- Background: `bg-primary` (`#6C63FF`)
- Text: `text-white text-sm font-medium`
- Border: none
- Border radius: `rounded-md`
- Padding: `px-4 py-2`
- Transition: `transition-all duration-150`

And on hover: `brightness-110 shadow-md`
And on active (pressed): `brightness-90 scale-[0.98]`
And on focus-visible: `ring-2 ring-primary/40 ring-offset-2 ring-offset-bg outline-none`

#### Scenario: Secondary button renders correctly

Given a `<Button variant="secondary">Cancel</Button>`,
When it renders,
Then it SHALL display:
- Background: `bg-surface`
- Text: `text-text text-sm font-medium`
- Border: `border border-border`
- On hover: `bg-border/50`

#### Scenario: Ghost button renders correctly

Given a `<Button variant="ghost">Edit</Button>`,
When it renders,
Then it SHALL display:
- Background: `transparent`
- Text: `text-muted text-sm font-medium`
- Border: none
- On hover: `text-text bg-surface`

#### Scenario: Danger button renders correctly

Given a `<Button variant="danger">Delete</Button>`,
When it renders in its resting state,
Then it SHALL display:
- Background: `bg-danger/15`
- Text: `text-danger text-sm font-medium`
- Border: `border border-danger/40`
- On hover: `bg-danger text-white border-danger`

#### Scenario: Icon-only button renders correctly

Given a `<Button variant="icon" aria-label="Edit"><Pencil size={16} /></Button>`,
When it renders,
Then it SHALL display as a `p-1.5 rounded-md` ghost button with `text-muted` icon, hover `text-text bg-surface`, no visible border.

#### Scenario: Disabled state applies to all variants

Given any button with the `disabled` attribute,
When it renders,
Then it SHALL have `opacity-40 cursor-not-allowed pointer-events-none` applied regardless of variant.

#### Scenario: Loading state replaces button label

Given a button with `loading={true}`,
When it renders,
Then the button label SHALL be replaced with `<Loader2 size={16} className="animate-spin" />` followed by the original label text, and `opacity-80 pointer-events-none` SHALL be applied. The button dimensions SHALL NOT change.

#### Scenario: Small and large size variants

Given `<Button size="sm">` or `<Button size="lg">`,
Then:
- `sm`: `px-3 py-1.5 text-xs`
- `md` (default): `px-4 py-2 text-sm`
- `lg`: `px-5 py-2.5 text-base`

---

### Requirement: Input Component

The app MUST have a single reusable `<Input>` component for text inputs, with matching `<Select>` and `<Textarea>` variants.

#### Scenario: Input default visual appearance

Given a `<Input placeholder="Enter value" />`,
When it renders,
Then it SHALL display:
- Background: `bg-surface`
- Border: `border border-border`
- Border radius: `rounded-md`
- Padding: `px-3 py-2`
- Text: `text-sm text-text`
- Placeholder: `text-muted`
- Width: `w-full`
- Transition: `transition-colors duration-150`

#### Scenario: Input focus state

Given an input that receives keyboard focus,
Then it SHALL display: `border-primary ring-2 ring-primary/20 outline-none`

#### Scenario: Input error state

Given an input with `error="Field is required"`,
Then the input border SHALL be `border-danger ring-2 ring-danger/20`, and below the input a `<p className="text-xs text-danger mt-1 flex items-center gap-1"><AlertCircle size={12} /> Field is required</p>` SHALL render.

#### Scenario: Input label and helper text

Given an input with `label="Monthly Rent"` and `helper="Amount in PKR"`,
Then above the input: `<label className="text-xs font-medium text-muted uppercase tracking-wide block mb-1">Monthly Rent</label>`
And below the input: `<p className="text-xs text-muted mt-1">Amount in PKR</p>`

#### Scenario: Disabled and read-only input states

Given an input with `disabled`,
Then: `bg-bg opacity-50 cursor-not-allowed border-border/50`
Given an input with `readOnly`,
Then: `bg-bg/50 text-muted border-border/30 cursor-default`

#### Scenario: Select dropdown appearance

Given a `<Select>` component,
When it renders,
Then it SHALL appear identical to `<Input>` with `appearance-none` applied to the native `<select>` element, and a `<ChevronDown size={16} className="text-muted" />` icon absolutely positioned at `right-3 top-1/2 -translate-y-1/2 pointer-events-none`.

#### Scenario: Textarea appearance

Given a `<Textarea>`,
Then it SHALL use identical styling to `<Input>` plus `resize-none min-h-[80px]`.

---

### Requirement: Modal Component

The app MUST have a reusable `<Modal>` component in three sizes, with a consistent header / body / footer structure.

#### Scenario: Modal overlay and container

Given a modal is open (`isOpen={true}`),
Then the overlay SHALL be `fixed inset-0 bg-bg/80 backdrop-blur-sm z-50 flex items-start justify-center`.
The modal container SHALL be `bg-surface rounded-lg shadow-modal border border-border w-full mx-4 mt-[10vh] p-0 overflow-hidden`.

#### Scenario: Modal entry animation

Given a modal transitions from closed to open,
Then it SHALL animate from `opacity-0 scale-95` to `opacity-100 scale-100` over `200ms ease-out`.
Closing SHALL animate from `opacity-100 scale-100` to `opacity-0 scale-95` over `150ms ease-in`.

#### Scenario: Modal header renders title and close button

Given any modal,
Then the header section SHALL render:
- `div.px-6.py-4.border-b.border-border.flex.items-center.justify-between`
- Left: optional Lucide icon (`size={20} text-primary`) + title (`text-lg font-semibold text-text`)
- Right: `<Button variant="icon" aria-label="Close"><X size={18} /></Button>`

#### Scenario: Modal body renders content

Given modal body content,
Then it SHALL render inside `div.px-6.py-5.overflow-y-auto` with `max-h-[60vh]` to allow scrolling for long forms.

#### Scenario: Modal footer renders action buttons

Given a modal with primary and secondary actions,
Then the footer SHALL render `div.px-6.py-4.border-t.border-border.flex.items-center.justify-end.gap-3`.
Secondary/cancel button comes first, primary confirm button comes last.

#### Scenario: Modal size variants

Given `<Modal size="sm">`, `<Modal size="md">`, or `<Modal size="lg">`,
Then the max-width SHALL be:
- `sm`: `max-w-sm` (384px) — for confirmation dialogs
- `md`: `max-w-lg` (512px) — for create/edit forms (default)
- `lg`: `max-w-2xl` (672px) — for Record Payment or complex forms

#### Scenario: Destructive confirmation modal

Given a `<ConfirmModal type="danger" title="Delete Property" message="This action cannot be undone.">`,
Then:
- The header icon SHALL be `<AlertTriangle size={24} className="text-danger" />`
- The title SHALL be `text-danger` colored
- The message SHALL use `text-sm text-muted`
- The footer SHALL have a `<Button variant="secondary">Cancel</Button>` and `<Button variant="danger">Delete</Button>`

#### Scenario: Pressing Escape or clicking backdrop closes modal

Given an open modal,
When the user presses `Escape` or clicks the backdrop overlay (not the modal container),
Then the modal SHALL close.

---

### Requirement: Toaster Notification Component

The app MUST have a toaster system that stacks notifications in the bottom-right of the viewport.

#### Scenario: Toaster container position

Given any toaster notification is active,
Then the toaster container SHALL be `fixed bottom-5 right-5 z-50 flex flex-col gap-2 items-end`.

#### Scenario: Individual toast visual structure

Given a toast notification renders,
Then it SHALL display:
- Container: `bg-surface border border-border rounded-lg shadow-toast px-4 py-3 flex items-start gap-3 min-w-[300px] max-w-[400px]`
- Left accent border based on type (see below)
- Left icon matching type
- Right side: title (`text-sm font-semibold text-text`) + message (`text-xs text-muted mt-0.5`)
- Top-right dismiss button: `<X size={14} />` Ghost icon button

#### Scenario: Toast type visual variants

Given a toast of each type,
Then the left border and icon SHALL be:
- **Success**: `border-l-4 border-primary` + `<CheckCircle2 size={18} className="text-primary mt-0.5" />`
- **Error**: `border-l-4 border-danger` + `<XCircle size={18} className="text-danger mt-0.5" />`
- **Warning**: `border-l-4 border-muted` + `<AlertTriangle size={18} className="text-muted mt-0.5" />`
- **Info**: `border-l-4 border-primary/50` + `<Info size={18} className="text-primary/70 mt-0.5" />`

#### Scenario: Toast auto-dismiss with progress bar

Given a toast appears,
Then it SHALL automatically dismiss after 4 seconds.
A 2px progress bar at the bottom of the toast container SHALL drain from `w-full` to `w-0` over 4 seconds, using the same color as the left accent border.
The toast SHALL fade out over `200ms` before being removed from the DOM.

#### Scenario: Toast entry animation

Given a new toast is added,
Then it SHALL slide in from the right (`translate-x-full → translate-x-0`) and fade in (`opacity-0 → opacity-100`) over `200ms ease-out`.

#### Scenario: Multiple toasts stack correctly

Given 3 toasts are active simultaneously,
Then they SHALL stack vertically with `gap-2` between them, newest on top (bottom of stack visually), with a maximum of 5 visible at once (oldest dismissed automatically if limit exceeded).

---

### Requirement: Tooltip Component

The app MUST display tooltips for icon-only buttons, truncated text, and elements with `data-tooltip` attributes.

#### Scenario: Tooltip trigger and appearance

Given an element with `data-tooltip="Edit property"` is hovered or focused,
Then after a `300ms` delay, a tooltip SHALL appear with:
- Container: `bg-surface border border-border text-xs text-text px-2 py-1 rounded-sm shadow-modal whitespace-nowrap`
- Arrow: 4px CSS triangle pointing toward the trigger
- Max width: `200px` (text wraps if exceeded)

#### Scenario: Tooltip animation

Given the hover delay has elapsed,
Then the tooltip SHALL fade in over `100ms`.
When the user moves away or unfocuses,
Then the tooltip SHALL fade out over `100ms` with no delay.

#### Scenario: Tooltip placement

Given a tooltip trigger near the top edge of the viewport,
Then the tooltip SHALL prefer placement `bottom`.
Otherwise it SHALL prefer placement `top`.
If neither fits, it SHALL try `right`.

---

### Requirement: Badge / Status Chip Component

The app MUST use a consistent `<Badge>` component to display status labels across tenant records, bill records, and payment records.

#### Scenario: Badge visual variants

Given a `<Badge variant="active">Active</Badge>`,
Then it SHALL render `inline-flex items-center gap-1 px-2 py-0.5 rounded-sm text-xs font-medium` with the following per-variant styling:

| Variant | Background | Text color | Use |
|---|---|---|---|
| `active` / `paid` | `bg-primary/15` | `text-primary` | Tenant active, Bill paid |
| `pending` | `bg-muted/15` | `text-muted` | Bill pending |
| `partial` | `bg-primary/10` | `text-primary/70` | Bill partially paid |
| `cancelled` | `bg-border/40` | `text-muted/60` | Bill cancelled |
| `overdue` | `bg-danger/15` | `text-danger` | Overdue bill |
| `inactive` / `exited` | `bg-bg/60` | `text-muted/50` | Inactive / exited tenant |

#### Scenario: Badge with dot indicator

Given a `<Badge dot variant="active">Active</Badge>`,
Then a `w-1.5 h-1.5 rounded-full bg-current` dot SHALL render to the left of the label text.

---

### Requirement: Upload Zone Component

The app MUST have a file upload zone component supporting PDF uploads for agreement documents.

#### Scenario: Upload zone default state

Given a `<UploadZone>` in its default resting state,
Then it SHALL display:
- Container: `border-2 border-dashed border-border rounded-lg p-6 flex flex-col items-center justify-center gap-2 bg-bg cursor-pointer transition-colors duration-150`
- Icon: `<Upload size={28} className="text-muted" />`
- Primary text: `text-sm text-muted` — "Click to upload or drag & drop"
- Caption: `text-xs text-muted` — "PDF only · Max 5 MB"

#### Scenario: Upload zone drag-over state

Given a file is dragged over the upload zone,
Then the container SHALL change to `border-primary bg-primary/5` and the icon SHALL change to `text-primary`.

#### Scenario: Upload zone uploaded state

Given a file has been successfully selected,
Then:
- The dashed border becomes solid: `border-2 border-solid border-primary`
- Background: `bg-primary/5`
- The upload icon and prompt text SHALL be replaced with a file pill: `bg-surface border border-border rounded-sm px-3 py-1 flex items-center gap-2 text-xs text-text` containing `<FileText size={14} className="text-primary" />` + filename + `<X size={12} />` remove button.

#### Scenario: Upload zone error state

Given a file exceeds 5 MB or is not a PDF,
Then:
- Border: `border-danger` dashed
- Background: `bg-danger/5`
- Below the zone: error message in `text-xs text-danger`

---

### Requirement: Data Table Component

The app MUST use a consistent table design across all list pages.

#### Scenario: Table container and header

Given a data table renders,
Then:
- Outer container: `w-full bg-surface rounded-lg border border-border overflow-hidden`
- Header row: `bg-bg border-b border-border`
- Each header cell: `px-4 py-3 text-xs font-medium text-muted uppercase tracking-wide text-left`

#### Scenario: Table body rows

Given table body rows render,
Then:
- Each row: `border-b border-border last:border-0 hover:bg-border/20 transition-colors duration-100`
- Each body cell: `px-4 py-3 text-sm text-text`
- Action cells: `flex gap-2 items-center justify-end`

#### Scenario: Empty state display

Given a table has no data to show,
Then a full-row centered section SHALL render:
- `<Inbox size={32} className="text-muted mx-auto" />`
- Below: `text-sm text-muted mt-2` with a contextual message like "No properties found."

#### Scenario: Loading state display

Given data is being fetched,
Then 5 skeleton rows SHALL render, each containing shimmer cells: `h-4 bg-border/30 animate-pulse rounded` at realistic widths.

#### Scenario: Pagination bar

Given a table is paginated,
Then the bottom bar SHALL render `flex justify-between items-center px-4 py-3 border-t border-border`:
- Left: `text-xs text-muted` — "Showing 1–10 of 43 results"
- Right: Previous / Next buttons using `<Button variant="secondary" size="sm">`

---

### Requirement: Stat Card Component (Dashboard)

The app MUST display key metrics using consistent stat cards on the Dashboard page.

#### Scenario: Stat card visual structure

Given a stat card renders,
Then it SHALL display:
- Container: `bg-surface rounded-xl border border-border p-5 flex flex-col gap-3 shadow-card`
- Icon container: `w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center`
- Icon: Lucide at `size={20} className="text-primary"`
- Value: `text-2xl font-bold text-text`
- Label: `text-xs font-medium text-muted uppercase tracking-wide`

#### Scenario: Stat card with trend indicator

Given a stat card has `trend` data,
Then below the label a `text-xs font-medium` trend indicator SHALL render:
- Positive trend: `<TrendingUp size={12} />` + value in `text-primary`
- Negative trend: `<TrendingDown size={12} />` + value in `text-danger`

#### Scenario: Stat card grid layout

Given the Dashboard page renders 4+ stat cards,
Then they SHALL be laid out in `grid grid-cols-2 lg:grid-cols-4 gap-4`.

---

### Requirement: Sidebar Navigation Component

The app MUST have a fixed sidebar for primary navigation with consistent active/hover states.

#### Scenario: Sidebar container and structure

Given the app shell renders,
Then the sidebar SHALL be `w-60 h-screen bg-surface border-r border-border flex flex-col fixed left-0 top-0 z-40`.
The logo area SHALL be `h-16 flex items-center px-5 border-b border-border` with the app name in `text-base font-bold text-text` and a logo icon in `text-primary`.

#### Scenario: Nav item states

Given sidebar navigation items render,
Then each nav item SHALL be `flex items-center gap-3 px-4 py-2.5 rounded-md mx-2 text-sm font-medium transition-colors duration-200`:

| State | Background | Text | Icon |
|---|---|---|---|
| Default | `transparent` | `text-muted` | `text-muted` |
| Hover | `bg-border/30` | `text-text` | `text-text` |
| Active (current page) | `bg-primary/15` | `text-primary` | `text-primary` |

#### Scenario: Sidebar bottom area

Given the sidebar renders,
Then the bottom section SHALL be `mt-auto border-t border-border p-4` and contain:
- User display name: `text-sm font-medium text-text`
- User email or role: `text-xs text-muted`
- Logout button: `<Button variant="ghost" size="sm"><LogOut size={16} /> Logout</Button>`

---

### Requirement: Page Header Component

Every page MUST use a consistent `<PageHeader>` component to maintain visual uniformity.

#### Scenario: Page header with action button

Given a `<PageHeader title="Properties" action={<Button variant="primary">Add Property</Button>} />`,
Then it SHALL render `flex items-center justify-between mb-6`:
- Left: `text-2xl font-bold text-text`
- Right: the provided action slot

#### Scenario: Page header without action

Given a `<PageHeader title="Dashboard" />`,
Then it SHALL render just the title with `mb-6`.

---

### Requirement: Filter Toolbar Component

List pages MUST display a filter toolbar above the data table.

#### Scenario: Filter toolbar layout

Given a list page with search and status filter,
Then the toolbar SHALL render `flex gap-3 items-center mb-4`:
- `<Input>` with `<Search size={16} />` left icon for text search — `max-w-xs`
- `<Select>` for status filter — `w-40`
- Other filters as needed (date range, property)
- Right-aligned export/action buttons

#### Scenario: Filter toolbar search input with icon

Given the search input in the filter toolbar,
Then the input wrapper SHALL be `relative flex items-center` with `<Search size={16} className="absolute left-3 text-muted" />` and `pl-9` on the input.
