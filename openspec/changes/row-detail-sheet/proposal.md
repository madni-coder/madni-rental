## Why

The previous modal-based detail approach requires two separate UI surfaces (a read modal + an edit modal), creating unnecessary context-switching. A right-side sheet surface keeps the user in the list view while letting them read all details and make edits without ever leaving the page.

## What Changes

- **BREAKING**: Remove `PropertyDetailModal` (modal-based) in favour of a `PropertyDetailSheet` that slides in from the right
- The sheet is the single surface for both **reading** all property fields and **editing** them inline
- Same pattern applied to Tenants, Bills, and Expenses — each module gets a dedicated detail/edit sheet
- Clicking a table row opens the sheet; the sheet contains a read view that switches to an edit form in-place without opening any secondary modal
- Delete action triggers a confirmation dialog (existing `ConfirmModal`) from within the sheet
- A `sheet.jsx` shadcn/ui primitive is added to `client/components/ui/`
- The `DataTable` component's `onRowClick` prop (already added) remains unchanged
- Supersedes the `row-detail-modals` change entirely

## Capabilities

### New Capabilities

- `sheet-primitive`: Shadcn/Radix Sheet primitive component (`components/ui/sheet.jsx`) used as the base for all detail sheets
- `property-detail-sheet`: Right-side sheet for Properties — view all fields, switch to inline edit form, delete with confirmation
- `tenant-detail-sheet`: Right-side sheet for Tenants — view all fields (masked Aadhaar/PAN), switch to inline edit, deactivate
- `bill-detail-sheet`: Right-side sheet for Bills — view all fields, cancel or record payment inline
- `expense-detail-sheet`: Right-side sheet for Expenses — view all fields, switch to inline edit form, delete

### Modified Capabilities

## Impact

- **Add**: `client/components/ui/sheet.jsx` — shadcn Sheet primitive
- **Replace**: `client/components/properties/PropertyDetailModal.jsx` → `client/components/properties/PropertyDetailSheet.jsx`
- **Add**: `client/components/tenants/TenantDetailSheet.jsx`
- **Add**: `client/components/bills/BillDetailSheet.jsx`
- **Add**: `client/components/expenses/ExpenseDetailSheet.jsx`
- **Update**: `client/app/(dashboard)/properties/page.jsx` — swap `PropertyDetailModal` for `PropertyDetailSheet`
- **Update**: `client/app/(dashboard)/tenants/page.jsx`
- **Update**: `client/app/(dashboard)/bills/page.jsx`
- **Update**: `client/app/(dashboard)/expenses/page.jsx`
- **Remove**: `client/components/properties/PropertyDetailModal.jsx`
- No server-side changes required
