## Context

Razvi Rental Management is a greenfield full-stack web application for landlords to manage properties, tenants, monthly bills, payments, and expenses from a single dashboard. There is no existing codebase or legacy system to migrate from. The sole stakeholder is the landlord (admin user). The application needs to be fast to build, easy to self-host or deploy on Vercel, and maintainable by a small team.

## Goals / Non-Goals

**Goals:**
- Full CRUD for properties, tenants, bills, payments, and expenses
- Bulk monthly bill generation per active tenant
- Partial payment recording with running balance tracking
- Dashboard with real-time occupancy, income, and overdue summaries
- Secure landlord authentication with protected routes
- Rent agreement PDF upload via local storage
- Automated WhatsApp/SMS reminders for overdue or upcoming rent
- PDF/Excel report exports by tenant, property, and date range
- Responsive, modern UI using Next.js App Router + Tailwind CSS + Lucide React

**Non-Goals:**
- Multi-tenant SaaS (multi-landlord) for this version — single-user admin
- Online payment gateway processing (Razorpay/Stripe) — future scope
- Native mobile app — responsive web only
- Accounting/GST invoicing — out of scope

## Decisions

### D1 — Next.js App Router (JavaScript) + Separate Express.js Backend
**Decision:** Use Next.js (App Router, `.jsx`/`.js`, no TypeScript) as the frontend-only layer, and a separate Express.js service as the REST API backend. Axios is used in the frontend to communicate with the Express API.  
**Rationale:** Clear separation of concerns between UI and API; Express gives full control over middleware, routing, and auth logic; no TypeScript removes transpilation complexity and speeds up onboarding.  
**Alternative considered:** Next.js API routes (monorepo) — rejected because the user requires Express as the backend; Next.js API routes would conflict with that.

### D2 — MongoDB + Mongoose (not PostgreSQL/Prisma)
**Decision:** Use MongoDB Atlas (or local instance) accessed via Mongoose ODM.  
**Rationale:** The rental domain has variable-length fields (amenities array, flexible expense categories, optional PAN/Aadhaar). MongoDB's document model fits naturally. No complex relational joins are needed — references by ObjectId suffice.  
**Alternative considered:** PostgreSQL + Prisma — rejected because the schema flexibility of MongoDB better suits the evolving feature set and the team's existing experience.

### D3 — Custom JWT with Express Middleware
**Decision:** Implement authentication entirely in Express using `jsonwebtoken`. On login, the Express API issues a signed JWT stored in an HTTP-only, `Secure`, `SameSite=Strict` cookie. An `auth.js` middleware verifies the token on every protected Express route. The Next.js frontend manages auth state via a React `AuthContext` that reads the session by calling `GET /api/auth/me`.  
**Rationale:** No NextAuth dependency keeps the stack simpler; JWT-in-cookie avoids XSS risks of localStorage; the approach is self-contained and portable to any Node.js host.  
**Alternative considered:** NextAuth — rejected because it is tightly coupled to Next.js route handlers, which are not used in this architecture.

### D4 — MongoDB GridFS for file uploads
**Decision:** Use MongoDB GridFS (via `multer-gridfs-storage`) for rent agreement PDF storage, keeping all data within the existing MongoDB instance.  
**Rationale:** No external service or API keys required; files live in the same database as application data, simplifying backups, deployments, and local development. PDFs are served back through an Express route with authentication enforcement.  
**Alternative considered:** Cloudinary — rejected because it introduces an external dependency, requires API keys, and adds operational complexity for a single-landlord app; AWS S3 — same concerns.

### D5 — API design (Express Router)
**Decision:** All API logic lives in the `server/` project under `src/routes/`. Each resource gets its own router file: `auth.js`, `properties.js`, `tenants.js`, `bills.js`, `payments.js`, `expenses.js`, `reminders.js`, `reports.js`, `dashboard.js`. Controllers are separated from route definitions under `src/controllers/`. The Express app mounts all routers under `/api`.  
**Rationale:** Express Router is lightweight, well-understood, and decoupled from the frontend. Controller separation keeps route files clean and business logic testable.

### D6 — Database schema design

