## ADDED Requirements

### Requirement: Icon Library Selection

The application MUST use Lucide React as the sole icon library. No other icon library (react-icons, heroicons, Font Awesome, etc.) SHALL be installed or used.

#### Scenario: Only Lucide React icons are used

Given any UI element requires an icon,
Then the icon component SHALL be imported ONLY from `lucide-react`.
No SVG inline icons, no icon fonts, and no icons from any other npm package are permitted.

#### Scenario: Lucide React is installed as a dependency

Given the `client/package.json`,
Then `lucide-react` SHALL be present in the `dependencies` (not `devDependencies`) since icons render at runtime.

---

### Requirement: Icon Size Scale

All icons MUST use one of 4 defined sizes. No arbitrary `size` prop values are permitted.

#### Scenario: Icon size conformance

Given any Lucide icon in the codebase,
When its `size` prop is inspected,
Then it SHALL be one of:

| Size | Value | Context |
|---|---|---|
| XS | `size={14}` | Inside badges, small dismiss buttons (`<X size={14} />`), inline text icons |
| SM | `size={16}` | Table action icons, sidebar nav icons, filter toolbar icons, button icons |
| MD | `size={18}` | Button icons with labels, toaster type icons, input right/left icons |
| LG | `size={20}` | Modal title icons, stat card icons, page header icons |
| XL | `size={24}` | Confirmation dialog warning icons |
| 2XL | `size={28}` | Upload zone upload icon |
| 3XL | `size={32}` | Empty state icons |
| 4XL | `size={48}` | Full-page empty state (e.g., Reports no-data state) |

Note: sizes 2XL/3XL/4XL are contextual exceptions; the primary working sizes are XS–LG.

---

### Requirement: Icon Stroke Width

All Lucide icons MUST use `strokeWidth={1.75}`. The Lucide default of `2` is slightly heavy for the Obsidian Dark theme's refined aesthetic.

#### Scenario: Stroke width is consistent across all icons

Given any Lucide icon in the codebase,
When its `strokeWidth` prop is inspected,
Then it SHALL be `1.75`.

A global default SHALL be set via a wrapper component or Tailwind CSS (`[&_svg]:stroke-[1.75]` on the icon container) rather than adding `strokeWidth` to every individual icon.

---

### Requirement: Icon Color Binding Rules

Icon colors MUST follow a defined binding scheme based on context. No arbitrary `className` color values are permitted on icons.

#### Scenario: Icons inside primary buttons

Given a Lucide icon inside a `variant="primary"` button,
Then the icon SHALL have `className="text-white"` (it inherits from the button's text color by default via `currentColor`).

#### Scenario: Icons inside ghost / secondary buttons

Given a Lucide icon inside a `variant="ghost"` or `variant="secondary"` button,
Then the icon SHALL inherit `currentColor` from the parent — explicitly `text-muted` at rest, `text-text` on hover.

#### Scenario: Icons in sidebar navigation items

Given a Lucide icon inside a sidebar nav item,
Then the icon SHALL inherit `currentColor` from the nav item text:
- Default: `text-muted`
- Hover: `text-text`
- Active: `text-primary`
No explicit `className` is needed on the icon if the nav item uses `currentColor` inheritance.

#### Scenario: Icons in toaster notifications

Given a type icon in a toast (`<CheckCircle2 />`, `<XCircle />`, etc.),
Then the icon SHALL have an explicit `className`:
- Success: `text-primary`
- Error: `text-danger`
- Warning: `text-muted`
- Info: `text-primary/70`

#### Scenario: Icons in input fields

Given a left or right icon in an input (e.g., `<Search size={16} />`, `<ChevronDown size={16} />`),
Then the icon SHALL have `className="text-muted"` and SHALL be positioned absolutely within a relative input wrapper, `pointer-events-none`.

#### Scenario: Icons in stat cards

Given the icon inside a stat card icon container,
Then it SHALL always be `className="text-primary"`.

#### Scenario: Danger / destructive icons

Given a `<Trash2 />` or `<AlertTriangle />` icon in a destructive context (delete button, confirmation dialog),
Then the icon SHALL be `className="text-danger"`.

---

### Requirement: Action-to-Icon Mapping

Every user action in the app MUST use its designated Lucide icon. Consistency is mandatory — the same action always uses the same icon everywhere.

#### Scenario: CRUD action icons are consistent

Given any button or icon button representing a CRUD or navigation action,
Then it SHALL use the following icon mapping without exception:

| Action | Icon | Notes |
|---|---|---|
| Add / Create new | `<Plus />` | Used in all "Add X" buttons |
| Edit / Update | `<Pencil />` | Table row edit action |
| Delete / Remove | `<Trash2 />` | Table row delete, not `<Trash />` |
| View detail | `<Eye />` | Table row view action |
| Save / Confirm action | `<Check />` | Not used in buttons (use button label text) |
| Cancel / Close | `<X />` | Modal close button, toast dismiss, file pill remove |
| Search | `<Search />` | Filter toolbar search input left icon |
| Filter / Options | `<SlidersHorizontal />` | Advanced filter button |
| Upload file | `<Upload />` | Upload zone icon, upload button |
| Download / Export | `<Download />` | Generic download actions |
| Export PDF | `<FileText />` | PDF-specific export |
| Export Excel | `<Sheet />` | Excel-specific export |
| Send reminder | `<Bell />` | Reminder / notification send action |
| Record payment | `<CreditCard />` | Bill table payment action, modal title |
| Generate bills | `<Zap />` | Generate monthly bills trigger |
| Logout | `<LogOut />` | Sidebar bottom logout |

#### Scenario: Module / page icons are consistent across nav and page headers

Given any icon representing a module (page, nav link, modal title, stat card),
Then it SHALL use the following module-to-icon mapping:

| Module | Icon |
|---|---|
| Dashboard | `<LayoutDashboard />` |
| Properties | `<Building2 />` |
| Tenants | `<Users />` |
| Bills | `<Receipt />` |
| Expenses | `<Wallet />` |
| Reports | `<BarChart3 />` |
| Authentication / User | `<UserCircle />` |
| Overdue / Warning | `<AlertTriangle />` |
| Success / Paid | `<CheckCircle2 />` |
| Error / Failed | `<XCircle />` |
| Info | `<Info />` |
| Empty state (list pages) | `<Inbox />` |
| Empty state (reports) | `<BarChart3 />` |
| File / PDF document | `<FileText />` |
| Loading spinner | `<Loader2 />` (animated with `animate-spin`) |
| Positive trend | `<TrendingUp />` |
| Negative trend | `<TrendingDown />` |
| Calendar / Date | `<Calendar />` |
| Dropdown chevron | `<ChevronDown />` |
| Previous page | `<ChevronLeft />` |
| Next page | `<ChevronRight />` |

---

### Requirement: Icon Accessibility

All icon-only interactive elements MUST be accessible to screen readers.

#### Scenario: Icon-only buttons have accessible labels

Given a button that renders only an icon with no visible text (e.g., `<Pencil size={16} />`),
Then the button element SHALL include `aria-label="Edit"` (or the equivalent descriptive action label).
The icon itself SHALL have `aria-hidden="true"` to prevent duplicate screen reader announcements.

#### Scenario: Decorative icons are hidden from screen readers

Given an icon that is purely decorative (e.g., the icon inside a stat card, a left icon in a nav item alongside visible text),
Then the icon element SHALL include `aria-hidden="true"`.
No `role` or `title` attributes are needed for decorative icons.
