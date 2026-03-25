## ADDED Requirements

### Requirement: Create tenant
The system SHALL allow a landlord to onboard a tenant with the following fields: full name (required), phone (required), email (optional), emergency contact (optional), Aadhaar number (required, stored encrypted), PAN number (optional, stored encrypted), property (required — dropdown of landlord's properties), monthly rent (required number), security deposit (required number), payment due date (required — day of month 1–31), start date (required), end date (optional), rent agreement PDF upload (optional, max 5 MB), and notes (optional). Multiple tenants SHALL be assignable to the same property. A tenant SHALL NOT be active in more than one property at the same time.

#### Scenario: Successful tenant creation
- **WHEN** a landlord submits a valid tenant form including a property selection
- **THEN** the system creates the tenant record linked to the property and landlord, uploads the PDF if provided, and shows the new tenant in the list

#### Scenario: Duplicate Aadhaar rejected
- **WHEN** a landlord submits a tenant with an Aadhaar number already registered under their account
- **THEN** the system returns "Aadhaar number already exists" and does not save

#### Scenario: Rent agreement upload size exceeded
- **WHEN** a landlord uploads a file larger than 5 MB
- **THEN** the system returns a validation error before uploading to Cloudinary

#### Scenario: Tenant cannot be active in two properties simultaneously (TC17)
- **WHEN** a landlord attempts to create or assign a tenant who is already active (`isActive: true`) in another property
- **THEN** the system returns an error "Tenant is already active in another property" and does not save

### Requirement: View tenant list
The system SHALL display all active tenants for the authenticated landlord with columns: name, phone, property, monthly rent, payment due date, and status.

#### Scenario: Tenant list loaded
- **WHEN** a landlord opens the Tenants page
- **THEN** the system fetches and renders all tenants where `userId` matches the logged-in user

#### Scenario: No tenants yet
- **WHEN** no tenants have been added
- **THEN** the system displays an empty state with a prompt to add the first tenant

### Requirement: Edit tenant
The system SHALL allow a landlord to update any field of an existing tenant record including re-uploading the rent agreement. The `startDate` field SHALL be locked for editing once any bill has been generated for that tenant. Updating a tenant's `monthlyRent` SHALL NOT retroactively alter any previously generated bills.

#### Scenario: Successful tenant update
- **WHEN** a landlord submits an edited tenant form
- **THEN** the system updates the record and reflects changes in the tenant list

#### Scenario: Start date edit blocked after bills generated (TC15)
- **WHEN** a landlord attempts to edit the `startDate` of a tenant who already has one or more bills
- **THEN** the system returns an error "Start date cannot be changed after bills have been generated" and does not update the field

#### Scenario: Rent update does not affect historical bills (TC6)
- **WHEN** a landlord updates a tenant's `monthlyRent`
- **THEN** all existing bills retain their original `totalAmount` unchanged; only future bill generation uses the new rent amount

### Requirement: Deactivate tenant
The system SHALL allow a landlord to mark a tenant as inactive (end of lease) via a "Tenant Exit" action. Inactive tenants SHALL remain in the system for historical reporting with all billing history, payment records, and dues intact. Hard-delete SHALL NOT be supported.

#### Scenario: Tenant deactivated
- **WHEN** a landlord marks a tenant as inactive
- **THEN** the system sets `isActive: false` and the tenant no longer appears in active-tenant counts or bill generation

#### Scenario: Bills cancelled on deactivation
- **WHEN** a tenant is deactivated
- **THEN** all pending bills for that tenant are automatically cancelled

#### Scenario: Early exit before agreement end date (TC1)
- **WHEN** a landlord records a tenant exit before the lease `endDate` or mid-month
- **THEN** the system records the actual exit date, pro-rates or cancels the current month's bill as applicable, cancels all future pending bills, and marks the tenant inactive — all billing history remains in the system

#### Scenario: Exited tenant excluded from active views (TC7)
- **WHEN** a tenant has `isActive: false`
- **THEN** the tenant does not appear in dashboard active-tenant counts, occupancy stats, or active-tenant report filters

#### Scenario: Billing history preserved after deactivation (TC18)
- **WHEN** a tenant is marked inactive
- **THEN** all historical bills, payments, and dues for that tenant remain fully accessible in reports and tenant detail views

### Requirement: Property reassignment
The system SHALL allow a landlord to reassign an active tenant from one property to another only after closing (deactivating) the current property mapping by recording an exit date. A tenant SHALL NOT be simultaneously linked as active to two different properties.

#### Scenario: Reassignment requires closing previous mapping (TC16)
- **WHEN** a landlord attempts to change an active tenant's property without first deactivating the current lease
- **THEN** the system returns an error "Current property mapping must be closed before reassignment" and does not update the property field

#### Scenario: Billing history preserved after reassignment (TC18)
- **WHEN** a tenant is reassigned to a new property after closing their previous lease
- **THEN** all bills and payments linked to the previous property remain intact and visible in historical reports

### Requirement: Tenant Aadhaar and PAN data protection
The system SHALL encrypt Aadhaar and PAN fields using AES-256 before persisting to the database. These values SHALL only be decryptable at the application layer and SHALL NOT appear in logs or list responses — only in single-tenant detail views.

#### Scenario: Sensitive fields encrypted at rest
- **WHEN** a tenant is created or updated with Aadhaar or PAN values
- **THEN** the stored database document contains encrypted ciphertext, not plaintext

#### Scenario: Sensitive fields not in list response
- **WHEN** the tenant list API is called
- **THEN** Aadhaar and PAN fields are omitted from the response payload
