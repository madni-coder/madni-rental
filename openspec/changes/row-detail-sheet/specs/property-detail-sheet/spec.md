## ADDED Requirements

### Requirement: Property row opens detail sheet
The system SHALL open a `PropertyDetailSheet` from the right when a user clicks any property table row.

#### Scenario: Row click opens sheet in view mode
- **WHEN** user clicks on a property row
- **THEN** the `PropertyDetailSheet` opens from the right showing a loading skeleton, then all property fields once the `GET /api/properties/:id` fetch completes

#### Scenario: Sheet displays all property fields
- **WHEN** the fetch succeeds
- **THEN** the sheet displays: Name, Type (badge), Floors, Area (sq ft), Planned Rent (₹), Address, Amenities (tag list), Notes

#### Scenario: Switch to edit mode
- **WHEN** user clicks the Edit button in the sheet
- **THEN** the sheet switches to edit mode — all fields become editable inline within the same sheet panel

#### Scenario: Save edit from sheet
- **WHEN** user submits the edit form inside the sheet
- **THEN** the sheet calls `PUT /api/properties/:id`, shows a success toast, refreshes the list, and returns to view mode

#### Scenario: Cancel edit returns to view mode
- **WHEN** user clicks Cancel inside the edit form
- **THEN** the sheet returns to view mode without saving

#### Scenario: Delete from sheet
- **WHEN** user clicks Delete in the sheet
- **THEN** the existing `ConfirmModal` opens; on confirm, `DELETE /api/properties/:id` is called, the sheet closes, and the list refreshes

#### Scenario: Row action buttons do not open sheet
- **WHEN** user clicks the edit or delete icon buttons in the table row directly
- **THEN** `e.stopPropagation()` prevents the sheet from opening; existing flows proceed normally

#### Scenario: Sheet fetch error shows retry
- **WHEN** `GET /api/properties/:id` fails
- **THEN** an inline error message and Retry button are shown inside the sheet
