## Why

Landlords managing multiple rental properties currently rely on spreadsheets, paper records, or disconnected tools to track tenants, rent payments, and expenses — leading to missed dues, poor visibility, and time-consuming manual follow-ups. Razvi Rental Management consolidates all these workflows into a single modern web application that gives landlords real-time control over their portfolio.

## What Changes

- **New application**: Full-stack web app with Next.js frontend (JavaScript, App Router), Express.js REST API backend, MongoDB, and Lucide React UI
- **Property management**: Create, edit, and delete properties with type, floor, area, amenities, address, and planned rent
- **Tenant management**: Onboard tenants with personal details (Aadhaar, PAN), lease terms, security deposit, rent agreement upload, and property assignment
- **Rent tracking**: Track monthly rent cycles, due dates, and payment status per tenant per bill period
- **Bill generation**: Bulk-generate monthly bills for all active tenants; cancel or manually record payments per bill
- **Payment recording**: Record manual payments with mode, collected-by, remarks, and partial payment support
- **Dashboard analytics**: View overdue alerts, vacant vs. occupied property counts, tenant count, monthly collection total, and recent payment activity
- **Expense tracking**: Log and track per-property expenses
- **Automated reminders**: Send WhatsApp/SMS reminders to tenants for upcoming and overdue rent
- **Reports & exports**: Filter and search by tenant, property, date range; export to PDF/Excel
- **Authentication**: Secure landlord login via JWT with Express middleware

## Capabilities

### New Capabilities

- `authentication`: Landlord sign-up, login, session management, and route protection using JWT with Express middleware
- `dashboard`: Overview page with overdue rent alerts, property occupancy stats, tenant count, monthly income summary, and recent payments feed
- `property-management`: Full CRUD for properties with fields for type, floors, area, planned rent, address, amenities, and notes
- `tenant-management`: Full CRUD for tenants including personal identity (Aadhaar/PAN), lease dates, deposit, rent due date, property assignment, and rent agreement PDF upload
- `bill-management`: Generate monthly bills in bulk or individually, view and filter bills by date/status, cancel bills
- `payment-recording`: Record manual payments against a bill with partial payment support, payment mode, collected-by, and remarks
- `expense-tracking`: Log per-property expenses with category, amount, date, and notes
- `reminders`: Automated and manual WhatsApp/SMS notifications for upcoming and overdue rent
- `reports`: Search and filter across tenants, properties, and payments; export reports as PDF or Excel

### Modified Capabilities

## Impact

- **New codebase**: Greenfield project — Next.js JavaScript frontend + Express.js backend — no existing code affected
- **Database**: MongoDB collections for users, properties, tenants, bills, payments, expenses, and reminders
- **External dependencies**: Twilio or WhatsApp Business API (reminders), Razorpay/Stripe (future payments), PDF/Excel export libraries
- **Authentication surface**: Protected API routes and pages requiring valid session tokens
- **File storage**: Rent agreement PDFs stored in MongoDB GridFS via Multer + `multer-gridfs-storage`; served through a dedicated Express download route
