## 1. Project Setup & Configuration

- [ ] 1.1 Initialise Next.js 14+ client project with App Router and JavaScript (`npx create-next-app@latest` — select JavaScript, no TypeScript)
- [ ] 1.2 Install and configure Tailwind CSS in the client project
- [ ] 1.3 Install client dependencies: `axios`, `lucide-react`, `jspdf`, `jspdf-autotable`, `xlsx`
- [ ] 1.4 Initialise Express server project (`server/`) with `npm init -y`; install server dependencies: `express`, `mongoose`, `bcryptjs`, `jsonwebtoken`, `cookie-parser`, `cors`, `helmet`, `express-rate-limit`, `express-validator`, `multer`, `multer-gridfs-storage`, `gridfs-stream`, `twilio`, `node-cron`, `dotenv`
- [ ] 1.5 Create `server/src/lib/db.js` — MongoDB connection singleton using Mongoose
- [ ] 1.6 Create `server/src/index.js` — Express app bootstrap: apply `helmet`, `cors` (allow client origin), `cookie-parser`, JSON body parser, mount all routers under `/api`, start server
- [ ] 1.7 Configure environment variables for both projects: `MONGODB_URI`, `JWT_SECRET`, `JWT_EXPIRES_IN`, `CLIENT_URL`, `TWILIO_*`, `ENCRYPTION_KEY`, `PORT`
- [ ] 1.8 Create `client/src/lib/axios.js` — Axios instance with `baseURL` pointing to Express server and `withCredentials: true`

## 2. Database Models

- [ ] 2.1 Create `server/src/models/User.js` — fields: name, email, passwordHash, createdAt
- [ ] 2.2 Create `server/src/models/Property.js` — fields: userId, name, type, floors, areaSqFt, plannedRent, address, amenities[], notes
- [ ] 2.3 Create `server/src/models/Tenant.js` — fields: userId, propertyId, fullName, phone, email, emergencyContact, aadhaar (encrypted), pan (encrypted), monthlyRent, securityDeposit, paymentDueDate, startDate, endDate, rentAgreementUrl, notes, isActive
- [ ] 2.4 Create `server/src/models/Bill.js` — fields: userId, tenantId, propertyId, month, year, totalAmount, dueAmount, dueDate, status (pending/partial/paid/cancelled)
- [ ] 2.5 Create `server/src/models/Payment.js` — fields: billId, tenantId, propertyId, amount, alreadyPaid, remaining, paymentMode, collectedBy, paymentDate, remarks
- [ ] 2.6 Create `server/src/models/Expense.js` — fields: propertyId, userId, category, amount, date, notes
- [ ] 2.7 Create `server/src/models/Reminder.js` — fields: tenantId, billId, channel, sentAt, status

## 3. Authentication

- [ ] 3.1 Create `server/src/lib/encryption.js` — AES-256 encrypt/decrypt helpers using Node.js `crypto` and `ENCRYPTION_KEY` env var
- [ ] 3.2 Create `server/src/middleware/auth.js` — Express middleware: reads JWT from HTTP-only cookie, verifies with `jsonwebtoken`, attaches `req.user`; returns 401 if invalid
- [ ] 3.3 Create `server/src/routes/auth.js` + `server/src/controllers/authController.js` — `POST /api/auth/register` (hash password, reject duplicate email), `POST /api/auth/login` (verify password, sign JWT, set HTTP-only cookie), `GET /api/auth/me` (return current user from token), `POST /api/auth/logout` (clear cookie)
- [ ] 3.4 Create `client/src/context/AuthContext.jsx` — React context providing `user`, `login()`, `logout()` backed by calls to `/api/auth/me`, `/api/auth/login`, `/api/auth/logout` via Axios
- [ ] 3.5 Create `client/src/app/(auth)/login/page.jsx` — login form (email + password) with error display; calls `login()` from AuthContext on submit
- [ ] 3.6 Create `client/src/app/(auth)/register/page.jsx` — registration form with client-side validation; calls `POST /api/auth/register` via Axios
- [ ] 3.7 Create `client/src/middleware.js` — Next.js middleware that redirects unauthenticated users from any `/(dashboard)/*` route to `/login` based on cookie presence
- [ ] 3.8 Add logout button to sidebar that calls `logout()` from AuthContext

## 4. Layout & Navigation Shell

