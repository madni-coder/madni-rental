## ADDED Requirements

### Requirement: Generate monthly bills in bulk
The system SHALL allow a landlord to generate rent bills for all active tenants for a selected month and year. Clicking "Generate Bills" SHALL open a confirmation popup pre-filled with the current month and year. On confirmation, the system SHALL create one bill per active tenant for that period if a bill does not already exist for that tenant + month + year combination.

#### Scenario: Successful bulk bill generation
- **WHEN** a landlord selects a month and year and confirms generation
- **THEN** the system creates pending bills for all active tenants who do not already have a bill for that period

#### Scenario: Duplicate bills not created (TC2)
- **WHEN** a bill already exists for a tenant in the selected month/year
- **THEN** the system skips that tenant and does not create a duplicate

#### Scenario: Concurrent generation does not create duplicates (TC10)
- **WHEN** two generation requests for the same month/year are processed concurrently
- **THEN** the system uses a unique index on `(tenantId, month, year)` to ensure at most one bill is created per tenant per period; the second request receives a skipped count rather than an error

#### Scenario: Inactive or exited tenants excluded (TC3)
- **WHEN** bulk bill generation runs
- **THEN** tenants with `isActive: false` are not included and receive no bill

#### Scenario: Billing stops after tenant exit date (TC8)
- **WHEN** the selected bill period falls after a tenant's recorded exit date
- **THEN** the system does not generate a bill for that tenant

#### Scenario: Agreement expiry respected in billing cycle (TC9)
- **WHEN** the selected bill period falls after a tenant's lease `endDate`
- **THEN** the system does not generate a bill for that tenant and flags the lease as expired

#### Scenario: All valid active tenants included (TC14)
- **WHEN** bulk generation runs for a period within all active tenants' lease dates
- **THEN** every active tenant with a valid lease receives exactly one bill; no tenant is silently skipped

#### Scenario: Bill dates are timezone-safe (TC13)
- **WHEN** bills are generated
- **THEN** the system stores and calculates all due dates using UTC midnight to prevent off-by-one date errors across timezones

#### Scenario: Generation report shown
- **WHEN** bulk generation completes
- **THEN** the system displays a summary: N bills created, M bills skipped (already exist or excluded)

### Requirement: Create individual bill
The system SHALL allow a landlord to create a single bill manually using a "Create Bill" form with tenant (dropdown), property (auto-filled from tenant), month, year, total amount (pre-filled with tenant's monthly rent), due date, and status.

#### Scenario: Successful individual bill creation
- **WHEN** a landlord submits a valid create-bill form
- **THEN** the system saves the bill with status `pending` and displays it in the bills table

### Requirement: View and filter bills
The system SHALL display bills in a table with columns: Month, Tenant, Property, Total Amount, Due Amount, Due Date, Status, Action (Cancel), and Payment (Record Payment). Bills SHALL be filterable by date range and status.

#### Scenario: Bills table loaded with filters
- **WHEN** a landlord opens the Bills page and applies date/status filters
- **THEN** the system fetches and renders matching bills sorted by due date descending

#### Scenario: No bills found for filters
- **WHEN** no bills match the applied filters
- **THEN** the system displays "No bills found for the selected filters"

### Requirement: Cancel bill
The system SHALL allow a landlord to cancel a `pending` or `partial` bill. A `paid` bill SHALL NOT be cancellable.

#### Scenario: Successful bill cancellation
- **WHEN** a landlord clicks Cancel on a pending or partial bill
- **THEN** the system sets the bill status to `cancelled`

#### Scenario: Paid bill cannot be cancelled
- **WHEN** a landlord attempts to cancel a paid bill
- **THEN** the system returns an error "Paid bills cannot be cancelled"

### Requirement: Bill status state machine
The system SHALL enforce the following bill status transitions:
- `pending` → `partial` (partial payment recorded)
- `pending` or `partial` → `paid` (full payment recorded)
- `pending` or `partial` → `cancelled` (landlord action)
- No other transitions SHALL be permitted.

#### Scenario: Invalid status transition rejected
- **WHEN** an API request attempts an illegal status transition
- **THEN** the system returns HTTP 422 with an error describing the invalid transition
