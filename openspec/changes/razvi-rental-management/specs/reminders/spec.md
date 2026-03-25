## ADDED Requirements

### Requirement: Automatic reminder scheduling
The system SHALL check daily (via a cron endpoint) for bills that are due within 3 days or are overdue (due date passed, status not paid/cancelled) and send reminders to the corresponding tenants via WhatsApp or SMS using Twilio.

#### Scenario: Due-soon reminder sent
- **WHEN** the cron endpoint runs and finds a bill due within 3 days with no reminder sent in the last 24 hours
- **THEN** the system sends a WhatsApp/SMS reminder to the tenant's phone number and logs the reminder in the `reminders` collection with status `sent`

#### Scenario: Overdue reminder sent
- **WHEN** the cron endpoint runs and finds an overdue bill with status `pending` or `partial` and no reminder sent in the last 24 hours
- **THEN** the system sends a reminder and logs it with status `sent`

#### Scenario: Reminder send failure logged
- **WHEN** Twilio returns an error for a reminder send attempt
- **THEN** the system logs the reminder with status `failed` and does not retry in the same cron run

### Requirement: Manual reminder trigger
The system SHALL allow a landlord to manually trigger a reminder for a specific tenant's overdue or pending bill from the Bills table.

#### Scenario: Manual reminder sent
- **WHEN** a landlord clicks "Send Reminder" on a pending or overdue bill
- **THEN** the system immediately sends a WhatsApp/SMS message to the tenant and records the action in the `reminders` collection

#### Scenario: Manual reminder blocked for paid bill
- **WHEN** a landlord attempts to send a reminder for a paid bill
- **THEN** the system does not send and returns an error "Reminders only applicable to pending or overdue bills"

### Requirement: Reminder message content
Reminder messages SHALL include the tenant's name, property name, bill month/year, total due amount, and payment due date. Messages SHALL be sent in English by default.

#### Scenario: Reminder message format validated
- **WHEN** a reminder is triggered (auto or manual)
- **THEN** the message body includes tenant name, property, bill period, amount due, and due date

### Requirement: Reminder history
The system SHALL maintain a log of all sent/failed reminders accessible per tenant or per bill.

#### Scenario: Reminder log shown
- **WHEN** a landlord views a specific bill's detail or tenant's history
- **THEN** the system shows a list of all reminder attempts with channel, status, and sent timestamp
