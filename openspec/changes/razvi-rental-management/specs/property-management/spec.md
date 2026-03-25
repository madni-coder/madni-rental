## ADDED Requirements

### Requirement: Create property
The system SHALL allow a landlord to create a property record with the following fields: name (required), type (required: apartment / commercial / house), floors (optional integer), area in sq ft (optional number), planned rent (required number), address (required string), amenities (optional list of strings), and notes (optional text).

#### Scenario: Successful property creation
- **WHEN** a landlord submits a valid property form
- **THEN** the system saves the property linked to the logged-in user and displays it in the property list

#### Scenario: Missing required fields
- **WHEN** a landlord submits the form without a name, type, planned rent, or address
- **THEN** the system returns field-level validation errors without saving

### Requirement: View property list
The system SHALL display all properties belonging to the authenticated landlord in a table or card view with name, type, area, planned rent, and occupancy status.

#### Scenario: Property list loaded
- **WHEN** a landlord opens the Properties page
- **THEN** the system fetches and renders all properties belonging to that user

#### Scenario: No properties yet
- **WHEN** the landlord has no properties
- **THEN** the system displays an empty state with a prompt to add the first property

### Requirement: Edit property
The system SHALL allow a landlord to update any field of an existing property.

#### Scenario: Successful property update
- **WHEN** a landlord submits an edited property form
- **THEN** the system updates the record and shows the updated values in the list

### Requirement: Delete property
The system SHALL allow a landlord to delete a property. A property with active tenants SHALL NOT be deleted; the system SHALL display an error instead.

#### Scenario: Delete property with no active tenants
- **WHEN** a landlord deletes a property that has no active tenants
- **THEN** the system removes the property record

#### Scenario: Delete blocked by active tenants
- **WHEN** a landlord attempts to delete a property that has one or more active tenants
- **THEN** the system returns an error "Cannot delete property with active tenants" and does not delete the record