- [ ] 4.1 Create `client/src/app/(dashboard)/layout.jsx` — dashboard shell with responsive sidebar and top nav; wraps in `AuthContext` provider
- [ ] 4.2 Build sidebar component with Lucide React icons for: Dashboard, Properties, Tenants, Bills, Expenses, Reports
- [ ] 4.3 Create shared UI primitives in `client/src/components/ui/`: Button, Modal (reusable), Table, Badge, Input, Select, DatePicker, Spinner

## 5. Property Management

- [ ] 5.1 Create `server/src/routes/properties.js` + `server/src/controllers/propertyController.js` — `GET /api/properties` (list), `POST /api/properties` (create), `GET /api/properties/:id`, `PUT /api/properties/:id`, `DELETE /api/properties/:id` (with active-tenant guard); all routes protected by `auth` middleware
- [ ] 5.2 Add express-validator rules for property create/update in `server/src/middleware/validate.js`
- [ ] 5.3 Create `client/src/app/(dashboard)/properties/page.jsx` — property list page; fetches from `/api/properties` via Axios
- [ ] 5.4 Build `PropertyForm` component — create and edit modes; fields: name, type (select), floors, areaSqFt, plannedRent, address, amenities (tag input), notes
- [ ] 5.5 Wire PropertyForm into a Modal for create & edit; POST/PUT to `/api/properties` via Axios on submit
- [ ] 5.6 Add delete confirmation dialog; show error toast if Express returns 409 (active tenants)

## 6. Tenant Management

- [ ] 6.1 Create `server/src/lib/gridfs.js` — Multer + MongoDB GridFS storage engine (`multer-gridfs-storage`) for rent agreement PDFs (max 5 MB, PDF MIME type only); add `GET /api/tenants/:id/agreement` Express route that streams the file from GridFS with auth check
- [ ] 6.2 Create `server/src/routes/tenants.js` + `server/src/controllers/tenantController.js` — `GET /api/tenants` (list, omit aadhaar/pan projection), `POST /api/tenants` (encrypt aadhaar/pan, upload PDF), `GET /api/tenants/:id` (single, decrypt fields), `PUT /api/tenants/:id` (update with re-encryption), `PATCH /api/tenants/:id/deactivate` (set isActive false, cascade-cancel pending bills)
- [ ] 6.3 Create `client/src/app/(dashboard)/tenants/page.jsx` — tenant list page; fetches from `/api/tenants` via Axios
- [ ] 6.4 Build `TenantForm` component — all tenant fields; property dropdown populated from `/api/properties`; file input for rent agreement PDF; uses `multipart/form-data` via Axios
- [ ] 6.5 Wire TenantForm into a Modal for create & edit; connect to API via Axios
- [ ] 6.6 Add deactivation action with confirmation modal; show cascade-cancel notice

## 7. Bill Management

- [ ] 7.1 Create `server/src/routes/bills.js` + `server/src/controllers/billController.js` — `GET /api/bills` (list with filters), `POST /api/bills` (create individual), `PUT /api/bills/:id` (update, enforce state machine), `PATCH /api/bills/:id/cancel` (pending/partial only)
- [ ] 7.2 Add `POST /api/bills/generate` handler — accepts month and year; generates pending bills for all active tenants skipping duplicates; returns created/skipped counts
- [ ] 7.3 Create `client/src/app/(dashboard)/bills/page.jsx` — bills page with filter toolbar (date range + status) and bills table
- [ ] 7.4 Build bills table with columns: Month, Tenant, Property, Total Amount, Due Amount, Due Date, Status badge, Cancel action, Record Payment action
- [ ] 7.5 Build `GenerateBillsModal` — month and year dropdowns (pre-filled with current), confirmation, show generation summary on success
- [ ] 7.6 Build `CreateBillModal` — manual bill form: tenant dropdown, property (auto-fill), month, year, total amount, due date
- [ ] 7.7 Wire "Generate Bills" and "Create Bill" buttons with their respective modals; calls via Axios

## 8. Payment Recording

