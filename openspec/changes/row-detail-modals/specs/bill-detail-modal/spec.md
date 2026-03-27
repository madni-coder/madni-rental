## ADDED Requirements

### Requirement: Bill row opens detail modal
The system SHALL open a `BillDetailModal` when a user clicks anywhere on a bill table row.

#### Scenario: Row click opens modal with loading state
- **WHEN** user clicks on any bill row
- **THEN** the `BillDetailModal` opens immediately showing a loading skeleton

#### Scenario: Modal displays full bill details after fetch
- **WHEN** `GET /api/bills/:id` returns successfully
- **THEN** the modal displays: Tenant Name, Property Name, Month & Year, Total Amount (₹), Due Amount (₹), Due Date (formatted), Status badge (Pending / Partial / Paid / Cancelled)

#### Scenario: Cancel action inside detail modal
- **WHEN** user clicks the Cancel Bill button inside the detail modal (only visible for pending or partial bills)
- **THEN** the cancel confirmation dialog opens (existing flow)

#### Scenario: Record Payment action inside detail modal
- **WHEN** user clicks the Record Payment button inside the detail modal (only visible for pending or partial bills)
- **THEN** the `RecordPaymentModal` opens pre-filled with the correct bill context

#### Scenario: Closing the detail modal
- **WHEN** user clicks the close button or presses Escape
- **THEN** the modal closes with no data mutation

#### Scenario: Row action buttons do not open detail modal
- **WHEN** user clicks the cancel or record-payment icon buttons in the table row
- **THEN** existing flows trigger and the detail modal does NOT open
