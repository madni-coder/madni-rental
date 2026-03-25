## ADDED Requirements

### Requirement: Payment blocked for inactive tenant (TC4)
The system SHALL NOT allow a payment to be recorded against any bill belonging to a tenant with `isActive: false`. The Record Payment action SHALL be disabled or return an error for such bills.

#### Scenario: Payment rejected for exited tenant
- **WHEN** a landlord attempts to record a payment for a bill whose tenant is marked inactive
- **THEN** the system returns an error "Cannot record payment for an exited or inactive tenant" and does not create a payment record

### Requirement: Record payment against a bill
The system SHALL allow a landlord to record a payment against an existing bill via a modal opened from the Bills table. The modal SHALL pre-fill: tenant name (read-only), property name (read-only), bill reference (month + year, read-only), total bill amount (read-only), and already-paid amount (read-only, sum of previous payments for this bill). The landlord SHALL enter: payment amount (required), payment mode (required: cash / bank transfer / UPI / cheque), collected by (required: name of person who collected), payment date (required, date picker), and remarks (optional).

#### Scenario: Full payment recorded
- **WHEN** a landlord records a payment equal to the remaining due amount
- **THEN** the system creates a payment record, sets the bill `dueAmount` to 0, and transitions the bill status to `paid`

#### Scenario: Partial payment recorded
- **WHEN** a landlord records a payment less than the remaining due amount
- **THEN** the system creates a payment record, reduces the bill `dueAmount` by the paid amount, and transitions the bill status to `partial`

#### Scenario: Overpayment rejected
- **WHEN** a landlord enters a payment amount greater than the remaining due amount
- **THEN** the system returns a validation error "Amount exceeds remaining balance"

### Requirement: View payment history
The system SHALL allow a landlord to view all payments with tenant name, property, bill period (month/year), payment amount, payment mode, collected by, payment date, and remarks.

#### Scenario: Payment history loaded
- **WHEN** a landlord opens the payment history view
- **THEN** the system fetches and renders all payment records sorted by paymentDate descending

### Requirement: Already-paid and remaining auto-calculation
The modal SHALL compute `remaining = totalAmount − alreadyPaid` in real time as the landlord enters the payment amount so they can see the post-payment balance.

#### Scenario: Remaining balance updated live
- **WHEN** a landlord types a payment amount in the modal
- **THEN** the modal displays the updated remaining balance dynamically without a page reload

### Requirement: Payment transaction atomicity (TC11)
The system SHALL persist a payment as an atomic operation: the Payment document creation and the corresponding Bill `dueAmount`/`status` update SHALL either both succeed or both fail. No partial state (e.g., payment saved but bill not updated) SHALL be left in the database.

#### Scenario: Payment API failure leaves no partial state
- **WHEN** an error occurs after the Payment record is written but before the Bill is updated
- **THEN** the system rolls back or compensates so that the bill `dueAmount` and status remain unchanged and the orphaned payment record is not persisted

### Requirement: Dashboard and payment data consistency (TC12)
The dashboard's monthly collection summary and the payment records list SHALL always reflect the same underlying data. The dashboard stats endpoint SHALL query the same `payments` collection that drives the payment history view.

#### Scenario: Dashboard total matches payment list total
- **WHEN** a new payment is recorded
- **THEN** the dashboard's "This Month Collection" figure is updated to include the new payment amount, matching the sum visible in the payment history list
