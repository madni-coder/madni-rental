## ADDED Requirements

### Requirement: App Shell Layout

Every authenticated page MUST share a common shell layout comprising a fixed sidebar and a scrollable content area.

#### Scenario: Shell renders sidebar and main content area

Given an authenticated user is on any page,
When the page renders,
Then the layout SHALL be `flex min-h-screen bg-bg`:
- Left: fixed sidebar `w-60 h-screen` (see Sidebar spec)
- Right: `ml-60 flex-1 flex flex-col min-h-screen` — the scrollable content region

#### Scenario: Content area wraps all page content

Given any page content renders within the shell,
Then the content area SHALL have `px-6 py-6` (24px padding all sides) and `max-w-7xl` centered if content is narrow enough to warrant it.

---

### Requirement: Auth Pages Layout (Login / Register)

The Login and Register pages MUST display a centered card on the full app background.

#### Scenario: Login page layout

Given an unauthenticated user visits `/login`,
Then the page SHALL render:
```
min-h-screen bg-bg flex items-center justify-center
  └── Card: max-w-sm w-full bg-surface border border-border rounded-lg p-8 shadow-modal
        ├── Logo icon (text-primary, size 32) + App name (text-xl font-bold text-text) — centered
        ├── Subtitle: text-sm text-muted text-center mt-1 mb-6
        ├── Email input (full width)
        ├── Password input (full width, mt-4)
        ├── Primary "Login" button (full width, mt-6)
        └── Link to Register: text-xs text-muted text-center mt-4 — "Don't have an account? Register"
```

#### Scenario: Register page layout

Given an unauthenticated user visits `/register`,
Then the page SHALL render the same card structure as Login with:
- Fields: Full Name, Email, Password, Confirm Password
- Submit button: "Create Account"
- Link below: "Already have an account? Login"

---

### Requirement: Dashboard Page Layout

The Dashboard page MUST display at-a-glance KPIs and recent activity in a structured grid.

#### Scenario: Dashboard full layout composition

Given an authenticated user visits `/dashboard`,
Then the page SHALL render in this top-to-bottom order:

1. `<PageHeader title="Dashboard" />` with current date display on the right (`text-sm text-muted`)

2. **Stat card row** — `grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6`:
   - Total Properties
   - Active Tenants
   - Pending Bills (overdue badge count)
   - Revenue This Month

3. **Two-column panel row** — `grid grid-cols-12 gap-4`:
   - Left panel (`col-span-5`): **Overdue Alerts** card
     - `bg-surface rounded-lg border border-border p-5`
     - Header: `<AlertTriangle size={16} className="text-danger" />` + "Overdue Bills" in `heading-md`
     - List of overdue bill rows: tenant name, property, amount, days overdue (as `text-danger`)
     - Empty state if none
   - Right panel (`col-span-7`): **Recent Payments** card
     - Header: `<CreditCard size={16} className="text-primary" />` + "Recent Payments" in `heading-md`
     - Compact table: Tenant | Property | Amount | Date
     - Last 10 payments

4. No page-level action buttons on Dashboard.

---

### Requirement: Properties Page Layout

The Properties page MUST list all properties with an Add Property action and per-row actions.

#### Scenario: Properties page composition

Given an authenticated user visits `/properties`,
Then the page SHALL render:

1. `<PageHeader title="Properties" action={<Button variant="primary"><Plus size={16} />Add Property</Button>} />`

2. Filter toolbar: search input (by name/address) + status select (All / Active / Inactive)

3. Full-width properties table with columns:
   - Property Name
   - Address
   - Type (Flat / Shop / House)
   - Current Tenant (or "Vacant" badge)
   - Monthly Rent
   - Status (`<Badge>`)
   - Actions: `<Eye />` View, `<Pencil />` Edit, `<Trash2 />` Delete

4. Clicking "Add Property" opens a `<Modal size="md">` with:
   - Title: `<Building2 size={20} />` Add Property
   - Fields: Property Name, Address, Property Type (select), Monthly Rent, Description (textarea), Agreement Upload zone
   - Footer: Cancel + "Add Property" (primary)

5. Clicking `<Trash2 />` opens a `<ConfirmModal type="danger">` Delete Property.

---

### Requirement: Tenants Page Layout

The Tenants page MUST list all tenants with an Add Tenant action and per-row actions.

#### Scenario: Tenants page composition

Given an authenticated user visits `/tenants`,
Then the page SHALL render:

1. `<PageHeader title="Tenants" action={<Button variant="primary"><Plus size={16} />Add Tenant</Button>} />`

2. Filter toolbar: search (by name/phone) + status select (All / Active / Exited) + property select

