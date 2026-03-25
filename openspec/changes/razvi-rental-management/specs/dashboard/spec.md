## ADDED Requirements

### Requirement: Overdue rent alerts
The system SHALL display a prominent alert section on the dashboard listing all bills with status `pending` or `partial` whose due date has passed.

#### Scenario: Overdue bills present
- **WHEN** one or more bills have a due date in the past and status is not `paid` or `cancelled`
- **THEN** the dashboard displays an alert panel listing each overdue bill with tenant name, property, amount due, and days overdue

#### Scenario: No overdue bills
- **WHEN** no bills are overdue
- **THEN** the alert section shows a "No overdue rents" message

### Requirement: Property occupancy stat
The system SHALL display the count of occupied properties and total properties (e.g., "3 / 5 occupied").

#### Scenario: Occupancy card displayed
- **WHEN** the dashboard loads
- **THEN** the system shows occupied property count (properties with at least one active tenant) and total property count

### Requirement: Tenant count stat
The system SHALL display the total number of active tenants. Tenants with `isActive: false` SHALL NOT be counted.

#### Scenario: Tenant count card displayed
- **WHEN** the dashboard loads
- **THEN** the system shows the count of tenants where `isActive` is true

#### Scenario: Exited tenant excluded from active count (TC7)
- **WHEN** a tenant is marked inactive
- **THEN** the dashboard active-tenant count and occupancy stats decrease immediately on next load and do not include the exited tenant

### Requirement: Monthly collection summary
The system SHALL display the total payment amount collected in the current calendar month.

#### Scenario: Monthly collection card displayed
- **WHEN** the dashboard loads
- **THEN** the system shows the sum of all payment amounts where `paymentDate` falls in the current month

### Requirement: Recent payments feed
The system SHALL display the 10 most recent payment records with tenant name, property name, amount, payment mode, and date.

#### Scenario: Recent payments table displayed
- **WHEN** the dashboard loads
- **THEN** the system fetches and renders the 10 most recent payments sorted by `paymentDate` descending

#### Scenario: No payments recorded yet
- **WHEN** no payments have been recorded
- **THEN** the system displays "No payments recorded yet"
