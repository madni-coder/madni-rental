## Context

The application has four main data modules — Properties, Tenants, Bills, and Expenses — each rendered as a table. Currently rows are static; the only actions are edit and delete via icon buttons in the last column. Users frequently need to review all fields of a record (e.g. full address, notes, amenities, emergency contact) without triggering an edit form.

The server already exposes `GET /api/:resource/:id` endpoints that return the full document. The client has a reusable `Modal` component and an Axios instance configured with auth cookies.

## Goals / Non-Goals

**Goals:**
- Add a clickable row interaction across Properties, Tenants, Bills, and Expenses tables
- Open a read-only detail modal per module, fetching fresh data from `GET /api/:resource/:id`
- Show a loading skeleton while the fetch is in-flight
- Surface Edit and Delete CTAs inside the detail modal, reusing existing handlers
- Consistent UX pattern — same look and behaviour across all four modules

**Non-Goals:**
- Inline editing inside the detail modal
- New server endpoints (all required GET/:id routes already exist)
- Paginated sub-lists within the detail modal (e.g. payment history on a bill — that is a separate feature)
- Mobile-specific layout changes

## Decisions

### Single generic `DetailModal` shell vs four separate components
**Decision**: Four separate components (`PropertyDetailModal`, `TenantDetailModal`, `BillDetailModal`, `ExpenseDetailModal`).

**Rationale**: Each module has substantially different fields, field grouping, formatting logic (currency, dates, badges), and action sets. A generic component would require heavy prop-drilling or a field-schema config — added complexity for no reuse benefit given only four isolated consumers.

**Alternative considered**: A shared `DetailModal` wrapper with slot-based content. Rejected because each modal body has unique layout sections (e.g. Tenant has a "Sensitive Info" group, Bill has a payment status timeline) that don't fit a uniform grid.

### Fetch-on-open vs pass full row data as props
**Decision**: Fetch from `GET /api/:resource/:id` each time the modal opens.

**Rationale**: Table rows may omit projected fields (e.g. `.select('-aadhaar -pan')` on Tenant list). A fresh fetch guarantees complete, decrypted data. Also prevents stale data if the record was recently edited in another tab.

**Alternative considered**: Pass the full row object as a prop (no extra request). Rejected because list projections intentionally omit sensitive and verbose fields; re-fetching is the only way to get complete data.

### Row click target area
**Decision**: The entire `<tr>` element is made clickable via `onClick` handler; action buttons (edit/delete) call `e.stopPropagation()` to prevent modal opening when an action icon is clicked.

**Rationale**: Standard table UX — expanding the click target to the full row improves discoverability without hiding the action icons.

## Risks / Trade-offs

- **Extra network request per modal open** → Mitigation: requests are fast (indexed by `_id`); show a skeleton while loading so the user sees immediate feedback.
- **Row click conflicts with action buttons** → Mitigation: `e.stopPropagation()` on edit/delete `<button>` elements.
- **Tenant aadhaar/PAN display** → Mitigation: Show masked placeholder (e.g. `••••••••`) in the detail modal — the client never stores or displays raw sensitive values.
