## ADDED Requirements

### Requirement: Landlord registration
The system SHALL allow a new landlord to register with a name, email, and password. Passwords SHALL be hashed using bcrypt before storage. Duplicate email registration SHALL be rejected.

#### Scenario: Successful registration
- **WHEN** a user submits a valid name, email, and password
- **THEN** the system creates a new user record and redirects to the login page

#### Scenario: Duplicate email rejected
- **WHEN** a user submits an email that already exists
- **THEN** the system returns an error message "Email already registered" and does not create a new record

#### Scenario: Weak password rejected
- **WHEN** a user submits a password shorter than 8 characters
- **THEN** the system returns a validation error before submission

### Requirement: Landlord login
The system SHALL authenticate landlords with email and password via the Express `/api/auth/login` endpoint. On success, a JWT SHALL be signed with `jsonwebtoken` and stored in a secure, HTTP-only, `SameSite=Strict` cookie.

#### Scenario: Successful login
- **WHEN** a user submits valid email and password credentials
- **THEN** the system issues a session token and redirects to the dashboard

#### Scenario: Invalid credentials rejected
- **WHEN** a user submits an incorrect email or password
- **THEN** the system returns "Invalid credentials" without indicating which field is wrong

### Requirement: Protected route access
The system SHALL restrict all dashboard pages and API routes to authenticated sessions. Unauthenticated requests to protected routes SHALL be redirected to the login page (UI) or return HTTP 401 (API).

#### Scenario: Unauthenticated page access
- **WHEN** an unauthenticated user navigates to any dashboard route
- **THEN** the system redirects them to /login

#### Scenario: Unauthenticated API access
- **WHEN** an API request is made without a valid session token
- **THEN** the system returns HTTP 401 Unauthorized

### Requirement: Logout
The system SHALL allow a logged-in landlord to end their session.

#### Scenario: Successful logout
- **WHEN** a user clicks the logout action
- **THEN** the system calls `POST /api/auth/logout` via Axios, the Express server clears the JWT cookie, and the client redirects to the login page
