## ADDED Requirements

### Requirement: Tenant row opens detail sheet
The system SHALL open a `TenantDetailSheet` from the right when a user clicks any tenant table row.

#### Scenario: Row click opens sheet in view mode
- **WHEN** user clicks on a tenant row
- **THEN** the `TenantDetailSheet` opens showing a skeleton, then all tenant fields from `GET /api/tenants/:id`

#### Scenario: Sheet displays all tenant fields
- **WHEN** the fetch succeeds
- **THEN** the sheet displays: Full Name, Phone, Email, Emergency Contact, Property Name, Monthly Rent (₹), Security Deposit (₹), Payment Due Date, Start Date, End Date, Rent Agreement (download link if present), Active status badge, Notes

#### Scenario: Sensitive fields are masked in view mode
- **WHEN** the sheet renders tenant data
- **THEN** Aadhaar and PAN fields SHALL be displayed as masked placeholders (`••••••••`) — raw values are never shown

#### Scenario: Switch to edit mode
- **WHEN** user clicks Edit in the sheet
- **THEN** the sheet switches to edit mode with all editable fields (excluding Aadhaar/PAN) available inline

#### Scenario: Save edit from sheet
- **WHEN** user submits the edit form inside the sheet
- **THEN** `PUT /api/tenants/:id` is called, success toast shown, list refreshed, sheet returns to view mode

#### Scenario: Cancel edit returns to view mode
- **WHEN** user clicks Cancel inside the edit form
- **THEN** the sheet returns to view mode without saving

#### Scenario: Deactivate from sheet
- **WHEN** user clicks Deactivate (only shown when `isActive === true`)
- **THEN** the `ConfirmModal` opens; on confirm, `PATCH /api/tenants/:id/deactivate` is called, the sheet closes, and the list refreshes

#### Scenario: Sheet fetch error shows retry
- **WHEN** `GET /api/tenants/:id` fails
- **THEN** an inline error message and Retry button are shown inside the sheet
