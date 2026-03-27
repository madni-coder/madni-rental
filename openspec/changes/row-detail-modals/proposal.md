## Why

The application currently displays data in tables but clicking a row does nothing — users have no way to view the full record details without opening an edit form. A dedicated read-only detail modal per module gives users a clean, at-a-glance summary of any record without accidental edits.

## What Changes

- Clicking any data row in Properties, Tenants, Bills, Expenses, and (future) Reports opens a read-only detail modal
- Each modal fetches latest data from the corresponding `GET /api/<resource>/:id` endpoint on open
- Modals display all fields for that record, including fields not shown in the table (e.g. amenities, notes, encrypted-field placeholders)
- A loading skeleton is shown while the detail fetch is in progress
- Edit and Delete actions remain available via buttons inside the detail modal (delegating to existing flows)
- Row cursor changes to `pointer` to communicate clickability

## Capabilities

### New Capabilities

- `property-detail-modal`: Full-detail read-only modal for a single property record, opened by clicking a property row
- `tenant-detail-modal`: Full-detail read-only modal for a single tenant record, opened by clicking a tenant row
- `bill-detail-modal`: Full-detail read-only modal for a single bill record, opened by clicking a bill row
- `expense-detail-modal`: Full-detail read-only modal for a single expense record, opened by clicking an expense row

### Modified Capabilities

## Impact

- `client/app/(dashboard)/properties/page.jsx` — add row `onClick` handler, wire `PropertyDetailModal`
- `client/app/(dashboard)/tenants/page.jsx` — add row `onClick` handler, wire `TenantDetailModal`
- `client/app/(dashboard)/bills/page.jsx` — add row `onClick` handler, wire `BillDetailModal`
- `client/app/(dashboard)/expenses/page.jsx` — add row `onClick` handler, wire `ExpenseDetailModal`
- New components: `PropertyDetailModal`, `TenantDetailModal`, `BillDetailModal`, `ExpenseDetailModal`
- Server routes already expose `GET /api/:resource/:id` — no new API endpoints required