| Collection   | Key Fields |
|---|---|
| `users`      | `_id`, `name`, `email`, `passwordHash`, `createdAt` |
| `properties` | `_id`, `userId`, `name`, `type` (apartment/commercial/house), `floors`, `areaSqFt`, `plannedRent`, `address`, `amenities[]`, `notes` |
| `tenants`    | `_id`, `userId`, `propertyId`, `fullName`, `phone`, `email`, `emergencyContact`, `aadhaar`, `pan`, `monthlyRent`, `securityDeposit`, `paymentDueDate`, `startDate`, `endDate`, `rentAgreementUrl`, `notes`, `isActive` |
| `bills`      | `_id`, `userId`, `tenantId`, `propertyId`, `month`, `year`, `totalAmount`, `dueAmount`, `dueDate`, `status` (pending/paid/partial/cancelled) |
| `payments`   | `_id`, `billId`, `tenantId`, `propertyId`, `amount`, `alreadyPaid`, `remaining`, `paymentMode`, `collectedBy`, `paymentDate`, `remarks` |
| `expenses`   | `_id`, `propertyId`, `userId`, `category`, `amount`, `date`, `notes` |
| `reminders`  | `_id`, `tenantId`, `billId`, `channel` (whatsapp/sms), `sentAt`, `status` (sent/failed) |

### D7 — Folder structure
```
client/                                  ← Next.js App Router (JavaScript)
  src/
    app/
      (auth)/
        login/page.jsx
        register/page.jsx
      (dashboard)/
        layout.jsx                       ← sidebar + nav shell
        dashboard/page.jsx
        properties/page.jsx
        tenants/page.jsx
        bills/page.jsx
        expenses/page.jsx
        reports/page.jsx
    components/
      ui/              ← Button, Modal, Table, Badge, Input, Select, Spinner
      dashboard/       ← stats cards, recent payments, alerts
      properties/      ← PropertyForm, PropertyTable
      tenants/         ← TenantForm, TenantTable
      bills/           ← BillTable, GenerateBillsModal, RecordPaymentModal
      expenses/        ← ExpenseForm, ExpenseTable
      reports/         ← ReportFilters, ExportButton
    context/
      AuthContext.jsx  ← auth state (user, login, logout)
    lib/
      axios.js         ← Axios instance (baseURL + withCredentials interceptor)

server/                                  ← Express.js REST API (JavaScript)
  src/
    index.js           ← app entry: Express setup, CORS, cookie-parser, routes
    middleware/
      auth.js          ← JWT cookie verification, attaches req.user
      validate.js      ← express-validator error handler
    routes/
      auth.js / properties.js / tenants.js / bills.js
      payments.js / expenses.js / reminders.js / reports.js / dashboard.js
    controllers/
      (one per route file)
    models/
      User.js / Property.js / Tenant.js / Bill.js
      Payment.js / Expense.js / Reminder.js
    lib/
      db.js            ← Mongoose connection singleton
      encryption.js    ← AES-256 helpers
      gridfs.js        ← Multer + MongoDB GridFS upload helper
      reminders.js     ← Twilio send helper
      scheduler.js     ← node-cron daily reminder job
  .env
```

### D8 — Reminders integration
**Decision:** Use Twilio for SMS and Twilio WhatsApp sandbox (or official WhatsApp Business API) for reminders.  
**Rationale:** Twilio has a free trial; both channels use the same SDK; easy to swap for other providers.  
**Trigger strategy:** A `node-cron` job inside the Express server (`server/src/lib/scheduler.js`) runs daily at 9 AM to auto-send reminders for bills due in ≤3 days or already overdue. This eliminates the need for an external cron service or Vercel Cron.

## Risks / Trade-offs

| Risk | Mitigation |
|---|---|
| MongoDB ObjectId references can go stale if documents are deleted | Use soft-deletes (mark `isActive: false`) instead of hard deletes for tenants and properties; cascade-cancel bills on tenant deactivation |
| Aadhaar/PAN numbers are sensitive PII | Store encrypted at rest (AES-256 via `crypto` module before save); never log or expose in API responses unless explicitly needed |
| GridFS storage growth | Default contract PDFs only; enforce file size validation (≤5 MB) and PDF MIME type on upload; GridFS scales with the MongoDB instance |
| Twilio WhatsApp requires pre-approved message templates | Use Twilio Sandbox for development; production requires Business API approval — document this as a setup prerequisite |
| Single-admin scope limits future multi-landlord expansion | Design `userId` on every collection now so multi-tenant support is additive, not a rewrite |
| Bill status transitions can become inconsistent | Bills follow a strict state machine: `pending → partial → paid` or `pending/partial → cancelled`; invalid transitions rejected at API level |