3. Full-width tenants table with columns:
   - Tenant Name
   - Phone Number
   - Assigned Property
   - Rent Start Date
   - Monthly Rent
   - Status (`<Badge>`)
   - Actions: `<Eye />` View, `<Pencil />` Edit, `<Trash2 />` Deactivate/Exit

4. Clicking "Add Tenant" opens a `<Modal size="md">` with:
   - Title: `<Users size={20} />` Add Tenant
   - Fields (two-column grid inside modal body for compact layout):
     - Full Name, Phone Number (row 1)
     - CNIC / Aadhaar No. (encrypted), Email (row 2)
     - Assigned Property (select), Monthly Rent (row 3)
     - Rent Start Date (date), Agreement End Date (date) (row 4)
     - Agreement Upload zone (full width, row 5)
   - Footer: Cancel + "Add Tenant" (primary)

5. Tenant detail side panel OR detail modal (`size="lg"`) showing rent history, payments, bills.

6. Clicking Deactivate opens `<ConfirmModal type="danger">` — "Mark as Exited".

---

### Requirement: Bills Page Layout

The Bills page MUST display all bills with generation controls and per-bill payment recording.

#### Scenario: Bills page composition

Given an authenticated user visits `/bills`,
Then the page SHALL render:

1. `<PageHeader title="Bills" />` with TWO action buttons in the right slot:
   - `<Button variant="secondary"><Receipt size={16} />Create Bill</Button>`
   - `<Button variant="primary"><Zap size={16} />Generate Monthly Bills</Button>`

2. Filter toolbar: Month picker + Year picker + Status select (All / Pending / Paid / Overdue / Partial) + Tenant search

3. Full-width bills table with columns:
   - Tenant Name
   - Property
   - Month / Year
   - Rent Amount
   - Amount Paid
   - Balance Due
   - Status (`<Badge>`)
   - Actions: `<Eye />` View, `<CreditCard />` Record Payment, `<Pencil />` Edit

4. Clicking "Record Payment" opens `<Modal size="lg">` — Record Payment:
   - Title: `<CreditCard size={20} />` Record Payment
   - Fields: Amount Paid (input), Payment Date (date), Payment Method (select: Cash / Bank Transfer / Online), Notes (textarea)
   - Bill summary at top of modal body: tenant name, property, billing period, total due
   - Footer: Cancel + "Record Payment" (primary)

5. Clicking "Generate Monthly Bills" opens a confirmation modal `size="sm"`:
   - Title: `<Zap size={20} />` Generate Bills
   - Message: "Generate bills for all active tenants for [current month]? Existing bills will be skipped."
   - Footer: Cancel + Confirm (primary)

---

### Requirement: Expenses Page Layout

The Expenses page MUST list maintenance/operating expenses with add and filter capability.

#### Scenario: Expenses page composition

Given an authenticated user visits `/expenses`,
Then the page SHALL render:

1. `<PageHeader title="Expenses" action={<Button variant="primary"><Plus size={16} />Add Expense</Button>} />`

2. Filter toolbar: Date range (from/to) + Property select + Category select

3. Full-width expenses table with columns:
   - Description
   - Property
   - Category
   - Amount
   - Date
   - Receipt (PDF link or `<FileText />` icon, or "—")
   - Actions: `<Pencil />` Edit, `<Trash2 />` Delete

4. Clicking "Add Expense" opens `<Modal size="md">`:
   - Title: `<Wallet size={20} />` Add Expense
   - Fields: Description, Property (select), Category (select), Amount, Date, Receipt (upload zone)
   - Footer: Cancel + "Add Expense" (primary)

---

### Requirement: Reports Page Layout

The Reports page MUST display financial summaries with export capability.

#### Scenario: Reports page composition

Given an authenticated user visits `/reports`,
Then the page SHALL render:

1. `<PageHeader title="Reports" />` with export buttons in right slot:
   - `<Button variant="secondary"><FileText size={16} />Export PDF</Button>`
   - `<Button variant="secondary"><Sheet size={16} />Export Excel</Button>`

2. Filter toolbar spanning full width:
   - Date range (from/to month pickers)
   - Property select (All / specific)
   - Report type select (Rent Collection / Expense Summary / Net P&L)

3. Summary stat row (3 stat cards): Total Billed, Total Collected, Net Income

4. Full-width results table appropriate to the selected report type:
   - Rent Collection: Tenant | Property | Bills | Collected | Pending
   - Expense Summary: Category | Count | Total Amount
   - Net P&L: Month | Income | Expense | Net

5. Empty state when no date range is selected: centered `<BarChart3 size={48} className="text-muted" />` + "Select a date range to generate a report."