- [ ] 8.1 Create `server/src/routes/payments.js` + `server/src/controllers/paymentController.js` — `GET /api/payments` (list, filterable by billId/tenantId), `POST /api/payments` (record payment: validate amount ≤ remaining, update bill dueAmount and status), `GET /api/payments/:id`
- [ ] 8.2 Build `RecordPaymentModal` — pre-filled read-only fields (tenant, property, bill month/year, total amount, already paid), editable fields (payment amount, mode select, collected by, payment date, remarks), live remaining balance calculation
- [ ] 8.3 Wire Record Payment button in bills table to open `RecordPaymentModal` with the correct bill context
- [ ] 8.4 Validate overpayment on both client (live feedback) and server (Express controller guard)

## 9. Expense Tracking

- [ ] 9.1 Create `server/src/routes/expenses.js` + `server/src/controllers/expenseController.js` — `GET /api/expenses` (filterable by propertyId and date range), `POST /api/expenses`, `PUT /api/expenses/:id`, `DELETE /api/expenses/:id`
- [ ] 9.2 Create `client/src/app/(dashboard)/expenses/page.jsx` — expense list page with filters (property, date range) and table (Property, Category, Amount, Date, Notes)
- [ ] 9.3 Build `ExpenseForm` component — property dropdown, category select, amount, date, notes; handles create and edit
- [ ] 9.4 Wire ExpenseForm into Modal for create & edit; add delete confirmation

## 10. Dashboard

- [ ] 10.1 Create `server/src/routes/dashboard.js` + `server/src/controllers/dashboardController.js` — `GET /api/dashboard/stats` returning: overdueCount + overdueBills list, occupiedCount, totalProperties, activeTenantsCount, currentMonthCollection, recentPayments (last 10)
- [ ] 10.2 Create `client/src/app/(dashboard)/dashboard/page.jsx` — client component that fetches stats from `/api/dashboard/stats` via Axios on mount
- [ ] 10.3 Build `OverdueAlertsPanel` — lists overdue bills with tenant name, property, due amount, days overdue
- [ ] 10.4 Build stats cards: Occupied Properties, Total Tenants, This Month Collection (using Lucide icons)
- [ ] 10.5 Build `RecentPaymentsTable` — shows last 10 payments with tenant name, property, amount, mode, date

## 11. Reminders

