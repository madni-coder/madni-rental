## ADDED Requirements

### Requirement: Property row opens detail modal
The system SHALL open a `PropertyDetailModal` when a user clicks anywhere on a property table row.

#### Scenario: Row click opens modal with loading state
- **WHEN** user clicks on any property row
- **THEN** the `PropertyDetailModal` opens immediately showing a loading skeleton

#### Scenario: Modal displays full property details after fetch
- **WHEN** `GET /api/properties/:id` returns successfully
- **THEN** the modal displays: Name, Type (badge), Floors, Area (sq ft), Planned Rent (₹ formatted), Address, Amenities (tag list), Notes

#### Scenario: Edit action inside detail modal
- **WHEN** user clicks the Edit button inside the detail modal
- **THEN** the detail modal closes and the edit form modal opens pre-filled with the property data

#### Scenario: Delete action inside detail modal
- **WHEN** user clicks the Delete button inside the detail modal
- **THEN** the delete confirmation dialog opens (existing flow)

#### Scenario: Closing the detail modal
- **WHEN** user clicks the close button or presses Escape
- **THEN** the modal closes with no data mutation

#### Scenario: Row action buttons do not open detail modal
- **WHEN** user clicks the edit or delete icon buttons in the table row
- **THEN** existing edit/delete flows trigger and the detail modal does NOT open
