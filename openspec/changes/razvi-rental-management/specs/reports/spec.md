## ADDED Requirements

### Requirement: Payment report with filters
The system SHALL provide a reports page where a landlord can filter payment records by tenant (optional), property (optional), and date range (from date / to date, both optional). The filtered results SHALL be displayed in a table showing: Tenant, Property, Bill Period, Amount Paid, Payment Mode, Collected By, and Payment Date.

#### Scenario: Payment report filtered by tenant
- **WHEN** a landlord selects a specific tenant and date range and applies the filter
- **THEN** the system returns all payment records matching those criteria

#### Scenario: Payment report with no filters
- **WHEN** a landlord views the reports page without applying any filters
- **THEN** the system returns all payment records sorted by payment date descending

#### Scenario: No records match filters
- **WHEN** the applied filters return no matching records
- **THEN** the system displays "No records found for the selected filters"

### Requirement: Pending dues report
The system SHALL show a summary of all pending and partial bills grouped by property, showing total outstanding amount.

#### Scenario: Pending dues summary loaded
- **WHEN** a landlord opens the pending dues report
- **THEN** the system fetches all bills with status `pending` or `partial` and displays them grouped by property with totals

### Requirement: Export report as PDF
The system SHALL allow a landlord to export the currently filtered report as a PDF file.

#### Scenario: Successful PDF export
- **WHEN** a landlord clicks "Export PDF" on the reports page
- **THEN** the system generates a PDF containing the filtered report table and triggers a browser download

### Requirement: Export report as Excel
The system SHALL allow a landlord to export the currently filtered report as an Excel (.xlsx) file.

#### Scenario: Successful Excel export
- **WHEN** a landlord clicks "Export Excel" on the reports page
- **THEN** the system generates an .xlsx file containing the filtered report data and triggers a browser download

### Requirement: Monthly income summary
The system SHALL display a monthly income chart/table showing total collected amount per month for the last 12 months.

#### Scenario: Monthly income chart loaded
- **WHEN** a landlord opens the reports page
- **THEN** the system fetches total payments grouped by month for the last 12 months and renders a summary table or chart
