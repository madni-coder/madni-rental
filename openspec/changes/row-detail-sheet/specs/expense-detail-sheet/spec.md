## ADDED Requirements

### Requirement: Expense row opens detail sheet
The system SHALL open an `ExpenseDetailSheet` from the right when a user clicks any expense table row.

#### Scenario: Row click opens sheet in view mode
- **WHEN** user clicks on an expense row
- **THEN** the `ExpenseDetailSheet` opens showing a skeleton, then all expense fields from `GET /api/expenses/:id`

#### Scenario: Sheet displays all expense fields
- **WHEN** the fetch succeeds
- **THEN** the sheet displays: Property Name, Category, Amount (₹), Date (formatted), Notes

#### Scenario: Switch to edit mode
- **WHEN** user clicks Edit in the sheet
- **THEN** the sheet switches to edit mode with all fields editable inline

#### Scenario: Save edit from sheet
- **WHEN** user submits the edit form inside the sheet
- **THEN** `PUT /api/expenses/:id` is called, success toast shown, list refreshed, sheet returns to view mode

#### Scenario: Cancel edit returns to view mode
- **WHEN** user clicks Cancel inside the edit form
- **THEN** the sheet returns to view mode without saving

#### Scenario: Delete from sheet
- **WHEN** user clicks Delete in the sheet
- **THEN** the `ConfirmModal` opens; on confirm, `DELETE /api/expenses/:id` is called, the sheet closes, and the list refreshes

#### Scenario: Sheet fetch error shows retry
- **WHEN** `GET /api/expenses/:id` fails
- **THEN** an inline error message and Retry button are shown inside the sheet
