## ADDED Requirements

### Requirement: Tenant row opens detail modal
The system SHALL open a `TenantDetailModal` when a user clicks anywhere on a tenant table row.

#### Scenario: Row click opens modal with loading state
- **WHEN** user clicks on any tenant row
- **THEN** the `TenantDetailModal` opens immediately showing a loading skeleton

#### Scenario: Modal displays full tenant details after fetch
- **WHEN** `GET /api/tenants/:id` returns successfully
- **THEN** the modal displays: Full Name, Phone, Email, Emergency Contact, Property (linked name), Monthly Rent (₹), Security Deposit (₹), Payment Due Date, Start Date, End Date, Rent Agreement (download link if present), Notes, Active status badge

#### Scenario: Sensitive fields are masked
- **WHEN** the detail modal renders Aadhaar and PAN fields
- **THEN** both fields SHALL be displayed as masked placeholders (e.g. `••••••••`) — raw values are never shown on the client

#### Scenario: Edit action inside detail modal
- **WHEN** user clicks the Edit button inside the detail modal
- **THEN** the detail modal closes and the tenant edit form opens pre-filled

#### Scenario: Deactivate action inside detail modal
- **WHEN** user clicks the Deactivate button inside the detail modal (only visible for active tenants)
- **THEN** the deactivation confirmation modal opens (existing flow)

#### Scenario: Closing the detail modal
- **WHEN** user clicks the close button or presses Escape
- **THEN** the modal closes with no data mutation

#### Scenario: Row action buttons do not open detail modal
- **WHEN** user clicks the edit or deactivate icon buttons in the table row
- **THEN** existing flows trigger and the detail modal does NOT open
