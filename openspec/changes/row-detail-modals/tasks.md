## 1. Shared Infrastructure

- [x] 1.1 Add `cursor-pointer` styling and `onClick` handler pattern to existing table row components (document the `e.stopPropagation()` contract for action buttons)
- [x] 1.2 Confirm `GET /api/properties/:id`, `GET /api/tenants/:id`, `GET /api/bills/:id`, and `GET /api/expenses/:id` server routes are all wired and returning full documents

## 2. Property Detail Modal

- [x] 2.1 Create `client/components/properties/PropertyDetailModal.jsx` — accepts `propertyId` and `onClose` props; fetches `GET /api/properties/:id` on mount; shows skeleton while loading
- [x] 2.2 Render all property fields in the modal body: Name, Type (badge), Floors, Area (sq ft), Planned Rent (₹), Address, Amenities (tag list), Notes
- [x] 2.3 Add Edit and Delete buttons in the modal footer; Edit closes modal and opens the edit form; Delete opens the existing confirmation dialog; both buttons call `e.stopPropagation()`
- [x] 2.4 Update `client/app/(dashboard)/properties/page.jsx` — add `onClick` to each `<tr>` to set `selectedPropertyId`; add `e.stopPropagation()` to existing edit/delete icon buttons; render `<PropertyDetailModal>` when `selectedPropertyId` is set

## 3. Tenant Detail Modal

- [ ] 3.1 Create `client/components/tenants/TenantDetailModal.jsx` — accepts `tenantId` and `onClose` props; fetches `GET /api/tenants/:id` on mount; shows skeleton while loading
- [ ] 3.2 Render all tenant fields: Full Name, Phone, Email, Emergency Contact, Property Name, Monthly Rent (₹), Security Deposit (₹), Payment Due Date, Start Date, End Date, Rent Agreement (download link), Active status badge, Notes
- [ ] 3.3 Render Aadhaar and PAN as masked placeholders (`••••••••`) — never display raw values
- [ ] 3.4 Add Edit and Deactivate buttons in the modal footer (Deactivate only shown when `isActive === true`); wire to existing handlers with `e.stopPropagation()`
- [ ] 3.5 Update `client/app/(dashboard)/tenants/page.jsx` — add `onClick` on `<tr>`, `e.stopPropagation()` on action buttons, render `<TenantDetailModal>` when `selectedTenantId` is set

## 4. Bill Detail Modal

- [ ] 4.1 Create `client/components/bills/BillDetailModal.jsx` — accepts `billId` and `onClose` props; fetches `GET /api/bills/:id` on mount; shows skeleton while loading
- [ ] 4.2 Render all bill fields: Tenant Name, Property Name, Month & Year, Total Amount (₹), Due Amount (₹), Due Date (formatted), Status badge
- [ ] 4.3 Add Cancel Bill and Record Payment buttons in the modal footer; both conditionally shown for pending/partial status only; wire to existing handlers with `e.stopPropagation()`
- [ ] 4.4 Update `client/app/(dashboard)/bills/page.jsx` — add `onClick` on `<tr>`, `e.stopPropagation()` on action buttons, render `<BillDetailModal>` when `selectedBillId` is set

## 5. Expense Detail Modal

- [ ] 5.1 Create `client/components/expenses/ExpenseDetailModal.jsx` — accepts `expenseId` and `onClose` props; fetches `GET /api/expenses/:id` on mount; shows skeleton while loading
- [ ] 5.2 Render all expense fields: Property Name, Category, Amount (₹), Date (formatted), Notes
- [ ] 5.3 Add Edit and Delete buttons in the modal footer; wire to existing handlers with `e.stopPropagation()`
- [ ] 5.4 Update `client/app/(dashboard)/expenses/page.jsx` — add `onClick` on `<tr>`, `e.stopPropagation()` on action buttons, render `<ExpenseDetailModal>` when `selectedExpenseId` is set

## 6. Polish & Consistency

- [ ] 6.1 Verify all four modals show an accessible skeleton loader (using existing `skeleton.jsx` primitives) while data is loading
- [ ] 6.2 Add error state handling in each modal — if the fetch fails, show an inline error message with a Retry button
- [ ] 6.3 Ensure all modal close triggers (close button, Escape key, backdrop click) work consistently via the existing `Modal` component
- [ ] 6.4 Apply `cursor-pointer` to table rows via Tailwind class across all four page files
