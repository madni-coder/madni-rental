## ADDED Requirements

### Requirement: Expense row opens detail modal
The system SHALL open an `ExpenseDetailModal` when a user clicks anywhere on an expense table row.

#### Scenario: Row click opens modal with loading state
- **WHEN** user clicks on any expense row
- **THEN** the `ExpenseDetailModal` opens immediately showing a loading skeleton

#### Scenario: Modal displays full expense details after fetch
- **WHEN** `GET /api/expenses/:id` returns successfully
- **THEN** the modal displays: Property Name, Category, Amount (₹ formatted), Date (formatted), Notes

#### Scenario: Edit action inside detail modal
- **WHEN** user clicks the Edit button inside the detail modal
- **THEN** the detail modal closes and the expense edit form opens pre-filled

#### Scenario: Delete action inside detail modal
- **WHEN** user clicks the Delete button inside the detail modal
- **THEN** the delete confirmation dialog opens (existing flow)

#### Scenario: Closing the detail modal
- **WHEN** user clicks the close button or presses Escape
- **THEN** the modal closes with no data mutation

#### Scenario: Row action buttons do not open detail modal
- **WHEN** user clicks the edit or delete icon buttons in the table row
- **THEN** existing flows trigger and the detail modal does NOT open
