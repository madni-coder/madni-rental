## ADDED Requirements

### Requirement: Bill row opens detail sheet
The system SHALL open a `BillDetailSheet` from the right when a user clicks any bill table row.

#### Scenario: Row click opens sheet
- **WHEN** user clicks on a bill row
- **THEN** the `BillDetailSheet` opens showing a skeleton, then all bill fields from `GET /api/bills/:id`

#### Scenario: Sheet displays all bill fields
- **WHEN** the fetch succeeds
- **THEN** the sheet displays: Tenant Name, Property Name, Month & Year, Total Amount (₹), Due Amount (₹), Due Date (formatted), Status badge

#### Scenario: Record Payment from sheet
- **WHEN** user clicks Record Payment (only shown for pending/partial bills)
- **THEN** the `RecordPaymentModal` opens pre-filled with the correct bill context; on success, the sheet refreshes its data

#### Scenario: Cancel bill from sheet
- **WHEN** user clicks Cancel Bill (only shown for pending/partial bills)
- **THEN** the `ConfirmModal` opens; on confirm, `PATCH /api/bills/:id/cancel` is called, the sheet data refreshes

#### Scenario: Sheet fetch error shows retry
- **WHEN** `GET /api/bills/:id` fails
- **THEN** an inline error message and Retry button are shown inside the sheet