- [ ] 11.1 Install and configure Twilio SDK in server; add `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, `TWILIO_FROM_NUMBER` to `server/.env`
- [ ] 11.2 Create `server/src/lib/reminders.js` — helper to send WhatsApp/SMS message via Twilio with templated body (tenant name, property, bill period, amount due, due date)
- [ ] 11.3 Create `server/src/routes/reminders.js` + `server/src/controllers/reminderController.js` — `POST /api/reminders/send` (accepts billId, validates pending/partial, sends message, logs reminder)
- [ ] 11.4 Create `server/src/lib/scheduler.js` — `node-cron` job scheduled at `0 9 * * *`; queries bills due in ≤3 days or overdue, skips bills with a reminder sent in last 24 hours, calls the Twilio helper for each, logs results
- [ ] 11.5 Import and start the scheduler in `server/src/index.js` on server boot
- [ ] 11.6 Add "Send Reminder" action button in bills table for pending/overdue rows; calls `POST /api/reminders/send` via Axios
- [ ] 11.7 Add reminder history view per bill (tooltip or expanded row) fetched from `/api/reminders?billId=<id>`

## 12. Reports & Exports

- [ ] 12.1 Create `server/src/routes/reports.js` + `server/src/controllers/reportController.js` — `GET /api/reports` with query params tenantId, propertyId, fromDate, toDate; returns paginated payment records + monthly income summary for last 12 months
- [ ] 12.2 Create `client/src/app/(dashboard)/reports/page.jsx` — reports page with filter toolbar; fetches from `/api/reports` via Axios
- [ ] 12.3 Build pending dues summary section: group pending/partial bills by property showing outstanding totals
- [ ] 12.4 Build `ExportButton` component with two options (PDF, Excel)
- [ ] 12.5 Implement PDF export using `jspdf` + `jspdf-autotable` on the client — generate report table from fetched data and trigger browser download
- [ ] 12.6 Implement Excel export using `xlsx` on the client — convert filtered report data to .xlsx and trigger browser download
- [ ] 12.7 Build monthly income summary table for last 12 months using plain table with Lucide icons

## 13. Security & Validation Hardening

- [ ] 13.1 Add `express-validator` rule chains in `server/src/middleware/validate.js` for all route inputs (properties, tenants, bills, payments, expenses)
- [ ] 13.2 Verify Aadhaar and PAN fields are excluded from list API responses via Mongoose projection (`.select('-aadhaar -pan')`)
- [ ] 13.3 Add `userId` ownership check in every Express controller — compare `req.user.id` against the document's `userId` before GET/PUT/DELETE; return 403 on mismatch
- [ ] 13.4 Apply `express-rate-limit` to `POST /api/auth/register` and `POST /api/auth/login` (max 10 requests per 15 min per IP)
- [ ] 13.5 Sanitize all string inputs using `express-mongo-sanitize` middleware to prevent NoSQL injection
- [ ] 13.6 Validate file MIME type (PDF only) and size (≤5 MB) in the Multer config server-side before GridFS upload

## 14. Polish & Deployment

- [ ] 14.1 Add loading skeletons / spinner for all Axios data-fetching pages (Tenants, Bills, Dashboard)
- [ ] 14.2 Add toast notifications (success, error) for all CRUD and payment operations using a lightweight toast library or custom hook
- [ ] 14.3 Ensure all pages are mobile-responsive using Tailwind responsive utilities
- [ ] 14.4 Write `client/.env.example` and `server/.env.example` documenting all required environment variables
- [ ] 14.5 Deploy Express server to Railway or Render; set all env vars including `CLIENT_URL` for CORS
- [ ] 14.6 Deploy Next.js client to Vercel; set `NEXT_PUBLIC_API_URL` pointing to the deployed Express server
- [ ] 14.7 Run end-to-end smoke test: register → add property → add tenant → generate bills → record payment → check dashboard

## 15. Negative-Case Guards & Data Integrity

- [ ] 15.1 Add unique compound index on `Bill` model: `{ tenantId, month, year }` to enforce no duplicate bills at the database level (TC2, TC10)
- [ ] 15.2 In `billController.js` generate handler: filter out tenants with `isActive: false` before creating bills (TC3)
- [ ] 15.3 In `billController.js` generate handler: skip a tenant if the selected bill period is after their `endDate` (exit date or lease end) (TC8, TC9)
- [ ] 15.4 In `billController.js` generate handler: store all `dueDate` values as UTC midnight to prevent timezone date drift (TC13)
- [ ] 15.5 In `billController.js` generate handler: assert after bulk insert that every qualifying active tenant received a bill; log any missing entries as an error (TC14)
- [ ] 15.6 In `tenantController.js` update handler: if `startDate` is in the request body and the tenant already has bills, return 422 "Start date cannot be changed after bills have been generated" (TC15)
- [ ] 15.7 In `tenantController.js` update handler: if `monthlyRent` is changed, update only the tenant document; add an Express-validator rule that rejects any request attempting to also update existing bill amounts (TC6)
- [ ] 15.8 In `tenantController.js` create/update handler: check that no other tenant document with the same user has `isActive: true` and the same `propertyId` before saving; return 409 if found (TC17)
- [ ] 15.9 In `tenantController.js` update handler: if `propertyId` is being changed and the tenant is currently `isActive: true`, return 422 "Current property mapping must be closed before reassignment" (TC16)
- [ ] 15.10 Add "Tenant Exit" action to the Tenants page: records exit date, pro-rates or cancels current month bill, cancels future pending bills, sets `isActive: false`; all historical data remains (TC1, TC8)
- [ ] 15.11 In `paymentController.js` record-payment handler: look up the bill's tenantId, check `isActive`; if false return 403 "Cannot record payment for an exited or inactive tenant" (TC4)
- [ ] 15.12 Implement atomic payment recording in `paymentController.js` using a Mongoose session + transaction: wrap `Payment.create()` and `Bill.findByIdAndUpdate()` in a single session; roll back both on any error (TC11)
- [ ] 15.13 In `dashboardController.js` stats endpoint: derive `currentMonthCollection` directly from `Payment.aggregate()` on the same `payments` collection used by the payment list — no separate counter or cached field (TC12)
- [ ] 15.14 In dashboard stats query: filter `activeTenantsCount` and occupancy using `isActive: true` only; verify exited tenants never inflate these figures (TC7)
- [ ] 15.15 Write negative integration tests covering all 18 cases: run against an in-memory MongoDB instance (using `mongodb-memory-server`) in the Express test suite
